package routes

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"dv4all/todoapi/pgdb"
	"dv4all/todoapi/response"
)

func users() http.HandlerFunc {
	return handleUsers
}

func handleUsers(res http.ResponseWriter, req *http.Request) {
	// route based on request method (UPPER)
	upperMethod := strings.ToUpper(req.Method)
	switch upperMethod {
	case "GET":
		getAllUsers(res)
	case "POST":
		addNewUser(req, res)
	case "PUT":
		updateUser(req, res)
	// case "PATCH":
	// 	updateUser(req, res)
	case "DELETE":
		deleteUser(req, res)
	default:
		log.Printf("METHOD NOT SUPPORTED...%v", upperMethod)
		var data response.Response
		data.Status = http.StatusBadRequest
		data.StatusText = "Method not supported"
		data.Payload = "Method not supported"
		//return bad request
		data.ReturnResponse(res)
	}
}

func getAllUsers(res http.ResponseWriter) {
	var data response.Response
	users, err := pgdb.GetAllUsers()
	if err != nil {
		data = response.SetErrorResponse(err, response.ServerStatus{})
	} else {
		data = response.SetOKResponse(users)
	}
	//write reponse
	data.ReturnResponse(res)
}

func getUserFromReqBody(req *http.Request, res http.ResponseWriter) (pgdb.InUser, error) {
	var data response.Response
	var user pgdb.InUser
	//extract data from request body
	err := json.NewDecoder(req.Body).Decode(&user)
	if err != nil {
		log.Println("getUserFromReqBody: ", err)
		data = response.SetErrorResponse(err, response.ServerStatus{
			Status:     http.StatusBadRequest,
			StatusText: "Failed to extract data from request.Body",
		})
		data.ReturnResponse(res)
		//exit
		return user, err
	}
	return user, nil
}

func addNewUser(req *http.Request, res http.ResponseWriter) {
	var data response.Response
	// extract user from body
	input, err := getUserFromReqBody(req, res)
	if err != nil {
		//exit on error
		return
	}
	// call insert statement
	user, err := pgdb.AddNewUser(input)
	// check if insert failed
	if err != nil {
		data = response.SetErrorResponse(err, response.ServerStatus{
			Status:     http.StatusBadRequest,
			StatusText: "Failed to extract data from request.Body",
		})
	} else {
		data = response.SetOKResponse(user)
	}
	//write reponse
	data.ReturnResponse(res)
}

func updateUser(req *http.Request, res http.ResponseWriter) {
	var data response.Response

	// extract user from body
	u, err := getUserFromReqBody(req, res)
	if err != nil {
		//exit on error
		return
	}

	user, err := pgdb.UpdateUser(u)
	if err != nil {
		data = response.SetErrorResponse(err, response.ServerStatus{
			Status:     http.StatusBadRequest,
			StatusText: "Failed to update user",
		})
	} else {
		data = response.SetOKResponse(user)
	}

	//write reponse
	data.ReturnResponse(res)
}

func deleteUser(req *http.Request, res http.ResponseWriter) {
	var data response.Response

	// extract user from body
	u, err := getUserFromReqBody(req, res)
	if err != nil {
		//exit on error
		return
	}
	user, err := pgdb.DeleteUserByID(u.ID)
	if err != nil {
		data = response.SetErrorResponse(err, response.ServerStatus{
			Status:     http.StatusBadRequest,
			StatusText: "Failed to delete user",
		})
	} else {
		data = response.SetOKResponse(user)
	}

	//write reponse
	data.ReturnResponse(res)
}
