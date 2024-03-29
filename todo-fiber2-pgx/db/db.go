package db

import (
	"context"
	"dv4all/fiber-pgx/utils"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// Settings for postgres connection string
type Settings struct {
	Host     string
	Port     int
	User     string
	Password string
	Dbname   string
	MaxConns int
}

var sqlDB *pgxpool.Pool

func getConnectionStr() string {
	// extract port from env
	pgPort, _ := strconv.Atoi(utils.GetEnv("PG_PORT", "5432"))
	maxCnn, _ := strconv.Atoi(utils.GetEnv("PG_POOL.MAX_SIZE", "20"))

	// constuct configuration
	cfg := Settings{
		Host:     utils.GetEnv("PG_HOST", "localhost"),
		Port:     pgPort,
		User:     utils.GetEnv("PG_USER", "postgres"),
		Password: utils.GetEnv("PG_PASS", "changeme"),
		Dbname:   utils.GetEnv("PG_DB", "todo_db"),
		MaxConns: maxCnn,
	}

	// build pg connection string
	// "postgres://username:password@localhost:5432/database_name"
	// "postgres://jack:secret@pg.example.com:5432/mydb?sslmode=verify-ca&pool_max_conns=10"
	cnnStr := fmt.Sprintf("postgres://%v:%v@%v:%v/%v?pool_max_conns=%v",
		cfg.User, cfg.Password, cfg.Host, cfg.Port, cfg.Dbname, cfg.MaxConns)

	// return connection string
	return cnnStr
}

func Connect() *pgxpool.Pool {
	cnnStr := getConnectionStr()
	pgxdb, err := pgxpool.New(context.Background(), cnnStr)
	// conn, err := pgx.Connect(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	// test connection after 10 sec.
	time.Sleep(time.Second * 10)
	err = pgxdb.Ping(context.Background())
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	utils.LogOnMainProcess("Connect to database...OK")
	// save to local variable
	sqlDB = pgxdb
	// pass refference back
	return pgxdb
}

func Close(pgxdb *pgxpool.Pool) {
	// log.Println("Closing DB server...")
	// close connection
	pgxdb.Close()
}
