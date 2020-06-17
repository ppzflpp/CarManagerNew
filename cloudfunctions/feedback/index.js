// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "release-5q0el"
})
const db = cloud.database({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log('phone = ' + event.phone + ",info = " + event.info);
  return db.collection("feedback").add({
    data: {
      user_id: event.id,
      nick: event.nick,
      phone: event.phone,
      info: event.info
    }
  });
}