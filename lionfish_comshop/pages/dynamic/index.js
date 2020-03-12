// pages/dynamic/index.js
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tablebar: 5,
    theme_type: '',
    loadover: false,
    is_more: true,
    token: '',
    list: [],
    can_post: false,
    images: {}
  },
  down_post_id: 0, //最下面一篇帖子id
  up_post_id: 0, //最上面一篇帖子id
  post_id: 0, // 最后帖子id
  up_down: 1, // 1上拉加载，2下拉刷新加载

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.showLoading();
    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/get_cur_theme_type',
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            theme_type: res.data.type,
            loadover: true
          })
        }
        wx.hideLoading();
      }
    })
    let token = wx.getStorageSync('token');
    that.getQuanInfo(token);
    that.getAuth(token);
    that.setData({
      token: token
    });
    that.loadData();
  },

  /**
  * 获取圈子发布
  */
  getAuth: function (token) {
    let that = this;
    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        controller: 'quan.get_quan_authority',
        'token': token
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            can_post: true
          })
        }
      }
    })
  },

  /**
  * 加载圈子信息
  */
  getQuanInfo: function (token) {
    let that = this;
    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        controller: 'quan.get_quan_info',
        'token': token
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            quanInfo: res.data.data
          })
        }
      }
    })
  },

  /**
   * 加载圈子
   */
  loadData: function () {
    let that = this;
    if (that.up_down == 1) {
      that.post_id = that.down_post_id;
    } else {
      that.post_id = that.up_post_id;
    }
    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        controller: 'quan.load',
        'token': that.data.token,
        'post_id': that.post_id,
        'up_down': that.up_down
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.down_post_id = res.data.down_post_id;
          that.up_post_id = res.data.up_post_id;
          let list = res.data.list;
          let oldlist = that.data.list;

          if (list.length<10){
            that.setData({ is_more: false })
          }
          if( that.up_down == 1 ) {
            that.setData({
              list: [...oldlist, ...list]
            })
          } else {
            that.setData({
              list: list
            })
          }
        } else {
          that.setData({
            is_more: false
          })
        }
      }
    })
  },

  /**
   * 图片预览
   */
  previewImg: function (e) {
    let imgIndex = e.currentTarget.dataset.imgidx;
    let listIndex = e.currentTarget.dataset.listidx;
    let imgArr = this.data.list[listIndex].content;
    wx.previewImage({
      current: imgArr[imgIndex],
      urls: imgArr,
      success: function (res) { },
      fail: function (res) {
        console.log('预览失败')
      }
    })
  },

  // 跳转发布
  goPost: function () {
    wx.navigateTo({
      url: '/Snailfish_shop/pages/dynamic/post/post',
    })
  },

  /**
   * 跳转商品
   */
  gotoGoods: function (e) {
    let id = e.currentTarget.dataset.gid;
    wx.navigateTo({
      url: '/Snailfish_shop/pages/goods/index?id='+id,
    })
  },

  /**
   * 图片信息获取
   */
  imageLoad: function (e) {
    var $width = e.detail.width,
      $height = e.detail.height,
      ratio = $width / $height;
    var viewWidth,viewHeight;
    if (ratio < 0.75){
      viewHeight = 400, viewWidth = 400*ratio;
    } else {
      viewWidth = 300,viewHeight = 300 / ratio;
    }
    var image = this.data.images;
    image[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight
    }
    this.setData({
      images: image
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  goLink: function (event) {
    let link = event.currentTarget.dataset.link;
    wx.reLaunch({
      url: link
    })
  },

  // 下拉刷新
  pullRefresh: function () {
    let that = this;
    that.setData({
      is_more: true
    })
    this.up_down = 2;
    this.loadData();
    console.log('下拉刷新')
  },

  // 加载更多
  loadMore: function () {
    this.up_down = 1;
    if (this.data.is_more) this.loadData();
    console.log('加载更多')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var share_title = this.data.quan_share;
    return {
      title: share_title,
      path: 'Snailfish_shop/pages/dynamic/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})