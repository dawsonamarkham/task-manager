package main

import (
	"task-manager-server-go/config"
	"task-manager-server-go/routes"

	"github.com/gin-gonic/gin"
)

func main() {
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
