---
layout: post
title: 构造独立的爬虫可执行文件
date: 2024-05-18 23:10:29
tags:
  - Python
  - Pyinstaller
  - Nodejs
categories: 技术杂谈
---

## 背景

最近在折腾公司内网的简易爬虫项目，希望将整个爬虫脚本打包成一个可执行文件，脱离复杂的 Python 和 Nodejs 开发环境搭建，让毫无开发基础的同事也能使用这个爬虫应用。

本项目在 Windows 上进行开发，项目的目标执行环境也是 Windows amd64 ，以下操作均在 Windows Powershell 7 上进行。

## 方法

### Nodejs SEA - 让 Nodejs 独立出来

Nodejs v21 开始引入了 *Single executable application* 的概念，可以将单个 JavaScript (CommonJS) 文件直接编译并注入 `node.exe` ，拼合形成定制的可执行文件。

对于爬虫文件而言，仅靠单一文件可能难以应对所有情况，更多时候我们还需要引入 `text-encoding` 或者 `jsdom` 这样的依赖项来「补环境」。这样的 JavaScript 源文件并不符合 Nodejs SEA 的要求，是否存在方法，可以把带有大量 `require()` 的复杂源文件变成完全独立的单个源文件呢？

### `@vercel/ncc` - JavaScript 的依赖压缩工具

`@vercel/ncc` 就是专门完成这个任务的。`ncc` 的名字借鉴自知名的编译工具链 `gcc` (GNU Compiler Collection) ，它能够智能地识别 JavaScript 源文件中的 `require()` 语句、自动处理模块依赖关系，根据依赖关系网把所有的源文件简化压缩，合并到一个源文件中。这个时候，即使本地 Nodejs 环境里没有安装任何依赖项，这个源文件也能够仅依赖于 Nodejs 标准库成功运行。

我们可以用下面的方法安装 `ncc` 并编译压缩 JavaScript 源文件：

```powershell
# ncc 仅在开发环境中使用，将它添加到 devDependencies
npm install --save-dev @vercel/ncc

# Nodejs 21 已经预装 npx ，它用于在当前 Nodejs 项目下启动一些可执行文件
# "./app.js" 是原始文件，"./dist" 是编译输出目录
npx ncc build ./app.js -o ./dist
```

编译结束后，我们会得到 `./dist/index.js` 文件。由于内置了必要的依赖项，`./dist/index.js` 会显著大于 `./app.js` 。

### 构建 Nodejs SEA

有了符合 Nodejs SEA 要求的单个 JavaScript 源文件，我们可以开始构建自己的可执行文件了。

1. 创建 `./sea-config.json` 文件，它的作用是描述如何将 `*.js` 文件打包成 `*.blob` 文件。`*.blob` 文件是一种特殊格式的二进制数据文件，在后面的步骤中，我们会使用 Nodejs 21 提供的专用工具把它注入到 Nodejs 主程序里。

   ```json
   { "main": "./dist/app.js", "output": "./dist/sea-prep.blob" }
   ```

2. 用 `node.exe` 执行打包过程。

   ```powershell
   node --experimental-sea-config ./sea-config.json
   ```

3. 我们需要把 `node.exe` 主程序复制一份。

   ```powershell
   node -e "require('fs').copyFileSync(process.execPath, './dist/app.exe')"
   ```

4. （可选）复制得到的 `./dist/app.exe` 带有 Nodejs 官方数字签名，数据注入后签名将失效，运行时可能存在各种警告信息，我们需要借助 *Visual Studio IDE 2022* 或者 *Visual Studio 生成工具 2022* 里提供的 `signtool.exe` 把签名信息擦除。

   `signtool.exe` 在 VS 安装时不会被自动添加到 `$env:PATH` 系统环境变量，Microsoft 为此提供了专门的 *Developer Powershell for VS 2022* 命令行环境，在这个环境下才能使用 `signtool.exe` 。

   如果你选择不擦除签名信息，也可以直接忽略下一步中由 `postject` 产生的所有警告。

   ```powershell
   signtool remove /s ./dist/app.exe
   ```

5. 执行数据注入过程。

   ```powershell
   npx postject ./dist/app.exe NODE_SEA_BLOB ./dist/sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
   ```

6. （可选）我们可以对注入完成后的可执行文件重新签名。

   即使不签名，可执行文件也能正常运行。

   ```powershell
   signtool sign /fd SHA256 ./dist/app.exe
   ```

现在，尝试运行 `./dist/app.exe` ，它应该能够正常使用了。

### Pyinstaller - 编译 Python ，万物归一

有了 `./dist/app.exe` ，我们可以在 Python 里借助 `subprocess.Popen()` 间接启动 Nodejs 独立可执行文件，我们成功地将 Nodejs 和 Python 的功能服务独立开了，剩下的就是把 Nodejs 独立可执行文件作为 Python 的一个外部资源文件，和 Python 项目一起编译构建为最终成品。

```powershell
pyinstaller -y --clean -F --add-data ./dist/app.exe:dist ./main.py
```

这会让 Pyinstaller 把 `./dist/app.exe` 视为数据文件，添加到最终可执行文件的 `dist/` 虚拟目录下，并将 `./main.py` 文件作为 Python 程序的核心，编译得到 `./dist/main.exe` 这个融合了 Python 和 Nodejs 的单一可执行文件。

## 后记

如果你有使用 GitHub Workflows / Microsoft Azure Pipelines / Travis CI / Circle CI 之类的 CI/CD 平台，还可以将上述编译打包过程自动化，只需要修补项目、提交并推送变更到远程仓库，就可以坐下来喝杯奶茶等待流水线输出最终编译产物了。

由于最终产物内置了 Python 运行时和 Nodejs SEA 可执行文件，最终用户将不再需要额外安装 Python 和 Nodejs 运行时，不用再额外安装庞大的 Python 和 Nodejs 依赖库了。
