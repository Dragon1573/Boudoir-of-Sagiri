---
layout: post
title: 挑战四
date: 2024-05-17 00:04:05
categories: 机器学习
mathjax: true
---

# 逻辑回归用于讽刺文本检测

## 数据可视化探索

- *Pandas* 内建了与 *Matplotlib* 的集成，可以在 `pandas.Series` 之上调用 `.hist()` 方法绘制条形统计图。
- `numpy.log1p()` 函数的意义为计算 $\ln{(1+x)}$ ，其中 $\ln{(\bullet)}=\log_e{(\bullet)}$ 。

### 词云（WordCloud 库）

***WordCloud*** 库是由 *Amueller* 开发的一款 Python 小型词云生成器，它可以在 Python 2.7 和 Python 3.4 ～ 3.7 环境下安装，其 `*.whl` 形式软件包发布于 *PyPI* 和 *Conda Forge* 。

*WordCloud* 依赖于 *Matplotlib ≥ 1.5.3* 、*Numpy ≥ 1.6.1* 和 *Pillow* ，其中 *Numpy* 用于生成词云的数值表示，*Pillow* 用于显示词云图片，*Matplotlib* 用于可视化词云数值矩阵和词云文件读写。

- 问题：参考 [WordCloud 官方文档](https://github.com/amueller/word_cloud/blob/master/examples/simple.py) 绘制两类评论文本词云图，可自定义样式效果。

  ```python
  # 导入词云和停用词库
  from wordcloud import WordCloud, STOPWORDS
  
  cloud = WordCloud(
      # 背景颜色与停用词
      background_color='black', stopwords=STOPWORDS,
      # 词云最大单词数量和最大字号
      max_words=200, max_font_size=100,
      # 图像大小和随机种子
      width=800, height=400, random_state=17
  )
  # 生成词云图
  _, axes = plt.subplots(nrows=1, ncols=2, figsize=(16, 9))
  cloud.generate(str(train_df.loc[train_df['label'] == 1, 'comment']))
  axes[0].imshow(cloud)
  axes[0].axis('off')
  cloud.generate(str(train_df.loc[train_df['label'] == 0, 'comment']))
  axes[1].imshow(cloud)
  axes[1].axis('off')
  ```

  英语单词以空格进行分隔，分词难度远低于现代汉语。但与现代汉语相同，英语词汇中存在大量不表达含义的 **停用词** （以虚词为主，例如助词、介词、冠词），对这类词汇的统计将显著降低词云绘制的效率。同时，我们设置了 `max_words` 参数，用于限制词云生成时展示的最大单词数量，进一步降低词云绘制复杂度。

  `wordcloud.WordCloud.generate()` 方法是 `.generate_from_text()` 方法的简化，它接受一个字符串或字节数组，并在其上按英语规范执行分词统计并生成词云。由于 `pandas.DataFrame.loc` 属性获取的值类型为 `pandas.Series` ，无法被 `generate()` 接受，因此直接调用 `str()` 类型转换即可，不需要依赖 `str.join()` 进行字符串拼接操作。

## 模型解释

### ELI5 库

*ELI5* 是一款用通用 API 可视化或调试多种机器学习模型的 Python 库。它为多种机器学习框架提供了内置支持，并提供了一种用于解释「黑盒模型」的方法。

## 模型改进

- 问题：使用构建好的 `TfidfVectorizer` 完成特征提取。

  ```python
  X_train_texts = tf_idf_texts.fit_transform(train_texts)
  X_valid_texts = tf_idf_texts.transform(valid_texts)
  X_train_subreddits = tf_idf_subreddits.fit_transform(train_subreddits)
  X_valid_subreddits = tf_idf_subreddits.transform(valid_subreddits)
  ```

  对于任意的数据集变换（例如此处的 `TfidfVectorizer` ），应仅对训练集调用 `.fit_transform()` 方法、对测试集调用 `.transform()` 方法。在测试集上调用 `.fit_transform()` 方法可能导致数据集列数不匹配。
