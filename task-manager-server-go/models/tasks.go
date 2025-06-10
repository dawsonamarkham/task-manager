package models

import (
	"github.com/google/uuid"
)

type Task struct {
	Model
	UserID      uuid.UUID `gorm:"type:uuid;"`
	Title       string
	Description string
	Category    string
	Completed   bool
}
