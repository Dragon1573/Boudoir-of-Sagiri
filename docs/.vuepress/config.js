const head = require('./config/head.js');
const plugins = require('./config/plugins.js');
const themeConfig = require('./config/themeConfig.js');

module.exports = {
  theme: 'vdoing',

  title: "Plotly.py 入门教程",
  description: '跟着我一起学习 Plotly ，享受它强大的数据可视化能力吧～',
  base: '/Plotly4py-Intro/',
  dest: 'dist',

  head,
  plugins,
  themeConfig,

  markdown: {
    lineNumber: false
  },
  extendMarkdown: md => {
    md.set({ breaks: true });
    md.use(require('markdown-it-mathjax3'));
  }
}
