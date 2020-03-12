var util = require('../../utils/util.js');
var app = getApp()
Page({
  data: {
    tablebar: 4,
    page: 1,
    theme_type: '',
    loadover: false,
    order_status: -1,
    no_order: 0,
    hide_tip: true,
    order: [],
    tip: '正在加载',
    is_empty: false
  },
  onLoad: function(options) {
    var that = this;
    var token = wx.getStorageSync('token');
    var order_status = options.order_status;
    var is_show_tip = options.is_show;
    let isfail = options.isfail; //支付失败

    wx.showLoading()
    that.setData({
      loadover: true
    })

    if (order_status == undefined) {
      order_status = -1;
    }
    this.setData({
      order_status: order_status,
    })

    if (is_show_tip != undefined && is_show_tip == 1) {
      wx.showToast({
        title: '支付成功',
      })
    } else if (isfail != undefined && isfail == 1) {
      wx.showToast({
        title: '支付失败',
        icon: 'none'
      })
    }
    this.getData();
  },

  onReachBottom: function() {
    if (this.data.no_order == 1) return false;
    this.data.page += 1;
    this.getData();

    this.setData({
      isHideLoadMore: false
    })

  },
  goGoods: function(event) {
    let id = event.currentTarget.dataset.type;

    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: '/Snailfish_shop/pages/goods/index?id=' + id
      })
    } else {
      wx.navigateTo({
        url: '/Snailfish_shop/pages/goods/index?id=' + id
      })
    }

  },
  getData: function() {
    this.setData({ isHideLoadMore: true })

    this.data.no_order = 1
    let that = this;
    var token = wx.getStorageSync('token');

    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        controller: 'order.orderlist',
        token: token,
        page: that.data.page,
        order_status: that.data.order_status
      },
      dataType: 'json',
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          let rushList = that.data.order.concat(res.data.data);
          that.setData({
            order: rushList,
            hide_tip: true,
            'no_order': 0
          });
        } else {
          if(that.data.page == 1 && that.data.order.length <= 0) that.setData({is_empty: true});
          that.setData({
            isHideLoadMore: true
          })
          return false;
        }
      }
    })

  },
  expressOrder: function(event) {
    let order_id = event.currentTarget.dataset.type;

    wx.navigateTo({
      url: "/Snailfish_shop/pages/order/goods_express?id=" + order_id
    })
  },
  goLink2: function(event) {
    let link = event.currentTarget.dataset.link;

    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: link
      })
    } else {
      wx.navigateTo({
        url: link
      })
    }
  },
  goLink: function(event) {
    let link = event.currentTarget.dataset.link;

    wx.reLaunch({
      url: link
    })
  },
  goOrder: function(event) {
    let id = event.currentTarget.dataset.type;
    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: '/lionfish_comshop/pages/order/order?id=' + id
      })
    } else {
      wx.navigateTo({
        url: '/lionfish_comshop/pages/order/order?id=' + id
      })
    }

  },
  receivOrder: function(event) {
    let id = event.currentTarget.dataset.type;
    let delivery = event.currentTarget.dataset.delivery;
    var token = wx.getStorageSync('token');
    let content = "确认收到";
    if (delivery == "pickup") content = "确认提货";
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认收到',
      confirmColor: '#F75451',
      success(res) {
        if (res.confirm) {
          app.util.request({
            'url': 'entry/wxapp/index',
            'data': {
              controller: 'order.receive_order',
              token: token,
              order_id: id
            },
            dataType: 'json',
            success: function(res) {
              if (res.data.code == 0) {
                wx.showToast({
                  title: '收货成功',
                  icon: 'success',
                  duration: 1000
                })
                that.order(that.data.order_status);
              }
            }
          })
        }
      }
    })

  },
  cancelOrder: function(event) {
    let id = event.currentTarget.dataset.type;
    var token = wx.getStorageSync('token');
    var that = this;
    wx.showModal({
      title: '取消支付',
      content: '好不容易挑出来，确定要取消吗？',
      confirmColor: '#F75451',
      success(res) {
        if (res.confirm) {
          app.util.request({
            'url': 'entry/wxapp/index',
            'data': {
              controller: 'order.cancel_order',
              token: token,
              order_id: id
            },
            dataType: 'json',
            success: function (res) {
              wx.showToast({
                title: '取消成功',
                icon: 'success',
                duration: 1000
              })
              that.order(that.data.order_status);
            }
          })
        }
      }
    })
  },
  getOrder: function(event) {
    this.setData({ is_empty: false })
    wx.showLoading();
    let starus = event.currentTarget.dataset.type;
    this.order(starus);
  },
  order: function(starus) {
    var that = this;
    var token = wx.getStorageSync('token');
    that.setData({
      order_status: starus,
      order: [],
      no_order: 0,
      page: 1
    })
    this.getData();
  },
  guess_goods: function() {
    var that = this;

    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        controller: 'index.load_index_pintuan',
        store_id: 1,
        per_page: 8,
        is_index_show: 1,
        orderby: 'rand',
        'page': 1
      },
      dataType: 'json',
      success: function(res) {
        if (res.data.data && res.data.data.length > 0) {
          that.setData({
            showguess: false,
            guessdata: res.data.data
          });
        }
      }
    })


  },
  orderComment: function(event) {
    var that = this;
    var token = wx.getStorageSync('token');
    let order_id = event.currentTarget.dataset.type;

    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: '/Snailfish_shop/pages/order/comment?id=' + order_id
      })
    } else {
      wx.navigateTo({
        url: '/Snailfish_shop/pages/order/comment?id=' + order_id
      })
    }

  },
  orderPay: function(event) {
    var that = this;
    var token = wx.getStorageSync('token');
    let id = event.currentTarget.dataset.type;

    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        controller: 'car.wxpay',
        'token': token,
        "order_id": id
      },
      dataType: 'json',
      method: 'POST',
      success: function(res) {
        if(res.data.code ==0)
        {
          var is_pin = res.data.is_pin;
          wx.requestPayment({
            appId: res.data.appId,
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: res.data.signType,
            paySign: res.data.paySign,
            success: function (wxres) {
              wx.redirectTo({
                url: '/lionfish_comshop/pages/order/order?id=' + id + '&is_show=1'
              })
            },
            fail: function (res) {
              console.log(res);
            }
          })
        } else if (res.data.code == 2) {
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }
    })

  },
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    this.setData({
      is_empty: false,
      page: 1,
      order: []
    })
    wx.showLoading();
    this.getData();
    wx.stopPullDownRefresh();
  }
})