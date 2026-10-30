package services

import (
	"context"
	"fmt"
	"log"

	"github.com/hirotomasato/scbz/sociabuzz"
)

type SociaBuzzService struct {
	client   *sociabuzz.SociaBuzz
	username string
}

type PaymentCreationResult struct {
	OrderID    string  `json:"orderId"`
	PaymentURL string  `json:"paymentUrl"`
	QRString   string  `json:"qrString,omitempty"`
	Method     string  `json:"method"`
	Amount     float64 `json:"amount"`
	Token      string  `json:"token"`
}

func (s *SociaBuzzService) GetUsername() string {
	return s.username
}

func NewSociaBuzzService(username string) *SociaBuzzService {
	return &SociaBuzzService{
		client:   sociabuzz.New("https://sociabuzz.com"),
		username: username,
	}
}

// CreateSubscriptionPayment creates a payment invoice on SociaBuzz
func (s *SociaBuzzService) CreateSubscriptionPayment(ctx context.Context, orderID string, amount float64, userFullName, userEmail, tierName, paymentMethod string) (*PaymentCreationResult, error) {
	if paymentMethod == "" {
		paymentMethod = "qris" // default to QRIS for instant scan
	}

	note := fmt.Sprintf("Picura %s [%s]", tierName, orderID)

	// Step 1: Submit donation to SociaBuzz
	donation, err := s.client.Donate(ctx, s.username, amount, "Indonesia", userFullName, userEmail, note)
	if err != nil {
		log.Printf("⚠️ SociaBuzz Donate Error: %v", err)
		return nil, fmt.Errorf("gagal membuat sesi donasi/pembayaran SociaBuzz: %w", err)
	}
	defer donation.Close()

	// Step 2: Create payment channel
	payment, err := donation.CreatePayment(ctx, paymentMethod)
	if err != nil {
		// If preferred method fails, fallback to QRIS or first available
		log.Printf("⚠️ Gagal memilih method %s, mencoba fallback qris: %v", paymentMethod, err)
		payment, err = donation.CreatePayment(ctx, "qris")
		if err != nil {
			return nil, fmt.Errorf("gagal menghasilkan channel pembayaran: %w", err)
		}
	}

	return &PaymentCreationResult{
		OrderID:    orderID,
		PaymentURL: payment.PaymentURL,
		QRString:   payment.QRString,
		Method:     payment.Method,
		Amount:     amount,
		Token:      payment.Token,
	}, nil
}
