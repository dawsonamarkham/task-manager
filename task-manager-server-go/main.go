package main

import (
	"task-manager-server-go/config"
	"task-manager-server-go/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	// Connect to Database and Initialize application
	db := config.ConnectToDB()

	// Initialize app with handlers for logging, recovery and no routes
	app := gin.Default()
	app.NoRoute(func(cntxt *gin.Context) {
		cntxt.JSON(404, gin.H{"error": "Resource not found."})
	})

	// Register Routes
	routes.RegisterRoutes(app, db)

	// Start the server
	app.Run(":3030")
}
