package routes

import (
	"dv4all/todoapi/logger"
	"dv4all/todoapi/token"
	"net/http"
)

// Register all server routes with methods
func Register() *http.ServeMux {
	mux := http.NewServeMux()

	// demo page does do much
	mux.HandleFunc("/demo", demo())
	// users management page GET,POST,PUT, DELETE
	mux.Handle("/users", logger.LogHandler(token.ProtectHFunc(handleUsers)))
	// login issues JWT tokens
	mux.Handle("/login", logger.LogHFunc(handleLogin))
	// verify user token
	mux.Handle("/verify", logger.LogHFunc(handleVerify))

	//todos routes
	mux.Handle("/todos/", logger.LogHFunc(handleTodos))

	//home page is static index.html
	mux.Handle("/", logger.LogHandler(http.FileServer(http.Dir("./views/"))))

	return mux
}
