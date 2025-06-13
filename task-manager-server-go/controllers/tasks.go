package controllers

import (
	"errors"
	"fmt"
	"log"
	"strings"
	"task-manager-server-go/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Define accepted categories
var ValidCategories = [...]string{"Work", "Hobby", "Personal", "Other"}

// Define POST/PUT Dat for tasks
type TaskBody struct {
	Title       string `json:"title" binding:"required,min=1,max=32"`
	Description string `json:"description" binding:"max=200"`
	Category    string `json:"category" binding:"required"`
	Completed   *bool  `json:"completed" binding:"required"`
}

// Define types for query parameters
type GetParams struct {
	Page             int    `form:"page"`
	Limit            int    `form:"limit"`
	CategoryFilter   string `form:"categoryFilter"`
	CompletionFilter *bool  `form:"completionFilter"`
}

// Define helper functions
func (env *Env) GetUserID(cntxt *gin.Context) (uuid.UUID, error) {
	// Return typed uuid
	userID, ok := cntxt.Get("userID")
	if !ok {
		var placeholder uuid.UUID
		return placeholder, fmt.Errorf("could not find userID in context")
	}
	return uuid.Parse(userID.(string))
}

func isValidCategory(val string) bool {
	// Return if value is one of the accepted categories
	for _, item := range ValidCategories {
		if item == val {
			return true
		}
	}
	return false
}

func (env *Env) RetrieveTaskByPathID(cntxt *gin.Context) (models.Task, error) {
	// Return task with given ID
	id := cntxt.Param("id")
	var task models.Task

	userID, err := env.GetUserID(cntxt)
	if err != nil {
		log.Println("Encountered error determining userID: " + err.Error())
		cntxt.JSON(500, gin.H{"error": "Encountered unexpected error. Please try again later or contact the system administrator."})
		return task, err
	}
	result := env.DB.Where("user_id = '" + userID.String() + "' AND id = '" + id + "'").First(&task)

	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		log.Println("Task not found.")
		cntxt.JSON(404, gin.H{"error": "Resource not found."})
		return task, result.Error
	}
	if result.Error != nil {
		log.Println("Encountered error during database communication: " + result.Error.Error())
		cntxt.JSON(500, gin.H{"error": "Encountered unexpected error. Please try again later or contact the system administrator."})
		return task, result.Error
	}

	return task, nil
}

// Define main functionality (CRUD logic)
func (env *Env) CreateTask(cntxt *gin.Context) {
	// Create Task with given data
	var data TaskBody
	if err := cntxt.ShouldBindJSON(&data); err != nil {
		cntxt.JSON(400, gin.H{"error": err.Error()})
		return
	}
	if !isValidCategory(data.Category) {
		cntxt.JSON(400, gin.H{"error": "Category must be one of " + strings.Join(ValidCategories[:], ", ")})
		return
	}

	// Get User ID
	userID, err := env.GetUserID(cntxt)
	if err != nil {
		log.Println("Encountered error determining userID: " + err.Error())
		cntxt.JSON(500, gin.H{"error": "Encountered unexpected error. Please try again later or contact the system administrator."})
		return
	}

	// Define and Save new Task
	newTask := models.Task{UserID: userID, Title: data.Title, Description: data.Description, Category: data.Category, Completed: *data.Completed}
	res := env.DB.Create(&newTask)
	if res.Error != nil {
		log.Println("Encountered error during row creation: " + res.Error.Error())
		cntxt.JSON(500, gin.H{"error": "Encountered unexpected error. Please try again later or contact the system administrator."})
		return
	}
	cntxt.JSON(200, newTask)
}

func (env *Env) FindTasks(cntxt *gin.Context) {
	// Return Paginated list of Tasks

	// Get/set parameters
	var params GetParams
	cntxt.ShouldBindQuery(&params)

	if params.Page <= 0 {
		params.Page = 1
	}
	if params.Limit <= 0 {
		params.Limit = 10
	} else if params.Limit > 100 {
		params.Limit = 100
	}

	userID, err := env.GetUserID(cntxt)
	if err != nil {
		log.Println("Encountered error determining userID: " + err.Error())
		cntxt.JSON(500, gin.H{"error": "Encountered unexpected error. Please try again later or contact the system administrator."})
		return
	}

	// Construct WHERE condition
	where := "user_id = '" + userID.String() + "'"

	if params.CategoryFilter != "" && isValidCategory(params.CategoryFilter) {
		where += " AND category = '" + params.CategoryFilter + "'"
	}

	if params.CompletionFilter != nil {
		if *params.CompletionFilter {
			where += " AND completed = TRUE"
		} else {
			where += " AND completed = FALSE"
		}
	}

	// Get Tasks and Total
	var tasks []models.Task
	var cnt int64
	if err := env.DB.Limit(params.Limit).Offset((params.Page - 1) * params.Limit).Order("created_at desc").Where(where).Find(&tasks).Error; err != nil {
		log.Println("Encountered error retrieving list: " + err.Error())
		cntxt.JSON(500, gin.H{"error": "Encountered unexpected error. Please try again later or contact the system administrator."})
		return
	}
	if err := env.DB.Model(&models.Task{}).Where(where).Count(&cnt).Error; err != nil {
		log.Println("Encountered error retrieving count: " + err.Error())
		cntxt.JSON(500, gin.H{"error": "Encountered unexpected error. Please try again later or contact the system administrator."})
		return
	}

	cntxt.JSON(200, gin.H{
		"data":  tasks,
		"page":  params.Page,
		"limit": params.Limit,
		"total": cnt,
	})

}

func (env *Env) FindTaskByID(cntxt *gin.Context) {
	// Get Task and return
	task, err := env.RetrieveTaskByPathID(cntxt)

	if err != nil {
		return
	}

	cntxt.JSON(200, task)
}

func (env *Env) UpdateTask(cntxt *gin.Context) {
	// Validate data
	var data TaskBody
	if err := cntxt.ShouldBindJSON(&data); err != nil {
		cntxt.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Retrieve Task
	task, err := env.RetrieveTaskByPathID(cntxt)

	if err != nil {
		return
	}

	// Update and Save values
	task.Title = data.Title
	task.Description = data.Description
	task.Category = data.Category
	task.Completed = *data.Completed

	if err := env.DB.Save(&task).Error; err != nil {
		log.Println("Encountered error updating task: " + err.Error())
		cntxt.JSON(500, gin.H{"error": "Encountered unexpected error. Please try again later or contact the system administrator."})
		return
	}

	// Return updated data
	cntxt.JSON(200, task)
}

func (env *Env) DeleteTask(cntxt *gin.Context) {
	// Retrieve task
	task, err := env.RetrieveTaskByPathID(cntxt)

	if err != nil {
		return
	}

	// Delete and send response
	if err := env.DB.Delete(&task).Error; err != nil {
		log.Println("Encountered error deleting task: " + err.Error())
		cntxt.JSON(500, gin.H{"error": "Encountered unexpected error. Please try again later or contact the system administrator."})
		return
	}

	cntxt.JSON(204, gin.H{})
}
