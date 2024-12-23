// components/song-menu-popup/song-menu-popup.js
import playerStore from "../../store/playerStore";

Component({
  data: {
    show: false,
    playSongList: [],
  },
  lifetimes: {
    attached() {
      playerStore.onState("playSongList", this.getPlaySongList(this));
    },
    detached() {
      playerStore.offState("playSongList", this.getPlaySongList(this));
    },
  },
  methods: {
    getPlaySongList: (ctx) => {
      let that = ctx;
      return (value) => {
        if (value) {
          that.setData({ playSongList: value });
        }
      };
    },
    onSongItemTap(event) {
      const index = event.currentTarget.dataset.index;
      playerStore.setState("playSongIndex", index);
    },
    changePopupStatus() {
      this.setData({
        show: true,
      });
    },
    onClose() {
      this.setData({ show: false });
    },
  },
});
