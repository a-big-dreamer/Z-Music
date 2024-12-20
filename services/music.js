import { http } from "./index";

// 获取轮播图
export function getMusicBanner(type = 0) {
  return http.get({
    url: "/banner",
    data: {
      type,
    },
  });
}

// 获取推荐歌曲
export function getRecommendSongs() {
  return http.get({
    url: "/recommend/songs",
  });
}

// 热门歌单
export function getSongMenuList(cat = "全部", limit = 6, offset = 0) {
  return http.get({
    url: "/top/playlist",
    data: {
      cat,
      limit,
      offset,
    },
  });
}

// 获取歌单类型
export function getSongMenuTag() {
  return http.get({
    url: "/playlist/hot",
  });
}

// // 获取榜单内容摘要
// export function getToplistDetail() {
//   return http.get({
//     url: "/toplist/detail",
//   });
// }

// 获取歌单详情（包括榜单）
export function getPlaylistDetail(id) {
  return http.get({
    url: "/playlist/detail",
    data: { id },
  });
}