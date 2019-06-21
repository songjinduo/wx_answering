// pages/python/python.js
const questionData = require('../../utils/data2.js')
const collectionData = require('../../utils/collections.js')
const fs = wx.getFileSystemManager()

//获取应用实例
const app = getApp()
var error_s;
var success2;
var data_c = new Array();//缓存的数据
var pro_suc = new Array();//正确的题目号
var pro_wro = new Array();//错误的题目号
var suct;//成功次数
var wro;//失败次数

function remove(k) {
  wx.removeStorage({
    key: k,
    success: function (res) {
      console.log(res.data)
    }
  })
}
//判断值是否在数组中
function contains(a, obj) {
  var i = a.length;
  while (i--) {
    if (a[i] === obj) {
      return i;
    }
  }
  return -1;
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    background: '/pages/image/pro.png',
    userInfo: {},
    hasUserInfo: false,
    isLoading: false,
    isFirst: true,
    swiper: {
      active: 0
    },
    layerlayer: {
      isLayerShow: false,//默认弹窗
      layerAnimation: {},//弹窗动画
    },
    isLocal: true,
    answers: {
      start: 0,//初始题号
      end: 0,//结束题号
      allList: [],//题号数据
      activeNum: 0,//当前显示条数
      onceLoadLength: 5,//一次向俩端加载条数，因我使用本地数据，此属性未实际使用
      isShowTip: false//默认是否显示提示
    },
    showModalStatus: false
  },

  //单选逻辑
  tapRadio: function (e) {
    let thisOption = e.currentTarget.dataset.option
    //console.log(thisOption)
    let list = this.data.answers.allList[thisOption[2]].options.map(function (option, i) {
      if (thisOption[1] == i && option.class != 'active') {
        option.Select = true
      } else {
        option.Select = false
      }
      return option
    })
    this.data.answers.allList[this.data.swiper.active].options = list
    this.tapSelect(e)
  },

  //多选逻辑
  tapCheckbox: function (e) {
    let thisOption = e.currentTarget.dataset.option
    let list = this.data.answers.allList[thisOption[2]].options.map(function (option, i) {
      if (thisOption[1] == i) {
        if (option.class != 'active') {
          option.Select = true
        }
        else {
          option.Select = false
        }
      }
      return option
    })
    this.data.answers.allList[this.data.swiper.active].options = list
  },

  //单选答案判断逻辑
  tapSelect: function (e) {
    var success1;
    if (!this.data.isFirst || this.data.answers.allList[this.data.answers.start + this.data.swiper.active].isAnswer) {
      return false
    }
    this.data.isFirst = false
    let bool = true
    let correct = this.data.answers.allList[this.data.swiper.active]['a']
    let data = this.data.answers.allList[this.data.swiper.active].options.map((option, i) => {
      if (option.Select && option.label != correct) {
        option.class = 'error'
        bool = false
      }
      if (!option.Select && option.label === correct) {
        option.class = 'active-success'
        bool = false
      }
      if (option.Select && option.label === correct) {
        option.class = 'success'
      }
      return option
    })

    var problem = this.data.answers.allList[this.data.answers.start + this.data.swiper.active]
    //判断数组中是否包含该题目
    var result_suc = contains(pro_suc, problem.id);
    var result_wro = contains(pro_wro, problem.id);
    if (bool) {//答对了
      suct = suct + 1
      problem.isAnswer = 1
      this.data.answers.success++
      if (result_suc == -1)
        pro_suc.push(problem.id)
      if (result_wro > -1)
        pro_wro.splice(result_wro, 1);
      console.log(problem.id + bool)
    } else {//失败了
      wro = wro + 1
      problem.isAnswer = 2
      this.data.answers.error++
      if (result_suc > -1)
        pro_suc.splice(result_suc, 1)
      if (result_wro == -1)
        pro_wro.push(problem.id);
      console.log(problem.id + bool)
      error_s = this.data.answers.error * 5
    }
    //将错误的题目和正确的题目加入缓存
    wx.setStorageSync("success", pro_suc)
    wx.setStorageSync("wrong", pro_wro)
    wx.setStorageSync("suc", suct)
    wx.setStorageSync("wro", wro)
    /*
        suct = wx.getStorageSync("suc")
        console.log(suct)*/

    problem.options = data
    this.data.answers.isShowTip = !bool
    this.setData(this.data)

    //延迟加载滑动
    if (this.data.answers.activeNum + 1 < this.data.answers.allList.length) {
      var suc = this.onSwiper('left');
      if (!bool) {
        wx.showModal({
          showCancel: false,//是否显示取消按钮
          title: '错误答案',
          content: '正确答案为' + correct,
          success: function (res) {
            if (res.confirm) {
              console.log('错误答案')
            }
          }
        })
      }
      setTimeout(() => this.onSwiper('left'), 200)
    } else {
      // 结束了
      var num = this.data.answers.success;
      if (num > 11) {
        wx.showModal({
          showCancel: false,//是否显示取消按钮
          title: '这是最后一题了',
          content: '恭喜你通过了测验！\n你答对了' + num + '道题',
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '../../../pages/index/index'
              })
            }
          }
        })
      } else {
        var text;
        if (bool) text = "按确定返回主页"
        else text = '正确答案为' + correct
        wx.showModal({
          title: '这是最后一题了',
          showCancel: false,//是否显示取消按钮
          content: text,
          success: function (res) {
            if (res.confirm) {
              //console.log('用户点击确定')
              wx.redirectTo({
                url: '../../../pages/index/index'
              })
            }
          }
        })
      }
    }
  },

  //多选答案判断逻辑
  tapConfirm: function (e) {
    if (!this.data.isFirst || this.data.answers.allList[this.data.answers.start + this.data.swiper.active].isAnswer) {
      //return false
    }
    this.data.isFirst = false
    let bool = true
    let correct = this.data.answers.allList[this.data.swiper.active]['a']
    let ans = ""
    let data = this.data.answers.allList[this.data.swiper.active].options.map((option, i) => {
      if (option.Select) {
        ans += option.label
      }
      return (option)
    })
    if (ans != correct) {
      bool = false
    }
    var problem = this.data.answers.allList[this.data.answers.start + this.data.swiper.active]

    //判断数组中是否包含该题目
    var result_suc = contains(pro_suc, problem.id + 10000);
    var result_wro = contains(pro_wro, problem.id + 10000);

    if (bool) {
      problem.isAnswer = 1
      if (result_suc == -1)
        pro_suc.push(problem.id + 10000)
      if (result_wro > -1)
        pro_wro.splice(result_wro, 1);
      this.data.answers.success++
    } else {
      problem.isAnswer = 2
      if (result_suc > -1)
        pro_suc.splice(result_suc, 1)
      if (result_wro == -1)
        pro_wro.push(problem.id + 10000);
      this.data.answers.error++
    }
    //将错误的题目和正确的题目加入缓存
    wx.setStorageSync("success", pro_suc)
    wx.setStorageSync("wrong", pro_wro)

    success2 = this.data.answers.success * 10
    problem.options = data
    this.data.answers.isShowTip = !bool
    this.setData(this.data)
    var points = success2 - 5 * (10 - error_s / 5)
    var num = this.data.answers.success;
    //延迟加载滑动
    if (this.data.answers.activeNum + 1 < this.data.answers.allList.length) {
      if (!bool) {
        wx.showModal({
          showCancel: false,//是否显示取消按钮
          title: '错误答案',
          content: '正确答案为' + correct,
          success: function (res) {
            if (res.confirm) {
              console.log('错误答案')
            }
          }
        })
      }
      setTimeout(() => this.onSwiper('left'), 200)
    } else {
      // 结束了
      //console.log(collectionData.data.pro);
      //wx.setStorageSync(, )
      if (num > 11) {
        wx.showModal({
          showCancel: false,//是否显示取消按钮
          title: '这是最后一题了',
          content: '恭喜你通过了测验！\n你答对了' + num + '道题',
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '../../../pages/index/index'
              })
            }
          }
        })
      } else {
        var text;
        if (bool) text = "按确定返回主页"
        else text = '正确答案为' + correct
        wx.showModal({
          title: '这是最后一题了',
          showCancel: false,//是否显示取消按钮
          content: text,
          success: function (res) {
            if (res.confirm) {
              //console.log('用户点击确定')
              wx.redirectTo({
                url: '../../../pages/index/index'
              })
            }
          }
        })
      }
    }
  },

  //页码切换列表效果
  pageClick: function () {
    let layerAnimation = wx.createAnimation({
      transformOrigin: '50% 50%',
      duration: 500,
      timingFunction: 'ease',
      delay: 0
    })
    if (!this.data.layerlayer.isLayerShow) {
      layerAnimation.translate3d(0, 0, 0).step()
    } else {
      layerAnimation.translate3d(0, '100%', 0).step()
    }
    this.data.layerlayer.isLayerShow = !this.data.layerlayer.isLayerShow
    this.data.layerlayer.layerAnimation = layerAnimation
    this.setData(this.data)
  },
  //页码切换列表收缩
  layerFooterClick: function () {
    let layerAnimation = wx.createAnimation({
      transformOrigin: '50% 50%',
      duration: 500,
      timingFunction: 'ease',
      delay: 0
    })
    layerAnimation.translate3d(0, '100%', 0).step()
    this.data.layerlayer.isLayerShow = false
    this.data.layerlayer.layerAnimation = layerAnimation
    this.setData(this.data)
  },

  //收藏逻辑
  collectList: function () {
    //console.log(collectionData)

    let index = this.data.answers.activeNum
    if (this.data.answers.allList[index].isStore == "false")
      this.data.answers.allList[index].isStore = false
    console.log(this.data.answers.allList[index].isStore)
    this.data.answers.allList[index].isStore = !this.data.answers.allList[index].isStore
    console.log(this.data.answers.allList[index].isStore)
    //初始收藏为空列表
    console.log(data_c)
    //获取题号
    var idx = this.data.answers.allList[index].id;
    var types = this.data.answers.allList[index].type;

    //判断收藏列表中是否存在该题目
    var result = 0;
    if (types == "单选")
      result = contains(data_c, idx);
    else
      result = contains(data_c, idx + 10000);

    //以下的逻辑为更新收藏列表
    if (this.data.answers.allList[index].isStore == true && result == -1) {
      if (index < 10)
        data_c.push(idx);
      else
        data_c.push(idx + 10000);
    } else if (this.data.answers.allList[index].isStore == false && result > -1) {
      data_c.splice(result, 1);
    }
    console.log("当前的收藏列表" + data_c)
    this.setData(this.data)
    //将收藏列表存入缓存
    wx.setStorageSync("collections", data_c)
  },

  //题号变更逻辑
  setActiveNum: function (e) {
    let thisOption = e.currentTarget.dataset.option - 0
    this.data.answers.activeNum = thisOption
    this.data.isFirst = false
    this.data.isLoading = false
    this.layerFooterClick()
    this.getSubject()
  },

  //swiper切换
  setEvent: function (e) {
    this.data.swiper.touchstartEvent = e
    return false
  },
  //滑动结束
  touchEnd: function (e) {
    this.onSwiper(this.getDirection(this.data.swiper.touchstartEvent, e))
    return false
  },
  //swiper切换
  onSwiper: function (dire) {
    let that = this
    let active = 0
    let storeSetTime
    let animationPre = wx.createAnimation({
      transformOrigin: '50% 50%',
      duration: 300,
      timingFunction: 'ease',
      delay: 0
    })
    let animationT = wx.createAnimation({
      transformOrigin: '50% 50%',
      duration: 300,
      timingFunction: 'ease',
      delay: 0
    })
    let animationNext = wx.createAnimation({
      transformOrigin: '50% 50%',
      duration: 300,
      timingFunction: 'ease',
      delay: 0
    })
    if (!this.$isLock) {//锁屏控制
      this.$isLock = true
      if (dire == 'bottom' || dire == 'top' || !dire) {
        this.$isLock = false
        return false
      }
      if (dire == 'right') {
        animationPre.translate3d('0', 0, 0).step()
        animationT.translate3d('100%', 0, 0).step()
        if (this.data.answers.activeNum > this.data.answers.start) {
          active = - 1
        } else {
          this.$isLock = false
          return
        }
      }
      if (dire == 'left') {
        animationT.translate3d('-100%', 0, 0).step()
        animationNext.translate3d('0', 0, 0).step()
        if (this.data.answers.activeNum < this.data.answers.end - 1) {
          active = 1
        } else {
          this.$isLock = false
          return
        }
      }
      this.data.isFirst = true
      this.data.swiper.animationPre = animationPre.export()
      this.data.swiper.animationT = animationT.export()
      this.data.swiper.animationNext = animationNext.export()
      this.setData(this.data)

      this.data.swiper.active = this.data.swiper.active + active
      this.data.answers.activeNum = this.data.answers.activeNum + active
      setTimeout(function () {
        that.setHtmlsetHtml(active)
      }, 300)
    }
  },
  //修改页面至正常位置
  setHtmlsetHtml: function (active) {
    let animationPre = wx.createAnimation({
      transformOrigin: '50% 50%',
      duration: 0,
      timingFunction: 'ease',
      delay: 0
    })
    let animationT = wx.createAnimation({
      transformOrigin: '50% 50%',
      duration: 0,
      timingFunction: 'ease',
      delay: 0
    })
    let animationNext = wx.createAnimation({
      transformOrigin: '50% 50%',
      duration: 0,
      timingFunction: 'ease',
      delay: 0
    })
    animationPre.translate3d('-100%', 0, 0).step()
    animationT.translate3d('0', 0, 0).step()
    animationNext.translate3d('100%', 0, 0).step()

    this.data.swiper.animationPre = animationPre
    this.data.swiper.animationT = animationT
    this.data.swiper.animationNext = animationNext
    this.setData(this.data)

    //调用加载数据方法
    // if ((this.data.swiper.active == 2 && this.data.answers.start > 0) || (this.data.swiper.active + 2 == this.data.answers.list.length && this.data.answers.end < this.data.answers.allList.length)) {
    //   // this.getSubject()
    // }

    //调用滑动结束回调
    if (this.isLockCall && typeof this.isLockCall == 'function') {
      this.isLockCall()
      this.isLockCall = false
    }
    this.$isLock = false
  },
  //获得手势方向
  getDirection: function (startEvent, endEvent) {
    let x = endEvent.changedTouches[0].clientX - startEvent.changedTouches[0].clientX
    let y = endEvent.changedTouches[0].clientY - startEvent.changedTouches[0].clientY
    let pi = 360 * Math.atan(y / x) / (2 * Math.PI)
    if (pi < 25 && pi > -25 && x > 0 && Math.abs(x) > 10) {
      return 'right'
    }
    if (pi < 25 && pi > -25 && x < 0 && Math.abs(x) > 10) {
      return 'left'
    }
    if ((pi < -75 || pi > 750) && y > 0 && Math.abs(y) > 10) {
      return 'bottom'
    }
    if ((pi < -75 || pi > 75) && y < 0 && Math.abs(y) > 10) {
      return 'top'
    }
  },
  getSubject: function () {
    this.data.answers.end = this.data.answers.allList.length
    // console.log()
    //注册滑动结束回调
    if (this.$isLock) {
      this.isLockCall = function () {
        this.data.swiper.active = this.data.answers.activeNum - this.data.answers.start
        this.data.answers.allList = questionData.data
        this.data.isLoading = false
        this.data.isFirst = true
        this.setData(this.data)
      }
    } else {
      this.data.swiper.active = this.data.answers.activeNum - this.data.answers.start
      this.data.answers.allList = questionData.data
      this.data.isLoading = false
      this.data.isFirst = true
      this.setData(this.data)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (params) {
    //wx.clearStorage()
    //获取缓存的收藏列表
    data_c = wx.getStorageSync("collections")
    pro_suc = wx.getStorageSync("success")
    pro_wro = wx.getStorageSync("wrong")
    suct = wx.getStorageSync("suc")
    wro = wx.getStorageSync("wro")
    //console.log(data_c)
    if (data_c == "") {
      data_c = []
      wx.setStorage({
        key: 'collections',
        data: data_c,
      })
    }
    if (pro_suc == "") {
      pro_suc = []
      wx.setStorage({
        key: 'success',
        data: pro_suc,
      })
    }
    if (pro_wro == "") {
      pro_wro = []
      wx.setStorage({
        key: 'wrong',
        data: pro_wro,
      })
    }
    if (suct == "") {
      suct = 0
      wx.setStorage({
        key: 'suc',
        data: suct,
      })
    }
    if (wro == "") {
      wro = 0
      wx.setStorage({
        key: 'wro',
        data: wro,
      })
    }

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    console.log(data_c)
    for (var i = 0; i < questionData.data.length; i++) {
      if (contains(data_c, questionData.data[i].id) == -1) {
        questionData.data[i].isStore = false
      } else {
        questionData.data[i].isStore = true
      }
    }
    // 
    this.data.answers.allList = questionData.data
    this.data.answers.success = 0
    this.data.answers.error = 0
    this.data.answers.loading = false
    this.setData(this.data)
    this.getSubject()
    //console.log(this.data.answers.allList)
    //wx.clearStorage(questionData)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function () {
    var that = this;
    //console.log(that);
    let base64 = wx.getFileSystemManager().readFileSync(this.data.background, 'base64');
    that.setData({
      'background': 'data:image/png;base64,' + base64
    });

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})