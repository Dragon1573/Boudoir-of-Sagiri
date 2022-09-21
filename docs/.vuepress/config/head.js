module.exports = [
  ['link', { rel: 'icon', href: '/favicon.png' }],
  // 首页关键词，方便搜索引擎 SEO 优化
  ['meta', { name: 'keywords', content: 'Plotly,Python' }],
  // 移动浏览器的主题背景色
  ['meta', { name: 'theme-color', content: '#11a8cd' }],
  // 站点默认文件编码格式
  ['meta', { charset: 'UTF-8' }],
  // 移动端缩放优化
  ['meta', {
    name: 'viewport',
    content: 'width=device-width, initial-scale=1'
  }],
  ['script', {
    async: true, src: 'https://www.googletagmanager.com/gtag/js?id=G-VWR5JJ7W9P'
  }],
  ['script', {}, `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-VWR5JJ7W9P');
  `]
]
