package pgdb

import (
	"log"
	"time"

	"dv4all/todoapi/password"
)

//BaseUser contains basic user properties
type BaseUser struct {
	ID        string `pg:"id, type:uuid, default:public.uuid_generate_v4()" json:"id"`
	Roles     string `pg:"roles, type:VARCHAR(100), NOT NULL" json:"roles"`
	FirstName string `pg:"first_name, notnull" json:"first_name"`
	LastName  string `pg:"last_name, notnull" json:"last_name"`
	Email     string `pg:"email, pk, unique" json:"email"`
	BirthDate string `pg:"birth_date, null" json:"birth_date"`
}

//InUser is the user strucuture posted to api
type InUser struct {
	BaseUser
	Password string `pg:"password" json:"password"`
}

// OutUser structure is the output structure
// we ignore sending password
type OutUser struct {
	BaseUser
	CreateDate time.Time `pg:"createdate, notnull, default: CURRENT_DATE" json:"createdate"`
}

//TotUser is object with all users properies
type TotUser struct {
	BaseUser
	Password   string    `pg:"password" json:"password"`
	CreateDate time.Time `pg:"createdate, notnull, default: CURRENT_DATE" json:"createdate"`
}

// GetAllUsers will extract all users from users table
func GetAllUsers() ([]OutUser, error) {
	rows, err := sqlDB.Query("SELECT id, roles, first_name, last_name, email, birth_date, createdate FROM users;")
	// check for errors
	if err != nil {
		log.Println("GetAllUsers...", err)
		return nil, err
	}
	//close at the end
	defer rows.Close()
	//create users slice
	users := make([]OutUser, 0)
	// extract rows
	for rows.Next() {
		//create new user instance
		user := OutUser{}
		//load from db
		err := rows.Scan(&user.ID, &user.Roles,
			&user.FirstName, &user.LastName, &user.Email,
			&user.BirthDate, &user.CreateDate)
		//check for error
		if err != nil {
			log.Println("GetAllUsers...", err)
			return nil, err
		}
		users = append(users, user)
	}
	//check for rows error
	if err := rows.Err(); err != nil {
		log.Println("GetAllUsers...", err)
		return nil, err
	}
	return users, nil
}

// AddNewUser to postgres database. On success returns
// user unique id generate by postgres
func AddNewUser(user InUser) (OutUser, error) {
	var u OutUser

	hash, err := password.Hash(user.Password)
	if err != nil {
		return u, err
	}
	user.Password = hash

	err = sqlDB.QueryRow(`INSERT INTO users (roles,first_name, last_name,email,password,birth_date)
	VALUES ($1,$2,$3,$4,$5,$6)
	RETURNING id, roles, first_name, last_name, email, birth_date, createdate;`, user.Roles, user.FirstName, user.LastName, user.Email, user.Password, user.BirthDate).Scan(&u.ID, &u.Roles, &u.FirstName, &u.LastName, &u.Email, &u.BirthDate, &u.CreateDate)

	if err != nil {
		log.Println("AddNewUser...", err)
		return u, err
	}
	return u, nil
}

// DeleteUserByID will delete user from database by unique id and return delete user object.
func DeleteUserByID(uid string) (OutUser, error) {
	var user OutUser

	err := sqlDB.QueryRow(`DELETE FROM users WHERE id=$1
	RETURNING id, roles, first_name, last_name, email, birth_date, createdate;`, uid).Scan(&user.ID, &user.Roles, &user.FirstName, &user.LastName, &user.Email, &user.BirthDate, &user.CreateDate)

	if err != nil {
		log.Println("DeleteUserByID...", err)
		return user, err
	}

	return user, nil
}

// UpdateUser in postgres database. On success returns
// updated user structure
func UpdateUser(u InUser) (OutUser, error) {
	var user OutUser

	err := sqlDB.QueryRow(`
	UPDATE users
		SET roles=$2,
			first_name=$3,
			last_name=$4,
			birth_date=$5
	WHERE id = $1
	RETURNING id, roles, first_name, last_name, email, birth_date, createdate;`, u.ID, u.Roles, u.FirstName, u.LastName, u.BirthDate).Scan(&user.ID, &user.Roles, &user.FirstName, &user.LastName, &user.Email, &user.BirthDate, &user.CreateDate)

	if err != nil {
		log.Println("UpdateUser...", err)
		return user, err
	}
	return user, nil
}

// GetUserByEmail will return user from database based on email
func GetUserByEmail(email string) (TotUser, error) {
	var user TotUser
	err := sqlDB.QueryRow(`SELECT * FROM users WHERE email=$1 LIMIT 1;`, email).Scan(&user.ID, &user.Roles, &user.FirstName, &user.LastName, &user.Email, &user.Password, &user.BirthDate,
		&user.CreateDate)
	if err != nil {
		log.Println("GetUserByEmail...", err)
		return user, err
	}
	return user, nil
}
