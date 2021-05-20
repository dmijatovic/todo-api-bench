using Microsoft.AspNetCore.Mvc;
using todo_api.Models;

namespace todo_api.Controllers{

  [ApiController]
  [Route("/")]
  public class HomeController:ControllerBase{
    private static Home message = new Home();
    // GET /todos
    [HttpGet]
    public ActionResult<Home> GetTodoList(){
      return Ok(message);
    }
  }
}