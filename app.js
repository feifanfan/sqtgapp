var util = require('we7/resource/js/util.js');
var timeQueue = require('lionfish_comshop/utils/timeQueue');
require('lionfish_comshop/utils//mixins.js');

App({
  onLaunch: function (res) {
    wx.hideTabBar();
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    this.globalData.userInfo = userInfo;
    var historyCommunity = wx.getStorageSync("historyCommunity") || [];
    var currentCommunity = wx.getStorageSync("community");
    this.globalData.hasDefaultCommunity = !!currentCommunity;
    this.globalData.community = currentCommunity;
    this.globalData.systemInfo = wx.getSystemInfoSync();
    var model = this.globalData.systemInfo.model;
    this.globalData.isIpx = model.indexOf("iPhone X") > -1 || model.indexOf("unknown<iPhone") > -1;
    this.globalData.timer = new timeQueue.default();
  },
  onShow: function (res) {
    this.getUpdate();
  },
  onHide: function () {
  },
  //加载微擎工具类
  util: util,
  //导航菜单，微擎将会自己实现一个导航菜单，结构与小程序导航菜单相同
  //用户信息，sessionid是用户是否登录的凭证
  userInfo: {
    sessionid: null,
  },
  globalData: {
    systemInfo: {},
    isIpx: false,
    userInfo: {},
    canGetGPS: true,
    city: {},
    community: {},
    location: {},
    hasDefaultCommunity: true,
    historyCommunity: [],
    changedCommunity: false,
    disUserInfo: {},
    changeCity: "",
    timer: 0,
    formIds: [],
    community_id: '',
    placeholdeImg: '',
    cartNum: 0,
    cartNumStamp: 0,
    common_header_backgroundimage: '',
    appLoadStatus: 1, // 1 正常 0 未登录 2 未选择社区 
    goodsListCarCount: [],
    typeCateId: 0,
    navBackUrl: '',
    isblack: 0
  },
  getUpdate: function(){
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        res.hasUpdate && (updateManager.onUpdateReady(function () {
          wx.showModal({
            title: "更新提示",
            content: "新版本已经准备好，是否马上重启小程序？",
            success: function (t) {
              t.confirm && updateManager.applyUpdate();
            }
          });
        }), updateManager.onUpdateFailed(function () {
          wx.showModal({
            title: "已经有新版本了哟~",
            content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
          });
        }));
      });
    } else wx.showModal({
      title: "提示",
      content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
    });
  },
  siteInfo: require('siteinfo.js')
});