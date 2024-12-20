// app.js
import {navBarHeight} from './constant/index'

App({
  globalData: {
    screenWidth: 375,
    screenHeight: 667,
    statusHeight: 20,
    contentHeight: 500,
  },
  onLaunch() {
    const { screenWidth, screenHeight, statusBarHeight } = wx.getWindowInfo();
    this.globalData.screenWidth = screenWidth;
    this.globalData.screenHeight = screenHeight;
    this.globalData.statusHeight = statusBarHeight;
    this.globalData.contentHeight = screenHeight - statusBarHeight - navBarHeight;
  },
});
