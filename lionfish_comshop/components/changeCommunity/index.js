// lionfish_comshop/components/changeCommunity/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    changeCommunity: {
      type: Object,
      value: {}
    },
    community: {
      type: Object,
      value: {}
    },
    visible: {
      type: Boolean,
      value: false
    },
    canChange: {
      type: Boolean,
      value: true
    },
    groupInfo: {
      type: Object,
      value: {
        group_name: '社区',
        owner_name: '团长'
      }
    },
    cancelFn: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchCommunity: function(e) {
      let type = e.currentTarget.dataset.type;
      if (type == 0 || !this.data.canChange){
        this.closeModal();
      } else {
        this.data.canChange && this.triggerEvent('changeComunity');
      }
    },
    closeModal: function() {
      this.data.cancelFn && this.triggerEvent('noChange');
      this.setData({ visible: false })
    }
  }
})
