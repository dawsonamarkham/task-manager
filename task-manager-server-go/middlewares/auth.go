package middlewares

import (
	"crypto"
	"fmt"
	"log"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type Env struct {
	PublicKey crypto.PublicKey
}

func (env *Env) AuthMiddleware() gin.HandlerFunc {
	// Handles unauthorized request and retrieves userId from JWT if possible
	return func(cntxt *gin.Context) {
		err := env.ValidateToken(cntxt)
		if err != nil {
			log.Println(err.Error())
			cntxt.JSON(401, gin.H{"error": "Unauthorized."})
			cntxt.Abort()
			return
		}
		cntxt.Next()
	}
}

func (env *Env) ValidateToken(cntxt *gin.Context) error {
	// Obtain JWT
	tkn := env.RetrieveToken(cntxt)

	// Parse JWT
	parsed, err := jwt.Parse(tkn, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("token has unexpected signing method: %v", token.Header["alg"])
		}
		return env.PublicKey, nil
	})
	if err != nil {
		return err
	}

	// Add userID to request context
	claims, ok := parsed.Claims.(jwt.MapClaims)
	if ok && parsed.Valid {
		cntxt.Set("userID", claims["jti"])
		return nil
	}

	// Something went wrong
	return fmt.Errorf("unable to obtain claims from jwt")
}

func (env *Env) RetrieveToken(cntxt *gin.Context) string {
	// Retrieve token from header (Remove 'Bearer ' prefix)
	tkn := cntxt.Request.Header.Get("Authorization")
	split := strings.Split(tkn, " ")

	if len(split) == 2 {
		return split[1]
	}
	return ""
}
