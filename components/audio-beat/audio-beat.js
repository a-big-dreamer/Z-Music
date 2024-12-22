// components/audio-beat/audio-beat.js
import playerStore from "../../store/playerStore";

Component({
  data: {
    isPlaying: false,
  },
  lifetimes: {
    attached() {
      playerStore.onState("isPlaying", this.handlePlayingMusicStyle(this));
    },
    detached() {
      playerStore.offState("isPlaying", this.handlePlayingMusicStyle(this));
    },
  },
  methods: {
    handlePlayingMusicStyle(ctx) {
      const that = ctx;
      return (value) => {
        if (value !== undefined) {
          that.setData({ isPlaying: value });
        }
      };
    },
  },
});
