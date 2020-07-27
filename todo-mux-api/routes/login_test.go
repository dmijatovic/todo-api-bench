package routes

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestGetHandleLogin(t *testing.T) {
	//create new request to login route
	req, err := http.NewRequest("GET", "http://fakeurlanyway/login", nil)
	if err != nil {
		t.Fatalf("could not open login: %v", err)
	}
	// test response writer
	rw := httptest.NewRecorder()
	handleLogin(rw, req)
	res := rw.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusBadRequest {
		t.Errorf("GET \\login expected status %v got %v", http.StatusBadRequest, res.StatusCode)
	}
}

// func TestPostHandleLogin(t *testing.T) {
// 	strJson := []byte("{'email':'demo.user@gmail.com','password': 'password'}")
// 	//create new request to login route
// 	req, err := http.NewRequest("POST", "http://localhost:8080/login", io.Reader(strJson))
// 	if err != nil {
// 		t.Fatalf("could not open login: %v", err)
// 	}
// 	// test response writer
// 	rw := httptest.NewRecorder()
// 	handleLogin(rw, req)
// 	res := rw.Result()
// 	defer res.Body.Close()

// 	if res.StatusCode != http.StatusBadRequest {
// 		t.Errorf("GET \\login expected status %v got %v", http.StatusBadRequest, res.StatusCode)
// 	}
// }
