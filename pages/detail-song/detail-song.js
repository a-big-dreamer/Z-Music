// pages/detail-song/detail-song.js
import rankingStore from "../../store/rankingStore";
import recommendStore from "../../store/recommendStore";
import { getPlaylistDetail } from "../../services/music";
import playerStore from "../../store/playerStore";

Page({
  data: {
    songs: [],
    type: "",
    key: "",
    songInfo: {},
  },
  // onLoad() {
  //   recommendStore.onState("recommendSongs", this.handleRecommendSongs);
  // },
  // handleRecommendSongs(value) {
  //   this.setData({ songs: value });
  // },
  // onUnload() {
  //   recommendStore.offState("recommendSongs", this.handleRecommendSongs);
  // },

  onLoad(options) {
    const { type } = options;
    this.setData({ type });
    if (type === "ranking") {
      const key = options.key;
      this.data.key = key;
      rankingStore.onState(key, this.handleRanking);
    } else if (type === "recommend") {
      recommendStore.onState("recommendSongInfo", this.handleRanking);
    } else if (type === "menu") {
      const id = options.id;
      this.fetchMenuSongInfo(id);
    }
  },
  handleRanking(value) {
    if (this.data.type === "recommend") {
      wx.setNavigationBarTitle({
        title: "推荐歌曲",
      });
      value.name = "推荐歌曲";
    }
    this.setData({ songInfo: value });
    wx.setNavigationBarTitle({
      title: value.name,
    });
  },

  async fetchMenuSongInfo(id) {
    const data = await getPlaylistDetail(id);
    this.setData({ songInfo: data.playlist });
  },
  onSongItemTap() {
    const { songInfo } = this.data;
    playerStore.setState(
      "playSongList",
      songInfo.tracks ? songInfo.tracks : songInfo.dailySongs
    );
  },
  onUnload() {
    if (this.data.type === "ranking") {
      rankingStore.offState(this.data.key, this.handleRanking);
    } else if (this.data.type === "recommend") {
      recommendStore.offState("recommendSongInfo", this.handleRanking);
    }
  },
});
