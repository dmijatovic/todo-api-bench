package token

import (
	"os"
	"testing"
)

/*
Testing jwt methods
to run test navigate to module folder token and run
go test -v
*/

func dummyClaims() CustomClaims {
	var claims CustomClaims
	userClaims := UserClaims{
		ID:        "user.ID",
		Roles:     "admin, user",
		FirstName: "first_name",
		LastName:  "last_name",
		Email:     "user.email@gmail.com",
	}
	claims.SetData(userClaims)
	return claims
}

func TestSignDefaults(t *testing.T) {
	// t.Skip()
	// create dummy claims
	claims := dummyClaims()
	// create token
	jwt, err := Sign(claims)

	if err != nil {
		t.Error(err)
	}

	if len(privateKey) == 0 {
		t.Error("privateKey lenght == 0. It should at least load default")
	}

	// println("privateKey", privateKey)
	// verify token
	valid, msg := Verify(jwt)
	// if token is not valid something is wrong
	if valid == false {
		t.Error(msg)
	}
}

func TestSignWithEnv(t *testing.T) {
	//reset privateKey
	privateKey = []byte("")
	//create test key
	testKey := []byte("fake_food_jwt_secret_key")
	//set environment variables
	os.Setenv("JWT_KEY", string(testKey))
	os.Setenv("JWT_EXP_TIME_SEC", "120")

	// test if expires at uses env variable FOOD_JWT_EXP_TIME_SEC
	// create dummy claims
	claims := dummyClaims()
	diff := claims.ExpiresAt - claims.IssuedAt
	if diff != 120 {
		t.Errorf("Incorrect JWT_EXP_TIME_SEC used...found %v ...expects...%v", diff, 120)
		t.Error("Check getExpiresAt method")
	}

	// create token
	jwt, err := Sign(claims)

	if err != nil {
		t.Error(err)
	}

	//test if privateKey is testKey
	pk := string(privateKey)
	tk := string(testKey)
	if pk != tk {
		t.Error("Private key not used from env FOOD_JWT_KEY")
		t.Errorf("Expected privateKey...%v...but got...%v", string(privateKey), string(testKey))
	}

	// if len(privateKey) == 0 {
	// 	t.Error("privateKey lenght == 0. It should at least load default")
	// }

	// verify token
	valid, msg := Verify(jwt)
	// if token is not valid something is wrong
	if valid == false {
		t.Error(msg)
	}
}
