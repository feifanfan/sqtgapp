var app = getApp();
var status = require('../../utils/index.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    spuItem: {
      type: Object,
      value: {
        skuList: []
      },
      observer: function (t) {
        let skuList = t.skuList || [];
        let specs = 0;
        if (Object.prototype.toString.call(skuList) === '[object Array]') {
          if (skuList.length) specs = 1;
        } else {
          if (Object.keys(skuList).length) specs = 1;
        }
        this.setData({ specs, number: t.goods_total_count || 0 })
      }
    },
    idx: {
      type: Number,
      value: -1
    },
    type: {
      type: Number,
      value: 0
    },
    hasIpt: {
      type: Boolean,
      value: true
    },
    state: {
      type: Boolean,
      value: false
    },
    needAuth: {
      type: Boolean,
      value: false
    },
    soliId: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    number: 0,
    placeholdeImg: app.globalData.placeholdeImg,
    specs: 0 // 0单规格 1多规格
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleSelect: function(){
      this.triggerEvent("onSelect", this.data.spuItem);
    },
    handleDelete: function(){
      this.triggerEvent("onSelect", this.data.idx);
    },
    showTip: function(){
      let that = this;
      wx.showToast({
        title: '多规格商品只能去购物车删除',
        icon: 'none',
        complete: () => {
          that.triggerEvent("showCart");
        }
      })
    },
    openSku: function () {
      if (this.data.needAuth) {
        this.triggerEvent("authModal", true);
        return;
      }
      this.setData({
        stopClick: true,
        disabled: false
      })
      if (this.data.spuItem.skuList.length === void 0) {
        console.log('多规格')
        this.triggerEvent("openSku", {
          actId: this.data.spuItem.actId,
          skuList: this.data.spuItem.skuList,
          promotionDTO: this.data.spuItem.promotionDTO,
          is_take_vipcard: this.data.spuItem.is_take_vipcard,
          is_mb_level_buy: this.data.spuItem.is_mb_level_buy,
          allData: {
            spuName: this.data.spuItem.spuName,
            skuImage: this.data.spuItem.skuImage,
            actPrice: this.data.spuItem.actPrice,
            canBuyNum: this.data.spuItem.spuCanBuyNum,
            stock: this.data.spuItem.spuCanBuyNum,
            marketPrice: this.data.spuItem.marketPrice
          }
        });
      } else {
        this.addCart({ value: 1, type: "plus" });
      }
    },
    changeNumber: function (t) {
      var e = t.detail;
      e && this.addCart(e);
    },
    outOfMax: function (t) {
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
      let token = wx.getStorageSync('token');
      let community = wx.getStorageSync('community');
      let goods_id = this.data.spuItem.actId;
      let soli_id = this.data.soliId;
      let community_id = community.communityId;
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
            buy_type: 'soitaire',
            pin_id: 0,
            is_just_addcar: 1,
            soli_id
          },
          dataType: 'json',
          method: 'POST',
          success: function (res) {
            if (res.data.code == 3) {
              let max_quantity = res.data.max_quantity || '';
              (max_quantity > 0) && that.setData({ number: that.data.number })
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            } else if (res.data.code == 4) {
              that.setData({ needAuth: true })
              that.triggerEvent("authModal", true);
            } else if (res.data.code == 6) {
              let max_quantity = res.data.max_quantity || '';
              (max_quantity > 0) && that.setData({ number: that.data.number })
              var msg = res.data.msg;
              wx.showToast({
                title: msg,
                icon: 'none',
                duration: 2000
              })
            } else {
              // that.triggerEvent("changeCartNum", res.data.total);
              that.setData({ number: res.data.cur_count })
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
            buy_type: 'soitaire',
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
            } else if (res.data.code == 4) {
              if (that.data.needAuth) {
                that.setData({ needAuth: true })
                that.triggerEvent("authModal", true);
                return;
              }
            } else {
              // that.triggerEvent("changeCartNum", res.data.total);
              that.setData({ number: res.data.cur_count })
              status.indexListCarCount(goods_id, res.data.cur_count);
            }
          }
        })
      }
    }
  }
})
