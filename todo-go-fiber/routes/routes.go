package routes

import (
	"dv4all/todo-go-fiber/logger"
	"dv4all/todo-go-fiber/pgdb"
	"dv4all/todo-go-fiber/response"
	"dv4all/todo-go-fiber/utils"
	"log"
	"strconv"

	"github.com/gofiber/fiber"
)

// Register all api routes
func Register() error {
	// get host url and port
	apiHost := utils.GetEnv("API_HOST", ":8080")
	api := fiber.New()

	// basic log middleware comparable with
	api.Use(logger.LogMiddleware)
	//todo list
	api.Get("/todos", getTodoLists)
	api.Post("/todos", addTodoList)
	api.Put("/todos", updateTodoList)
	api.Delete("/todos/:listid", deleteTodoList)

	// todo items from specific list
	api.Get("/todos/:listid/items", getTodoItems)
	api.Post("/todos/:listid/items", addTodoItem)
	api.Put("/todos/item", updateTodoItem)
	api.Delete("/todos/item/:id", deleteTodoItem)

	//static
	api.Static("/", "./static")

	err := api.Listen(apiHost)
	if err != nil {
		return err
	}
	return nil
}

func returnError(ctx *fiber.Ctx, err error) {
	resp := response.SetErrorResponse(err,
		response.ServerStatus{})
	ctx.Set("content-type", "application/json")
	ctx.Status(500).JSON(resp)
	log.Println(ctx.Path(), "ERROR", err)
	return
}

func returnOK(ctx *fiber.Ctx, payload interface{}) {
	resp := response.SetOKResponse(payload)
	// no return needed?
	ctx.Status(200).JSON(resp)
	return
}

func getTodoLists(ctx *fiber.Ctx) {
	//get data
	tls, err := pgdb.GetAllTodoLists()
	// set json header
	ctx.Set("content-type", "application/json")
	if err != nil {
		returnError(ctx, err)
		return
	}
	returnOK(ctx, tls)
}

func addTodoList(ctx *fiber.Ctx) {
	var tl pgdb.BaseList
	//extract data from body
	err := ctx.BodyParser(&tl)
	if err != nil {
		returnError(ctx, err)
		return
	}
	// add list to db
	res, err := pgdb.AddTodoList(tl)
	if err != nil {
		returnError(ctx, err)
		return
	}
	returnOK(ctx, res)
}

func updateTodoList(ctx *fiber.Ctx) {
	var tl pgdb.TodoList
	//extract data from body
	err := ctx.BodyParser(&tl)
	if err != nil {
		returnError(ctx, err)
		return
	}
	// add list to db
	res, err := pgdb.UpdateTodoList(tl)
	if err != nil {
		returnError(ctx, err)
		return
	}
	returnOK(ctx, res)
}

func deleteTodoList(ctx *fiber.Ctx) {
	//extract listid from path
	i64, err := strconv.ParseInt(ctx.Params("listid"), 10, 64)
	if err != nil {
		returnError(ctx, err)
		return
	}
	lid := int32(i64)
	// delete list
	res, err := pgdb.DeleteTodoList(lid)
	if err != nil {
		returnError(ctx, err)
		return
	}
	returnOK(ctx, res)
}

func getTodoItems(ctx *fiber.Ctx) {
	i64, err := strconv.ParseInt(ctx.Params("listid"), 10, 64)
	if err != nil {
		returnError(ctx, err)
		return
	}
	lid := int32(i64)
	todos, err := pgdb.GetTodoItems(lid)
	if err != nil {
		returnError(ctx, err)
		return
	}
	returnOK(ctx, todos)
}

func addTodoItem(ctx *fiber.Ctx) {
	var li pgdb.BaseTodoItem
	//extract listid from path
	i64, err := strconv.ParseInt(ctx.Params("listid"), 10, 64)
	if err != nil {
		returnError(ctx, err)
		return
	}
	lid := int32(i64)
	//extract data from body
	err = ctx.BodyParser(&li)
	if err != nil {
		returnError(ctx, err)
		return
	}
	// add todo item to db
	res, err := pgdb.AddTodoItem(lid, li)
	if err != nil {
		returnError(ctx, err)
		return
	}
	returnOK(ctx, res)
}

func updateTodoItem(ctx *fiber.Ctx) {
	var li pgdb.TodoItem
	//extract data from body
	err := ctx.BodyParser(&li)
	if err != nil {
		returnError(ctx, err)
		return
	}
	// add todo item to db
	res, err := pgdb.UpdateTodoItem(li)
	if err != nil {
		returnError(ctx, err)
		return
	}
	returnOK(ctx, res)
}

func deleteTodoItem(ctx *fiber.Ctx) {
	//extract listid from path
	i64, err := strconv.ParseInt(ctx.Params("id"), 10, 64)
	if err != nil {
		returnError(ctx, err)
		return
	}
	id := int32(i64)
	// add todo item to db
	res, err := pgdb.DeleteTodoItem(id)
	if err != nil {
		returnError(ctx, err)
		return
	}
	returnOK(ctx, res)
}
