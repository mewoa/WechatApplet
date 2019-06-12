const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  var courseId = event.courseId;
  var collectionName = event.collectionName
  try {
    return await db.collection(collectionName).where({
      courseId: courseId
    }).remove()
  } catch (e) {
    console.error(e)
  }
}