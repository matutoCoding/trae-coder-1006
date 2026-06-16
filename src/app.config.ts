export default defineAppConfig({
  pages: [
    'pages/field/index',
    'pages/farming/index',
    'pages/harvest/index',
    'pages/quality/index',
    'pages/order/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#2E7D32',
    navigationBarTitleText: '中药材GAP种植基地',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#2E7D32',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/field/index',
        text: '药田台账'
      },
      {
        pagePath: 'pages/farming/index',
        text: '农事管理'
      },
      {
        pagePath: 'pages/harvest/index',
        text: '采收加工'
      },
      {
        pagePath: 'pages/quality/index',
        text: '质量检测'
      },
      {
        pagePath: 'pages/order/index',
        text: '订单销售'
      }
    ]
  }
})
