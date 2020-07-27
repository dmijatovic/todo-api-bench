package main

import (
	"database/sql"
	"dv4all/todo-go-fiber/pgdb"
	"dv4all/todo-go-fiber/routes"
	"dv4all/todo-go-fiber/utils"
	"log"
	"os"
	"os/signal"
	"strconv"
	"syscall"
)

var appName string

// connection to postgres
func initDB() *sql.DB {
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

// shutdown http server
func shutdownServer(db *sql.DB) {
	if db != nil {
		log.Println("sqlDB...closing...")
		edb := db.Close()
		if edb != nil {
			log.Printf("sqlDB.Close() failed: %v", edb)
		}
	}
	// if api != nil {
	// 	log.Println("http...closing...")
	// 	err := api.Shutdown(context.Background())
	// 	if err != nil {
	// 		log.Printf("http closing failed: %v", err)
	// 	}
	// }
	log.Printf("%v...stopped", appName)
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
	appName = utils.GetEnv("API_NAME", "todo-go-fiber")
	// create close channel
	close := make(chan bool, 1)
	//connect to database
	db := initDB()
	//run api in separate routine
	go func() {
		err := routes.Register()
		if err != nil {
			log.Fatalf("%v server failed: %v", appName, err)
		}
	}()
	//listen for close events
	go onCloseAPI(close)
	//wait for close event
	<-close
	//close DB and api
	shutdownServer(db)
}
