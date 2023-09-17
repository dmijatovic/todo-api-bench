package api

import (
	"dv4all/fiber-pgx/utils"
	"log"
	"os"
	"runtime"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

type Config struct {
	name    string
	host    string
	prefork bool
}

var Server *fiber.App
var settings Config

func Start() {
	// load AppName
	cfg := Config{
		name: utils.GetEnv("API_NAME", "fiber-pgx"),
		host: utils.GetEnv("API_HOST", ":8080"),
		// disabling prefork solves PID=1 exit issue on some container types
		prefork: utils.GetEnv("API_PREFORK", "false") == "true",
	}

	envProc := utils.GetEnv("API_MAXPROC", "UNDEFINED")
	if envProc != "UNDEFINED" {
		// define max number of processes
		maxProc, err := strconv.ParseInt(envProc, 10, 32)
		if err != nil {
			log.Println("Failed to apply API_MAXPROC", err)
		} else {
			// by default prefork will spawn process on each processor core
			runtime.GOMAXPROCS(int(maxProc))
		}
	}
	// create fiber app
	app := fiber.New(fiber.Config{
		// enable multiple processes to run
		Prefork: cfg.prefork,
	})
	// register logger middleware
	app.Use(logger.New())

	//static
	app.Static("/static", "./static")

	// register all other routes
	registerRoutes(app)

	// start listening
	// NOTE! if no error the code execution stays here
	err := app.Listen(cfg.host)
	// check for errors
	if err != nil {
		log.Println("app.Listen failed...", cfg.host, "...", err)
		// exit if we cannot start listening
		os.Exit(1)
	}
	// save values
	Server = app
	settings = cfg
}

func registerRoutes(api *fiber.App) {
	//home
	api.Get("/", getHome)

	//todo list
	api.Get("/list", getTodoLists)
	api.Post("/list", addTodoList)
	api.Get("/list/:listid", getTodoList)
	api.Put("/list/:listid", updateTodoList)
	api.Delete("/list/:listid", deleteTodoList)

	// todo item
	api.Post("/todo", addTodoItem)
	api.Get("/todo/:id", getTodoItem)
	api.Put("/todo/:id", updateTodoItem)
	api.Delete("/todo/:id", deleteTodoItem)

	// todo items of list
	api.Get("/list/:listid/todo", getTodoItems)

	// log this
	utils.LogOnMainProcess("api.registerRoutes...OK")
}

// TODO! integrate shutdown in channel communication
func Shutdown(close chan bool) {

	// wait for close sign
	<-close

	if Server != nil {
		log.Println("Closing api server")
		Server.Shutdown()
	} else {
		log.Println("api.Shutdown...no server to shutdown")
	}
}

func Settings() Config {
	return settings
}
