package routes

import (
	"errors"
	"log"
	"net/http"
	"strings"

	"dv4all/todoapi/response"
	"dv4all/todoapi/token"
)

func handleVerify(res http.ResponseWriter, req *http.Request) {
	// route based on request method (UPPER)
	upperMethod := strings.ToUpper(req.Method)
	switch upperMethod {
	case "GET":
		verifyUser(req, res)
	case "POST":
		verifyUser(req, res)
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

func verifyToken(tokenStr string) response.Response {
	valid, err := token.Verify(tokenStr)
	if valid == true {
		var r = struct {
			AccessToken string `json:"access_token"`
			TokenStatus string `json:"token_status"`
		}{
			AccessToken: tokenStr,
			TokenStatus: err,
		}
		return response.SetOKResponse(r)
	}
	return response.SetErrorResponse(errors.New(err), response.ServerStatus{
		Status:     http.StatusForbidden,
		StatusText: err,
	})
}

func verifyUser(req *http.Request, res http.ResponseWriter) {
	// var data Response
	tokenStr, err := token.GetTokenFromAuthHeader(req)
	if err != nil {
		data := response.SetErrorResponse(err, response.ServerStatus{
			Status:     http.StatusForbidden,
			StatusText: "Forbidden",
		})
		data.ReturnResponse(res)
	} else {
		data := verifyToken(tokenStr)
		data.ReturnResponse(res)
	}
}
