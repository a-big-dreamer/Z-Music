// pages/detail-menu/detail-menu.js
import { getSongMenuTag, getSongMenuList } from "../../services/music";
Page({
  data: {
    songMenus: [],
  },
  onLoad() {
    this.fetchAllMenuList();
  },
  async fetchAllMenuList() {
    const { tags } = await getSongMenuTag();
    let allPromises = [];
    tags.forEach((tag) => {
      const promise = getSongMenuList(tag.name);
      allPromises.push(promise);
    });
    Promise.all(allPromises).then((res) => {
      this.setData({ songMenus: res });
    });
  },
});
