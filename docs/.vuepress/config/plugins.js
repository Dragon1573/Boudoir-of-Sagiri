module.exports = [
  [
    // 一键复制
    'one-click-copy',
    {
      copySelector: [
        'div[class*="language-"] pre',
        'div[class*="aside-code"] aside'
      ],
      copyMessage: '复制成功',
      duration: 1000,
      showInMobile: false
    }
  ],
  [
    // 图片放大
    'zooming',
    {
      selector: '.theme-vdoing-content img:not(.no-zoom)',
      options: {
        bgColor: 'rgba(0,0,0,0.6)'
      }
    }
  ],
  [
    // 『上次更新』插件配置
    '@vuepress/last-updated',
    {
      // 时间显示格式
      transformer: (timestamp, _lang) => {
        const dayjs = require('dayjs')
        return dayjs(timestamp).format('YYYY/MM/DD, HH:mm:ss')
      }
    }
  ],
  [
    // 站点地图
    'sitemap',
    {
      hostname: 'https://dragon1573.github.io/Plotly4py-Intro/',
      exclude: ['/404.html']
    }
  ]
]
