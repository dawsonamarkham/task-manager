package routes

import (
	"task-manager-server-go/controllers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterRoutes(app *gin.Engine, db *gorm.DB) {
	env := &controllers.Env{DB: db}
	// Define authorization endpoints
	app.POST("/signin", env.CreateToken)
	app.POST("/signup", env.CreateUser)

	app.POST("/signout", env.DestroyToken)

	// Define task endpoints
	app.POST("/tasks", env.CreateTask)
	app.GET("/tasks", env.FindTasks)
	app.GET("/tasks/:id", env.FindTaskByID)
	app.PUT("/tasks/:id", env.UpdateTask)
	app.DELETE("/tasks/:id", env.DeleteTask)
}
