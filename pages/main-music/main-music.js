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

    stateKeys: ["currentSong", "isPlaying", "currentLyricText"],
    currentSong: {},
    isPlaying: false,
    currentLyricText: "",
  },
  onLoad() {
    this.fetchMusicBanner();
    this.fetchSongMenuList();

    recommendStore.onState("recommendSongInfo", this.handleRecommendSongs);
    recommendStore.dispatch("fetchRecommandSongsAction");
    for (const key in rankingsMap) {
      rankingStore.onState(key, this.getRankingHandler(key));
    }
    rankingStore.dispatch("fetchRankingDataAction");
    playerStore.onStates(this.data.stateKeys, this.handlePlayInfos);
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
  onPlayOrPauseBtnTap() {
    playerStore.dispatch("changeMusicStatusAction");
  },
  onPlayBarTap() {
    wx.navigateTo({
      url: "/packagePlayer/pages/music-player/music-player",
    });
  },
  handlePlayInfos({ currentSong, isPlaying, currentLyricText }) {
    if (currentSong) {
      this.setData({ currentSong });
    }
    if (isPlaying !== undefined) {
      this.setData({ isPlaying });
    }
    if (currentLyricText) {
      this.setData({ currentLyricText });
    }
  },
  onUnload() {
    recommendStore.offState("recommendSongInfo", this.handleRecommendSongs);
    for (const key in rankingsMap) {
      rankingStore.offState(key, this.getRankingHandler(key));
    }
    playerStore.offStates(this.data.stateKeys, this.handlePlayInfos);
  },
});
