// components/video-item/video-item.js
Component({
  properties: {
    itemData: {
      type: Object,
      value: {},
    },
  },
  methods: {
    onItemTap() {
      const { id } = this.properties.itemData;
      wx.navigateTo({
        url: `/packageVideo/pages/detail-video/detail-video?id=${id}`,
      });
    },
  },
});
