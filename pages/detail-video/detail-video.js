// pages/detail-video/detail-video.js
import { getMVUrl, getMVInfo, getMVRelated } from "../../services/video";
Page({
  data: {
    id: 0,
    mvUrl: "",
    mvInfo: {},
    relatedVideo: [],
  },
  onLoad(options) {
    const id = options.id;
    this.fetchMVUrl(id);
    this.fetchMVInfo(id);
    this.fetchMVRelated(id);
  },
  async fetchMVUrl(id) {
    const {
      data: { url },
    } = await getMVUrl(id);
    this.setData({ mvUrl: url });
  },
  async fetchMVInfo(id) {
    const { data } = await getMVInfo(id);
    this.setData({ mvInfo: data });
  },
  async fetchMVRelated(id) {
    const { mvs } = await getMVRelated(id);
    this.setData({ relatedVideo: mvs });
  },
});
