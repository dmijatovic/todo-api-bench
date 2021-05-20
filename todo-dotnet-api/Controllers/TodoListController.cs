using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using todo_api.Models;
using todo_api.Services.TodoService;

namespace todo_api.Controllers{

  [ApiController]
  [Route("todolist")]
  public class TodoListController:ControllerBase{
    private readonly ITodoService _todoService;
    // service is injected into controller
    // in the constructor (here below)
    // use ctor shortcut to generate construction function
    public TodoListController(ITodoService todoService)
    {
      _todoService = todoService;
    }
    // GET /todos
    [HttpGet]
    public async Task<ActionResult<List<TodoList>>> GetTodoLists(){
      return Ok(await _todoService.GetTodoLists());
    }

    [HttpGet("{lid}")]
    public async Task<ActionResult<TodoList>> GetTodoListById(int lid){
      return Ok(await _todoService.GetTodoListById(lid));
    }

    [HttpPost]
    public async Task<ActionResult<TodoList>> AddTodoList(NewTodoList newlist){
      // return
      return Ok(await _todoService.AddTodoList(newlist));
    }

    [HttpPut]
    public async Task<ActionResult<TodoList>> UpdateTodoList(TodoList updatelist){
      // return
      return Ok(await _todoService.UpdateTodoList(updatelist));
    }

    [HttpDelete("{lid}")]
    public async Task<ActionResult<TodoList>> DeleteTodoList(int lid){
      // return
      return Ok(await _todoService.DeleteTodoList(lid));
    }
  }
}