package controllers

import (
	"crypto/rsa"

	"gorm.io/gorm"
)

// Allows access to DB and Secret Key for controllers
type Env struct {
	DB        *gorm.DB
	SecretKey *rsa.PrivateKey
}
