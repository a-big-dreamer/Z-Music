// components/nav-bar/nav-bar.js
import { navBarHeight } from "../../constant/index";

const app = getApp();
Component({
  options: {
    multipleSlots: true,
    navBarHeight: 0,
  },
  data: {
    statusHeight: 20,
  },
  properties: {
    title: {
      type: String,
      value: "默认标题",
    },
  },
  lifetimes: {
    attached() {
      this.setData({ statusHeight: app.globalData.statusHeight, navBarHeight });
    },
  },
});
