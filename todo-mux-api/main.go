package main

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"dv4all/todoapi/pgdb"
	"dv4all/todoapi/routes"
	"dv4all/todoapi/utils"
)

// AppName holds application name
var AppName string

// connection to postgres
func todoDB() *sql.DB {
	// get connection props from environment
	pgHost := utils.GetEnv("PG_HOST", "localhost")
	pgPort, _ := strconv.Atoi(utils.GetEnv("PG_PORT", "5432"))
	pgUser := utils.GetEnv("PG_USER", "postgres")
	pgPass := utils.GetEnv("PG_PASS", "changeme")
	pgDb := utils.GetEnv("PG_DB", "todo_db")
	// connect to postgres database
	cnnStr := pgdb.ConnectionStr(pgdb.Settings{
		Host:     pgHost,
		Port:     pgPort,
		User:     pgUser,
		Password: pgPass,
		Dbname:   pgDb,
	})
	// println(cnnStr)
	db := pgdb.Connect(cnnStr)
	//close connection at the end
	return db
}

// start http server
func todoHTTP() *http.Server {
	// get host url and port
	apiHost := utils.GetEnv("API_HOST", ":8080")
	// create new router
	mux := routes.Register()
	// create https server
	srv := &http.Server{
		Addr:         apiHost,
		Handler:      mux,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 20 * time.Second,
	}
	log.Printf("%v...starting on...%v", AppName, apiHost)
	return srv
}

// shutdown http server
func shutdownServer(db *sql.DB, api *http.Server) {
	if db != nil {
		log.Println("sqlDB...closing...")
		edb := db.Close()
		if edb != nil {
			log.Printf("sqlDB.Close() failed: %v", edb)
		}
	}
	if api != nil {
		log.Println("http...closing...")
		err := api.Shutdown(context.Background())
		if err != nil {
			log.Printf("http closing failed: %v", err)
		}
	}
	log.Printf("%v...stopped", AppName)
}

// Listen for system close events
func onCloseAPI(close chan bool) {
	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)
	// wait for sigs
	log.Printf("os.Signal...%v", <-sigs)
	// os signal send notify others now
	close <- true
}

func main() {
	// load AppName
	AppName = utils.GetEnv("API_NAME", "go-todo-api")
	// create close channel
	close := make(chan bool, 1)
	//connect to database
	db := todoDB()
	//start api on http
	api := todoHTTP()
	//run api in separate routine
	go func(api *http.Server) {
		err := api.ListenAndServe()
		if err != nil {
			log.Fatalf("%v server failed: %v", AppName, err)
		}
	}(api)
	//listen for close events
	go onCloseAPI(close)
	//wait for close event
	<-close
	//close DB and api
	shutdownServer(db, api)
}
