import { http } from "./index";

// 获取热门搜索
export const getHotSearch = () => {
  return http.get({
    url: "/search/hot",
  });
};

// 搜索建议
export const getSearchSuggest = (keywords) => {
  return http.get({
    url: "/search/suggest",
    data: { keywords, type: "mobile" },
  });
};

// 获取默认搜索关键词
export const getDefaultKeywords = () => {
  return http.get({
    url: "/search/default",
  });
};

// 搜索
export const getSearchResult = (keywords) => {
  return http.get({
    url: "/search",
    data: {
      keywords,
    },
  });
};
