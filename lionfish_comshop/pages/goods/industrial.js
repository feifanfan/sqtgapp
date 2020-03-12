var app = getApp();

Page({
  data: {
    goods_industrial: []
  },

  onLoad: function (options) {
    wx.showLoading();
    this.getData();
  },

  getData(){
    let that = this;
    app.util.request({
      url: 'entry/wxapp/index',
      data: {
        controller: 'goods.get_instructions'
      },
      dataType: 'json',
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          that.setData({
            goods_industrial: res.data.data.goods_industrial || []
          })
        }
      }
    })
  }
})