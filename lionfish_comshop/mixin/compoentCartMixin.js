var a = require("../utils/public");
var app = getApp();
var status = require('../utils/index.js');

module.exports = {
  data: {
    visible: false,
    stopClick: false,
    updateCart: 0
  },

  authModal: function (t=false) {
    t.detail && this.setData({needAuth: true});
    if (this.data.needAuth) {
      this.setData({ showAuthModal: !this.data.showAuthModal });
      return false;
    }
    return true;
  },

  openSku: function (t) {
    if (!this.authModal()) return;
    var that = this,
      e = t.detail;
    var goods_id = e.actId;
    var options = e.skuList;
    that.setData({
      addCar_goodsid: goods_id
    })

    let list = options.list || [];
    let arr = [];
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        let sku = list[i]['option_value'][0];
        let temp = {
          name: sku['name'],
          id: sku['option_value_id'],
          index: i,
          idx: 0
        };
        arr.push(temp);
      }
      //把单价剔除出来begin

      var id = '';
      for (let i = 0; i < arr.length; i++) {
        if (i == arr.length - 1) {
          id = id + arr[i]['id'];
        } else {
          id = id + arr[i]['id'] + "_";
        }
      }
      var cur_sku_arr = options.sku_mu_list[id];
      that.setData({
        sku: arr,
        sku_val: 1,
        cur_sku_arr: cur_sku_arr,
        skuList: e.skuList,
        visible: true,
        showSku: true
      });
    } else {
      let goodsInfo = e.skuList;
      that.setData({
        sku: [],
        sku_val: 1,
        skuList: [],
        cur_sku_arr: goodsInfo
      })
      let formIds = {
        detail: {
          formId: ""
        }
      };
      formIds.detail.formId = "the formId is a mock one";
      that.gocarfrom(formIds);
    }
  },

  /**
   * 确认加入购物车
   */
  gocarfrom: function (e) {
    var that = this;
    var is_just_addcar = 1;
    wx.showLoading();
    a.collectFormIds(e.detail.formId);
    that.goOrder();
  },

  goOrder: function () {
    let that = this;
    let tdata = that.data;
    if (tdata.can_car) {
      tdata.can_car = false;
    }
    var token = wx.getStorageSync('token');
    var community = wx.getStorageSync('community');
    var community_id = community.communityId;

    var goods_id = tdata.addCar_goodsid;
    var quantity = tdata.sku_val;
    var cur_sku_arr = tdata.cur_sku_arr;

    var sku_str = '';
    var is_just_addcar = 1;
    let updateCart = that.data.updateCart || 0;

    if (cur_sku_arr && cur_sku_arr.option_item_ids) {
      sku_str = cur_sku_arr.option_item_ids;
    }

    // 接龙
    let soli_info = this.data.soli_info || '';
    let soli_id = (soli_info && soli_info.id) || '';
    let buy_type = this.data.buy_type || 'dan';

    //addCar_goodsid: goods_id
    app.util.request({
      'url': 'entry/wxapp/user',
      'data': {
        controller: 'car.add',
        token,
        goods_id,
        community_id,
        quantity,
        sku_str,
        buy_type,
        pin_id: 0,
        is_just_addcar,
        soli_id
      },
      dataType: 'json',
      method: 'POST',
      success: function (res) {
        if (res.data.code == 3) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        } else if (res.data.code == 4) {
          wx.showToast({
            title: '您未登录',
            duration: 2000,
            success: () => {
              that.setData({
                needAuth: true
              })
            }
          })
        } else if (res.data.code == 6) {
          let max_quantity = res.data.max_quantity || '';
          (max_quantity > 0) && that.setData({
            sku_val: max_quantity
          })
          var msg = res.data.msg;
          wx.showToast({
            title: msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          if (is_just_addcar == 1) {
            that.closeSku();
            status.indexListCarCount(goods_id, res.data.cur_count);
            that.setData({
              cartNum: res.data.total || 0,
              updateCart: updateCart+1
            })
            wx.showToast({
              title: "已加入购物车",
              image: "../../images/addShopCart.png"
            })
          } else {
            var pages_all = getCurrentPages();
            if (pages_all.length > 3) {
              wx.redirectTo({
                url: '/lionfish_comshop/pages/buy/index?type=' + tdata.order.buy_type
              })
            } else {
              wx.navigateTo({
                url: '/lionfish_comshop/pages/buy/index?type=' + tdata.order.buy_type
              })
            }
          }
        }
      }
    })

  },

  changeCartNum(e) {
    let cartNum = e.detail || 0;
    cartNum && this.setData({ cartNum })
  },

  /**
   * 关闭购物车选项卡
   */
  closeSku: function () {
    this.setData({
      visible: false,
      stopClick: false
    });
  },

  changeNumber: function (t) {
    var e = t.detail;
    e && this.addCart(e);
  },

  outOfMax: function (t) {
    console.log(t)
    var e = t.detail, canBuyNum = this.data.spuItem.spuCanBuyNum;
    if (this.data.number >= canBuyNum) {
      wx.showToast({
        title: "不能购买更多啦",
        icon: "none"
      })
    }
  },

  addCart: function (t) {
    // {value: 2, type: "plus/minus"}
    let idx = t.idx;
    let list = this.data.list;
    var token = wx.getStorageSync('token');
    var community = wx.getStorageSync('community');
    var goods_id = list[idx].actId;
    var community_id = community.communityId;

    // 接龙
    let soli_info = this.data.soli_info || '';
    let soli_id = (soli_info && soli_info.id) || '';
    let buy_type = this.data.buy_type || 'dan';

    let that = this;
    if (t.type == 'plus') {
      app.util.request({
        url: 'entry/wxapp/user',
        data: {
          controller: 'car.add',
          token: token,
          goods_id: goods_id,
          community_id: community_id,
          quantity: 1,
          sku_str: '',
          buy_type,
          pin_id: 0,
          is_just_addcar: 1,
          soli_id
        },
        dataType: 'json',
        method: 'POST',
        success: function (res) {
          if (res.data.code == 3) {
            let max_quantity = res.data.max_quantity || '';
            list[idx].car_count = max_quantity;
            (max_quantity > 0) && that.setData({ list })
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          } else if (res.data.code == 6) {
            let max_quantity = res.data.max_quantity || '';
            list[idx].car_count = max_quantity;
            (max_quantity > 0) && that.setData({ cartNum: res.data.total || 0, list })
            var msg = res.data.msg;
            wx.showToast({
              title: msg,
              icon: 'none',
              duration: 2000
            })
          } else {
            list[idx].car_count = res.data.cur_count;
            that.setData({ cartNum: res.data.total || 0, list })
            wx.showToast({
              title: "已加入购物车",
              image: "../../images/addShopCart.png"
            })
            status.indexListCarCount(goods_id, res.data.cur_count);
          }
        }
      })
    } else {
      app.util.request({
        url: 'entry/wxapp/user',
        data: {
          controller: 'car.reduce_car_goods',
          token: token,
          goods_id: goods_id,
          community_id: community_id,
          quantity: 1,
          sku_str: '',
          buy_type,
          pin_id: 0,
          is_just_addcar: 1,
          soli_id
        },
        dataType: 'json',
        method: 'POST',
        success: function (res) {
          if (res.data.code == 3) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          } else {
            list[idx].car_count = res.data.cur_count;
            that.setData({ list, cartNum: res.data.total || 0 })
            status.indexListCarCount(goods_id, res.data.cur_count);
          }
        }
      })
    }
  }

}