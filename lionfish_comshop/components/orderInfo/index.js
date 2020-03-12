// lionfish_comshop/components/orderInfo/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderInfo: {
      type: Object,
      observer: function (t) {
        let real_total = t.real_total * 1;
        let total = t.total * 1;
        var goodsTotal = parseFloat(real_total) - parseFloat(t.shipping_fare);
        
        let disAmount = parseFloat(t.voucher_credit) + parseFloat(t.fullreduction_money);
        disAmount = (disAmount > goodsTotal) ? goodsTotal : disAmount;
        this.setData({
          goodsTotal: goodsTotal.toFixed(2),
          disAmount: disAmount.toFixed(2)
        });
      }
    },
    order_goods_list: {
      type: Array,
      observer: function (t) {
        let levelAmount = 0;
        if(t&&t.length) {
          t.forEach(function(item){
            let total = item.total * 1;
            let old_total = item.old_total * 1;
            if (item.is_level_buy==1 || item.is_vipcard_buy==1) {
              levelAmount += old_total - total;
            }
          })
        }
        this.setData({
          levelAmount: levelAmount.toFixed(2)
        });
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    disAmount: 0,
    goodsTotal: 0
  }
})
