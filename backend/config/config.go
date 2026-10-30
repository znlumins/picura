package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port              string
	DatabaseURL       string
	JWTSecret         string
	SociaBuzzUsername string
	SociaBuzzAPIKey   string
	NextFrontendURL   string
}

func Load() *Config {
	// Try loading from .env in current dir, or parent dir
	if err := godotenv.Load(".env"); err != nil {
		if err2 := godotenv.Load("../.env"); err2 != nil {
			log.Println("ℹ️ File .env tidak ditemukan, menggunakan environment variables sistem")
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("❌ DATABASE_URL wajib diisi")
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "picura-super-production-secret-jwt-key-2026-xyz"
	}

	sociaBuzzUsername := os.Getenv("SOCIABUZZ_USERNAME")
	if sociaBuzzUsername == "" {
		sociaBuzzUsername = "picura" // default placeholder
	}

	sociaBuzzAPIKey := os.Getenv("SOCIABUZZ_API_KEY")

	frontendURL := os.Getenv("NEXT_PUBLIC_APP_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:3000"
	}

	return &Config{
		Port:              port,
		DatabaseURL:       dbURL,
		JWTSecret:         jwtSecret,
		SociaBuzzUsername: sociaBuzzUsername,
		SociaBuzzAPIKey:   sociaBuzzAPIKey,
		NextFrontendURL:   frontendURL,
	}
}
