package pgdb

import (
	"log"
)

// BaseList used for extracting POST
type BaseList struct {
	Title string `pg:"title,type:VARCHAR(150), NOT NULL" json:"title"`
}

// TodoList structure model
type TodoList struct {
	ID int32 `pg:"id,type:serial, pk" json:"id"`
	BaseList
}

// BaseTodoItem used to extract POST data
type BaseTodoItem struct {
	Title   string `pg:"title, type:VARCHAR(150), NOT NULL" json:"title"`
	Checked bool   `pg:"checked, type:boolean, NOT NULL, default:false" json:"checked"`
}

// TodoItem structure model
type TodoItem struct {
	ID     int32 `pg:"id,type:serial, pk" json:"id"`
	ListID int32 `pg:"list_id, type:integer, NOT NULL" json:"list_id"`
	BaseTodoItem
}

// GetAllTodoLists returns all todo lists from db
func GetAllTodoLists() ([]TodoList, error) {
	rows, err := sqlDB.Query("SELECT id, title from todo_list LIMIT 50;")
	if err != nil {
		log.Println("GetAllTodoLists...", err)
		return nil, err
	}
	defer rows.Close()

	todolists := make([]TodoList, 0)
	for rows.Next() {
		todolist := TodoList{}
		//load from db
		err := rows.Scan(&todolist.ID, &todolist.Title)
		if err != nil {
			log.Println("GetAllTodoLists...", err)
			return nil, err
		}
		todolists = append(todolists, todolist)
	}
	if err := rows.Err(); err != nil {
		log.Println("GetAllTodoLists...", err)
		return nil, err
	}
	return todolists, nil
}

// AddTodoList will add new todo list to db
func AddTodoList(todolist BaseList) (TodoList, error) {
	var tl TodoList

	err := sqlDB.QueryRow(`INSERT INTO todo_list (title) VALUES ($1)
		RETURNING id, title;`, todolist.Title).Scan(&tl.ID, &tl.Title)

	if err != nil {
		log.Println("AddNewTodoList...", err)
		return tl, err
	}
	return tl, nil
}

// GetTodoItems returns all items from specified todo list
func GetTodoItems(listID int32) ([]TodoItem, error) {
	rows, err := sqlDB.Query("SELECT id, list_id, title, checked from todo_item WHERE list_id = $1;", listID)
	if err != nil {
		log.Println("GetTodoItems...", err)
		return nil, err
	}
	defer rows.Close()

	todoitems := make([]TodoItem, 0)
	for rows.Next() {
		todoitem := TodoItem{}
		//load from db
		err := rows.Scan(&todoitem.ID, &todoitem.ListID, &todoitem.Title, &todoitem.Checked)
		if err != nil {
			log.Println("GetTodoItems...", err)
			return nil, err
		}
		todoitems = append(todoitems, todoitem)
	}
	if err := rows.Err(); err != nil {
		log.Println("GetTodoItems...", err)
		return nil, err
	}
	return todoitems, nil
}

// AddTodoItem will add item to todo_item table
func AddTodoItem(listID int32, todo BaseTodoItem) (TodoItem, error) {
	var item TodoItem
	// insert item into table
	err := sqlDB.QueryRow(`INSERT into todo_item (list_id, title, checked) VALUES($1,$2,$3)
	RETURNING id, list_id, title, checked;`, &listID, &todo.Title, &todo.Checked).Scan(&item.ID, &item.ListID, &item.Title, &item.Checked)
	if err != nil {
		log.Println("AddNewTodoList...", err)
		return item, err
	}
	return item, nil
}
