package controllers

import (
	"crypto/rsa"

	"gorm.io/gorm"
)

type Env struct {
	DB        *gorm.DB
	SecretKey *rsa.PrivateKey
}
