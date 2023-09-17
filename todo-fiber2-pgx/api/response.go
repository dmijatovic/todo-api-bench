package api

import (
	"dv4all/fiber-pgx/db"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

// ServerStatus is send as part of api response
// this is quite similair how axios responds
type ServerStatus struct {
	Status     int    `json:"status"`
	StatusText string `json:"statusText"`
}

// Response type for json api response
// NOTE! json tags with "" and without spaces
type Response struct {
	ServerStatus
	// empty interface makes it possible
	// to send any data format
	Payload interface{} `json:"payload"`
}

type Home struct {
	Status string `json:"status"`
}

// SetErrorResponse creates standardized api response
func SetErrorResponse(err error, state ServerStatus) Response {
	if state.Status == 0 {
		state.Status = 500
	}
	if state.StatusText == "" {
		state.StatusText = "Internal Server Error"
	}
	var r Response

	r.Status = state.Status
	r.StatusText = state.StatusText
	r.Payload = err.Error()

	return r
}

// SetOKResponse creates standard response with status and payload
func SetOKResponse(data interface{}) Response {
	var r Response

	r.Status = 200
	r.StatusText = "OK"
	r.Payload = data

	return r
}

func getHome(ctx *fiber.Ctx) error {
	ok := Home{
		Status: "OK",
	}
	return ctx.JSON(ok)
}

func getTodoLists(ctx *fiber.Ctx) error {
	//get data from database
	tls, err := db.GetAllTodoLists()
	// check for error
	if err != nil {
		// construct error message
		errResp := SetErrorResponse(err, ServerStatus{Status: 0, StatusText: ""})
		return ctx.Status(500).JSON(errResp)
	}
	// construct response
	// response := SetOKResponse(tls)
	return ctx.JSON(tls)
}

func addTodoList(ctx *fiber.Ctx) error {
	var tl db.BaseList
	//extract data from body
	err := ctx.BodyParser(&tl)
	if err != nil {
		// construct error message
		errResp := SetErrorResponse(err, ServerStatus{Status: 0, StatusText: ""})
		return ctx.Status(400).JSON(errResp)
	}
	// add list to db
	res, err := db.AddTodoList(tl)
	if err != nil {
		errResp := SetErrorResponse(err, ServerStatus{Status: 0, StatusText: ""})
		return ctx.Status(400).JSON(errResp)
	}
	// construct response
	// response := SetOKResponse(res)
	return ctx.JSON(res)
}

func getTodoList(ctx *fiber.Ctx) error {
	//extract listid from path
	i64, err := strconv.ParseInt(ctx.Params("listid"), 10, 64)
	if err != nil {
		// construct error message
		status := ServerStatus{Status: 400, StatusText: "Bad request"}
		errResp := SetErrorResponse(err, status)
		return ctx.Status(400).JSON(errResp)
	}
	lid := int32(i64)

	res, err := db.GetTodoList(lid)
	if err != nil {
		errResp := SetErrorResponse(err, ServerStatus{Status: 0, StatusText: ""})
		return ctx.Status(400).JSON(errResp)
	}
	// construct response
	// response := SetOKResponse(res)
	return ctx.JSON(res)
}

func updateTodoList(ctx *fiber.Ctx) error {
	var tl db.TodoList

	//extract listid from path
	i64, err := strconv.ParseInt(ctx.Params("listid"), 10, 64)
	if err != nil {
		// construct error message
		status := ServerStatus{Status: 400, StatusText: "Bad request"}
		errResp := SetErrorResponse(err, status)
		return ctx.Status(400).JSON(errResp)
	}
	lid := int32(i64)

	//extract data from body
	err = ctx.BodyParser(&tl)
	if err != nil {
		// construct error message
		errResp := SetErrorResponse(err, ServerStatus{Status: 0, StatusText: ""})
		return ctx.Status(400).JSON(errResp)
	}
	// update list to db
	res, err := db.UpdateTodoList(lid, tl)
	if err != nil {
		errResp := SetErrorResponse(err, ServerStatus{Status: 400, StatusText: "Incorrect request"})
		return ctx.Status(400).JSON(errResp)
	}

	// construct response
	// response := SetOKResponse(res)
	return ctx.JSON(res)
}

func deleteTodoList(ctx *fiber.Ctx) error {
	//extract listid from path
	i64, err := strconv.ParseInt(ctx.Params("listid"), 10, 64)
	if err != nil {
		// construct error message
		status := ServerStatus{Status: 400, StatusText: "Bad request"}
		errResp := SetErrorResponse(err, status)
		return ctx.Status(400).JSON(errResp)
	}
	lid := int32(i64)
	// delete list
	res, err := db.DeleteTodoList(lid)
	if err != nil {
		// construct error message
		status := ServerStatus{Status: 400, StatusText: "Bad request"}
		errResp := SetErrorResponse(err, status)
		return ctx.Status(400).JSON(errResp)
	}

	// construct response
	// response := SetOKResponse(res)
	return ctx.JSON(res)
}

func getTodoItems(ctx *fiber.Ctx) error {
	i64, err := strconv.ParseInt(ctx.Params("listid"), 10, 64)
	if err != nil {
		// construct error message
		status := ServerStatus{Status: 400, StatusText: "Bad request"}
		errResp := SetErrorResponse(err, status)
		return ctx.Status(400).JSON(errResp)
	}
	lid := int32(i64)
	todos, err := db.GetTodoItems(lid)
	if err != nil {
		// construct error message
		status := ServerStatus{Status: 400, StatusText: "Bad request"}
		errResp := SetErrorResponse(err, status)
		return ctx.Status(400).JSON(errResp)
	}
	// construct response
	// response := SetOKResponse(todos)
	return ctx.JSON(todos)
}

func addTodoItem(ctx *fiber.Ctx) error {
	var li db.BaseTodoItem
	err := ctx.BodyParser(&li)
	if err != nil {
		// construct error message
		status := ServerStatus{Status: 400, StatusText: "Bad request"}
		errResp := SetErrorResponse(err, status)
		return ctx.Status(400).JSON(errResp)
	}
	// add todo item to db
	res, err := db.AddTodoItem(li)
	if err != nil {
		// construct error message
		status := ServerStatus{Status: 400, StatusText: "Bad request"}
		errResp := SetErrorResponse(err, status)
		return ctx.Status(400).JSON(errResp)
	}
	// construct response
	// response := SetOKResponse(res)
	return ctx.JSON(res)
}

func getTodoItem(ctx *fiber.Ctx) error {
	//extract id from path
	id64, err := strconv.ParseInt(ctx.Params("id"), 10, 32)
	if err != nil {
		// construct error message
		status := ServerStatus{Status: 400, StatusText: "Bad request"}
		errResp := SetErrorResponse(err, status)
		return ctx.Status(400).JSON(errResp)
	}
	id32 := int32(id64)

	res, err := db.GetTodoItem(id32)
	if err != nil {
		// construct error message
		status := ServerStatus{Status: 400, StatusText: "Bad request"}
		errResp := SetErrorResponse(err, status)
		return ctx.Status(400).JSON(errResp)
	}

	return ctx.JSON(res)
}

func updateTodoItem(ctx *fiber.Ctx) error {
	var li db.TodoItem
	//extract id from path
	id, err := strconv.ParseInt(ctx.Params("id"), 10, 32)
	li.ID = int32(id)
	//extract data from body
	err = ctx.BodyParser(&li)

	if err != nil {
		// construct error message
		status := ServerStatus{Status: 400, StatusText: "Bad request"}
		errResp := SetErrorResponse(err, status)
		return ctx.Status(400).JSON(errResp)
	}
	// add todo item to db
	res, err := db.UpdateTodoItem(li)
	if err != nil {
		// construct error message
		status := ServerStatus{Status: 400, StatusText: "Bad request"}
		errResp := SetErrorResponse(err, status)
		return ctx.Status(400).JSON(errResp)
	}
	// construct response
	// response := SetOKResponse(res)
	return ctx.JSON(res)
}

func deleteTodoItem(ctx *fiber.Ctx) error {
	//extract listid from path
	i64, err := strconv.ParseInt(ctx.Params("id"), 10, 64)
	if err != nil {
		// construct error message
		status := ServerStatus{Status: 400, StatusText: "Bad request"}
		errResp := SetErrorResponse(err, status)
		return ctx.Status(400).JSON(errResp)
	}
	id := int32(i64)
	// add todo item to db
	res, err := db.DeleteTodoItem(id)
	if err != nil {
		// construct error message
		status := ServerStatus{Status: 400, StatusText: "Bad request"}
		errResp := SetErrorResponse(err, status)
		return ctx.Status(400).JSON(errResp)
	}

	// construct response
	// response := SetOKResponse(res)
	return ctx.JSON(res)
}
