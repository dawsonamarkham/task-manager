package routes

import (
	"log"
	"os"
	"task-manager-server-go/controllers"
	"task-manager-server-go/middlewares"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

func RegisterRoutes(app *gin.Engine, db *gorm.DB) {
	// Define namespace for controller functionality
	secretKey, err := jwt.ParseRSAPrivateKeyFromPEM([]byte(os.Getenv("SECRET_KEY")))

	if err != nil {
		log.Fatal("Error parsing secret key:\n" + err.Error())
	}

	controllerEnv := &controllers.Env{DB: db, SecretKey: secretKey}
	middlewareEnv := &middlewares.Env{PublicKey: secretKey.Public()}

	// Define authorization endpoints
	app.POST("/signin", controllerEnv.CreateToken)
	app.POST("/signup", controllerEnv.CreateUser)

	app.Use(middlewareEnv.AuthMiddleware())
	app.POST("/signout", controllerEnv.DestroyToken)

	// Define task endpoints
	app.POST("/tasks", controllerEnv.CreateTask)
	app.GET("/tasks", controllerEnv.FindTasks)
	app.GET("/tasks/:id", controllerEnv.FindTaskByID)
	app.PUT("/tasks/:id", controllerEnv.UpdateTask)
	app.DELETE("/tasks/:id", controllerEnv.DeleteTask)
}
