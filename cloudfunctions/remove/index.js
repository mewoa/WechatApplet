
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
    return await db.collection(collectionName).doc(docid).remove({
      success: res => {
        wx.showToast({
          title: '删除fileBase成功',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })
  } 
  catch (e) {
    console.error(e)
  }
}