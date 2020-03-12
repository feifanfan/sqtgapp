var app = getApp();
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var status = require('../../utils/index.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    status.setNavBgColor();
    let that = this;
    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        controller: 'supply.get_apply_page'
      },
      dataType: 'json',
      success: function (res) {
        let supply_diy_name = res.data.supply_diy_name || '供应商';
        wx.setNavigationBarTitle({
          title: supply_diy_name,
        })
        that.setData({ supply_diy_name })
        if (res.data.code == 0) {
          console.log(res)
          let article = res.data.data || '';
          WxParse.wxParse('article', 'html', article, that, 5);
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    util.check_login_new().then((res) => {
      that.setData({ needAuth: !res });
    })
  },

  authModal: function () {
    if (this.data.needAuth) {
      this.setData({ showAuthModal: !this.data.showAuthModal });
      return false;
    }
    return true;
  },

  /**
   * 授权成功回调
   */
  authSuccess: function () {
    this.setData({
      needAuth: false,
      showAuthModal: false
    })
  },

  goLink: function (event) {
    if (!this.authModal()) return;
    let url = event.currentTarget.dataset.link;
    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({ url })
    } else {
      wx.navigateTo({ url })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})