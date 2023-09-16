package pgdb

import (
	"database/sql"
	"fmt"
	"log"
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

// ConnectionStr creates postgres connection string
func ConnectionStr(conf Settings) string {
	cnn := fmt.Sprintf("host=%v port=%v user=%v password=%v dbname=%v sslmode=disable",
		conf.Host, conf.Port, conf.User, conf.Password, conf.Dbname)
	return cnn
}

// Connect to Postgres database
// func Connect(cfg *Settings) *sql.DB {
func Connect(cnnStr string, maxCnn int) *sql.DB {
	// cnnStr := "host=localhost port=5432 user=postgres password=changeme dbname=auth_db sslmode=disable"
	db, err := sql.Open("postgres", cnnStr)
	if err != nil {
		log.Fatal(err)
	}
	// set connection pool?!?
	db.SetMaxOpenConns(maxCnn)
	// test connection after 10 sec.
	time.Sleep(time.Second * 10)
	// try to connect
	db.Ping()
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Connection validated...")
	//save here in the module
	sqlDB = db
	//return db refrence too
	return db
}
