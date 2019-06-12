// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {

  try {
    var docid = event.docid
    var field1 = event.field1
    var field2 = event.field2
    var name = event.name
    var info = event.info
    var collectionName = event.collectionName

    return await db.collection(collectionName).doc(docid).update({
      data:
      {
        [field1]:name,
        [field2]:info
      }
    })
  } catch (e) {
    console.error(e)
  }
}