package routes

import (
	"dv4all/todoapi/pgdb"
	"dv4all/todoapi/response"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"
)

func handleTodos(res http.ResponseWriter, req *http.Request) {
	var data response.Response
	var listID int32
	upperMethod := strings.ToUpper(req.Method)
	// extract listID from params
	params := strings.Split(req.URL.Path, "/")
	// log.Println("Path: ", req.URL.Path)
	// log.Println("params len: ", len(params))
	// url = /todos/{listID}/items
	if len(params) == 4 {
		log.Println("Url listID: ", params[2])
		i64, err := strconv.ParseInt(params[2], 10, 32)
		if err != nil {
			data = response.SetErrorResponse(err, response.ServerStatus{
				Status:     400,
				StatusText: "Bad request",
			})
			data.ReturnResponse(res)
			return
		}
		listID = int32(i64)
	}
	switch upperMethod {
	case "GET":
		if listID > 0 {
			getAllTodoItems(req, res, listID)
		} else {
			getAllTodoLists(req, res)
		}
	case "POST":
		if listID > 0 {
			addTodoItem(req, res, listID)
		} else {
			addTodoList(req, res)
		}
	default:
		log.Printf("METHOD NOT SUPPORTED...%v", upperMethod)
		data.Status = http.StatusBadRequest
		data.StatusText = "Method not supported"
		data.Payload = "Method not supported"
		//return bad request
		data.ReturnResponse(res)
	}
}

func getAllTodoLists(req *http.Request, res http.ResponseWriter) {
	var data response.Response
	tls, err := pgdb.GetAllTodoLists()

	if err != nil {
		data = response.SetErrorResponse(err, response.ServerStatus{})
	} else {
		data = response.SetOKResponse(tls)
	}
	//write reponse
	data.ReturnResponse(res)
}

func getTodoListFromReqBody(req *http.Request, res http.ResponseWriter) (pgdb.BaseList, error) {
	var data response.Response
	var tl pgdb.BaseList
	err := json.NewDecoder(req.Body).Decode(&tl)
	if err != nil {
		log.Println("getTodoListFromReqBody: ", err)
		data = response.SetErrorResponse(err, response.ServerStatus{
			Status:     http.StatusBadRequest,
			StatusText: "Failed to extract data from request.Body",
		})
		data.ReturnResponse(res)
		//exit
		return tl, err
	}
	return tl, nil
}

func addTodoList(req *http.Request, res http.ResponseWriter) {
	var data response.Response
	input, err := getTodoListFromReqBody(req, res)
	if err != nil {
		//exit on error
		return
	}
	todolist, err := pgdb.AddTodoList(input)
	// check if insert failed
	if err != nil {
		data = response.SetErrorResponse(err, response.ServerStatus{
			Status:     http.StatusBadRequest,
			StatusText: "Failed to insert data into db",
		})
	} else {
		data = response.SetOKResponse(todolist)
	}
	//write reponse
	data.ReturnResponse(res)
}

func getAllTodoItems(req *http.Request, res http.ResponseWriter, lid int32) {
	items, err := pgdb.GetTodoItems(lid)
	if err != nil {
		data := response.SetErrorResponse(err, response.ServerStatus{
			Status:     http.StatusBadRequest,
			StatusText: "Failed to extract data from request.Body",
		})
		data.ReturnResponse(res)
	}
	data := response.SetOKResponse(items)
	data.ReturnResponse(res)
}

func getTodoItemFromBody(req *http.Request, res http.ResponseWriter) (pgdb.BaseTodoItem, error) {

	var td pgdb.BaseTodoItem
	err := json.NewDecoder(req.Body).Decode(&td)
	if err != nil {
		data := response.SetErrorResponse(err, response.ServerStatus{
			Status:     400,
			StatusText: "Failed to extract todo item from body",
		})
		data.ReturnResponse(res)
		return td, err
	}
	// data := response.SetOKResponse(td)
	// data.ReturnResponse(res)
	return td, nil
}

func addTodoItem(req *http.Request, res http.ResponseWriter, lid int32) {
	data, err := getTodoItemFromBody(req, res)
	if err != nil {
		return
	}
	todo, err := pgdb.AddTodoItem(lid, data)
	if err != nil {
		data := response.SetErrorResponse(err, response.ServerStatus{})
		data.ReturnResponse(res)
		return
	}
	resp := response.SetOKResponse(todo)
	resp.ReturnResponse(res)
}
