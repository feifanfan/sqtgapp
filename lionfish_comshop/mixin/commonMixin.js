module.exports = {
  data: {
    visible: false,
    stopClick: false
  },

  authModal: function () {
    if (this.data.needAuth) {
      this.setData({
        showAuthModal: !this.data.showAuthModal
      });
      return false;
    }
    return true;
  }
}