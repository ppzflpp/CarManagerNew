// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env : "release-5q0el"
})

// 云函数入口函数
exports.main = async(event, context) => {

  return db.collection(event.tableName).doc(event._id).update({
    data : {
      user_id : event.user_id,
      index : event.index,
      style : event.style,
      style_alias : event.style_alias,
      date : event.date,
      money : event.money,
      info : event.info,
      updateDate : event.updateDate,
      indexCar : event.indexCar,
      distance : event.distance,
    }
  });
}