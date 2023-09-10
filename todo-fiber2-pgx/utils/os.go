package utils

import (
	"os"
)

// GetEnv get environment variable value if found, otherwise
// return default value. Note! it logs if env variable is not
// found and the default value used.
func GetEnv(key string, defaultVal string) string {
	//look for environment value
	val, ok := os.LookupEnv(key)
	// if found return
	if ok == true {
		return val
	}
	// env variable not found
	// log this and return default
	// log.Println("GetEnv...", key, "is MISSING. Using default...", defaultVal)
	return defaultVal
}
