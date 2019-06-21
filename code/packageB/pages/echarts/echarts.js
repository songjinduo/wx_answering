import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

//成功和失败的次数
var suc;
var wro;

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    title: {
      text: '您的答题情况',
      subtext: '来源：毛概答题',
      x: 'center'
    },
    
    series: [
      {
        name: '题目',
        type: 'pie',
        radius: ['40%', '55%'],
/*
        labelLine: {
          normal: {
            length: 20,
            length2: 70,
            lineStyle: {
              color: '#333'
            }
          }
        },*/

        label: {
          normal: {
            position:'inner',
            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
            borderWidth: 20,
            borderRadius: 4,
            padding: [0, -70],
            rich: {
              a: {
                color: "#ffbb00",
                fontSize: 12,
                lineHeight: 20
              },
              b: {
                fontSize: 12,
                lineHeight: 20,
                color: '#ffff00'
              }
            }
          }
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '30',
              fontWeight: 'bold'
            }
        },
        data: [
          { value: suc, name: '答题正确次数' },
          { value: wro, name: '答题错误次数' },
        ]
      }
    ]
  };

  chart.setOption(option);
  return chart;
}

Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {
    },
    background: '/pages/image/pro.png',
  },

  onReady() {
  },
  
  onLoad(){
    var that = this;
    //console.log(that);
    let base64 = wx.getFileSystemManager().readFileSync(this.data.background, 'base64');
    that.setData({
      'background': 'data:image/png;base64,' + base64
    });
  },
  onShow() {
    wro = wx.getStorageSync("wro")
    suc = wx.getStorageSync("suc")
    if (suc == "") {
      suc = 0
      wx.setStorage({
        key: 'suc',
        data: suc,
      })
    }
    if (wro == "") {
      wro = 0
      wx.setStorage({
        key: 'wro',
        data: wro,
      })
    }

  },

  echartInit(e) {
    initChart(e.detail.canvas, e.detail.width, e.detail.height);
  }
});
