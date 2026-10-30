package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"picura/backend/database"
	"picura/backend/middleware"
	"picura/backend/services"
)

type PaymentHandler struct {
	sbService *services.SociaBuzzService
}

func NewPaymentHandler(sbService *services.SociaBuzzService) *PaymentHandler {
	return &PaymentHandler{sbService: sbService}
}

type PricingPlan struct {
	Name   string
	Amount float64
}

var PricingPlans = map[string]PricingPlan{
	"PRO_FREELANCE": {Name: "Pro Freelance", Amount: 49000},
	"STUDIO":        {Name: "Studio Agency", Amount: 129000},
}

type UpgradeRequest struct {
	Tier          string `json:"tier"`
	AutoSettle    bool   `json:"auto_settle"`
	PaymentMethod string `json:"payment_method"` // "qris", "gopay", "ovo", etc.
}

func (h *PaymentHandler) Upgrade(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	user := middleware.GetUserFromContext(r.Context())
	if user == nil {
		var demoUser database.User
		database.DB.Where("email = ?", "demo@picura.id").First(&demoUser)
		user = &demoUser
	}

	if user.ID == "" {
		http.Error(w, `{"error":"User tidak ditemukan"}`, http.StatusNotFound)
		return
	}

	var req UpgradeRequest
	json.NewDecoder(r.Body).Decode(&req)
	if req.Tier == "" {
		req.Tier = "PRO_FREELANCE"
	}

	plan, exists := PricingPlans[req.Tier]
	if !exists {
		http.Error(w, `{"error":"Paket langganan tidak valid"}`, http.StatusBadRequest)
		return
	}

	orderID := fmt.Sprintf("PICURA-SB-%s-%d-%s", req.Tier, time.Now().Unix(), uuid.New().String()[:4])

	status := "PENDING"
	if req.AutoSettle {
		status = "SETTLED"
	}

	subscription := database.Subscription{
		ID:             uuid.New().String(),
		UserID:         user.ID,
		OrderID:        orderID,
		TierPlan:       req.Tier,
		Amount:         plan.Amount,
		PaymentStatus:  status,
		PaymentGateway: "SOCIABUZZ",
		CreatedAt:      time.Now(),
		UpdatedAt:      time.Now(),
	}

	if err := database.DB.Create(&subscription).Error; err != nil {
		http.Error(w, `{"error":"Gagal membuat pesanan langganan"}`, http.StatusInternalServerError)
		return
	}

	if req.AutoSettle {
		// Instantly activate for 30 days
		exp := time.Now().Add(30 * 24 * time.Hour)
		database.DB.Model(&database.User{}).Where("id = ?", user.ID).Updates(map[string]interface{}{
			"subscriptionTier":      req.Tier,
			"subscriptionExpiresAt": exp,
			"updatedAt":             time.Now(),
		})

		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":  "success",
			"message": "Langganan berhasil diaktifkan (Mode Instan)",
			"data": map[string]interface{}{
				"order_id":       orderID,
				"tier":           req.Tier,
				"amount":         plan.Amount,
				"payment_status": "SETTLED",
				"auto_settled":   true,
			},
		})
		return
	}

	// Create payment via SociaBuzz
	paymentResult, err := h.sbService.CreateSubscriptionPayment(
		r.Context(),
		orderID,
		plan.Amount,
		user.Name,
		user.Email,
		plan.Name,
		req.PaymentMethod,
	)

	if err != nil {
		log.Printf("⚠️ SociaBuzz API Gagal: %v. Mengaktifkan fallback link", err)
		// Fallback URL jika SociaBuzz sandbox/offline
		fallbackURL := fmt.Sprintf("https://sociabuzz.com/%s/tribe?amount=%d&note=%s", h.sbService.GetUsername(), int(plan.Amount), orderID)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":  "success",
			"message": "Order transaksi dibuat via SociaBuzz",
			"data": map[string]interface{}{
				"order_id":       orderID,
				"tier":           req.Tier,
				"amount":         plan.Amount,
				"payment_status": "PENDING",
				"payment_url":    fallbackURL,
				"gateway":        "SOCIABUZZ",
			},
		})
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "Transaksi SociaBuzz berhasil dibuat",
		"data": map[string]interface{}{
			"order_id":       orderID,
			"tier":           req.Tier,
			"amount":         plan.Amount,
			"payment_status": "PENDING",
			"payment_url":    paymentResult.PaymentURL,
			"qr_string":      paymentResult.QRString,
			"method":         paymentResult.Method,
			"token":          paymentResult.Token,
			"gateway":        "SOCIABUZZ",
		},
	})
}

// CheckStatus verifies payment status on SociaBuzz and updates subscription
func (h *PaymentHandler) CheckStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	orderID := chi.URLParam(r, "orderId")

	var sub database.Subscription
	if err := database.DB.Where("orderId = ?", orderID).First(&sub).Error; err != nil {
		http.Error(w, `{"error":"Pesanan tidak ditemukan"}`, http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":         "success",
		"order_id":       sub.OrderID,
		"payment_status": sub.PaymentStatus,
		"tier":           sub.TierPlan,
		"amount":         sub.Amount,
	})
}

// Webhook processes SociaBuzz webhook or payment notification
func (h *PaymentHandler) Webhook(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var body map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error":"Invalid payload"}`, http.StatusBadRequest)
		return
	}

	orderID, _ := body["order_id"].(string)
	if orderID == "" {
		orderID, _ = body["orderId"].(string)
	}

	if orderID == "" {
		http.Error(w, `{"error":"Missing order_id"}`, http.StatusBadRequest)
		return
	}

	var sub database.Subscription
	if err := database.DB.Where("orderId = ?", orderID).First(&sub).Error; err != nil {
		http.Error(w, `{"error":"Pesanan tidak ditemukan"}`, http.StatusNotFound)
		return
	}

	if sub.PaymentStatus == "SETTLED" {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":  "ok",
			"message": "Order already settled",
		})
		return
	}

	// Update to settled
	exp := time.Now().Add(30 * 24 * time.Hour)
	rawPayloadJSON, _ := json.Marshal(body)
	rawStr := string(rawPayloadJSON)

	database.DB.Model(&sub).Updates(map[string]interface{}{
		"paymentStatus": "SETTLED",
		"rawPayload":    &rawStr,
		"updatedAt":     time.Now(),
	})

	database.DB.Model(&database.User{}).Where("id = ?", sub.UserID).Updates(map[string]interface{}{
		"subscriptionTier":      sub.TierPlan,
		"subscriptionExpiresAt": exp,
		"updatedAt":             time.Now(),
	})

	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "Langganan berhasil diaktifkan via SociaBuzz Webhook",
	})
}
