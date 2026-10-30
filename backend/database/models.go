package database

import (
	"time"
)

type User struct {
	ID                    string     `gorm:"primaryKey;type:text" json:"id"`
	Email                 string     `gorm:"uniqueIndex;type:text;not null" json:"email"`
	Name                  string     `gorm:"type:text;not null" json:"name"`
	PasswordHash          *string    `gorm:"type:text;column:passwordHash" json:"-"`
	GoogleID              *string    `gorm:"uniqueIndex;type:text;column:googleId" json:"googleId,omitempty"`
	GoogleAccessToken     *string    `gorm:"type:text;column:googleAccessToken" json:"-"`
	GoogleRefreshToken    *string    `gorm:"type:text;column:googleRefreshToken" json:"-"`
	AvatarURL             *string    `gorm:"type:text;column:avatarUrl" json:"avatarUrl,omitempty"`
	SubscriptionTier      string     `gorm:"type:text;default:'FREEMIUM';column:subscriptionTier" json:"subscriptionTier"`
	SubscriptionExpiresAt *time.Time `gorm:"column:subscriptionExpiresAt" json:"subscriptionExpiresAt,omitempty"`
	GoogleAPIKey          *string    `gorm:"type:text;column:googleApiKey" json:"googleApiKey,omitempty"`
	StudioName            *string    `gorm:"type:text;column:studioName" json:"studioName,omitempty"`
	StudioWhatsapp        *string    `gorm:"type:text;column:studioWhatsapp" json:"studioWhatsapp,omitempty"`
	CreatedAt             time.Time  `gorm:"column:createdAt;default:now()" json:"createdAt"`
	UpdatedAt             time.Time  `gorm:"column:updatedAt;default:now()" json:"updatedAt"`

	Galleries     []Gallery      `gorm:"foreignKey:UserID" json:"galleries,omitempty"`
	Subscriptions []Subscription `gorm:"foreignKey:UserID" json:"subscriptions,omitempty"`
}

func (User) TableName() string {
	return "users"
}

type Gallery struct {
	ID                   string     `gorm:"primaryKey;type:text" json:"id"`
	UserID               string     `gorm:"type:text;not null;column:userId;index" json:"userId"`
	Title                string     `gorm:"type:text;not null" json:"title"`
	Slug                 string     `gorm:"uniqueIndex;type:text;not null" json:"slug"`
	GoogleDriveFolderID  string     `gorm:"type:text;not null;column:googleDriveFolderId" json:"googleDriveFolderId"`
	MaxSelectionQuota    int        `gorm:"type:integer;default:20;column:maxSelectionQuota" json:"maxSelectionQuota"`
	PasswordHash         *string    `gorm:"type:text;column:passwordHash" json:"-"`
	EditorWhatsappNumber string     `gorm:"type:text;not null;column:editorWhatsappNumber" json:"editorWhatsappNumber"`
	Status               string     `gorm:"type:text;default:'ACTIVE'" json:"status"`
	ExpiresAt            *time.Time `gorm:"column:expiresAt" json:"expiresAt,omitempty"`
	CreatedAt            time.Time  `gorm:"column:createdAt;default:now()" json:"createdAt"`
	UpdatedAt            time.Time  `gorm:"column:updatedAt;default:now()" json:"updatedAt"`

	User       *User        `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Photos     []PhotoCache `gorm:"foreignKey:GalleryID" json:"photos,omitempty"`
	Selections []Selection  `gorm:"foreignKey:GalleryID" json:"selections,omitempty"`
}

func (Gallery) TableName() string {
	return "galleries"
}

type PhotoCache struct {
	ID             string    `gorm:"primaryKey;type:text" json:"id"`
	GalleryID      string    `gorm:"type:text;not null;column:galleryId;index" json:"galleryId"`
	DriveFileID    string    `gorm:"type:text;not null;column:driveFileId" json:"driveFileId"`
	FileName       string    `gorm:"type:text;not null;column:fileName" json:"fileName"`
	ThumbnailURL   string    `gorm:"type:text;not null;column:thumbnailUrl" json:"thumbnailUrl"`
	WebContentLink *string   `gorm:"type:text;column:webContentLink" json:"webContentLink,omitempty"`
	CreatedAt      time.Time `gorm:"column:createdAt;default:now()" json:"createdAt"`
}

func (PhotoCache) TableName() string {
	return "photos_cache"
}

type Selection struct {
	ID               string    `gorm:"primaryKey;type:text" json:"id"`
	GalleryID        string    `gorm:"type:text;not null;column:galleryId;index" json:"galleryId"`
	ClientName       *string   `gorm:"type:text;column:clientName" json:"clientName,omitempty"`
	ClientNotes      *string   `gorm:"type:text;column:clientNotes" json:"clientNotes,omitempty"`
	SelectedPhotoIds string    `gorm:"type:text;not null;column:selectedPhotoIds" json:"selectedPhotoIds"`
	TotalSelected    int       `gorm:"type:integer;not null;column:totalSelected" json:"totalSelected"`
	SubmittedAt      time.Time `gorm:"column:submittedAt;default:now()" json:"submittedAt"`
}

func (Selection) TableName() string {
	return "selections"
}

type Subscription struct {
	ID             string    `gorm:"primaryKey;type:text" json:"id"`
	UserID         string    `gorm:"type:text;not null;column:userId;index" json:"userId"`
	OrderID        string    `gorm:"uniqueIndex;type:text;not null;column:orderId" json:"orderId"`
	TierPlan       string    `gorm:"type:text;not null;column:tierPlan" json:"tierPlan"`
	Amount         float64   `gorm:"type:numeric;not null" json:"amount"`
	PaymentStatus  string    `gorm:"type:text;default:'PENDING';column:paymentStatus" json:"paymentStatus"`
	PaymentGateway string    `gorm:"type:text;default:'SOCIABUZZ';column:paymentGateway" json:"paymentGateway"`
	RawPayload     *string   `gorm:"type:text;column:rawPayload" json:"rawPayload,omitempty"`
	CreatedAt      time.Time `gorm:"column:createdAt;default:now()" json:"createdAt"`
	UpdatedAt      time.Time `gorm:"column:updatedAt;default:now()" json:"updatedAt"`

	User *User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

func (Subscription) TableName() string {
	return "subscriptions"
}
