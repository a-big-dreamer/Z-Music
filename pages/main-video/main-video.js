// pages/main-video/main-video.js
import { getTopMv } from "../../services/video";
Page({
  data: {
    videoList: [],
    offset: 0,
    hasMore: true,
  },
  onLoad() {
    this.fetchTopMv();
  },
  async fetchTopMv() {
    const { data, hasMore } = await getTopMv(this.data.offset);
    this.setData({ videoList: [...this.data.videoList, ...data] });
    this.data.offset = this.data.videoList.length;
    this.data.hasMore = hasMore;
  },
  onReachBottom() {
    if (!this.data.hasMore) return;
    this.fetchTopMv();
  },
  async onPullDownRefresh() {
    this.data.offset = 0;
    this.data.videoList = [];
    this.data.hasMore = true;
    await this.fetchTopMv();
    wx.stopPullDownRefresh();
  }
});
