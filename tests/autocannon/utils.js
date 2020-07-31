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
      //add
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
  }
}