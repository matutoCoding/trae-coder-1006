export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/field/index',
    'pages/farm/index',
    'pages/quality/index',
    'pages/order/index',
    'pages/seedling/index',
    'pages/pest/index',
    'pages/harvest/index',
    'pages/field-form/index',
    'pages/seedling-form/index',
    'pages/farm-form/index',
    'pages/pest-form/index',
    'pages/harvest-form/index',
    'pages/quality-detail/index',
    'pages/quality-form/index',
    'pages/order-detail/index',
    'pages/order-form/index',
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
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/field/index',
        text: '药田台账'
      },
      {
        pagePath: 'pages/farm/index',
        text: '农事记录'
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
