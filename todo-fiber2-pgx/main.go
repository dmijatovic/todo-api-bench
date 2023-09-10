package main

import (
	"dv4all/fiber-pgx/api"
	"dv4all/fiber-pgx/db"
	"dv4all/fiber-pgx/utils"
	"os"
	"os/signal"
)

func main() {
	// log start of main fiber process
	utils.LogOnMainProcess("Starting...to stop use Ctrl+C")

	// connect DB
	go db.Connect()
	// start api
	go api.Start()

	// listen to interrupt signal
	interupt := make(chan os.Signal, 1)
	// When an interrupt is sent, notify the channel
	signal.Notify(interupt, os.Interrupt)
	// executions stop here untill interrupt is send
	// and will resume after signal is received
	// NOTE! if you use syntax bellow it won't continue?!?
	// _ := <-interupt
	<-interupt

	// Log closing of main app processes
	utils.LogOnMainProcess("FiberAPI...main...STOPED")
}
