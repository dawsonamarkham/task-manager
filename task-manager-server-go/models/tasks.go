package models

import (
	"github.com/google/uuid"
)

type Task struct {
	Model
	UserID      uuid.UUID `json:"userId" gorm:"type:uuid;"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Category    string    `json:"category"`
	Completed   bool      `json:"completed"`
}
