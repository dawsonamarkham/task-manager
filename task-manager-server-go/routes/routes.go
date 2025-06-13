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
	// Define namespace for  accessing DB and Secret Key for controllers
	secretKey, err := jwt.ParseRSAPrivateKeyFromPEM([]byte(os.Getenv("SECRET_KEY")))

	if err != nil {
		log.Fatal("Error parsing secret key:\n" + err.Error())
	}

	controllerEnv := &controllers.Env{DB: db, SecretKey: secretKey}
	middlewareEnv := &middlewares.Env{PublicKey: secretKey.Public()}

	// Define authorization endpoints
	app.POST("/signin", controllerEnv.CreateToken)
	app.POST("/signup", controllerEnv.CreateUser)
	app.POST("/signout", middlewareEnv.AuthMiddleware(), controllerEnv.DestroyToken)

	// Define task endpoints
	app.POST("/tasks", middlewareEnv.AuthMiddleware(), controllerEnv.CreateTask)
	app.GET("/tasks", middlewareEnv.AuthMiddleware(), controllerEnv.FindTasks)
	app.GET("/tasks/:id", middlewareEnv.AuthMiddleware(), controllerEnv.FindTaskByID)
	app.PUT("/tasks/:id", middlewareEnv.AuthMiddleware(), controllerEnv.UpdateTask)
	app.DELETE("/tasks/:id", middlewareEnv.AuthMiddleware(), controllerEnv.DeleteTask)
}
