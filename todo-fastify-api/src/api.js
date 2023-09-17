const todos = require('./db/todos')

module.exports = function (fastify,opts,done){
  fastify.get("/",async (req,res)=>{
    return {
      status:"OK"
    }
  })

  // list
  fastify.get("/list",todos.GetAllTodoLists)
  fastify.post("/list",todos.AddTodoList)
  fastify.get("/list/:lid",todos.GetTodoList)
  fastify.put("/list/:lid",todos.UpdateTodoList)
  fastify.delete("/list/:lid",todos.DeleteTodoList)

  // items
  fastify.post("/todo",todos.AddTodoItem)
  fastify.get("/todo/:id",todos.GetTodoItem)
  fastify.put("/todo/:id",todos.UpdateTodoItem)
  fastify.delete("/todo/:id",todos.DeleteTodoItem)

  fastify.get("/list/:lid/todo",todos.GetTodoItems)
  // indicate operation is done
  // this is kind of middleware action
  done()
}
