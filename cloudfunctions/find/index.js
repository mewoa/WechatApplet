const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
// 传入表名，字段名，和要查找的Id
exports.main = async(event, context) => {
  var tabelName = event.tabelName
  var field  = event.field
  var id = event.id
  var password = event.password

  console.log(tabelName)
  console.log(field)
  console.log(id)
  console.log(password)
try{
      return await db.collection(tabelName).where({
        field: id,
        password:password
  }).get()
}
catch(e){
    console.log(e)
  }
}