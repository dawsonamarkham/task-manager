package config

import (
	"fmt"
	"log"
	"os"
	"task-manager-server-go/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectToDB() *gorm.DB {

	dbHost := os.Getenv("DB_HOST")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbPort := os.Getenv("DB_PORT")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s", dbHost, dbUser, dbPassword, dbName, dbPort)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Problem occurred connecting to database:\n", err)
	}

	err = db.AutoMigrate(models.Task{}, models.User{})

	if err != nil {
		log.Fatal("Problem occurred when making migrations in database:\n", err)
	}

	return db
}
