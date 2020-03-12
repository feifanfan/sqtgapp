// lionfish_comshop/components/orderStatus/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status: {
      type: String,
      default: "",
      observer: function (t, e, s) {
        var a = this.statusChange(t);
        this.setData({
          showStatus: a
        });
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showStatus: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    statusChange: function (t) {
      switch (t) {
        case "0":
          return "待付款";

        case "1":
          return "待提货";

        case "2":
          return "已完成";

        case "3":
          return "已取消";

        case "4":
          return "待配送";

        default:
          return "";
      }
    }
  }
})
