using System.Collections.Generic;
using System.Threading.Tasks;
using todo_api.Models;

namespace todo_api.Services.TodoService{
  public interface ITodoService{
    // Sync operations
    // List<TodoList> GetAll();
    // TodoList GetTodoListById(int id);
    // TodoList AddTodoList(NewTodoList newlist);
    // TodoList UpdateTodoList(TodoList updatelist);
    // TodoList DeleteTodoList(int id);

    // ASYNC operations definitions

    // todolist interface part
    Task<ServiceResponse<List<TodoList>>> GetTodoLists();
    Task<ServiceResponse<TodoList>> GetTodoListById(int id);
    Task<ServiceResponse<TodoList>> AddTodoList(NewTodoList newlist);
    Task<ServiceResponse<TodoList>> UpdateTodoList(TodoList updatelist);
    Task<ServiceResponse<TodoList>> DeleteTodoList(int id);

    // todo items interface part
    Task<ServiceResponse<List<TodoItem>>> GetAllTodos();

    Task<ServiceResponse<List<TodoItem>>> GetItemsForList(int lid);

    Task<ServiceResponse<TodoItem>> AddItemToList(NewTodoItem newTodo);

    Task<ServiceResponse<TodoItem>> GetItemById(int lid, int id);

    Task<ServiceResponse<TodoItem>> UpdateItem(TodoItem todoItem);

    Task<ServiceResponse<TodoItem>> DeleteItem(int lid, int id);
  }
}