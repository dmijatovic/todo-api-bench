using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace todo_api.Models{
  public class TodoItem{
    [Key]
    public int id {get;set;}
    [Required]
    public string title {get;set;}

    [Required]
    public byte done {get; set;}
    [Required]
    public int list_id {get;set;}
  }

  public class NewTodoItem{
    [Required]
    public string title {get;set;}

    [Required]
    public byte done {get; set;}
    [Required]
    public int list_id {get;set;}
  }
}