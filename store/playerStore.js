import { HYEventStore } from "hy-event-store";
import { getSongDetail, getSongLyric } from "../services/player";
import { parseLyric } from "../utils/parse-lyric";

export const audioContext = wx.createInnerAudioContext();

function randomMusic(index, length) {
  while (true) {
    const newIndex = Math.floor(Math.random() * length);
    if (newIndex !== index) {
      return newIndex;
    }
  }
}

const playerStore = new HYEventStore({
  state: {
    playSongList: [],
    playSongIndex: 0,

    id: 0,
    currentSong: {},
    currentTime: 0,
    durationTime: 0,
    lyricInfos: [],
    currentLyricText: "",
    currentLyricIndex: -1,

    isFirstPlay: true,
    isPlaying: false,
    playModeIndex: 0, // 0：顺序播放 1：单曲循环 2：随机播放
  },

  actions: {
    playMusicWithSongIdAction(ctx, id) {
      ctx.currentSong = {};
      ctx.currentTime = 0;
      ctx.durationTime = 0;
      ctx.lyricInfos = [];
      ctx.currentLyricText = "";
      ctx.currentLyricIndex = -1;

      ctx.id = id;
      ctx.isPlaying = true;
      getSongDetail(id).then((res) => {
        ctx.currentSong = res.songs[0];
        ctx.durationTime = res.songs[0].dt;
      });
      getSongLyric(id).then((res) => {
        const lrcString = res.lrc.lyric;
        const lyricInfos = parseLyric(lrcString);
        ctx.lyricInfos = lyricInfos;
      });

      // audioContext.stop();
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
      audioContext.autoplay = true;

      if (ctx.isFirstPlay) {
        ctx.isFirstPlay = false;

        audioContext.onTimeUpdate(() => {
          ctx.currentTime = audioContext.currentTime * 1000;
          if (!ctx.lyricInfos.length) return;
          let index = ctx.lyricInfos.length - 1;
          for (let i = 0; i < ctx.lyricInfos.length; i++) {
            const info = ctx.lyricInfos[i];
            if (info.time > audioContext.currentTime * 1000) {
              index = i - 1;
              break;
            }
          }
          if (index === ctx.currentLyricIndex || index === -1) return;
          const currentLyricText = ctx.lyricInfos[index].text;
          ctx.currentLyricText = currentLyricText;
          ctx.currentLyricIndex = index;
        });

        audioContext.onWaiting(() => {
          console.log("==========music-waiting===============");
        });

        audioContext.onEnded(() => {
          if (audioContext.loop) return;
          this.dispatch("playNewMusicAction");
        });
      }
    },
    changeMusicStatusAction(ctx) {
      if (!audioContext.paused) {
        audioContext.pause();
      } else {
        audioContext.play();
      }
      ctx.isPlaying = !ctx.isPlaying;
    },
    changePlayModeAction(ctx) {
      let playModeIndex = ctx.playModeIndex;
      playModeIndex += 1;
      if (playModeIndex === 3) playModeIndex = 0;

      if (playModeIndex == 1) {
        audioContext.loop = true;
      } else {
        audioContext.loop = false;
      }
      ctx.playModeIndex = playModeIndex;
    },
    playNewMusicAction(ctx, isNext = true) {
      const length = ctx.playSongList.length;
      let index = ctx.playSongIndex;
      switch (ctx.playModeIndex) {
        case 1:
        case 0:
          index = isNext ? index + 1 : index - 1;
          if (index === length) index = 0;
          if (index === -1) index = length - 1;
          break;
        case 2:
          index = randomMusic(index, length);
          break;
      }

      const newSong = ctx.playSongList[index];
      this.dispatch("playMusicWithSongIdAction", newSong.id);
      ctx.playSongIndex = index;
    },
  },
});

export default playerStore;
