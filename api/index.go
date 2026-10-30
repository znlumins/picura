package handler

import (
	"log"
	"net/http"
	"os"
	"sync"

	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"picura/backend/database"
	"picura/backend/handlers"
	"picura/backend/middleware"
	"picura/backend/services"
)

var (
	router http.Handler
	once   sync.Once
)

func initRouter() {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Println("⚠️ DATABASE_URL belum di-set di environment")
	} else {
		_, err := database.Connect(dbURL)
		if err != nil {
			log.Printf("⚠️ Gagal koneksi database di serverless init: %v", err)
		}
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "picura-super-production-secret-jwt-key-2026-xyz"
	}

	sbUsername := os.Getenv("SOCIABUZZ_USERNAME")
	if sbUsername == "" {
		sbUsername = "mindyourkills"
	}

	sbService := services.NewSociaBuzzService(sbUsername)
	authHandler := handlers.NewAuthHandler(jwtSecret)
	galleryHandler := handlers.NewGalleryHandler()
	paymentHandler := handlers.NewPaymentHandler(sbService)

	r := chi.NewRouter()

	r.Use(chimiddleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok","engine":"golang","platform":"vercel-serverless","version":"2.0.0"}`))
	})

	r.Route("/api/v1", func(r chi.Router) {
		r.Route("/auth", func(r chi.Router) {
			r.Post("/register", authHandler.Register)
			r.Post("/login", authHandler.Login)
			r.Group(func(r chi.Router) {
				r.Use(middleware.AuthMiddleware(jwtSecret))
				r.Get("/me", authHandler.Me)
				r.Put("/settings", authHandler.UpdateSettings)
			})
		})

		r.Route("/galleries", func(r chi.Router) {
			r.Group(func(r chi.Router) {
				r.Use(middleware.OptionalAuthMiddleware(jwtSecret))
				r.Get("/", galleryHandler.List)
				r.Post("/", galleryHandler.Create)
			})
			r.Get("/{slug}", galleryHandler.GetBySlug)
			r.Post("/{slug}/verify-password", galleryHandler.VerifyPassword)
			r.Post("/{slug}/submit", galleryHandler.SubmitSelection)
		})

		r.Route("/payments", func(r chi.Router) {
			r.Group(func(r chi.Router) {
				r.Use(middleware.OptionalAuthMiddleware(jwtSecret))
				r.Post("/upgrade", paymentHandler.Upgrade)
			})
			r.Get("/status/{orderId}", paymentHandler.CheckStatus)
			r.Post("/webhook", paymentHandler.Webhook)
		})
	})

	router = r
}

// Handler is the official Vercel Serverless Function entrypoint
func Handler(w http.ResponseWriter, r *http.Request) {
	once.Do(initRouter)
	router.ServeHTTP(w, r)
}
