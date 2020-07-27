package routes

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"dv4all/todoapi/password"
	"dv4all/todoapi/pgdb"
	"dv4all/todoapi/response"
	"dv4all/todoapi/token"
)

// LoginCredentials of user
type LoginCredentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type accessToken struct {
	AccessToken string `json:"access_token"`
}

func handleLogin(res http.ResponseWriter, req *http.Request) {
	// route based on request method (UPPER)
	upperMethod := strings.ToUpper(req.Method)
	switch upperMethod {
	case "POST":
		loginUser(req, res)
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

func getCredentialsFromBody(req *http.Request, res http.ResponseWriter) (LoginCredentials, error) {
	var data response.Response
	var cred LoginCredentials

	err := json.NewDecoder(req.Body).Decode(&cred)
	if err != nil {
		log.Println("getUserFromReqBody: ", err)
		data = response.SetErrorResponse(err, response.ServerStatus{
			Status:     http.StatusBadRequest,
			StatusText: "Failed to extract data from request.Body",
		})
		data.ReturnResponse(res)
		//exit
		return cred, err
	}

	return cred, nil
}

func validPassword(loginPass string, userPass string) bool {
	same := password.Validate(loginPass, userPass)
	return same
}

func signToken(user pgdb.TotUser) (string, error) {
	var claims token.CustomClaims
	userClaims := token.UserClaims{
		ID:        user.ID,
		Roles:     user.Roles,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Email:     user.Email,
	}

	claims.SetData(userClaims)
	// log.Println("claims...", claims)

	jwt, err := token.Sign(claims)
	if err != nil {
		return "", err
	}
	return jwt, nil
	// token := fmt.Sprintf("user %v", u)
	// return token
}

func loginUser(req *http.Request, res http.ResponseWriter) {
	var data response.Response

	cred, err := getCredentialsFromBody(req, res)
	if err != nil {
		return
	}

	data = response.SetOKResponse(cred)

	user, err := pgdb.GetUserByEmail(cred.Email)
	if err != nil {
		data = response.SetErrorResponse(err, response.ServerStatus{
			Status:     http.StatusForbidden,
			StatusText: "User email or password incorrect",
		})
		data.ReturnResponse(res)
		return
	}

	if validPassword(cred.Password, user.Password) == true {
		token, err := signToken(user)
		if err != nil {
			data.Status = http.StatusInternalServerError
			data.StatusText = "Internal Server Error"
			data.Payload = "Failed to authenticate"
		} else {
			at := accessToken{
				AccessToken: token,
			}
			data = response.SetOKResponse(at)
		}
	} else {
		data.Status = http.StatusForbidden
		data.StatusText = "Forbidden"
		data.Payload = "User email or password incorrect"
	}
	// // send response
	data.ReturnResponse(res)
}
