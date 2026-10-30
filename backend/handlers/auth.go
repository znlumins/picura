package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"picura-backend/database"
	"picura-backend/middleware"
)

type AuthHandler struct {
	jwtSecret string
}

func NewAuthHandler(jwtSecret string) *AuthHandler {
	return &AuthHandler{jwtSecret: jwtSecret}
}

type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *AuthHandler) generateToken(user *database.User) (string, error) {
	claims := middleware.JWTClaims{
		UserID: user.ID,
		Email:  user.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(30 * 24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(h.jwtSecret))
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Format payload tidak valid"}`, http.StatusBadRequest)
		return
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
	if req.Email == "" || req.Password == "" || req.Name == "" {
		http.Error(w, `{"error":"Nama, email, dan password wajib diisi"}`, http.StatusBadRequest)
		return
	}

	var existing database.User
	if err := database.DB.Where("email = ?", req.Email).First(&existing).Error; err == nil {
		http.Error(w, `{"error":"Email sudah terdaftar, silakan masuk"}`, http.StatusConflict)
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, `{"error":"Gagal memproses password"}`, http.StatusInternalServerError)
		return
	}
	hashStr := string(hashed)

	newUser := database.User{
		ID:               uuid.New().String(),
		Email:            req.Email,
		Name:             req.Name,
		PasswordHash:     &hashStr,
		SubscriptionTier: "FREEMIUM",
		CreatedAt:        time.Now(),
		UpdatedAt:        time.Now(),
	}

	if err := database.DB.Create(&newUser).Error; err != nil {
		http.Error(w, `{"error":"Gagal mendaftarkan pengguna"}`, http.StatusInternalServerError)
		return
	}

	token, _ := h.generateToken(&newUser)

	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "Pendaftaran berhasil",
		"token":   token,
		"user": map[string]interface{}{
			"id":               newUser.ID,
			"name":             newUser.Name,
			"email":            newUser.Email,
			"subscriptionTier": newUser.SubscriptionTier,
		},
	})
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Format payload tidak valid"}`, http.StatusBadRequest)
		return
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
	var user database.User
	if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		http.Error(w, `{"error":"Email atau password salah"}`, http.StatusUnauthorized)
		return
	}

	if user.PasswordHash == nil || bcrypt.CompareHashAndPassword([]byte(*user.PasswordHash), []byte(req.Password)) != nil {
		http.Error(w, `{"error":"Email atau password salah"}`, http.StatusUnauthorized)
		return
	}

	token, err := h.generateToken(&user)
	if err != nil {
		http.Error(w, `{"error":"Gagal generate token"}`, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "Login berhasil",
		"token":   token,
		"user": map[string]interface{}{
			"id":               user.ID,
			"name":             user.Name,
			"email":            user.Email,
			"subscriptionTier": user.SubscriptionTier,
			"studioName":       user.StudioName,
			"studioWhatsapp":   user.StudioWhatsapp,
		},
	})
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	user := middleware.GetUserFromContext(r.Context())
	if user == nil {
		http.Error(w, `{"error":"Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
		"user":   user,
	})
}

func (h *AuthHandler) UpdateSettings(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	user := middleware.GetUserFromContext(r.Context())
	if user == nil {
		http.Error(w, `{"error":"Unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req struct {
		StudioName     *string `json:"studioName"`
		StudioWhatsapp *string `json:"studioWhatsapp"`
		GoogleAPIKey   *string `json:"googleApiKey"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Invalid payload"}`, http.StatusBadRequest)
		return
	}

	updates := map[string]interface{}{
		"updatedAt": time.Now(),
	}
	if req.StudioName != nil {
		updates["studioName"] = req.StudioName
	}
	if req.StudioWhatsapp != nil {
		updates["studioWhatsapp"] = req.StudioWhatsapp
	}
	if req.GoogleAPIKey != nil {
		updates["googleApiKey"] = req.GoogleAPIKey
	}

	if err := database.DB.Model(user).Updates(updates).Error; err != nil {
		http.Error(w, `{"error":"Gagal menyimpan pengaturan"}`, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "Pengaturan studio berhasil disimpan",
	})
}
