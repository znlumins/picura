package database

import (
	"log"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Connect(dsn string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		return nil, err
	}

	sqlDB, err := db.DB()
	if err != nil {
		return nil, err
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(50)
	sqlDB.SetConnMaxLifetime(time.Hour)

	DB = db
	log.Println("✅ Terhubung ke database PostgreSQL")

	// Ensure demo seed user exists
	ensureSeedUser()

	return DB, nil
}

func ensureSeedUser() {
	var count int64
	DB.Model(&User{}).Where("email = ?", "demo@picura.id").Count(&count)
	if count == 0 {
		hashed, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
		hashStr := string(hashed)
		studioName := "Lumina Studio Jakarta"
		studioWA := "6281234567890"

		demoUser := User{
			ID:               uuid.New().String(),
			Email:            "demo@picura.id",
			Name:             "Demo Fotografer",
			PasswordHash:     &hashStr,
			SubscriptionTier: "PRO_FREELANCE",
			StudioName:       &studioName,
			StudioWhatsapp:   &studioWA,
			CreatedAt:        time.Now(),
			UpdatedAt:        time.Now(),
		}
		if err := DB.Create(&demoUser).Error; err != nil {
			log.Println("⚠️ Gagal membuat demo user:", err)
		} else {
			log.Println("🌱 Demo user demo@picura.id berhasil dibuat")
		}
	}
}
