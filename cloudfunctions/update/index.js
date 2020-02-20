// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()


// 云函数入口函数
exports.main = async(event, context) => {
  console.log("tableName = " + event.tableName);
  console.log("openId = " + event.openId);
  console.log("info = ", event.info);
  console.log("evn1 = ", event.env);


  const db = cloud.database({
    env: event.env
  })
  const _ = db.command;

  try {
    return await db.collection(event.tableName)
      .where({
        openId: event.openId
      })
      .update({
        data: {
          cars: _.push(event.info)
        }
      })
  } catch (e) {
    console.error(e)
    console.debug("test test")
  }
}