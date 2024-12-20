import { http } from "./index";

// 获取歌曲播放详细信息
export function getSongDetail(ids) {
  return http.get({
    url: "/song/detail",
    data: {
      ids,
    },
  });
}

export function getSongLyric(id) {
  return http.get({
    url: "/lyric",
    data: {
      id,
    },
  });
}
