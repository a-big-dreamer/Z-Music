// pages/detail-search/detail-search.js
import {
  getHotSearch,
  getSearchSuggest,
  getDefaultKeywords,
  getSearchResult,
} from "../../services/search";
import { throttle } from "underscore";
import playerStore from "../../store/playerStore";

Page({
  data: {
    hotSearchList: [],
    suggestList: [],
    searchResult: [],
    value: "",
    placeholder: "",
    isSearching: false,
  },
  onLoad() {
    this.fetchHotSearch();
    this.fetchDefaultKeywords();
  },
  async fetchDefaultKeywords() {
    const data = await getDefaultKeywords();
    const placeholder = data.data.realkeyword;
    this.setData({ placeholder });
  },
  async fetchHotSearch() {
    const data = await getHotSearch();
    const hotSearchList = data.result.hots;
    this.setData({ hotSearchList });
  },
  async fetchSearchSuggest(keywords) {
    const data = await getSearchSuggest(keywords);
    const suggestList = data.result.allMatch;
    suggestList && this.setData({ suggestList });
  },

  async fetchSearchResult(keywords) {
    const data = await getSearchResult(keywords);
    const searchResult = data.result.songs;
    this.setData({ searchResult });
  },
  onSearch: throttle(
    function (event) {
      const keywords = event.detail;
      this.setData({ value: keywords, isSearching: true });
      if (keywords == "") {
        this.onCancleTap();
        return;
      }
      this.fetchSearchSuggest(keywords);
    },
    300,
    {
      leading: true,
      trailing: true,
    }
  ),
  onClear() {
    this.onCancleTap();
  },
  onItemTap(event) {
    const keywords = event.currentTarget.dataset.text;
    this.setData({ value: keywords, isSearching: false });
    this.fetchSearchResult(keywords);
  },
  onMusicPlayTap() {
    playerStore.setState("playSongList", this.data.searchResult);
  },
  onCancleTap() {
    this.setData({
      suggestList: [],
      searchResult: [],
      value: "",
    });
  },
});
