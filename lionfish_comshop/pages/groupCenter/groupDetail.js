// lionfish_comshop/pages/groupCenter/groupDetail.js
var app = getApp();
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.groupOrderId
    });

    if (util.check_login()) {
      this.setData({ needAuth: false })
    } else {
      this.setData({ needAuth: true });
    }
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    this.getData();
  },

  authSuccess: function () {
    let that = this;
    this.setData({
      needAuth: false
    }, ()=>{
      that.getData();
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 获取数据
   */
  getData: function(){
    var that = this;
    var token = wx.getStorageSync('token');

    if (this.data.orderId){
      app.util.request({
        'url': 'entry/wxapp/index',
        'data': {
          controller: 'order.order_head_info',
          token: token,
          id: this.data.orderId
        },
        dataType: 'json',
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 0) {
            let order = res.data.data;
            let commision = 0;
            order && order.order_goods_list && order.order_goods_list.forEach(function (item) {
              commision += parseFloat(item.commision);
            })
            that.setData({
              order: res.data.data,
              commision: commision.toFixed(2)
            });
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '订单不存在',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '/lionfish_comshop/pages/groupCenter/groupList',
            })
          }
        }
      })
    }
  },

  /**
   * 状态判断
   */
  swithState: function (e) {
    switch (e) {
      case "-1":
        break;
      case "0":
        this.setData({
          orderStatusName: "待成团"
        });
        break;
      case "1":
        this.setData({
          orderStatusName: "待配送"
        });
        break;
      case "2":
        this.setData({
          orderStatusName: "待收货"
        });
        break;
      case "3":
        this.setData({
          orderStatusName: "待提货"
        });
        break;
      case "4":
        this.setData({
          orderStatusName: "已完成"
        });
        break;
      case "6":
        this.setData({
          orderStatusName: "待采购"
        });
    }
  }
})