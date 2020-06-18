// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: "release-5q0el"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var $ = db.command.aggregate;
  var openId = event.openId;
  var carId = event.carId;

  //获取汽车信息
  var carInfoRes = await db.collection('cars-info').aggregate()
    .match({
      openId: openId
    })
    .project({
      _openid: 0
    })
    .end()
    console.log("carInfoRes",carInfoRes)
  //获取汽车消费信息
  var carCostInfoRes = await db.collection('records').aggregate()
    .match({
      user_id: openId
    })
    .group({
      _id: '$carId',
      totalDistance: $.sum('$distance'),
      totalPrice: $.sum('$money')
    })
    .end()
  console.log("carCostInfo",carCostInfoRes)
  //合并两个结果给客户端
  if (carInfoRes != null && carInfoRes.list != null) {
    for (let i = 0; i < carInfoRes.list.length; i++) {
      //初始化不存在的两个变量
      carInfoRes.list[i].totalDistance = 0;
      carInfoRes.list[i].totalPrice = 0;
      if (carCostInfoRes != null && carCostInfoRes.list != null) {
        for (let j = 0; j < carCostInfoRes.list.length; j++) {
          //若存在对应汽车的消耗，赋值给新变量，并且结束本次循环
          if (carInfoRes.list[i]._id == carCostInfoRes.list[j]._id) {
            carInfoRes.list[i].totalDistance = carCostInfoRes.list[j].totalDistance;
            carInfoRes.list[i].totalPrice = carCostInfoRes.list[j].totalPrice;
            break;
          }
        }
      }
    }
  }

  //返回最终结果给客户端
  var res = carInfoRes.list;
  console.log("res", res);
  return res;
}