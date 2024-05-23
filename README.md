# 纱雾の闺房 - 不可进入の房间

<center>
    <a href="https://github.com/Dragon1573/Study-Notes/blob/butterfly/LICENSE.txt">
        <img alt="Static Badge" src="https://img.shields.io/badge/License-CC--BY--NC--SA_4.0-%23EF9421?style=flat-square&logo=creative-commons&logoColor=%23EF9421&label=License&color=%23EF9421" />
    </a>
    <a href="https://blog.dragon1573.wang/">
        <img alt="GitHub deployments" src="https://img.shields.io/github/deployments/Dragon1573/Study-Notes/github-pages?style=flat-square&logo=github&label=GitHub%20Pages" />
    </a>
    <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/Dragon1573/Boudoir-of-Sagiri?style=flat-square&label=Repo%20Size" />
    <br />
    <img alt="GitHub package.json dynamic (branch)" src="https://img.shields.io/github/package-json/packageManager/Dragon1573/Boudoir-of-Sagiri/butterfly?style=flat-square&label=Package%20Manager" />
    <img alt="GitHub package.json dev/peer/optional dependency version" src="https://img.shields.io/github/package-json/dependency-version/Dragon1573/Boudoir-of-Sagiri/dev/hexo?style=flat-square&label=Hexo" />
    <img alt="GitHub package.json dev/peer/optional dependency version" src="https://img.shields.io/github/package-json/dependency-version/Dragon1573/Boudoir-of-Sagiri/dev/hexo-theme-butterfly?style=flat-square&label=Butterfly" />
</center>

## :sparkles: 介绍

一个使用 [Hexo](https://hexo.io/zh-cn/) 编译构建、应用了 [Butterfly](https://github.com/jerryc127/hexo-theme-butterfly) 主题样式、托管于 [GitHub Pages](https://pages.github.com/) 上的 ~~涩涩~~ 知识站。

本站文章以 *Python* 为主，在「技术杂谈」分区可能会涉及其他语言和工具。

## 本地构建

```bash
# 将项目 Clone 到本地，此处推荐 SSH URL
git clone --progress git@github.com:Dragon1573/Study-Notes.git

# 切换到工作目录
cd Study-Notes/

# 安装必要的依赖项
yarn install --immutable

# 启动本地开发服务器（预览）
yarn run server

# 编译生成站点静态文件（生产环境部署）
yarn run build
```

你可以配合 *Nginx* / *Tomcat* / *Apache2* 甚至是 *Windows IIS* 完成站点部署。

### 许可证

除使用 *Yarnpkg* 引入的第三方依赖项外（它们有各自的开源许可证），本站其他内容均使用 **CC-BY-NC-SA 4.0** 许可证授权开源。禁止本站以商业为目的二次部署！

© 2024-至今 Dragon1573，版权所有。
