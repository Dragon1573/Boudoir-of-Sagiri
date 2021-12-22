const nav = require('./nav.js');

// 主题配置
module.exports = {
  logo: '/favicon.png',
  nav,
  sidebarDepth: 2,
  repo: 'Dragon1573/Study-Notes',
  searchMaxSuggestions: 10,
  lastUpdated: '上次更新',
  docsDir: 'docs',
  editLinks: false,

  /* 开始：Vdoing 主题相关配置 */
  category: false,
  tag: false,
  archive: false,
  updateBar: {
    showToArticle: false
  },
  rightMenuBar: true,
  sidebarOpen: true,
  pageButton: true,
  sidebar: {
    mode: 'structuring',  // WARNING：强制设置，不可更改！
    collapsable: true
  },
  author: {
    name: 'Dragon1573',
    link: 'https://github.com/Dragon1573',
  },
  social: {
    icons: [
      {
        iconClass: 'icon-github',
        title: 'GitHub',
        link: 'https://github.com/Dragon1573',
      },
      {
        iconClass: 'icon-csdn',
        title: 'CSDN',
        link: 'https://blog.csdn.net/u011367208'
      },
      {
        iconClass: 'icon-bilibili',
        title: 'B站',
        link: 'https://space.bilibili.com/289561900'
      },
      {
        iconClass: 'icon-youtube',
        title: 'YouTube',
        link: 'https://www.youtube.com/channel/UCS36ZpuvN2Hp6tO1mcBgTig'
      },
      {
        iconClass: 'icon-erji',
        title: 'QQ音乐',
        link: 'https://y.qq.com/n/ryqq/profile/like/song?uin=owc5NKSAoK6A'
      }
    ]
  },
  footer: {
    createYear: 2021,
    copyrightInfo:
      'Dragon1573 | <a href="https://github.com/Dragon1573/Study-Notes/blob/main/LICENSE.txt">CC-BY-SA 4.0</a>',
  }
}
