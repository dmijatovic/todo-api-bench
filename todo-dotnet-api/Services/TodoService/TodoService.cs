using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using todo_api.Data;
using todo_api.Models;

namespace todo_api.Services.TodoService{
  public class TodoService : ITodoService
  {
    private static List<TodoList> memoLists = new List<TodoList>{};
    private readonly DataContext _db;

    public TodoService(DataContext dbContext)
    {
        _db = dbContext;
    }

    public async Task<ServiceResponse<TodoList>> AddTodoList(NewTodoList newlist)
    {
      TodoList newTodoList = new TodoList{
        title = newlist.title
        // items = new List<TodoItem>()
      };
      // add list to collection
      await _db.TodoLists.AddAsync(newTodoList);
      // save
      await _db.SaveChangesAsync();
      var serviceResponse = new ServiceResponse<TodoList>();
      serviceResponse.payload = newTodoList;
      // return
      return serviceResponse;
    }

    public async Task<ServiceResponse<TodoList>> DeleteTodoList(int id)
    {
      var serviceResponse = new ServiceResponse<TodoList>();
      var found = await _db.TodoLists.FirstOrDefaultAsync(list=>list.id==id);
      if (found!=null){
        _db.TodoLists.Remove(found);
        serviceResponse.payload=found;
        await _db.SaveChangesAsync();
      }else{
        serviceResponse.payload=null;
      }
      return serviceResponse;
    }

    public async Task<ServiceResponse<List<TodoList>>> GetTodoLists()
    {
      var serviceResponse = new ServiceResponse<List<TodoList>>();
      List<TodoList> todoLists = await _db.TodoLists.ToListAsync();
      serviceResponse.payload = todoLists;
      return serviceResponse;
    }

    public async Task<ServiceResponse<TodoList>> GetTodoListById(int id)
    {
      var serviceResponse = new ServiceResponse<TodoList>();
      var todoList = await _db.TodoLists.FirstOrDefaultAsync(list=>list.id==id);
      serviceResponse.payload = todoList;
      return serviceResponse;
    }

    public async Task<ServiceResponse<TodoList>> UpdateTodoList(TodoList updatelist)
    {
      TodoList found = _db.TodoLists.FirstOrDefault(list=>list.id==updatelist.id);
      if (found!=null){
        // change
        found.title = updatelist.title;
        // save
        await _db.SaveChangesAsync();
      }

      var serviceResponse = new ServiceResponse<TodoList>();
      serviceResponse.payload = found;
      return serviceResponse;
    }

    public async Task<ServiceResponse<List<TodoItem>>> GetAllTodos(){
      // TodoList found = memoLists.FirstOrDefault(todolist=>todolist.id==lid);
      var serviceResponse = new ServiceResponse<List<TodoItem>>();

      List<TodoItem> todos = await _db.TodoItems.ToListAsync();

      serviceResponse.payload = todos;
      return serviceResponse;
    }

    public async Task<ServiceResponse<List<TodoItem>>> GetItemsForList(int lid){
      // TodoList found = memoLists.FirstOrDefault(todolist=>todolist.id==lid);
      var serviceResponse = new ServiceResponse<List<TodoItem>>();

      List<TodoItem> todos = await _db.TodoItems
        .Where(i => i.list_id==lid)
        .ToListAsync();

      serviceResponse.payload = todos;
      return serviceResponse;
    }

    public async Task<ServiceResponse<TodoItem>> AddItemToList(NewTodoItem newTodo){
      // TodoList found = memoLists.FirstOrDefault(todolist=>todolist.id==newTodo.list_id);
      var serviceResponse = new ServiceResponse<TodoItem>();
      // create new todo item
      var todoItem = new TodoItem{
        list_id = newTodo.list_id,
        title = newTodo.title,
        done = newTodo.done
      };
      try{
        await _db.TodoItems.AddAsync(todoItem);
        // save
        await _db.SaveChangesAsync();
        // return item
        serviceResponse.payload = todoItem;
        return serviceResponse;
      }catch{
        serviceResponse.error="Failed to add item to list";
        return serviceResponse;
      }
    }

    public async Task<ServiceResponse<TodoItem>> UpdateItem(TodoItem todoItem){
      var serviceResponse = new ServiceResponse<TodoItem>();
      var foundItem = await _db.TodoItems.FirstOrDefaultAsync(i => i.id==todoItem.id);
      if (foundItem!=null){
        foundItem.title = todoItem.title;
        foundItem.done = todoItem.done;
        await _db.SaveChangesAsync();
        serviceResponse.payload=foundItem;
      }else{
        serviceResponse.payload = null;
        serviceResponse.error = "Item not found";
      }
      return serviceResponse;
    }

    public async Task<ServiceResponse<TodoItem>> DeleteItem(int lid, int id){
      var serviceResponse = new ServiceResponse<TodoItem>();
      var foundItem = await _db.TodoItems.FirstOrDefaultAsync(item => item.id==id);
      if (foundItem!=null){
        // remove
        _db.TodoItems.Remove(foundItem);
        // save
        await _db.SaveChangesAsync();
        // return
        serviceResponse.payload = foundItem;
      }else{
        serviceResponse.payload = null;
      }
      return serviceResponse;
    }


    public async Task<ServiceResponse<TodoItem>> GetItemById(int lid,int id){
      var serviceResponse = new ServiceResponse<TodoItem>();

      TodoItem foundItem = await _db.TodoItems.FirstOrDefaultAsync(item => item.id==id);
      if (foundItem!=null){
        serviceResponse.payload = foundItem;
      }else{
        serviceResponse.payload = null;
      }
      return serviceResponse;
    }
  }
}