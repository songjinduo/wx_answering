const fs = wx.getFileSystemManager()
var util = require('util.js')
const collections = {"pro":[]}

module.exports = {
  data: collections
}



/*
var data = fs.readFileSync("/utils/collections.json", "utf-8")
fs.readFile({
  filePath: wx.env.USER_DATA_PATH + "/utils/collections.json",
  encoding: 'utf-8',
  success: res => {
    //返回临时文件路径
    console.log(res.data)
    collections.pro = res.data.data;
  },
  fail: console.error
})
 */