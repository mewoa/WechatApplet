// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {

  try {
    var docid = event.docid
    var content= event.infoContent

    return await db.collection("notice").doc(docid).update({
      data:
      {
        content: content
      }
    })
  } catch (e) {
    console.error(e)
  }
}