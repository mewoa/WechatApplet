// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  var docid = event.docid;
  var collectionName = event.collectionName
  
  try {
    var field = event.field
    return await db.collection(collectionName).doc(docid).update({
      data:
      {
        [field]: _.inc(1)
      }
    })
  } catch (e) {
    console.error(e)
  }
}