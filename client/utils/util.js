const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
/*
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  */
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getCurrentDate = () =>{

}

const log = (str,res=null) =>{
  console.log(str,res)
}

module.exports = {
  formatTime: formatTime,
  getCurrentDate: getCurrentDate,
  log : log
}


