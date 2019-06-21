
//index.js
//获取应用实例
const app = getApp()

Page({

  data: {
    background: '/pages/image/index.png',
    motto: '欢迎来到毛概答题',
    enter: '开始答题',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../../packageB/pages/echarts/echarts'
    })
  },
  onLoad: function () {
    var that = this;
    //console.log(that);
    let base64 = wx.getFileSystemManager().readFileSync   (this.data.background, 'base64');
    that.setData({
      'background': 'data:image/png;base64,' + base64
    });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    //console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onPullDownRefresh: function () {
    var i = 0;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function () {
      // complete

      wx.navigateTo({
        url: '/pages/python/python',
        success: function (res) {
        },
        fail: function (res) { },
        complete: function (res) { },
      })
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  menuClick1: function (e) {
    console.log(e)
    this.setData({
      _num: e.target.dataset.num
    })
  },

  menuClick2: function (e) {

    this.setData({
      _num: e.target.dataset.num
    })
  },
  menuClick3: function (e) {

    this.setData({
      _num: e.target.dataset.num
    })
  },
  menuClick4: function (e) {

    this.setData({
      _num: e.target.dataset.num
    })
  },
  menuClick5: function (e) {

    this.setData({
      _num: e.target.dataset.num
    })
  },
    onShareAppMessage: function () {

  }
})


