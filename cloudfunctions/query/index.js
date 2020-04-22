const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({
  env : "release-5q0el"
})
const MAX_LIMIT = 100

exports.main = async (event, context) => {
  console.log('tableName',event.tableName)
  console.log('openId',event.openId)
  let tableName = event.tableName;
  let openId = event.openId;

  // 先取出集合记录总数
  const countResult = await db.collection(tableName).where({
    user_id : openId
  }).count();

  const total = countResult.total;
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection(tableName).where({
      user_id: openId
    }).orderBy('date','desc').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}