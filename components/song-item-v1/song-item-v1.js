// components/song-item-v1/song-item-v1.js
import playerStore from "../../store/playerStore";

Component({
  properties: {
    itemData: {
      type: Object,
      value: {},
    },
  },
  data: {
    id: 0,
  },
  lifetimes: {
    attached() {
      playerStore.onState("id", this.handlePlayingMusicStyle(this));
    },
    detached() {
      playerStore.offState("id", this.handlePlayingMusicStyle(this));
    },
  },
  methods: {
    onSongItemTap() {
      const id = this.properties.itemData.id;
      wx.navigateTo({
        url: `/pages/music-player/music-player?id=${id}`,
      });
    },
    handlePlayingMusicStyle(ctx) {
      const that = ctx;
      return (value) => {
        if (value !== undefined) {
          that.setData({ id: +value });
        }
      };
    },
  },
});
