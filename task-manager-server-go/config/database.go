package config

import (
	"log"
	"task-manager-server-go/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectToDB() *gorm.DB {
	dsn := "host=localhost user=example password=example dbname=example port=5432"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Problem occurred connecting to database: ", err)
	}

	err = db.AutoMigrate(models.Task{}, models.User{})

	if err != nil {
		log.Fatal("Problem occurred when making migrations in database: ", err)
	}

	return db
}
