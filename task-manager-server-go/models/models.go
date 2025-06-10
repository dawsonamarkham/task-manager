package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Model struct {
	ID        uuid.UUID `gorm:"type:uuid;"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

func (model *Model) BeforeCreate(tx *gorm.DB) error {
	newId, err := uuid.NewRandom()
	if err != nil {
		return err
	}
	model.ID = newId
	return nil
}
