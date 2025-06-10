package controllers

import (
	"errors"
	"log"
	"task-manager-server-go/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var secret, secretErr = jwt.ParseRSAPrivateKeyFromPEM([]byte("PLACE PEM ENCODED KEY HERE"))

type UserInfo struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8,max=72"`
}

func (env *Env) CreateUser(cntxt *gin.Context) {
	if secretErr != nil {
		log.Println(secretErr.Error())
	}
	// Validate request body
	var data UserInfo
	if err := cntxt.ShouldBindJSON(&data); err != nil {
		cntxt.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Make sure email does not exist
	if err := env.DB.First(&models.User{Email: data.Email}).Error; errors.Is(err, gorm.ErrRecordNotFound) {
		// Calculate Hash and create a new user entry
		hash, err := bcrypt.GenerateFromPassword([]byte(data.Password), 14)

		if err != nil {
			log.Println("Encountered error during hash creation: " + err.Error())
			cntxt.JSON(500, gin.H{"error": "Encountered unexpected error. Please try again later or contact the system administrator."})
			return
		}

		newUser := models.User{Email: data.Email, PasswordHash: hash}

		res := env.DB.Create(&newUser)
		if res.Error != nil {
			log.Println("Encountered error during row creation: " + res.Error.Error())
			cntxt.JSON(500, gin.H{"error": "Encountered unexpected error. Please try again later or contact the system administrator."})
			return
		}

		// Create JWT
		expirationOffset := 10 * time.Minute
		claims := &jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expirationOffset)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			ID:        newUser.ID.String(),
		}
		token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
		sToken, err := token.SignedString(secret)
		if err != nil {
			log.Println("Encountered error during token creation: " + err.Error())
			cntxt.JSON(500, gin.H{"error": "Encountered unexpected error. Please try again later or contact the system administrator."})
			return
		}
		cntxt.Writer.Header().Set("Cache-Control", "no-store")
		cntxt.JSON(200, gin.H{
			"access_token": sToken,
			"token_type":   "Bearer",
			"expires_in":   expirationOffset.Seconds(),
		})
		return

	} else {
		cntxt.JSON(409, gin.H{"error": "An account is already associated with the provided email."})
		return
	}

}

func (env *Env) CreateToken(cntxt *gin.Context) {
	if secretErr != nil {
		log.Println(secretErr.Error())
	}
	// Validate request body
	var data UserInfo
	if err := cntxt.ShouldBindJSON(&data); err != nil {
		cntxt.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Find user and hash
	var user models.User
	result := env.DB.First(&user)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		log.Println("Account does not exist.")
		cntxt.JSON(400, gin.H{"error": "Email or password is incorrect."})
		return
	}
	if result.Error != nil {
		log.Println("Encountered error during database communication: " + result.Error.Error())
		cntxt.JSON(500, gin.H{"error": "Encountered unexpected error. Please try again later or contact the system administrator."})
		return
	}

	// Compre hash and password
	err := bcrypt.CompareHashAndPassword(user.PasswordHash, []byte(data.Password))
	if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
		log.Println("Encountered error during password comparison: " + err.Error())
		cntxt.JSON(400, gin.H{"error": "Email or password is incorrect."})
		return
	}
	if err != nil {
		log.Println("Encountered error during hash comparison: " + err.Error())
		cntxt.JSON(500, gin.H{"error": "Encountered unexpected error. Please try again later or contact the system administrator."})
		return
	}

	// Create JWT
	expirationOffset := 10 * time.Minute
	claims := &jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(expirationOffset)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		NotBefore: jwt.NewNumericDate(time.Now()),
		ID:        user.ID.String(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	sToken, err := token.SignedString(secret)
	if err != nil {
		log.Println("Encountered error during token creation: " + err.Error())
		cntxt.JSON(500, gin.H{"error": "Encountered unexpected error. Please try again later or contact the system administrator."})
		return
	}
	cntxt.Writer.Header().Set("Cache-Control", "no-store")
	cntxt.JSON(200, gin.H{
		"access_token": sToken,
		"token_type":   "Bearer",
		"expires_in":   expirationOffset.Seconds(),
	})
}

func (env *Env) DestroyToken(cntxt *gin.Context) {
	// Do nothing. The token should be deleted on the client end upon logout.
}
