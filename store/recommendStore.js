import { HYEventStore } from "hy-event-store";
import { getRecommendSongs } from "../services/music";
const recommendStore = new HYEventStore({
  state: {
    recommendSongInfo: {},
  },
  actions: {
    async fetchRecommandSongsAction(ctx) {
      const { data } = await getRecommendSongs();
      ctx.recommendSongInfo = data;
    },
  },
});

export default recommendStore;
