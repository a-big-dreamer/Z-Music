// components/related-video-item/related-video-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    relatedVideoData: {
      type: Object,
      value: {},
    },
  },
  methods: {
    onItemTap() {
      const { id } = this.properties.relatedVideoData;
      wx.navigateTo({
        url: `/packageVideo/pages/detail-video/detail-video?id=${id}`,
      });
    },
  },
});
