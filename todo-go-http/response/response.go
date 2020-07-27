package response

import (
	"encoding/json"
	"net/http"
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

// SetErrorResponse creates standardized api response
func SetErrorResponse(err error, state ServerStatus) Response {
	if state.Status == 0 {
		state.Status = http.StatusInternalServerError
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

	r.Status = http.StatusOK
	r.StatusText = "OK"
	r.Payload = data

	return r
}

// ReturnResponse will return response to api consumer
// including the status code
// NOTE! When setting header values, this need to be
// done before setting status using WriteHeader!!!
func (r *Response) ReturnResponse(rw http.ResponseWriter) {
	// set content-type
	rw.Header().Add("content-type", "application/json")
	rw.Header().Add("x-server", "dv4all-basic-go-http-server")
	// SET ALL HEADER PROPS BEFORE setting state
	// NOTE! GO requirement
	rw.WriteHeader(r.Status)
	// log.Println(rw)
	json.NewEncoder(rw).Encode(r)
}
