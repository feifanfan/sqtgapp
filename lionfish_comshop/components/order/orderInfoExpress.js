Component({
  properties: {
    order: {
      type: Object
    },
    showNickname: {
      type: Boolean,
      default: false
    },
    hidePhone: {
      type: Number,
      default: 0
    },
    groupInfo: {
      type: Object,
      default: {
        group_name: '社区',
        owner_name: '团长',
        delivery_ziti_name: '到点自提',
        delivery_tuanzshipping_name: '团长配送',
        delivery_express_name: '快递配送'
      }
    }
  },
  data: {
    isCalling: false
  },
  methods: {
    callTelphone: function (t) {
      var e = this;
      this.data.isCalling || (this.data.isCalling = true, wx.makePhoneCall({
        phoneNumber: t.currentTarget.dataset.phone,
        complete: function () {
          e.data.isCalling = false;
        }
      }));
    },
    goExpress: function(){
      let order_id = this.data.order.order_info.order_id;
      wx.navigateTo({
        url: '/lionfish_comshop/pages/order/goods_express?id=' + order_id,
      })
    }
  }
});