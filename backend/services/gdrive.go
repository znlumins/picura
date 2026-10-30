package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strings"
	"time"
)

type DriveFile struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	ThumbnailURL string `json:"thumbnailUrl"`
}

var folderRegex = regexp.MustCompile(`folders/([a-zA-Z0-9_-]+)`)
var idRegex = regexp.MustCompile(`id=([a-zA-Z0-9_-]+)`)

// ExtractFolderID extracts folder ID from a Google Drive URL
func ExtractFolderID(urlOrID string) string {
	urlOrID = strings.TrimSpace(urlOrID)
	if m := folderRegex.FindStringSubmatch(urlOrID); len(m) > 1 {
		return m[1]
	}
	if m := idRegex.FindStringSubmatch(urlOrID); len(m) > 1 {
		return m[1]
	}
	return urlOrID
}

// FetchDrivePhotos fetches files from a Google Drive folder using Google API Key or fallback
func FetchDrivePhotos(folderID string, apiKey string) ([]DriveFile, error) {
	if apiKey != "" {
		client := &http.Client{Timeout: 10 * time.Second}
		query := fmt.Sprintf("'%s' in parents and trashed = false and mimeType contains 'image/'", folderID)
		url := fmt.Sprintf("https://www.googleapis.com/drive/v3/files?q=%s&fields=files(id,name,thumbnailLink)&key=%s", query, apiKey)

		resp, err := client.Get(url)
		if err == nil && resp.StatusCode == http.StatusOK {
			defer resp.Body.Close()
			body, _ := io.ReadAll(resp.Body)
			var data struct {
				Files []struct {
					ID            string `json:"id"`
					Name          string `json:"name"`
					ThumbnailLink string `json:"thumbnailLink"`
				} `json:"files"`
			}
			if err := json.Unmarshal(body, &data); err == nil && len(data.Files) > 0 {
				var files []DriveFile
				for _, f := range data.Files {
					thumb := f.ThumbnailLink
					if thumb == "" {
						thumb = fmt.Sprintf("https://drive.google.com/thumbnail?id=%s&sz=w1000", f.ID)
					}
					files = append(files, DriveFile{
						ID:           f.ID,
						Name:         f.Name,
						ThumbnailURL: thumb,
					})
				}
				return files, nil
			}
		}
	}

	// Fallback to sample high-resolution dummy photos if no API key or empty folder
	dummyImages := []struct {
		ID   string
		Name string
		URL  string
	}{
		{"demo-1", "IMG_001_Aesthetic.jpg", "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80"},
		{"demo-2", "IMG_002_Bride_Detail.jpg", "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80"},
		{"demo-3", "IMG_003_Reception.jpg", "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80"},
		{"demo-4", "IMG_004_FirstDance.jpg", "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80"},
		{"demo-5", "IMG_005_RingExchange.jpg", "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1000&q=80"},
		{"demo-6", "IMG_006_Portrait.jpg", "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1000&q=80"},
	}

	var files []DriveFile
	for _, d := range dummyImages {
		files = append(files, DriveFile{
			ID:           d.ID,
			Name:         d.Name,
			ThumbnailURL: d.URL,
		})
	}
	return files, nil
}
