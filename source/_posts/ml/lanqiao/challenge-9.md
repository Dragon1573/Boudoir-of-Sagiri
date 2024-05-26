---
layout: post
title: 挑战九
date: 2024-05-18 01:10:45
categories: 机器学习
---

# 时间序列分析应用练习

## 数据集

- 下载地址：[阿里云 OSS 服务](https://labfile.oss.aliyuncs.com/courses/1283/wiki_machine_learning.csv)
- 来源：维基百科特定词条每日浏览量

## Prophet 建模预测

在 *Pandas* 中，数据集的时间字段会默认以 `object` 数据类型载入，需要调用 `pandas.to_datetime()` 函数将字段转换为可用于时间计算的 `datetime` 数据类型。

- 问题：请使用 *Prophet* 对 `train_df` 数据建模，预测后 30 天的结果。并回答 1 月 20 日当天的预测结果是多少？

  > ```python
  > from fbprophet import Prophet
  > 
  > model = Prophet()
  > model.fit(train_df)
  > pred_df = model.make_future_dataframe(periods=30, freq='D', include_history=False)
  > pred_df = model.predict(pred_df)
  > pred_df[['ds', 'yhat']]
  > ```
  >
  > 通过以上的建模预测，我们可以得到如下表格：
  >
  > |     ds     |    yhat     |
  > |:----------:|:-----------:|
  > | 2015-12-22 | 3385.507108 |
  > |   ......   |   ......    |
  > | 2016-01-20 | 3426.449686 |
  >
  > 因此，1月20日当天的预测结果约为3426次。

- 问题：Prophet 预测值和真实值之间的 MAPE 和 MSE 值为多少？

  > ```python
  > def mean_abosulute_percentage_error(y_true, y_pred):
  >     assert y_true.shape[0] == y_pred.shape[0]
  >     return np.mean(np.abs(100.0 * (y_true.values - y_pred.values) / y_true.values))
  >
  > from sklearn.metrics import mean_squared_error
  >
  > (
  >     mean_abosulute_percentage_error(df.y, pred_df.yhat),
  >     mean_squared_error(df.y, pred_df.yhat)
  > )
  > ```
  >
  > - *sklearn* 中没有内置计算 MAPE 的接口，需要我们自己定义函数进行计算
  > - `pandas.Series` 之间无法直接进行数值计算，需要对相应对象调用 `.values` 获取 *NumPy* 数组再进行计算
  >
  > 通过以上计算可以得出，*Prophet* 预测值与真实值之间的 MAPE 和 MSE 分别约为 10.6 和 142539.3 。

## ARIMA 建模预测

- 问题：下面使用 Dickey-Fuller 测试来验证序列的平稳性。`train_df` 是平稳序列吗？最终的 p 值是多少？

  > ```python
  > sm.tsa.seasonal_decompose(train_df['y'].values, freq=7).plot()
  > print("Dickey-Fuller test: p=%f" % sm.tsa.stattools.adfuller(train_df['y'])[1])
  > ```
  >
  > 从绘制生成的4张图中可以看出，仅有 Seasonal 呈周期性稳定震荡，其他都不具有平稳性，因此 `train_df` 不是平稳序列；最终计算得出 p 值约为 0.107392 。
