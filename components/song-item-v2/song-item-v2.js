// components/song-item-v2/song-item-v2.js
import playerStore from "../../store/playerStore";

Component({
  properties: {
    itemData: {
      type: Object,
      value: {},
    },
    index: {
      type: Number,
      value: -1,
    },
    isSkip: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    id: 0,
    isPlaying: false,
  },
  lifetimes: {
    attached() {
      playerStore.onStates(
        ["id", "isPlaying"],
        this.handlePlayingMusicStyle(this)
      );
    },
    detached() {
      playerStore.offStates(
        ["id", "isPlaying"],
        this.handlePlayingMusicStyle(this)
      );
    },
  },
  methods: {
    onSongItemTap() {
      const id = this.properties.itemData.id;
      if (this.properties.isSkip) {
        console.log(this.properties.isSkip);
        playerStore.dispatch("playMusicWithSongIdAction", id);
      } else {
        wx.navigateTo({
          url: `/pages/music-player/music-player?id=${id}`,
        });
      }
    },
    handlePlayingMusicStyle(ctx) {
      const that = ctx;
      return ({ id, isPlaying }) => {
        if (id !== undefined) {
          that.setData({ id: +id });
        }
        if (isPlaying !== undefined) {
          that.setData({ isPlaying });
        }
      };
    },
  },
});
