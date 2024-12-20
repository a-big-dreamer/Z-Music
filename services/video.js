import { http } from "./index";

// 获取MV列表
export function getTopMv(offset = 0, limit = 20) {
  return http.get({
    url: "/top/mv",
    data: {
      limit,
      offset,
    },
  });
}

// 获取MV链接
export function getMVUrl(id) {
  return http.get({
    url: "/mv/url",
    data: { id },
  });
}

// 获取MV信息
export function getMVInfo(mvid) {
  return http.get({
    url: "/mv/detail",
    data: {
      mvid,
    },
  });
}

// 获取相关MV
export function getMVRelated(mvid) {
  return http.get({
    url: "/simi/mv",
    data: { mvid },
  });
}
