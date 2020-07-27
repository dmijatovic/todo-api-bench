package routes

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

// to test only this method
// go test -v -run TestRoutes

func TestRoutes(t *testing.T) {
	// register all routes
	mux := Register()
	//create test server
	srv := httptest.NewServer(mux)
	defer srv.Close()

	tt := []struct {
		route   string
		method  string
		status  int
		payload string
	}{
		{
			route:  srv.URL + "/login",
			method: "GET",
			status: http.StatusBadRequest,
		},
		// {
		// 	route:   srv.URL + "/login",
		// 	method:  "POST",
		// 	status:  http.StatusOK,
		// 	payload: "{\"email\":\"user\",\"password\":\"password\"}",
		// },
	}

	for _, tc := range tt {
		var res *http.Response
		var err error
		switch tc.method {
		case "GET":
			res, err = http.Get(tc.route)
		case "POST":
			res, err = http.Post(tc.route, "application/json", strings.NewReader(tc.payload))
		default:
			err = errors.New("Method not supported in test")
			res.StatusCode = 500
			// t.Errorf("GET /login status failed: %v", res.StatusCode)
		}
		if err != nil {
			t.Errorf("%v %v failed: %v", tc.route, tc.method, err)
		}
		if res.StatusCode != tc.status {
			t.Errorf("%v %v status expected %v; got %v", tc.route, tc.method, tc.status, res.StatusCode)
		}
	}
}
