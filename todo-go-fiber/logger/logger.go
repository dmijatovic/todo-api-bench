package logger

import (
	"log"
	"strings"

	"github.com/gofiber/fiber"
)

func createLogEntry(ctx *fiber.Ctx) {
	// new string builder
	msg := strings.Builder{}
	msg.WriteString(ctx.Method())
	msg.WriteString(" ")
	msg.WriteString(ctx.Path())
	// msg.WriteString(w.Header().Clone())
	// msg.WriteString(" -")
	// msg.WriteString(ctx.Status())
	// msg.WriteString("]")
	//log request
	log.Println(msg.String())
}

//LogMiddleware logs request method and URL.path
func LogMiddleware() func(*fiber.Ctx) {
	return func(ctx *fiber.Ctx) {
		// pass to next
		createLogEntry(ctx)
		ctx.Next()
	}
}
