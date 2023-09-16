package utils

import (
	"log"

	"github.com/gofiber/fiber/v2"
)

func LogOnMainProcess(msg string) {
	// Log only main fiber process
	if fiber.IsChild() == false {
		log.Println(msg)
	}
}
