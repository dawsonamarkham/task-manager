package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Base structure for all DB models
type Model struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// Generate a new UUID on creation
func (model *Model) BeforeCreate(tx *gorm.DB) error {
	newId, err := uuid.NewRandom()
	if err != nil {
		return err
	}
	model.ID = newId
	return nil
}
