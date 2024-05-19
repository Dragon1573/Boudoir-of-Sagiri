---
layout: post
title: 实验七
date: 2024-05-18 01:03:33
categories: 机器学习
mathjax: true
---

# 主成分分析和聚类

## 主成分分析 PCA

### 概念

- 降维
  - 有助于数据可视化
  - 有效地解决维度灾难问题
  - 数据压缩，提升模型训练效率
- 主成分分析
  - 最简单，最直观，最常用
  - 将数据投影到一个正交特征子空间中

### 工作流

1. 根据 **散度** （数据在某一特征中的分散程度）降低的顺序对特征进行排序，随后取前 $k$ 项；

2. 计算原始 $n$ 维数据的散度值和协方差；
   $$
   \text{cov}(X_i, X_j) = E[(X_i - \mu_i) (X_j - \mu_j)] = E[X_i X_j] - \mu_i \mu_j
   $$

3. 协方差矩阵可以被本征化，分解为一组本征向量和一组本征值，样本 $\mathbf{X}$ 的最大方差位于最大本征值对应的本征向量上。
   $$
   M w_i = \lambda_i w_i
   $$

[^1]: 数据在某一特征中的分散程度

### 莺尾花（Iris）数据集

- *PCA* 降维工具位于 `sklearn.decomposition.PCA`
- `PCA.components_` 可以获取主成分分析后获得的各正交主成分组成
- `PCA.explained_variance_ratio_` 可以获取主成分分析后各正交主成分的方差、

### 手写数字（MNIST）数据集

- *t-SNE* 降维不具有线性约束
- *t-SNE* 降维工具位于 `sklearn.manifold.TSNE`
- *t-SNE* 运行耗时远高于 *PCA*

## 聚类

- *Sklearn* 内置了不同类型的聚类算法，其适用场景也不同

### K-Means 聚类

1. 选择认为最佳的类别数量 $k$ ，即样本大概可以分为多少个簇
2. 在数据空间内随机初始化 $k$ 点为 **质心**
3. 将每个观察数据点划分到于其最近的簇的质心的簇
4. 将质心更新为一个簇中所有数据点的中心
5. 重复步骤 3 和 4 步骤直到所有质心都相对稳定

*K-Means* 对聚类质心的初始位置的很敏感，可以多次运行算法，然后平均所有质心结果。

### K-均值算法中 K 值的选择

<div style="text-align: center; padding: 20px 0px;">
<img src="https://dn-simplecloud.shiyanlou.com/courses/uid917549-20210903-1630635819021" />
</div>

$$
D(k) = \frac{|J(C_k) - J(C_{k+1})|}{|J(C_{k-1}) - J(C_k)|}  \rightarrow \min\limits_k
$$

### K-均值存在的问题

- *K-Means* 是一种 **NP-Hard** 问题
- 对于 $n$ 个 $d$ 维数据聚集为 $k$ 类，*K-Means* 复杂度为 $O(n^{dk+1})$
- 可以借助 *MiniBatch K-Means* 算法降低复杂度

### 近邻传播算法

- 不需要事先设置簇的数量

- 根据观测点之间的相似性来对数据进行聚类

- 相似性指标：负平方距离 $s(x_i,x_j)=-\|x_i-x_j\|^2$

- 吸引度：样本 $x_k$ 适合作为 $x_i$ 的聚类中的的程度
  $$
  r_{i,k} \leftarrow s_(x_i, x_k) - \max_{k' \neq k} \left\{ a_{i,k'} + s(x_i, x_k') \right\}
  $$

- 归属度：样本 $x_i$ 选择 $x_k$ 作为聚类中心的合适程度
  $$
  a_{i,k} \leftarrow \min \left( 0, r_{k,k} + \sum_{i' \notin \{i,k\}} \max{(0,r_{i',k})} \right), i \neq k
  $$

  $$
  a_{k,k} \leftarrow \sum_{i' \neq k} \max(0, r_{i',k})
  $$

### 谱聚类

- 谱聚类是一种图模型
- 谱聚类通过邻接矩阵描述每两个观测点之间的相似性
- 谱聚类的过程是图分割的过程（*Normalized Cut* 问题）

### 凝聚聚类

- 流程：

  1. 首先将每个观测点都作为一个簇
  2. 然后按降序对每两个簇中心之间距离进行排序
  3. 取最近的两个相邻的簇并将它们合并为一个簇，然后重新计算簇中心
  4. 重复步骤 2 和 3 ，直到所有观测点都合并到一个簇中

- 距离公式：

  - 单连接
    $$
    d(C_i, C_j) = \min_{x_i \in C_i, x_j \in C_j} \|x_i - x_j\|
    $$

  - 全连接
    $$
    d(C_i, C_j) = \max_{x_i \in C_i, x_j \in C_j} \|x_i - x_j\|
    $$

  - 平均连接
    $$
    d(C_i, C_j) = \frac{1}{n_i n_j} \sum_{x_i \in C_i} \sum_{x_j \in C_j} \|x_i - x_j\|
    $$

  - 质心连接
    $$
    d(C_i, C_j) = \|\mu_i - \mu_j\|
    $$

  平均连接时间效率最高，不需要在每次合并后重算距离。

- 一般用树状图表示聚类过程

## 聚类模型评价

### 调整兰德指数

- 兰德指数

  $$
  \text{RI} = \frac{2(a + b)}{n(n-1)}
  $$

  其中， $n$ 是样本中数据点对数的数量、 $a$ 表示在真实标签与聚类结果中都是同类别的观测点对数、 $b$ 表示在真实标签与聚类结果中都是不同类别的观测点对数。

- 调整兰德指数
  $$
  \text{ARI} = \frac{\text{RI} - E[\text{RI}]}{\max(\text{RI}) - E[\text{RI}]}
  $$

### 同质性、完整性、V-measure

- 同质性

  $$
  h = 1 - \frac{H(C\mid K)}{H(C)}
  $$

- 完整性
  $$
  c = 1 - \frac{H(K\mid C)}{H(K)}
  $$

其中，$K$ 是聚类结果、$C$ 是原始数据。

- V-measure 值
  $$
  v = 2\frac{hc}{h+c}
  $$

### 轮廓系数

$$
s = \frac{b - a}{\max(a, b)}
$$

其中， $a$ 是数据点与一个簇内其他观测点之间距离的平均值，$b$ 是观测点到最近簇的观测点的平均距离。
