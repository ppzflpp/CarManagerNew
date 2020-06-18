// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env : "release-5q0el"
})

// 云函数入口函数
exports.main = async (event, context) => {
  var tableName = event.tableName;
  var _id = event._id;
  console.log("query by id " + "_id = " + _id + ",tableName = " + tableName);
  return db.collection(tableName).where({
    _id : _id
  }).get();
}