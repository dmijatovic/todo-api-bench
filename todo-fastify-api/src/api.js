const todos = require('./db/todos')

module.exports = function (fastify,opts,done){
  fastify.get("/",async (req,res)=>{
    return {
      message:"This is OK"
    }
  })

  fastify.post("/list",todos.AddTodoList)
  fastify.put("/list",todos.UpdateTodoList)
  fastify.get("/list",todos.GetAllTodoLists)
  fastify.get("/list/:lid",todos.GetTodoList)
  fastify.delete("/list/:lid",todos.DeleteTodoList)

  fastify.post("/todo",todos.AddTodoItem)
  fastify.put("/todo/:id",todos.UpdateTodoItem)
  fastify.delete("/todo/:id",todos.DeleteTodoItem)

  fastify.get("/todo/list/:lid",todos.GetTodoItems)
  fastify.get("/todo/:id",todos.GetTodoItem)
  // indicate operation is done
  // this is kind of middleware action
  done()
}
