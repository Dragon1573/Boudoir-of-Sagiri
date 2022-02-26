module.exports = [
  [
    // 一键复制
    'one-click-copy',
    {
      copySelector: [
        'div[class*="language-"] pre',
        'div[class*="aside-code"] aside'
      ],
      copyMessage: '白嫖成功',
      toolTipMessage: '立即白嫖',
      duration: 1250
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
      hostname: 'https://blog.dragon1573.wang/',
      exclude: ['/404.html']
    }
  ]
]
