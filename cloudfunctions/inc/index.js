// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  try {
    var docid = event.docid;
    var collectionName = event.collectionName
    var field = event.field
    var count = event.count
    var lastTime = event.lastTime
    return await db.collection(collectionName).doc(docid).update({
      data:
      {
        [field]: _.inc(count),
        lastTime:lastTime
      }
    })
  } catch (e) {
    console.error(e)
  }
}