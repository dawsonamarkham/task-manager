package controllers

import (
	"log"
	"task-manager-server-go/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type TaskBody struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
	Category    string `json:"category" binding:"required"`
	Completed   *bool  `json:"completed" binding:"required"`
}

type GetParams struct {
	Page           int    `form:"page"`
	Limit          int    `form:"limit"`
	CategoryFilter string `form:"categoryFilter"`
}

func (env *Env) CreateTask(cntxt *gin.Context) {
	// 6c196332-778a-41f9-ba4f-c4291d16e242
	var data TaskBody
	if err := cntxt.ShouldBindJSON(&data); err != nil {
		cntxt.JSON(400, gin.H{"error": err.Error()})
		return
	}
	userID := uuid.MustParse("6c196332-778a-41f9-ba4f-c4291d16e242")
	newTask := models.Task{UserID: userID, Title: data.Title, Description: data.Description, Category: data.Category, Completed: *data.Completed}
	res := env.DB.Create(&newTask)
	if res.Error != nil {
		log.Println("Encountered error during row creation: " + res.Error.Error())
		cntxt.JSON(500, gin.H{"error": "Encountered unexpected error. Please try again later or contact the system administrator."})
		return
	}
	cntxt.JSON(200, gin.H{
		"id":          newTask.ID,
		"createdAt":   newTask.CreatedAt,
		"updatedAt":   newTask.UpdatedAt,
		"userId":      newTask.UserID,
		"title":       newTask.Title,
		"description": newTask.Description,
		"completed":   newTask.Completed,
	})
}

func (env *Env) FindTasks(cntxt *gin.Context) {
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

	userID := uuid.MustParse("6c196332-778a-41f9-ba4f-c4291d16e242")
	var tasks []models.Task
	env.DB.Limit(params.Limit).Offset((params.Page - 1) * params.Limit).Order("created_at desc").Find(&tasks)

	var cnt int64
	env.DB.Model(&models.Task{}).Count(&cnt)

	cntxt.JSON(200, gin.H{
		"data":  tasks,
		"page":  params.Page,
		"limit": params.Limit,
		"total": cnt,
	})

}

func (env *Env) FindTaskByID(cntxt *gin.Context) {

}

func (env *Env) UpdateTask(cntxt *gin.Context) {

}

func (env *Env) DeleteTask(cntxt *gin.Context) {

}
