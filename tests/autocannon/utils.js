const os = require('os')
const fs = require('fs')
const ldb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

// const JSONFile = require('lowdb/node')
// const adapter = new FileSync('./report/db.json')
// const db = ldb(adapter,)

module.exports = {
  // settings
  settings:{
    // default title (change)
    title: "default title",
    //default url (actix)
    url:"http://localhost:8080",
    connections:10,
    duration:60,
  },
  system: `${os.cpus()[0]?.model}`,
  coreCnt: os.cpus()?.length,
  jsonFileName: () => {
    const baseInfo = os.cpus()[0]?.model ?? "db.json"
    // if no info return file name
    if (baseInfo === "db.json") return baseInfo
    const fileName = baseInfo
      .trim()
      .replaceAll(" ", "_")
      .replaceAll("-", "_")
      .replaceAll("(", "")
      .replaceAll(")", "")
      .replaceAll("@", "")
      .replaceAll(".", "")
      .replaceAll("____", "_")
      .replaceAll("___", "_")
      .replaceAll("__", "_")
    return `./report/${fileName}.json`
  },
  getCoreSpeed:(core=0)=>{
    return os.cpus()[core]?.speed
  },
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
  saveToLowdb:(err, result, file)=>{
    if (err) {
      console.error(err)
    } else {
      const adapter = new FileSync(file)
      const db = ldb(adapter)
      // create default report
      db.defaults({report:[]})
        .write()
      // basic stats
      const {IdNotRetuned, Created} = result
      console.log(`IdNotRetuned tot: ${(IdNotRetuned.list + IdNotRetuned.item)}, lists: ${IdNotRetuned.list}, items:${IdNotRetuned.item}`)
      console.log(`Created tot: ${(Created.list + Created.item)}, lists: ${Created.list}, items: ${Created.item}`)
      // add to report
      db.get("report")
        .push(result)
        .write()

      console.log("Saved to lowdb json file...", file)
    }
  },
  writeStatusByRoute:(status,route,statusByRoute)=>{
    if (statusByRoute[route]){
      if (statusByRoute[route][status]){
        // increase for one
        statusByRoute[route][status]+=1
      }else{
        statusByRoute[route][status]=1
      }
    }else{
      statusByRoute[route]={};
      statusByRoute[route][status]=1;
    }
    return statusByRoute
  },
  // Test data for post and put
  todoList:{
    title:"New todo list"
  },
  todoItem:{
    "title":"Todo item",
    "checked": false
  },
  todoItemForList:(lid=1)=>({
    list_id:lid,
    title:"New item title from autocannon",
    checked: false
  }),
  todoItemUpdate:(lid=1,id=1)=>({
    id,
    list_id:lid,
    title:"Updated item title from autocannon",
    checked: true
  }),
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