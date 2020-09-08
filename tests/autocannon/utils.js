const fs = require('fs')
const ldb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('./report/db.json')
const db = ldb(adapter)

module.exports = {
  saveToJsonFile: (err, result)=>{
    if (err) {
      console.error(err)
    }else{
      // basic stats
      const {IdNotRetuned, Created} = result
      console.log(`IdNotRetuned tot: ${(IdNotRetuned.list + IdNotRetuned.item)}, lists: ${IdNotRetuned.list}, items:${IdNotRetuned.item}`)
      console.log(`Created tot: ${(Created.list + Created.item)}, lists: ${Created.list}, items: ${Created.item}`)

      // console.log("Results received:", result)
      const fileName = `report/load_test_${Date.now()}.json`
      fs.writeFileSync(fileName, JSON.stringify(result))
      console.log("Saved to file:", fileName)
    }
  },
  saveToLowdb:(err, result)=>{
    if (err) {
      console.error(err)
    }else{
      // basic stats
      const {IdNotRetuned, Created} = result
      console.log(`IdNotRetuned tot: ${(IdNotRetuned.list + IdNotRetuned.item)}, lists: ${IdNotRetuned.list}, items:${IdNotRetuned.item}`)
      console.log(`Created tot: ${(Created.list + Created.item)}, lists: ${Created.list}, items: ${Created.item}`)
      // add to report
      db.get('report')
        .push(result)
        .write()

      console.log("Saved to lowdb json file")
    }
  },
  // settings
  settings:{
    //default url (actix)
    url:"http://localhost:8080",
    connections:10,
    duration:30,
  },
  // Test data for post and put
  todoList:{
    title:"New todo list"
  },
  todoItem:{
    "title":"Todo item",
    "checked": false
  },
  //hasura GraphQL queries
  qql:{
    getTodoList:{
      "query": "query TodoLists {\n  todo_list(limit: 50){\n    id\n    title\n  }\n}\n",
      "variables": null,
      "operationName": "TodoLists"
    },
    addTodoList:{
      "query": "mutation AddTodoList {\n  insert_todo_list_one(object: {title: \"This is my list title\"}) {\n  id\n  title\n}\n}\n",
      "variables": null,
      "operationName": "AddTodoList"
    },
    updateTodoList:(id=1,title="default title")=>({
      "query": `mutation UpdateTodoList {\n  update_todo_list_by_pk(pk_columns: {id: ${id}}, _set: {title: \"${title}\"}) {\n    id\n    title\n  }\n}\n`,
      "variables": null,
      "operationName": "UpdateTodoList"
    }),
    addTodoItem:(list_id=1,title="",checked=false)=>({
      "query": `mutation MutateTodoItems {\n  insert_todo_item_one(object: {list_id: ${list_id}, title: \"${title}\", checked: ${checked}}) {\n    id\n    list_id\n    title\n    checked\n  }\n}\n`,
      "variables": null,
      "operationName": "MutateTodoItems"
    }),
    getTodoItemForList:(list_id=1)=>({
      "query": `query GetTodoItems {\n  todo_item(where: {list_id: {_eq: ${list_id}}}) {\n    id\n    checked\n    list_id\n    title\n  }\n}\n\n`,
      "variables": null,
      "operationName": "GetTodoItems"
    }),
    deleteTodoItem:(id)=>({
      "query": `mutation MutateTodoItems {\n  delete_todo_item_by_pk(id: ${id}) {\n    id\n    list_id\n    title\n    checked\n  }\n}\n`,
      "variables": null,
      "operationName": "MutateTodoItems"
    })
  }
}