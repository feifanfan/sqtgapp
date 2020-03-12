// lionfish_comshop/pages/user/protocol.js
var util = require('../../utils/util.js');
var status = require('../../utils/index.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ''
  },
  token: '',

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    status.setNavBgColor();
    var token = wx.getStorageSync('token');
    this.token = token;
    wx.showLoading({ title: '加载中' });
    this.get_list();
  },

  /**
   * 获取列表
   */
  get_list: function(){
    let that = this;
    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        controller: 'article.get_article_list',
        'token': this.token
      },
      dataType: 'json',
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          var list = res.data.data;
          that.setData({
            list
          })
        }
      }
    })
  }
})