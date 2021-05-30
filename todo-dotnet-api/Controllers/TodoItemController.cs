using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using todo_api.Models;
using todo_api.Services.TodoService;

namespace todo_api.Controllers{

  [ApiController]
  [Route("todo")]
  public class TodoItemController:ControllerBase{
    private readonly ITodoService _todoService;
    // service is injected into controller
    // in the constructor (here below)
    // use ctor shortcut to generate construction function
    public TodoItemController(ITodoService todoService)
    {
      _todoService = todoService;
    }
    // GET /todo/all
    [HttpGet("all")]
    public async Task<ActionResult<List<TodoItem>>> GetAllTodos(){
      return Ok(await _todoService.GetAllTodos());
    }
    // GET /todo/list/{lid}
    [HttpGet("list/{lid}")]
    public async Task<ActionResult<List<TodoItem>>> GetItemsForList(int lid){
      return Ok(await _todoService.GetItemsForList(lid));
    }

    // POST /todo
    [HttpPost]
    public async Task<ActionResult<TodoItem>> AddTodoItem(NewTodoItem newItem){
      // return
      return Ok(await _todoService.AddItemToList(newItem));
    }

    // PUT /todo
    [HttpPut]
    public async Task<ActionResult<TodoItem>> UpdateTodoItem(TodoItem updateItem){
      // return
      return Ok(await _todoService.UpdateItem(updateItem));
    }

    // GET /todo/id/{id}
    [HttpGet("id/{id}")]
    public async Task<ActionResult<TodoItem>> GetTodoItemById(int lid, int id){
      return Ok(await _todoService.GetItemById(lid,id));
    }

    // DELETE
    [HttpDelete("id/{id}")]
    public async Task<ActionResult<TodoItem>> DeleteTodoItem(int lid, int id){
      // return
      return Ok(await _todoService.DeleteItem(lid,id));
    }
  }
}