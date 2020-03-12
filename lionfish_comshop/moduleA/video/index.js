var app = getApp();
var util = require('../../utils/util.js');
var status = require('../../utils/index.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rushList: [],
    loadText: "加载中...",
    noData: 0,
    loadMore: true,
  },
  pageNum: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const that = this;
    util.check_login_new().then((res) => {
      let needAuth = !res;
      that.setData({ needAuth })
      if (res) {
        (0, status.cartNum)('', true).then((res) => {
          res.code == 0 && that.setData({
            cartNum: res.data
          })
        });
      }
    })
  },

  /**
   * 获取商品列表
   */
  getData: function() {
    var token = wx.getStorageSync('token');
    var that = this;
    var cur_community = wx.getStorageSync('community');
    wx.showLoading();

    app.util.request({
      url: 'entry/wxapp/index',
      data: {
        controller: 'index.load_gps_goodslist',
        token: token,
        pageNum: that.pageNum,
        head_id: cur_community.communityId,
        per_page: 12,
        is_video: 1
      },
      dataType: 'json',
      success: function(res) {
        if (res.data.code == 0) {
          let rushList = '';
          let h = {};
          let rdata = res.data;
          if (rdata.list.length < 12) h.noMore = true;
          let oldRushList = that.data.rushList;
          rushList = oldRushList.concat(rdata.list);
          that.pageNum++;
          that.setData({
            rushList: rushList,
            tip: '',
            ...h
          });
        } else if (res.data.code == 1) {
          if (that.pageNum == 1) that.setData({ noData: 1 })
          that.setData({ loadMore: false, noMore: false, loadText: "没有更多记录了~" })
        } else if (res.data.code == 2) {
          //no login
          that.setData({
            needAuth: true
          })
        }
      },
      complete: function() {
        wx.hideLoading();
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.loadMore) return false;
    this.getData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    
  }
})