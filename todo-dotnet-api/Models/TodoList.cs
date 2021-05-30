using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace todo_api.Models{
  public class TodoList{
    [Key]
    public int id {get;set;}
    [Required]
    public string title{get;set;}
    // public List<TodoItem> items{get;set;}
  }
  public class NewTodoList{
    [Required]
    public string title{get;set;}
  }
}