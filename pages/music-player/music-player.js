// pages/music-player/music-player.js
import { getSongDetail, getSongLyric } from "../../services/player";
import { throttle } from "underscore";
import { parseLyric } from "../../utils/parse-lyric";
import playerStore from "../../store/playerStore";

const app = getApp();
const audioContext = wx.createInnerAudioContext();
const query = wx.createSelectorQuery();
query.selectAll(".item-text").boundingClientRect();
const playModeList = ["order", "repeat", "random"];

Page({
  data: {
    pageTitles: ["歌曲", "歌词"],
    id: 0,
    currentSong: {},
    lyricInfos: [],
    currentLyricText: "",
    currentLyricIndex: -1,
    lyricTextBox: [],

    statusHeight: 20,
    currentPage: 0,
    contentHeight: 0,
    currentTime: 0,
    durationTime: 0,
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

  setupPlaySong(id) {
    getSongDetail(id).then((res) => {
      this.setData({
        currentSong: res.songs[0],
        durationTime: res.songs[0].dt,
      });
    });
    getSongLyric(id).then((res) => {
      const lrcString = res.lrc.lyric;
      const lyricInfos = parseLyric(lrcString);
      this.setData({ lyricInfos });
    });

    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
    audioContext.autoplay = true;

    if (this.data.isFirstPlay) {
      this.data.isFirstPlay = false;
      const throttleUpdateProgress = throttle(this.updateProgress, 800, {
        leading: false,
        trailing: false,
      });
      audioContext.onTimeUpdate(() => {
        if (!this.data.isSliderChanging && !this.data.isWaiting) {
          console.log(1111);
          throttleUpdateProgress();
        }

        if (!this.data.lyricInfos.length) return;
        let index = this.data.lyricInfos.length - 1;
        for (let i = 0; i < this.data.lyricInfos.length; i++) {
          const info = this.data.lyricInfos[i];
          if (info.time > audioContext.currentTime * 1000) {
            index = i - 1;
            break;
          }
        }
        if (index === this.data.currentLyricIndex) return;
        const currentLyricText = this.data.lyricInfos[index].text;
        if (!this.data.lyricTextBox.length) {
          query.exec((res) => {
            this.data.lyricTextBox = res[0];
          });
        }

        const lyricScrollTop = this.data.lyricTextBox
          .slice(0, index)
          .reduce((heightSum, item) => item.height + heightSum, 0);
        this.setData({
          currentLyricText,
          currentLyricIndex: index,
          lyricScrollTop,
        });
      });

      audioContext.onWaiting(() => {
        console.log("==========music-waiting===============");
      });

      audioContext.onEnded(() => {
        if (audioContext.loop) return;
        this.changeNewSong();
      });
    }
  },
  onLoad(options) {
    this.setData({
      contentHeight: app.globalData.contentHeight,
    });
    const { id } = options;
    this.setupPlaySong(id);
    playerStore.onStates(
      ["playSongList", "playSongIndex"],
      this.getPlaySongInfosHandler
    );
  },
  updateProgress() {
    const sliderValue = (this.data.currentTime / this.data.durationTime) * 100;
    this.setData({
      sliderValue,
      currentTime: audioContext.currentTime * 1000,
    });
  },

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
    if (!audioContext.paused) {
      audioContext.pause();
    } else {
      audioContext.play();
    }
    this.setData({ isPlaying: !this.data.isPlaying });
  },

  onPrevBtnTap() {
    this.changeNewSong(false);
  },

  onNextBtnTap() {
    this.changeNewSong();
  },

  randomMusic(index, length) {
    while (true) {
      const newIndex = Math.floor(Math.random() * length);
      if (newIndex !== index) {
        return newIndex;
      }
    }
  },

  changeNewSong(isNext = true) {
    const length = this.data.playSongList.length;
    let index = this.data.playSongIndex;
    switch (this.data.playModeIndex) {
      case 1:
      case 0:
        index = isNext ? index + 1 : index - 1;
        if (index === length) index = 0;
        if (index === -1) index = length - 1;
        break;
      case 2:
        index = this.randomMusic(index, length);
        break;
    }

    const newSong = this.data.playSongList[index];
    this.setData({
      currentSong: {},
      sliderValue: 0,
      currentTime: 0,
      durationTime: 0,
    });
    this.setupPlaySong(newSong.id);
    playerStore.setState("playSongIndex", index);
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
    let playModeIndex = this.data.playModeIndex;
    playModeIndex += 1;
    if (playModeIndex === 3) playModeIndex = 0;

    if ((playModeIndex = 1)) {
      audioContext.loop = true;
    } else {
      audioContext.loop = true;
    }
    this.setData({ playModeIndex, playModeName: playModeList[playModeIndex] });
  },

  onUnload() {
    playerStore.offStates(
      ["playSongList", "playSongIndex"],
      this.getPlaySongInfosHandler
    );
  },
});
