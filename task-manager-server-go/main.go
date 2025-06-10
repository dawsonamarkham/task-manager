package main

import (
	"log"
	"task-manager-server-go/config"
	"task-manager-server-go/routes"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error loading .env file: " + err.Error())
	}

	// Connect to Database and Initialize application
	db := config.ConnectToDB()
	app := gin.Default()

	// app.Use(middlewares.AddDBToContext(db))
	routes.RegisterRoutes(app, db)

	// Define routes
	app.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Welcome to Gin Framework!",
		})
	})

	// Start the server
	app.Run(":3000")
}
