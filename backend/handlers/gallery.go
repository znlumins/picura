package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"picura/backend/database"
	"picura/backend/middleware"
	"picura/backend/services"
)

type GalleryHandler struct{}

func NewGalleryHandler() *GalleryHandler {
	return &GalleryHandler{}
}

func (h *GalleryHandler) List(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	user := middleware.GetUserFromContext(r.Context())
	if user == nil {
		// Fallback to demo user if unauthenticated
		var demoUser database.User
		if err := database.DB.Where("email = ?", "demo@picura.id").First(&demoUser).Error; err == nil {
			user = &demoUser
		} else {
			http.Error(w, `{"error":"Unauthorized"}`, http.StatusUnauthorized)
			return
		}
	}

	var galleries []database.Gallery
	if err := database.DB.Preload("Photos").Preload("Selections").Where("userId = ?", user.ID).Order("createdAt desc").Find(&galleries).Error; err != nil {
		http.Error(w, `{"error":"Gagal memuat galeri"}`, http.StatusInternalServerError)
		return
	}

	activeCount := 0
	totalPhotosCached := 0
	quotaLimit := 2
	if user.SubscriptionTier != "FREEMIUM" {
		quotaLimit = 999
	}

	type FormattedGallery struct {
		ID                   string      `json:"id"`
		Title                string      `json:"title"`
		Slug                 string      `json:"slug"`
		GoogleDriveFolderID  string      `json:"googleDriveFolderId"`
		MaxSelectionQuota    int         `json:"maxSelectionQuota"`
		HasPassword          bool        `json:"hasPassword"`
		EditorWhatsappNumber string      `json:"editorWhatsappNumber"`
		Status               string      `json:"status"`
		ExpiresAt            *time.Time  `json:"expiresAt,omitempty"`
		CreatedAt            time.Time   `json:"createdAt"`
		PhotoCount           int         `json:"photoCount"`
		ProgressPercent      int         `json:"progressPercent"`
		LatestSelection      interface{} `json:"latestSelection,omitempty"`
	}

	formatted := make([]FormattedGallery, 0, len(galleries))
	for _, g := range galleries {
		if g.Status == "ACTIVE" {
			activeCount++
		}
		totalPhotosCached += len(g.Photos)

		var latestSel interface{} = nil
		latestCount := 0
		if len(g.Selections) > 0 {
			sel := g.Selections[len(g.Selections)-1]
			latestCount = sel.TotalSelected
			latestSel = map[string]interface{}{
				"clientName":    sel.ClientName,
				"clientNotes":   sel.ClientNotes,
				"totalSelected": sel.TotalSelected,
				"submittedAt":   sel.SubmittedAt,
			}
		}

		progress := 0
		if g.MaxSelectionQuota > 0 && latestCount > 0 {
			progress = (latestCount * 100) / g.MaxSelectionQuota
			if progress > 100 {
				progress = 100
			}
		}

		formatted = append(formatted, FormattedGallery{
			ID:                   g.ID,
			Title:                g.Title,
			Slug:                 g.Slug,
			GoogleDriveFolderID:  g.GoogleDriveFolderID,
			MaxSelectionQuota:    g.MaxSelectionQuota,
			HasPassword:          g.PasswordHash != nil && *g.PasswordHash != "",
			EditorWhatsappNumber: g.EditorWhatsappNumber,
			Status:               g.Status,
			ExpiresAt:            g.ExpiresAt,
			CreatedAt:            g.CreatedAt,
			PhotoCount:           len(g.Photos),
			ProgressPercent:      progress,
			LatestSelection:      latestSel,
		})
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
		"meta": map[string]interface{}{
			"activeCount":       activeCount,
			"quotaLimit":        quotaLimit,
			"totalPhotosCached": totalPhotosCached,
			"canCreateMore":     activeCount < quotaLimit,
			"userTier":          user.SubscriptionTier,
		},
		"data": formatted,
	})
}

type CreateGalleryRequest struct {
	Title             string   `json:"title"`
	DriveFolderURL    string   `json:"drive_folder_url"`
	MaxSelectionQuota int      `json:"max_selection_quota"`
	Password          string   `json:"password"`
	EditorWhatsapp    string   `json:"editor_whatsapp"`
	DirectFiles       []string `json:"direct_files"`
}

func (h *GalleryHandler) Create(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	user := middleware.GetUserFromContext(r.Context())
	if user == nil {
		var demoUser database.User
		database.DB.Where("email = ?", "demo@picura.id").First(&demoUser)
		user = &demoUser
	}

	var req CreateGalleryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Payload tidak valid"}`, http.StatusBadRequest)
		return
	}

	// Quota check
	var activeCount int64
	database.DB.Model(&database.Gallery{}).Where("userId = ? AND status = 'ACTIVE'", user.ID).Count(&activeCount)
	quotaLimit := int64(2)
	if user.SubscriptionTier != "FREEMIUM" {
		quotaLimit = 999
	}

	if activeCount >= quotaLimit {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error":            "QUOTA_EXCEEDED",
			"message":          "Batas paket Freemium tercapai (maksimal 2 galeri aktif). Silakan upgrade ke Pro Freelance atau Studio.",
			"requires_upgrade": true,
		})
		return
	}

	if strings.TrimSpace(req.Title) == "" {
		http.Error(w, `{"error":"Judul galeri wajib diisi"}`, http.StatusBadRequest)
		return
	}

	folderID := services.ExtractFolderID(req.DriveFolderURL)
	if folderID == "" {
		folderID = "drive_folder_" + uuid.New().String()[:8]
	}

	// Generate slug
	rawSlug := strings.ToLower(strings.ReplaceAll(req.Title, " ", "-"))
	slug := fmt.Sprintf("%s-%s", rawSlug, uuid.New().String()[:6])

	var passHash *string
	if strings.TrimSpace(req.Password) != "" {
		hashed, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		hStr := string(hashed)
		passHash = &hStr
	}

	waNumber := strings.TrimSpace(req.EditorWhatsapp)
	if waNumber == "" && user.StudioWhatsapp != nil {
		waNumber = *user.StudioWhatsapp
	}
	if waNumber == "" {
		waNumber = "6281234567890"
	}

	quota := req.MaxSelectionQuota
	if quota <= 0 {
		quota = 20
	}

	gallery := database.Gallery{
		ID:                   uuid.New().String(),
		UserID:               user.ID,
		Title:                req.Title,
		Slug:                 slug,
		GoogleDriveFolderID:  folderID,
		MaxSelectionQuota:    quota,
		PasswordHash:         passHash,
		EditorWhatsappNumber: waNumber,
		Status:               "ACTIVE",
		CreatedAt:            time.Now(),
		UpdatedAt:            time.Now(),
	}

	if err := database.DB.Create(&gallery).Error; err != nil {
		http.Error(w, `{"error":"Gagal menyimpan galeri"}`, http.StatusInternalServerError)
		return
	}

	// Fetch photos
	apiKey := ""
	if user.GoogleAPIKey != nil {
		apiKey = *user.GoogleAPIKey
	}
	photos, _ := services.FetchDrivePhotos(folderID, apiKey)

	for _, p := range photos {
		pc := database.PhotoCache{
			ID:           uuid.New().String(),
			GalleryID:    gallery.ID,
			DriveFileID:  p.ID,
			FileName:     p.Name,
			ThumbnailURL: p.ThumbnailURL,
			CreatedAt:    time.Now(),
		}
		database.DB.Create(&pc)
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "Galeri berhasil dibuat dengan koneksi Google Drive",
		"data": map[string]interface{}{
			"id":          gallery.ID,
			"slug":        gallery.Slug,
			"photosCount": len(photos),
			"publicUrl":   "/g/" + gallery.Slug,
		},
	})
}

func (h *GalleryHandler) GetBySlug(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	slug := chi.URLParam(r, "slug")

	var gallery database.Gallery
	if err := database.DB.Preload("Photos").Preload("User").Where("slug = ?", slug).First(&gallery).Error; err != nil {
		http.Error(w, `{"error":"Galeri tidak ditemukan"}`, http.StatusNotFound)
		return
	}

	requiresPassword := gallery.PasswordHash != nil && *gallery.PasswordHash != ""

	type PhotoDTO struct {
		ID           string `json:"id"`
		FileName     string `json:"fileName"`
		ThumbnailURL string `json:"thumbnailUrl"`
	}

	photos := make([]PhotoDTO, 0, len(gallery.Photos))
	for _, p := range gallery.Photos {
		photos = append(photos, PhotoDTO{
			ID:           p.ID,
			FileName:     p.FileName,
			ThumbnailURL: p.ThumbnailURL,
		})
	}

	studioName := "Picura Studio Partner"
	if gallery.User != nil && gallery.User.StudioName != nil {
		studioName = *gallery.User.StudioName
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
		"gallery": map[string]interface{}{
			"id":                gallery.ID,
			"title":             gallery.Title,
			"slug":              gallery.Slug,
			"maxSelectionQuota": gallery.MaxSelectionQuota,
			"requiresPassword":  requiresPassword,
			"status":            gallery.Status,
			"studioName":        studioName,
			"photos":            photos,
			"totalPhotos":       len(photos),
		},
	})
}

func (h *GalleryHandler) VerifyPassword(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	slug := chi.URLParam(r, "slug")

	var req struct {
		Password string `json:"password"`
	}
	json.NewDecoder(r.Body).Decode(&req)

	var gallery database.Gallery
	if err := database.DB.Where("slug = ?", slug).First(&gallery).Error; err != nil {
		http.Error(w, `{"error":"Galeri tidak ditemukan"}`, http.StatusNotFound)
		return
	}

	if gallery.PasswordHash == nil || *gallery.PasswordHash == "" {
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "success", "valid": true})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(*gallery.PasswordHash), []byte(req.Password)); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": "Password salah", "valid": false})
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{"status": "success", "valid": true})
}

type SubmitSelectionRequest struct {
	ClientName     string `json:"client_name"`
	ClientNotes    string `json:"client_notes"`
	SelectedPhotos []struct {
		FileID   string `json:"file_id"`
		Filename string `json:"filename"`
	} `json:"selected_photos"`
}

func (h *GalleryHandler) SubmitSelection(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	slug := chi.URLParam(r, "slug")

	var gallery database.Gallery
	if err := database.DB.Where("slug = ?", slug).First(&gallery).Error; err != nil {
		http.Error(w, `{"error":"Galeri tidak ditemukan"}`, http.StatusNotFound)
		return
	}

	var req SubmitSelectionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Invalid payload"}`, http.StatusBadRequest)
		return
	}

	if len(req.SelectedPhotos) == 0 {
		http.Error(w, `{"error":"Belum ada foto yang dipilih"}`, http.StatusBadRequest)
		return
	}

	photosJSON, _ := json.Marshal(req.SelectedPhotos)

	selection := database.Selection{
		ID:               uuid.New().String(),
		GalleryID:        gallery.ID,
		ClientName:       &req.ClientName,
		ClientNotes:      &req.ClientNotes,
		SelectedPhotoIds: string(photosJSON),
		TotalSelected:    len(req.SelectedPhotos),
		SubmittedAt:      time.Now(),
	}

	database.DB.Create(&selection)

	// Build WhatsApp message
	var fileList strings.Builder
	for i, f := range req.SelectedPhotos {
		fileList.WriteString(fmt.Sprintf("%d. %s\n", i+1, f.Filename))
	}

	clientDisplay := req.ClientName
	if clientDisplay == "" {
		clientDisplay = "Klien"
	}

	waText := fmt.Sprintf(
		"Halo Tim Editor Picura!\n\nSaya *%s* telah menyelesaikan seleksi foto untuk galeri: *%s*.\n\nTotal foto terpilih: *%d dari %d kuota*\n\nDaftar File:\n%s\nCatatan Tambahan:\n_%s_\n\nTerima kasih!",
		clientDisplay,
		gallery.Title,
		len(req.SelectedPhotos),
		gallery.MaxSelectionQuota,
		fileList.String(),
		req.ClientNotes,
	)

	waURL := fmt.Sprintf("https://wa.me/%s?text=%s", gallery.EditorWhatsappNumber, url.QueryEscape(waText))

	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "Seleksi berhasil disimpan",
		"data": map[string]interface{}{
			"selectionId":   selection.ID,
			"totalSelected": len(req.SelectedPhotos),
			"whatsappUrl":   waURL,
		},
	})
}
