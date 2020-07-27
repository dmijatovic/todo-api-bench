package logger

import (
	"log"
	"net/http"
	"strings"
)

func createLogEntry(w http.ResponseWriter, r *http.Request) {
	// new string builder
	msg := strings.Builder{}
	msg.WriteString(r.Method)
	msg.WriteString(" ")
	msg.WriteString(r.URL.Path)
	// msg.WriteString(w.Header().Clone())
	msg.WriteString(" [")
	msg.WriteString(r.UserAgent())
	msg.WriteString("]")
	//log request
	log.Println(msg.String())
}

//LogHandler log middleware for Handler. It logs request method and URL.path
func LogHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// pass to next
		createLogEntry(w, r)
		next.ServeHTTP(w, r)
	})
}

//LogHFunc log middleware for HandlerFunc. It logs request method and URL.path
func LogHFunc(next http.HandlerFunc) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		createLogEntry(w, r)
		// pass to next
		next(w, r)
	})
}
