package main

import (
	"task-manager-server-go/config"
	"task-manager-server-go/routes"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load environment variables
	// err := godotenv.Load(".env")

	// if err != nil {
	// 	log.Fatal("Error loading .env file: " + err.Error())
	// }

	// Connect to Database and Initialize application
	db := config.ConnectToDB()
	app := gin.Default()
	app.NoRoute(func(cntxt *gin.Context) {
		cntxt.JSON(404, gin.H{"error": "Resource not found."})
	})

	app.Use(static.Serve("/", static.LocalFile("./web", true)))

	// app.Use(middlewares.AddDBToContext(db))
	routes.RegisterRoutes(app, db)

	// Start the server
	app.Run(":3000")
}
