var app = getApp();
var util = require('../../utils/util.js');
import WxValidate from '../../utils/WxValidate.js';
var u = true;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgGroup: [],
    otherImgGroup: [],
    imgMax: 4,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initValidate(); //验证规则函数
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  //资料验证函数
  initValidate() {
    const rules = {
      head_name: {
        required: true,
        minlength: 1
      },
      head_mobile: {
        required: true,
        tel: true
      }
    }
    const messages = {
      head_name: {
        required: '请填写店铺名称',
        minlength: '请输入正确的店铺名称'
      },
      head_mobile: {
        required: '请填写手机号',
        tel: '请填写正确的手机号'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },

  /**
   * 输入框获得焦点
   */
  iptFocus: function(t) {
    let name = t.currentTarget.dataset.name;
    this.setData({
      currentFocus: name
    })
  },

  /**
   * 输入框失去焦点
   */
  iptBlur: function() {
    this.setData({
      currentFocus: ''
    })
  },

  chooseImage: function () {
    u = false;
  },

  changeImg: function (e) {
    u = e.detail.len === e.detail.value.length;
    this.setData({
      imgGroup: e.detail.value
    });
  },

  chooseImageOther: function () {
    u = false;
  },

  changeImgOther: function (e) {
    u = e.detail.len === e.detail.value.length;
    this.setData({
      otherImgGroup: e.detail.value
    });
  },

  //报错 
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },

  /**
   * 资料修改表单提交
   */
  formSubmit(e) {
    this.setData({ btnLoading: true })
    const params = e.detail.value
    //校验表单
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0];
      this.showModal(error);
      this.setData({ btnLoading: false })
      return false;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})