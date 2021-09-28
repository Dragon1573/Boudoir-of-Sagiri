// nav
module.exports = [
  { text: '首页', link: '/' },
  { text: '前端', link: '/frontend/' },
  {
    text: '后端',
    link: '/backend/',
    items: [
      { text: '机器学习', link: '/backend/ml/' },
      {
        text: '数据可视化',
        link: '/backend/visualization/',
        items: [
          { text: 'Plotly', link: '/backend/visualization/plotly/getting-started.html' }
        ]
      }
    ]
  },
  { text: '技术杂谈', link: '/skills/' }
]
