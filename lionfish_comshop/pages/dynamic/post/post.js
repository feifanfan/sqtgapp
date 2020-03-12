// pages/dynamic/post/post.js
var util = require('../../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    max: 300,
    currentWordNumber: 0,
    quanInfo: '',
    list: [],
    is_more: true,
    isDisable: true,
    isChecked: false,
    goodsItem: '',
    thumb_img: [], // 缩略图片地址
    gid: 0, //选中商品ID
    isGoods: false //显示商品列表
  },
  imgs: [], //原图片地址 预览图片
  orign_image: [], //提交服务器原始图片地址
  page: 1,
  token: '',
  is_share: 0,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getQuanInfo();
    this.token = wx.getStorageSync('token');
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

  /**
   * 加载圈子信息
   */
  getQuanInfo: function () {
    let that = this;
    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        controller: 'quan.get_quan_info',
        'token': that.token
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
   * 加载商品列表
   */
  getGoods: function () {
    let that = this;
    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        controller: 'quan.load_fabu_goods',
        'page': that.page
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 0) {
          if (that.page == 1 && res.data.list.length < 10){
            that.setData({ is_more: false })
          }
          let list = that.data.list;
          let new_list = res.data.list;
          that.page++;
          that.setData({
            list: [...list, ...new_list]
          })
        } else {
          that.setData({
            is_more: false
          })
        }
      }
    })
  },

  /**
   * 文本框监控
   */
  textValue: function (e) {
    var value = e.detail.value;
    var len = parseInt(value.length);

    //最多字数限制
    if (len > this.data.max) return;
    this.setData({
      currentWordNumber: len
    });
  },

  /**
   * 图片预览
   */
  previewImg: function (e) {
    let imgIndex = e.currentTarget.dataset.imgidx;
    let imgArr = this.imgs;
    wx.previewImage({
      current: imgArr[imgIndex],
      urls: imgArr,
      success: function (res) { },
      fail: function (res) {
        console.log('预览失败')
      }
    })
  },

  // 删除图片
  deleteImg: function (e) {
    var thumb_img = this.data.thumb_img;
    var index = e.currentTarget.dataset.imgidx;
    thumb_img.splice(index, 1);
    this.orign_image.splice(index, 1);
    this.imgs.splice(index, 1);
    this.setData({
      thumb_img: thumb_img
    });
  },

  /**
   * 删除选中商品
   */
  deleteGoods: function (e) {
    let gid = e.currentTarget.dataset.gid;
    this.setData({
      isDisable: true,
      isChecked: false,
      goodsItem: '',
      gid: 0
    })
  },

  /**
   * 构造链接
   */
  getUrl: function (controller) {
    let url = 'entry/wxapp/index';
    let nowPage = getCurrentPages();
    let data = '';
    if (nowPage.length) {
      nowPage = nowPage[getCurrentPages().length - 1];
      if (nowPage && nowPage.__route__) {
        data = { m: nowPage.__route__.split('/')[0], controller: controller }
      }
    }
    return url = app.util.url(url, data);
  },

  /**
   * 上传图片
   */
  chooseImg: function (e) {
    var that = this;
    var imgArr = this.data.thumb_img;
    if (imgArr.length >= 9) {
      this.setData({
        lenMore: 1
      });
      setTimeout(function () {
        that.setData({
          lenMore: 0
        });
      }, 2500);
      return false;
    }
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({title: '上传中'})
        var tempFilePaths = res.tempFilePaths;
        var new_thumb_img = that.data.thumb_img;
        for (var i = 0; i < tempFilePaths.length; i++) {
          if (imgArr.length >= 9) {
            that.setData({
              thumb_img: new_thumb_img
            });
            return false;
          } else {
            wx.uploadFile({
              url: that.getUrl('goods.doPageUpload'),
              filePath: tempFilePaths[i],
              name: 'upfile',
              formData: {
                'name': tempFilePaths[i]
              },
              header: {
                'content-type': 'multipart/form-data'
              },
              success: function (res) {
                console.log(res)
                var data = JSON.parse(res.data);
                if (data.code==0){
                  var image_thumb = data.image_thumb;
                  var orign_image = data.image_o;
                  var img = data.image;
                  that.imgs.push(img);
                  new_thumb_img.push(image_thumb);
                  that.orign_image.push(orign_image);
                  that.setData({
                    thumb_img: new_thumb_img
                  });
                } else {
                  // console.log(data.msg)
                  wx.hideLoading();
                  wx.showModal({
                    title: '提示',
                    content: data.msg,
                    showCancel: false,
                    confirmColor: '#f57'
                  });
                }
              }
            })
          }
          wx.hideLoading();
        }
      }
    });
  },

  /**
   * 复选框监控
   */
  checkboxChange: function (e) {
    let val = e.detail.value;
    this.is_share = val[0] || 0;
    console.log(this.is_share);
  },

  /**
   * 提交
   */
  formSubmit: function (e) {
    let content = e.detail.value.content;
    if (!content) {
      wx.showToast({
        title: '请输入内容',
        image: '../../../images/error.png',
        duration: 2000
      })
      return;
    }
    let that = this;
    let group_id = that.data.quanInfo.group_id;
    let goods_id = that.data.gid;
    let pics = that.orign_image;
    let is_share = this.is_share;
    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        controller: 'quan.post_group',
        'token': that.token,
        group_id,
        goods_id,
        pics,
        content,
        is_share
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(()=>{
            wx.reLaunch({
              url: '/Snailfish_shop/pages/dynamic/index',
            })
          },2000)
        } else {
          wx.showModal({
            title: '提示',
            content: '提交失败',
            showCancel: false,
            confirmText: '确定'
          })
        }
      }
    })
  },

  /**
   * 打开商品列表
   */
  chooseGoods: function () {
    this.getGoods();
    this.setData({
      isGoods: true
    })
  },

  /**
   * 关闭商品列表
   */
  closeGoods: function () {
    this.setData({
      isGoods: false
    })
  },

  /**
   * 加载更多商品
   */
  loadMore: function () {
    if (!this.data.is_more) return;
    this.getGoods();
    console.log(111)
  },

  /**
   * 选择商品
   */
  chooseGoodsItem: function (e) {
    let idx = e.currentTarget.dataset.index;
    let list = this.data.list;
    let goodsItem = list[idx];
    this.setData({
      isDisable: false,
      isGoods: false,
      goodsItem: list[idx],
      gid: goodsItem.goods_id
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  }
})