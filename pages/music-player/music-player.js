// pages/music-player/music-player.js
import { throttle } from "underscore";
import playerStore, { audioContext } from "../../store/playerStore";

const app = getApp();
const query = wx.createSelectorQuery();
query.selectAll(".item-text").boundingClientRect();
const playModeList = ["order", "repeat", "random"];

Page({
  data: {
    stateKeys: [
      "id",
      "currentSong",
      "durationTime",
      "currentTime",
      "lyricInfos",
      "currentLyricText",
      "currentLyricIndex",
      "isPlaying",
      "playModeIndex",
    ],

    id: 0,
    currentSong: {},
    currentTime: 0,
    durationTime: 0,
    lyricInfos: [],
    currentLyricText: "",
    currentLyricIndex: -1,

    lyricTextBox: [],

    statusHeight: 20,
    currentPage: 0,
    contentHeight: 0,

    pageTitles: ["歌曲", "歌词"],
    sliderValue: 0,
    isSliderChanging: false,
    isWaiting: false,
    timer: null,
    isPlaying: true,
    lyricScrollTop: 0,

    playSongList: [],
    playSongIndex: 0,
    isFirstPlay: true,

    playModeIndex: 0, // 0：顺序播放 1：单曲循环 2：随机播放
    playModeName: "order",
  },

  onLoad(options) {
    this.setData({
      contentHeight: app.globalData.contentHeight,
    });
    const { id } = options;
    if (id) {
      playerStore.dispatch("playMusicWithSongIdAction", id);
    }

    playerStore.onStates(
      ["playSongList", "playSongIndex"],
      this.getPlaySongInfosHandler
    );
    playerStore.onStates(this.data.stateKeys, this.getPlayerInfosHandler);
  },

  updateProgress: throttle(
    function (currentTime) {
      if (this.data.isSliderChanging) return;
      const sliderValue = (currentTime / this.data.durationTime) * 100;
      this.setData({
        sliderValue,
        currentTime,
      });
    },
    1000,
    { leading: false, trailing: false }
  ),

  onSwiperChange(event) {
    this.setData({ currentPage: event.detail.current });
  },
  onNavTabItemTap(event) {
    const index = event.currentTarget.dataset.index;
    this.setData({ currentPage: index });
  },
  onSliderChange(event) {
    if (this.data.timer) {
      this.data.timer = null;
    }
    this.data.isWaiting = true;
    this.data.timer = setTimeout(() => {
      this.data.isWaiting = false;
      this.data.isSliderChanging = false;
    }, 300);
    const value = event.detail.value;
    const currentTime = (value / 100) * this.data.durationTime;
    audioContext.seek(currentTime / 1000);
    this.setData({ currentTime });
  },

  onSliderChanging: throttle(function (event) {
    this.data.isSliderChanging = true;
    const value = event.detail.value;
    const currentTime = (value / 100) * this.data.durationTime;
    this.setData({ currentTime });
  }, 100),

  onPlayOrPause() {
    playerStore.dispatch("changeMusicStatusAction");
  },

  onPrevBtnTap() {
    playerStore.dispatch("playNewMusicAction", false);
  },

  onNextBtnTap() {
    playerStore.dispatch("playNewMusicAction");
  },

  getPlaySongInfosHandler({ playSongList, playSongIndex }) {
    if (playSongList) {
      this.setData({ playSongList });
    }
    if (playSongIndex !== undefined) {
      this.setData({ playSongIndex });
    }
  },

  onModeBtnTap() {
    playerStore.dispatch("changePlayModeAction");
  },

  getPlayerInfosHandler({
    id,
    currentSong,
    durationTime,
    currentTime,
    lyricInfos,
    currentLyricText,
    currentLyricIndex,
    isPlaying,
    playModeIndex,
  }) {
    if (id !== undefined) {
      this.setData({ id });
    }
    if (currentSong) {
      this.setData({ currentSong });
    }
    if (durationTime !== undefined) {
      this.setData({ durationTime });
    }
    if (currentTime !== undefined) {
      this.updateProgress(currentTime);
    }
    if (lyricInfos) {
      this.setData({ lyricInfos });
    }
    if (currentLyricText) {
      this.setData({ currentLyricText });
    }
    if (currentLyricIndex !== undefined) {
      if (!this.data.lyricTextBox.length) {
        query.exec((res) => {
          this.data.lyricTextBox = res[0];
        });
      }

      const lyricScrollTop = this.data.lyricTextBox
        .slice(0, currentLyricIndex)
        .reduce((heightSum, item) => item.height + heightSum, 0);
      this.setData({ currentLyricIndex, lyricScrollTop });
    }
    if (isPlaying !== undefined) {
      this.setData({ isPlaying });
    }
    if (playModeIndex !== undefined) {
      this.setData({ playModeName: playModeList[playModeIndex] });
    }
  },
  onUnload() {
    playerStore.offStates(
      ["playSongList", "playSongIndex"],
      this.getPlaySongInfosHandler
    );
    playerStore.offStates(this.data.stateKeys, this.getPlayerInfosHandler);
  },
});
