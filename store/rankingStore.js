import { HYEventStore } from "hy-event-store";
import { getPlaylistDetail } from "../services/music";

// async function fetchToplistDetail(ctx) {
//   const res = await getToplistDetail();
//   return res;
// }
export const rankingsMap = {
  newRanking: 3779629,
  originRanking: 2884035,
  upRanking: 19723756,
};

const rankingStore = new HYEventStore({
  state: {
    newRanking: {},
    originRanking: {},
    upRanking: {},
  },
  actions: {
    async fetchRankingDataAction(ctx) {
      for (const key in rankingsMap) {
        const id = rankingsMap[key];
        getPlaylistDetail(id).then((res) => {
          ctx[key] = res.playlist;
        });
      }
      // if (ctx.rankingsList.length === 0) {
      //   const res = await fetchToplistDetail();
      //   ctx.rankingsList = res.list.slice(0, 3);
      //   console.log(ctx.rankingsList);
      //   for (const item of ctx.rankingsList) {
      //     getPlaylistDetail(item.id).then((res) => {
      //       console.log(res);
      //     });
      //   }
      // }
    },
  },
});

export default rankingStore;
