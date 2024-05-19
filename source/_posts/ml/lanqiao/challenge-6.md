---
layout: post
title: 挑战六
date: 2024-05-18 01:02:12
categories: 机器学习
mathjax: true
---

# 红酒质量数据回归探索

## 线性回归

- 问题：训练数据和测试数据上的平均绝对误差 MSE 值是多少？

  > ```python
  > mean_squared_error(
  > y_true=y_train, y_pred=linreg.predict(X_train_scaled)
  > ), mean_squared_error(
  > y_true=y_holdout, y_pred=linreg.predict(X_holdout_scaled)
  > )
  > ```
  >
  > 训练集和测试集的 MSE 分别为 0.558 和 0.584 。

- 问题：该线性回归模型中，哪些特征对目标值的影响更大？

  > 【注意】蓝桥云课 *Jupyter Notebook* 环境内置的 *Pandas v1.0.1* ，而本题中调用的功能需要 *Pandas v1.1.0* 及以上版本才有提供，我们需要另外升级 *Pandas* 。
  >
  > ```python
  > # 此时会升级到 v1.3.2
  > !pip install -U pandas
  >
  > pd.DataFrame({
  > 'Feature': X.columns,
  > 'Coefficent': linreg.coef_
  > # 排序键参数（callable）是 Pandas v1.1.0 引入的新参数
  > # 我们需要用这个参数对回归系数求绝对值，按绝对值排序
  > }).sort_values(by='Coefficent', key=np.abs, ascending=False)
  > ```
  >
  > 可以看出，红酒密度（Density）和残糖量（Residual Sugar）对目标值影响更大。

## Lasso 回归

- 代价函数：

  <div style="text-align: center; padding: 20px 0px;">
  <img src="https://dn-simplecloud.shiyanlou.com/courses/uid917549-20210902-1630588956243" />
  </div>

  - 问题： 该 Lasso 回归模型中，哪些特征对目标值的影响最小？

    > ```python
    > pd.DataFrame({
    >  'Features': X.columns,
    >  'Coefficent': lasso1.coef_
    > }).sort_values(by='Coefficent', key=np.abs, ascending=True)
    > ```
    >
    > 可以看出，固定酸（Fixed Acidity）、柠檬酸（Critic Acid）和总二氧化硫（Total Sulfur Dioxide）对目标值的影响最小。

  - 问题： 上面调参得到的 Lasso 回归模型中，哪些特征对目标值的影响最小？

    > ```python
    > pd.DataFrame({
    >  'Features': X.columns,
    >  'Coefficent': lasso_cv.coef_
    > }).sort_values(by='Coefficent', key=np.abs, ascending=True)
    > ```
    >
    > 可以看出，柠檬酸对目标值影响最小。

  - 问题： 调参得到的 Lasso 回归模型中，训练数据和测试数据上的平均绝对误差 MSE 值是多少？

    > ```python
    > print('训练数据：', mean_squared_error(y_train, lasso_cv.predict(X_train_scaled)))
    > print('测试数据：', mean_squared_error(y_holdout, lasso_cv.predict(X_holdout_scaled)))
    > ```
    >
    > 训练数据上约为 0.588 ，测试数据上约为 0.583 。

## 随机森林

葡萄酒质量数据集中特征和目标之间呈现较强的非线性关系，所以随机森林在这项任务中工作得更好。
