---
layout: post
title: 实验四
date: 2024-05-17 00:02:37
categories: 机器学习
mathjax: true
---

# 线性回归和线性分类器

## 最小二乘法（OLS）

- 线性模型的定义：
  $$
  \mathbf y = \mathbf X w + \epsilon
  $$
  其中，$y\in \mathbb{R}^n$ 为因变量（目标变量，列向量），$w$ 为模型的权重（列向量），$X$ 为观测得到的特征矩阵（ $n\times(m+1)$ ，秩为 $m+1$ ），$\epsilon$ 为随机不可测误差。

  - 模型的限制：
    - 随机误差的数学期望为 $0$
    - 随机误差具有等分散性（相同的有限方差）
    - 随机误差不相关

- 无偏（Unbiased）估计：期望值与估计参数真实值相等。
  $$
  \mathbb{E} \left[ \hat{w}_i \right] = w_i
  $$

- OLS 均方误差公式：
  $$
  \begin{eqnarray}
  \mathcal{L}(\mathbf{X},\mathbf{y},\mathbf{w}) & = & \frac{1}{2n}\sum_{i = 1}^{n}{(y_i-\mathbf{w}^\mathrm{T}\mathbf{x}_i)^2} \\
  & = & \frac{1}{2n}\left \| \mathbf{y} - \mathbf{X}\mathbf{w} \right \| _2^2 \\
  & = & \frac{1}{2n} (\mathbf{y} - \mathbf{X}\mathbf{w})^\mathrm{T} (\mathbf{y} - \mathbf{X}\mathbf{w})
  \end{eqnarray}
  $$
  
- OLS 对参数求导：
  $$
  \begin{array}{rcl}
  \frac{\partial \mathcal{L}}{\partial \mathbf{w}} &=& \frac{1}{2n} \left(-2 \mathbf{X}^{\text{T}} \mathbf{y} + 2\mathbf{X}^{\text{T}} \mathbf{X} \mathbf{w}\right)
  \end{array}
  $$

  $$
  \begin{array}{rcl}
  \frac{\partial \mathcal{L}}{\partial \mathbf{w}} = 0 &\Leftrightarrow& \mathbf{w} = \left(\mathbf{X}^{\text{T}} \mathbf{X}\right)^{-1} \mathbf{X}^{\text{T}} \mathbf{y}
  \end{array}
  $$

- 基于定义和条件，根据高斯-马尔可夫定理，模型参数的 OLS 估计是所有线性无偏估计中最优的，即通过 OLS 估计可以获得最低的方差。

- 若不选择最小化均方误差，那么就不满足高斯-马尔可夫定理的条件，得到的估计将不再是最佳的线性无偏估计。

## 极大似然估计（MLE）

- 伯努利分布：如果一个随机变量只有两个值（1 和 0，相应的概率为 $\theta$ 和 $1-\theta$​ ），那么该随机变量满足 **伯努利分布** ，遵循以下概率分布函数：
  $$
  p(\theta,x) = \theta^x(1-\theta)^{1-x},x\in\{0,1\}
  $$
  其中，分布参数 $\theta$ 就是事件 $X$ 的 **概率估计** 。
  
  对于多次独立试验，记观测结果为 $\mathbf{x} = \left(x_1, x_2, \ldots, x_{400}\right)$ ，其 **似然** 为
  $$
  p(\mathbf{x};\theta)=\prod_{i=1}^{400}{\theta^{x_i}(1-\theta)^{(1-x_i)}}
  $$
  
- 正态分布：若随机变量 $\mathbf{X}$ 服从位置参数为 $\mu$ 、尺度参数为 $\sigma$ 的概率分布，且其概率密度函数为
  $$
  f(x)=\frac{1}{\sqrt{2\pi}\sigma}e^{-\frac{(x-\mu)^2}{2\sigma^2}}
  $$
  则该变量称为 **正态随机变量** ，其服从 **正态分布** 。当 $\mu=0,\sigma=1$​ 时，其定义为 **标准正态分布** 。
  $$
  f(x)=\frac{1}{\sqrt{2\pi}}e^{\left(-\frac{x^2}{2}\right)}
  $$

- 假设随机误差 $\epsilon\sim\mathcal{N}(0,\sigma^2)$ ，改写模型可得
  $$
  y_i\sim\sum_{j=1}^m{w_jX_{ij}}+\mathcal{N}(0,\sigma^2)
  $$

  $$
  p(y_i|\mathbf{X};\mathbf{w})=\mathcal{N}\left(\sum_{j=1}^m{w_jX_{ij}},\sigma^2\right)
  $$

  根据 **高斯-马尔科夫定理** 的 **误差不相关约束** ，将似然求对数，可得
  $$
  \log{p(\mathbf{y}|\mathbf{X};\mathbf{w})}=
  -\frac{n}{2}\log{2\pi\sigma^2}-\frac{1}{2\sigma^2}\sum_{i=1}^n{(y_i-\mathbf{w}^Tx_i)^2}
  $$
  对其最大化，可得
  $$
  \mathbf{w}_{\text{ML}}=\arg\min_w\mathcal{L}(\mathbf{X},\mathbf{y},\mathbf{w})
  $$
  所以，当测量误差服从正态（高斯）分布的情况下， 最小二乘法等价于极大似然估计。

## 偏置-方差分解

- 线性回归模型的要求：

  - 目标真值是确定性函数与随机误差之和：$y=f(x)+\epsilon$
  - 误差符合均值为零、方差一致的正态分布：$\epsilon\sim\mathcal{N}(0,\sigma^2)$
  - 目标真值也服从正态分布：$y\sim\mathcal{N}(f(x),\sigma^2)$

- 点 $\mathbf{x}$ 的误差可以被分解为三部分：
  $$
  \text{Err}(\mathbf{x})=
  \text{Bias}\left(\hat{f}\right)^2 + \text{Var}\left(\hat{f}\right) + \sigma^2
  $$
  其中，

  - $\text{Bias}(\hat{f})$ 为 **偏置** ，它度量了学习算法的期望输出与真实结果的偏离程度，刻画了算法的拟合能力；
  - $\text{Var}\left(\hat{f}\right)$ 为 **方差** ，它代表「同样大小的不同的训练数据集训练出的模型」与「这些模型的期望输出值」之间的差异。
  - $\sigma^2$ 为 **不可消除误差** ，它刻画了当前任务任何算法所能达到的期望泛化误差的下界，即刻画了问题本身的难度。

- 当模型计算量增加（自由参数数量增加），模型的方差增加、偏置下降，可能导致过拟合。当模型计算量太少（自由参数数量太少），可能导致欠拟合。

- 高斯-马尔科夫定理表明，在线性模型参数估计问题中，OLS 估计是最佳的线性无偏估计。对于所有无偏线性模型 $g$ ， $\text{Var}(\hat{f})\le\text{Var}(g)$ 。

## 线性回归的正则化

在一些情形下，会为了稳定性（降低模型的方差）而导致模型的偏置 $\text{Bias}(\hat{f})$ 提高。高斯-马尔可夫定理成立的条件之一就是矩阵 $\mathbf{X}$ 是满秩的，否则矩阵 $\mathbf{X}^{\text{T}}\mathbf{X}$ 为奇异矩阵（退化矩阵），其逆矩阵 $(\mathbf{X}^{\text{T}}\mathbf{X})^{-1}$ 不存在，使得 OLS 的解 $(\mathbf{X}^{\text{T}}\mathbf{X})^{-1}\mathbf{X}^{\text{T}}\mathbf{y}$ 也不存在。这类问题被称为 **病态问题** ，必须通过 **正则化过程** 加以矫正。

- **吉洪诺夫（Tikhonov）正则化**：在均方误差的中加入新变量
  $$
  \mathcal{L}\left(\mathbf{X}, \mathbf{y}, \mathbf{w} \right) = \frac{1}{2n} \left\| \mathbf{y} - \mathbf{X} \mathbf{w} \right\|_2^2 + \left\| \Gamma \mathbf{w}\right\|^2
  $$

- **吉洪诺夫矩阵**：$\Gamma=\frac{\lambda}{2}E$ ，可以将最小化均方误差问题变为 **L2正则化问题** ，其解为
  $$
  \mathbf{w} = \left(\mathbf{X}^{\text{T}} \mathbf{X} + \lambda \mathbf{E}\right)^{-1} \mathbf{X}^{\text{T}} \mathbf{y}
  $$

这一类回归问题被称为 **岭回归（Ridge Regression）** ，「岭」指的是对角矩阵，它可以保证 $\mathbf{X}^\text{T} \mathbf{X}$ 是一个正则矩阵。

岭回归降低了方差，但增加了偏置。参数的正则向量也被最小化，使得解向 $\vec{\mathbf{0}}$ 移动。

## 线性分类

- 基本思路：目标分类的值可以被特征空间中的一个超平面分开。

- 如果这可以无误差地达成，那么训练集被称为 **线性可分** 。

- 对于二分类问题，将正例和反例分别记为 $+1$ 和 $-1$ ，则线性分类器可以通过回归进行定义：
  $$
  a(\mathbf{x}) = \text{sign}(\mathbf{w}^\text{T}\mathbf x)
  $$
  其中，

   - $\mathbf{x}$ 是特征向量（包括标识）。
   - $\mathbf{w}$ 是线性模型中的权重向量（偏置为 $w_0$）。
   - $\text{sign}(\bullet)$ 是符号函数，返回参数的符号。
   - $a(\mathbf{x})$ 是分类 $\mathbf{x}$ 的分类器。

## 基于逻辑回归的线性分类器

逻辑回归是线性分类器的一个特殊情形，但逻辑回归有一个额外的优点：它可以预测样本 $\mathbf{x}_\text{i}$ 为分类「+」的概率 $p_+$：
$$
p_+ = P\left(y_i = 1 \mid \mathbf{x}_\text{i}, \mathbf{w}\right) =
\sigma(\mathbf{w}^{\text{T}}\mathbf{x})
$$
首先使用 OLS 构造预测
$$
b(\mathbf{x}) = \mathbf{w}^\text{T} \mathbf{x} \in \mathbb{R}
$$
随后，使用 **Sigmoid 函数** 将预测值压缩到 $[0,1]$ 区间
$$
\sigma(z) = \frac{1}{1 + e^{-z}}
$$

## 极大似然估计与逻辑回归

- 向量 $\vec{\mathbf{x}_A}$ 与平面 $\mathbf{w}^{\text{T}}\mathbf{x}=0$ 的距离定义为
  $$
  \rho(\mathbf{x_A},\mathbf{w}^{\text{T}}\mathbf{x}=0) =
  \frac{\mathbf{w}^{\text{T}}\mathbf{x_A}}{\|\mathbf{w}\|}
  $$
  表达式 $\mathbf{w}^\text{T}\mathbf{x}_\text{i}$ 的绝对值越大，点 $\mathbf{x}_\text{i}$ 离平面 $\mathbf{w}^\text{T}\mathbf{x} = 0$ 的距离就越远。

- 逻辑损失函数定义为
  $$
  \mathcal{L_{\log}} (\mathbf X, \mathbf{y}, \mathbf{w}) = \sum_{i=1}^{\ell} \log (1 + \exp^{-y_i\mathbf{w}^\text{T}\mathbf{x}_\text{i}})
  $$
  用分类边缘 $M(x_i)$ 改写损失函数，则有 $L(M)=\log(1+e^{-M})$ 。

## 逻辑回归的 L2 正则化

其正则化过程和岭回归类似，最小化以下等式
$$
\mathcal{J}(\mathbf X, \mathbf{y}, \mathbf{w}) = \mathcal{L_{\log}} (\mathbf X, \mathbf{y}, \mathbf{w}) + \lambda |\mathbf{w}|^2
$$
在逻辑回归中，一般使用正则化系数的倒数 $C=\frac{1}{\lambda}$ ：
$$
\hat{\mathbf w}  = \arg \min_{\mathbf{w}} \mathcal{J}(\mathbf X, \mathbf{y}, \mathbf{w}) =  \arg \min_{\mathbf{w}}\ (C\sum_{i=1}^{\ell} \log (1 + \exp^{-y_i\mathbf{w}^\text{T}\mathbf{x}_\text{i}})+ |\mathbf{w}|^2)
$$

## 验证和学习曲线

- 简单模型的训练误差和验证误差很接近，且都比较大。这暗示模型欠拟合，参数数量不够多。
- 高度复杂模型的训练误差和验证误差相差很大，这暗示模型过拟合。当参数数量过多或者正则化不够严格时，算法可能被数据中的噪声「转移注意力」，没能把握数据的整体趋势。

## 数据对于模型的影响（学习曲线）

- 事先固定模型的参数，将误差视为训练集样本数量的函数，改变训练集大小，查看模型质量与训练集数据量之间的依赖关系。
- 对于少量数据而言，训练集和交叉验证集之间的误差差别（方差）相当大，这暗示了过拟合。
- 同样的模型，使用大量数据，误差「收敛」，暗示了欠拟合。
- 加入更多数据，该训练集的误差不会增加，且该验证集上的误差也不会下降。
- 尽管曲线收敛，但学习曲线和验证曲线普遍下移（AUC值下降），同样暗示过拟合。
