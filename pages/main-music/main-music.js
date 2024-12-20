// pages/main-music/main-music.js
import { getMusicBanner, getSongMenuList } from "../../services/music";
import { querySelect } from "../../utils/query-select";
// import throttle from "../../utils/throttle";
import { throttle } from "underscore";
import recommendStore from "../../store/recommendStore";
import rankingStore, { rankingsMap } from "../../store/rankingStore";
import playerStore from "../../store/playerStore";

const querySelectThrottle = throttle(querySelect, 200, { trailing: true });

Page({
  data: {
    searchValue: "",
    banners: [],
    bannerHeight: 0,
    recommendSongs: [],
    hotMenuList: [],
    recommendMenuList: [],
    rankingInfos: {},
    isRankingData: false,
  },
  onLoad() {
    this.fetchMusicBanner();
    recommendStore.onState("recommendSongInfo", this.handleRecommendSongs);
    recommendStore.dispatch("fetchRecommandSongsAction");
    for (const key in rankingsMap) {
      rankingStore.onState(key, this.getRankingHandler(key));
    }
    rankingStore.dispatch("fetchRankingDataAction");
    this.fetchSongMenuList();
  },

  async fetchMusicBanner() {
    const res = await getMusicBanner();
    this.setData({ banners: res.banners });
  },
  onSearchClick() {
    wx.navigateTo({
      url: "/pages/detail-search/detail-search",
    });
  },
  async onBannerImageLoad() {
    const res = await querySelectThrottle(".banner-image");
    res && this.setData({ bannerHeight: res[0].height });
  },

  fetchSongMenuList() {
    getSongMenuList().then(({ playlists }) => {
      this.setData({ hotMenuList: playlists });
    });
    getSongMenuList("华语").then(({ playlists }) => {
      this.setData({ recommendMenuList: playlists });
    });
  },
  onRecommendMoreClick() {
    wx.navigateTo({
      url: "/pages/detail-song/detail-song?type=recommend",
    });
  },

  handleRecommendSongs(value) {
    if (!value.dailySongs) return;
    const recommendSongs = value.dailySongs.slice(0, 6);
    this.setData({ recommendSongs });
  },
  // handleNewRanking(value) {
  //   const newRankingInfos = { ...this.data.rankingInfos, newRanking: value };
  //   this.setData({ rankingInfos: newRankingInfos });
  // },
  // handleOriginRanking(value) {
  //   const newRankingInfos = { ...this.data.rankingInfos, originRanking: value };
  //   this.setData({ rankingInfos: newRankingInfos });
  // },
  // handleUpRanking(value) {
  //   const newRankingInfos = { ...this.data.rankingInfos, upRanking: value };
  //   this.setData({ rankingInfos: newRankingInfos });
  // },

  getRankingHandler(ranking) {
    return (value) => {
      if (Object.keys(value).length > 0) {
        this.setData({ isRankingData: true });
      }
      const newRankingInfos = {
        ...this.data.rankingInfos,
        [ranking]: value,
      };

      this.setData({ rankingInfos: newRankingInfos });
    };
  },
  onSongItemTap(event) {
    const index = event.currentTarget.dataset.index;
    playerStore.setState("playSongList", this.data.recommendSongs);
    playerStore.setState("playSongIndex", index);
  },
  onUnload() {
    recommendStore.offState("recommendSongInfo", this.handleRecommendSongs);
    // rankingStore.offState("newRanking", this.handleNewRanking);
    // rankingStore.offState("originRanking", this.handleOriginRanking);
    // rankingStore.offState("upRanking", this.handleUpRanking);
    for (const key in rankingsMap) {
      rankingStore.offState(key, this.getRankingHandler(key));
    }
  },
});
