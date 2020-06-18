// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env : "release-5q0el"
})

// 云函数入口函数
exports.main = async (event, context) => {

  console.log("updateCars", event)
  var tmpData = {
    openId: event.openId,
    carState: event.carState,
    carType: event.carType,
    carStyle: event.carStyle,
    carNumber: event.carNumber,
    carPrice: event.carPrice,
    carBuyDate: event.carBuyDate,
    carImage: event.carImage
  }

  try {
    if (!event.edit) {
      return await db.collection("cars-info").add({
        data: tmpData
      });
    } else {
      return await db.collection("cars-info")
        .where({
          _id: event.objectId
        })
        .update({
          data: tmpData
        })
    }

  } catch (e) {
    console.error(e)
  }
}