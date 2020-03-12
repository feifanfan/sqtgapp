// lionfish_comshop/pages/user/articleProtocol.js
var util = require('../../utils/util.js');
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.showLoading();
    this.get_article();
  },

  /**
   * 获取列表
   */
  get_article: function () {
    let that = this;
    app.util.request({
      url: 'entry/wxapp/index',
      data: {
        controller: 'group.pintuan_slides'
      },
      dataType: 'json',
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          let { pintuan_publish } = res.data;
          WxParse.wxParse('article', 'html', pintuan_publish, that, 15);
        }
      }
    })
  }
})