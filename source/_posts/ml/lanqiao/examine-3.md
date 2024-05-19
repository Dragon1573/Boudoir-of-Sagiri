---
layout: post
title: 实验三
date: 2024-05-16 23:44:08
categories: 机器学习
mathjax: true
---

# 决策树和 K 近邻分类

## 机器学习介绍

- 定义

  > 假设用 $P$ 来评估计算机程序在某任务类 $T$ 上的性能，若一个程序利用经验 $E$ 在任务 $T$ 上获得了性能改善，则我们就说关于 $T$ 和 $P$, 该程序对 $E$ 进行了学习。

- 常见任务 $T$ ：**分类**、**回归**、**聚类**、**离群检测**

- 经验 $E$ 即为 **数据** ，根据训练方式可以将算法分为 **监督** 和 **无监督** 两类。

## 构建决策树 - 熵

对于拥有 $N$ 种可能状态的系统，熵定义为
$$
S=-\sum_{i=1}^N{p_i\log_2p_i}
$$
其中，$p_i$ 是系统处于第 $i$ 个状态的概率。

## 决策树构建算法

对于 **ID3** 或 **C4.5** 等流行的决策树构建算法，其核心是贪婪最大化信息增益：在每一步，算法都会选择能在分割后给出最大信息增益的变量。

## 分割质量标准

- 基尼不确定性（Gini uncertainty ，效果与信息增益相似）：
  $$
  G=1-\sum_k{(p_k)^2}
  $$

- 错分率（Misclassification error）：
  $$
  E=1-\max_k{p_k}
  $$

- 二分类的熵和基尼不确定性：
  $$
  S=-p_+\log_2{p_+}-(1-p_+)\log_2(1-p_+)
  $$

  $$
  G=2p_+(1-p_+)
  $$

## 启发式属性选择

- 根据基尼不确定性质量标准，决策树总会选择区分性更好的属性。
- 决策树处理数值特征最简单的启发式算法是升序排列它的值，然后只关注目标变量发生改变的那些值。

## 树的关键参数

- 仅在构建 **随机森林** 或进行 **决策树修剪** 时，树会被构建到最大深度，每个叶子节点仅有一个实例。
- 通过 **人工限制树深度**、 **人工限制叶子节点最少样本数** 和 **树剪枝操作** 可以有效解决决策树过拟合问题。

## DecisionTreeClassifier

- 树的最大深度：`max_depth`
- 搜索时的最大属性数量：`max_features`
- 叶子节点最少样本数：`min_samples_leaf`

## 回归问题中的决策树

决策树使用分段的常数函数逼近数据，衡量其好坏的质量标准改变了。现在它的质量标准如下：
$$
D=\frac{1}{\ell}\sum_{i=1}^\ell{(y_i-\frac{1}{\ell}\sum_{j=1}^\ell{y_j})^2}
$$
其中，$\ell$ 是叶节点中的样本数，$y_i$ 是目标变量的值。

## 最近邻算法

在最近邻方法中，为了对测试集中的每个样本进行分类，需要依次进行以下操作：

- 计算训练集中每个样本之间的距离。
- 从训练集中选取 k 个距离最近的样本。
- 测试样本的类别将是它 k 个最近邻中最常见的分类。

### 实际应用

- 在某些案例中，KNN 可以作为一个模型的基线。
- 在 [Kaggle竞赛](https://www.kaggle.com/competitions) 中，KNN 常常用于构建元特征（即 KNN 的预测结果作为其他模型的输入），或用于堆叠/混合。
- KNN 还可以扩展到推荐系统等任务中。
- 在大型数据集上，常常使用逼近方法搜索 KNN。

### 主要参数

- 邻居数量
- 样本间距离定义（[汉明距离](https://zh.wikipedia.org/zh-cn/%E6%B1%89%E6%98%8E%E8%B7%9D%E7%A6%BB)、[编辑距离](https://zh.wikipedia.org/zh-cn/%E7%B7%A8%E8%BC%AF%E8%B7%9D%E9%9B%A2)、[欧几里得距离](https://zh.wikipedia.org/wiki/%E6%AC%A7%E5%87%A0%E9%87%8C%E5%BE%97%E8%B7%9D%E7%A6%BB)、[余弦相似性](https://zh.wikipedia.org/wiki/%E4%BD%99%E5%BC%A6%E7%9B%B8%E4%BC%BC%E6%80%A7)、闵可夫斯基距离、哈密顿距离等）
- 各邻居的距离权重

## KNeighborsClassifier

主要参数：

- 权重值 `weights` ：`uniform` 均等权重、`distance` 反比距离或用户自定义的权重计算公式
- 最近邻搜索方法 `algorithm` （可选）：
  - `brute` 网格搜索
  - `ball_tree` 或 `KD_tree` 树搜索
  - `auto` 自适应
- 树搜索自适应阈值 `leaf_size` （可选）：若使用树搜索，超过阈值时切换为网格搜索
- 距离算法 `metric` ：`minkowski` 闵可夫斯基、`manhattan` 曼哈顿、`euclidean` 欧几里得、`chebyshev` 切比雪夫

## 参数选择与交叉验证

数据集划分方法：

- 留一法：仅保留1个样本作为测试
- 比例划分法：按 20% ～ 30% 留出验证集，划分后子集各类别样本比例与总体接近
- 交叉验证法：按比例划分法将总体等分，每次取其中一份用作验证

## 决策树的复杂情况

由于决策树对属性的划分基于固定常量值，在特定情况下划分结果非常复杂。这时，可以考虑使用线性分类器。

## KNN的复杂情况

KNN 使用的距离算法对特定属性不敏感，当类别与特定属性直接关联且与其他属性完全无关时，距离并不能检测出相关性。此时，决策树能够通过对属性划分方法的信息增益检测出对目标值影响最大的属性，从而实现简单模型的高准确率分类。

## KNN VS. Decision Tree

### 决策树 Decision Tree

|        优势        |            劣势            |
| :----------------: | :------------------------: |
|     可解释性高     |          噪声敏感          |
|     易于可视化     |         边界局限性         |
|  训练/预测速度快   |     额外操作避免过拟合     |
|    参数数量更少    |   树的不稳定性，数据敏感   |
| 支持数值和类别特征 |     NPC 最佳决策树搜索     |
|                    | 数据缺失值使决策树难以创建 |
|                    |   模型只能内插，无法外推   |

### K近邻算法 K Nearest Neighbors

|               优势               |                             劣势                             |
| :------------------------------: | :----------------------------------------------------------: |
|             实现简单             |                  邻居数目大时，计算速度较慢                  |
|             研究充分             |              大量属性时无法判断权重和属性相关性              |
|             更为常见             |     默认欧氏距离不合理<br />大数据集的网格参数搜索耗时长     |
| 特定衡量标准和核函数针对特定问题 | 没有理论指导确定超参数<br />邻居数量小时对离散值敏感，倾向过拟合 |
|                                  |               『维度诅咒』，大量特征时效果不佳               |