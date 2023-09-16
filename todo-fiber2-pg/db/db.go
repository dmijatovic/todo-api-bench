package db

import (
	"database/sql"
	"dv4all/fiber-pg/utils"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	// import postgres driver
	_ "github.com/lib/pq"
)

// Settings for postgres connection string
type Settings struct {
	Host     string
	Port     int
	User     string
	Password string
	Dbname   string
}

var sqlDB *sql.DB

func getConnectionStr() string {
	// extract port from env
	pgPort, _ := strconv.Atoi(utils.GetEnv("PG_PORT", "5432"))

	// constuct configuration
	cfg := Settings{
		Host:     utils.GetEnv("PG_HOST", "localhost"),
		Port:     pgPort,
		User:     utils.GetEnv("PG_USER", "postgres"),
		Password: utils.GetEnv("PG_PASS", "changeme"),
		Dbname:   utils.GetEnv("PG_DB", "todo_db"),
	}

	// build pg connection string
	// "postgres://username:password@localhost:5432/database_name"
	cnnStr := fmt.Sprintf("postgres://%v:%v@%v:%v/%v?sslmode=disable",
		cfg.User, cfg.Password, cfg.Host, cfg.Port, cfg.Dbname)

	// return connection string
	return cnnStr
}

func Connect() *sql.DB {
	cnnStr := getConnectionStr()
	// urlExample := "postgres://username:password@localhost:5432/database_name"
	pgdb, err := sql.Open("postgres", cnnStr)
	// conn, err := pgx.Connect(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	// test connection after 10 sec.
	time.Sleep(time.Second * 10)
	err = pgdb.Ping()
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	utils.LogOnMainProcess("Connect to database...OK")
	// save to local variable
	sqlDB = pgdb
	// pass refference back
	return pgdb
}

func Close(pgdb *sql.DB) {
	// log.Println("Closing DB server...")
	// close connection
	pgdb.Close()
}
