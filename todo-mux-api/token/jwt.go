package token

import (
	"strconv"
	"time"

	"dv4all/todoapi/utils"

	"github.com/dgrijalva/jwt-go"
)

// privateKey for signing tokens
var privateKey []byte

// token expiration time in seconds
var expTimeSec int

// UserClaims to be included in the JWT.
type UserClaims struct {
	ID        string `json:"id"`
	Roles     string `json:"roles"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
}

// CustomClaims combines UserClaims and StandardJWT claims.
type CustomClaims struct {
	Profile UserClaims `json:"profile"`
	jwt.StandardClaims
}

func getExpiresAt() int64 {
	// var expTime time.Duration
	if expTimeSec == 0 {
		expTimeSec, _ = strconv.Atoi(utils.GetEnv("JWT_EXP_TIME_SEC", "120"))
	}
	expTime := time.Duration(expTimeSec) * time.Second
	return time.Now().Add(expTime).Unix()
}

// SetData for CustomClaims and Standard JWT claims
func (cc *CustomClaims) SetData(d UserClaims) {
	//custom user profile claims
	cc.Profile = d
	// default jwt claims
	cc.Audience = d.Roles
	cc.Id = d.ID
	cc.IssuedAt = time.Now().Unix()
	//calculate expiration time
	cc.ExpiresAt = getExpiresAt()
	cc.Issuer = "dv4all-oauth2-go-service"
	cc.Subject = d.FirstName + " " + d.LastName
}

// Sign will create new token for valid user
// This method is used AFTER user is authenticated
// The data will be included in the token.
// DO NOT SEND secrity related information (like password) in the data
func Sign(claims CustomClaims) (string, error) {
	// log.Println("clams...", claims)
	newToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	key := getPrivateKey()
	token, err := newToken.SignedString(key)
	if err != nil {
		return "", err
	}
	return token, nil
}

func getPrivateKey() []byte {
	if len(privateKey) == 0 {
		key := utils.GetEnv("JWT_KEY", "01545c0cdd271a8177bea35d4d4b0517")
		privateKey = []byte(key)
		return privateKey
	}
	return privateKey
}

func myKey(token *jwt.Token) (interface{}, error) {
	return getPrivateKey(), nil
}

// Verify will check if token is valid and return true/false and error message
func Verify(tokenStr string) (bool, string) {
	token, err := jwt.Parse(tokenStr, myKey)
	if err != nil {
		return false, "Invalid token"
	}
	if token.Valid {
		return true, "Valid token"
	}
	// check for know errors
	ve, ok := err.(*jwt.ValidationError)
	if ok == true {
		if ve.Errors&(jwt.ValidationErrorExpired|jwt.ValidationErrorNotValidYet) != 0 {
			return false, "Token expired"
		}
		return false, "Invalid token"
	}
	return false, "Invalid token"
}
