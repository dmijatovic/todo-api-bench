package token

import (
	"dv4all/todoapi/response"
	"errors"
	"log"
	"net/http"
	"strings"
)

// GetTokenFromAuthHeader extracts Bearer token from Authorization header
func GetTokenFromAuthHeader(req *http.Request) (string, error) {
	ah := req.Header.Get("Authorization")
	token := strings.Split(ah, " ")
	if len(token) == 2 {
		if strings.ToLower(token[0]) != "bearer" {
			return "", errors.New("Authorization header Bearer token missing")
		}
		return token[1], nil
	}
	return "", errors.New("Authorization header Bearer missing")
}

// ProtectHFunc is jwt token validation middleware. You can use
// it to protect specific routes
func ProtectHFunc(next http.HandlerFunc) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// extract token from request header
		tokenStr, err := GetTokenFromAuthHeader(r)
		if err != nil {
			data := response.SetErrorResponse(err, response.ServerStatus{
				Status:     http.StatusForbidden,
				StatusText: "Forbidden",
			})
			// not allowed
			data.ReturnResponse(w)
			log.Println("ProtectHFunc...Forbidden")
		} else {
			//verify token
			valid, err := Verify(tokenStr)
			if valid == true {
				// proceed
				next(w, r)
			} else {
				data := response.SetErrorResponse(errors.New(err),
					response.ServerStatus{
						Status:     http.StatusForbidden,
						StatusText: err,
					})
				data.ReturnResponse(w)
				log.Println("ProtectHFunc...Forbidden")
			}
		}
	})
}
