package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"picura-backend/config"
	"picura-backend/database"
	"picura-backend/handlers"
	"picura-backend/middleware"
	"picura-backend/services"
)

func main() {
	cfg := config.Load()

	// Connect to Database
	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("❌ Gagal terhubung ke database: %v", err)
	}
	_ = db

	// Initialize Services
	sbService := services.NewSociaBuzzService(cfg.SociaBuzzUsername)

	// Initialize Handlers
	authHandler := handlers.NewAuthHandler(cfg.JWTSecret)
	galleryHandler := handlers.NewGalleryHandler()
	paymentHandler := handlers.NewPaymentHandler(sbService)

	// Create Router
	r := chi.NewRouter()

	// Global Middleware
	r.Use(chimiddleware.Logger)
	r.Use(chimiddleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "https://picura.web.id", "http://localhost:*", "*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Health Check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok","engine":"golang","service":"picura-backend","version":"2.0.0"}`))
	})

	// API v1 Routes
	r.Route("/api/v1", func(r chi.Router) {
		// Auth routes
		r.Route("/auth", func(r chi.Router) {
			r.Post("/register", authHandler.Register)
			r.Post("/login", authHandler.Login)

			// Protected auth routes
			r.Group(func(r chi.Router) {
				r.Use(middleware.AuthMiddleware(cfg.JWTSecret))
				r.Get("/me", authHandler.Me)
				r.Put("/settings", authHandler.UpdateSettings)
			})
		})

		// Gallery routes
		r.Route("/galleries", func(r chi.Router) {
			// Optional auth to support demo user seamlessly
			r.Group(func(r chi.Router) {
				r.Use(middleware.OptionalAuthMiddleware(cfg.JWTSecret))
				r.Get("/", galleryHandler.List)
				r.Post("/", galleryHandler.Create)
			})

			r.Get("/{slug}", galleryHandler.GetBySlug)
			r.Post("/{slug}/verify-password", galleryHandler.VerifyPassword)
			r.Post("/{slug}/submit", galleryHandler.SubmitSelection)
		})

		// Payment routes (SociaBuzz)
		r.Route("/payments", func(r chi.Router) {
			r.Group(func(r chi.Router) {
				r.Use(middleware.OptionalAuthMiddleware(cfg.JWTSecret))
				r.Post("/upgrade", paymentHandler.Upgrade)
			})
			r.Get("/status/{orderId}", paymentHandler.CheckStatus)
			r.Post("/webhook", paymentHandler.Webhook)
		})
	})

	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("🚀 Picura Golang Backend berjalan di port %s", cfg.Port)
	log.Printf("💳 SociaBuzz Gateway aktif dengan username target: %s", cfg.SociaBuzzUsername)
	if err := http.ListenAndServe(addr, r); err != nil {
		log.Fatalf("❌ Server error: %v", err)
	}
}
