var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let order_id = options.order_id || 0;
    if (order_id == undefined || !order_id){
      wx.redirectTo({
        url: '/lionfish_comshop/pages/index/index',
      })
    }
    wx.showLoading();
    this.getData(order_id);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 获取数据
   */
  getData: function (order_id) {
    let that = this;
    app.util.request({
      'url': 'entry/wxapp/index',
      'data': {
        controller: 'order.order_head_info',
        id: order_id,
        is_share: 1
      },
      dataType: 'json',
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        if(res.data.code == 0){
          let order = res.data.data;
          let order_info = order.order_info || '';
          if (order_info){
            let { shipping_name, shipping_address } = order_info;
            shipping_name = that.formatData(shipping_name, 2);
            shipping_address = that.formatData(shipping_address, 6);
            order.order_info.shipping_name = shipping_name;
            order.order_info.shipping_address = shipping_address;
          }

          that.setData({ order })
        }
      }
    })
  },

  /**
   * 去商品详情
   */
  goGoodsDetails: function(e){
    let id = e.currentTarget.dataset.id || 0;
    let head_id = this.data.order.order_info.head_id || '';
    wx.navigateTo({
      url: '/lionfish_comshop/pages/goods/goodsDetail?id=' + id + '&community_id=' + head_id,
    })
  },

  formatData: function(str, len) {
    len = str.length > 3 ? len : 1;
    if (str.length > len) {
      return str.substr(0, str.length - len) + new Array(len+1).join('*');
    } else {
      return str;
    }
  }
})