package password

import (
	"golang.org/x/crypto/bcrypt"
)

var cost int = 7

// Hash will hash string passwords. DeUsing default costs of 7.
func Hash(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), cost)
	return string(bytes), err
}

// Validate password and hash are the same
func Validate(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
