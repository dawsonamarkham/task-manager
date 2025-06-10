package middlewares

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AddDBToContext(db *gorm.DB) gin.HandlerFunc {
	return func(cntxt *gin.Context) {
		cntxt.Set("DB", db)
		cntxt.Next()
	}
}
