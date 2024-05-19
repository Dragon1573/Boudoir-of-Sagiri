---
layout: post
title: 挑战二
date: 2024-05-16 23:43:14
categories: 机器学习
---

# 心血管疾病数据探索分析

## 数据集特征表示

|   Feature    | Variable Type |  Variable   |              Value Type               |
| :----------: | :-----------: | :---------: | :-----------------------------------: |
|     年龄     |   基础事实    |     age     |               int (天)                |
|     身高     |   基础事实    |   height    |              int (厘米)               |
|     体重     |   基础事实    |   weight    |             float (千克)              |
|     性别     |   基础事实    |   gender    |               类别编码                |
|    收缩压    |   体检结果    |    ap_hi    |            int（毫米汞柱）            |
|    舒张压    |   体检结果    |    ap_lo    |            int（毫米汞柱）            |
|   血胆固醇   |   体检结果    | cholesterol | 1: 正常<br />2: 过高<br />3: 严重过高 |
|   血葡萄糖   |   体检结果    |    gluc     | 1: 正常<br />2: 过高<br />3: 严重过高 |
|    吸烟者    |   主观反馈    |    smoke    |                binary                 |
|     酗酒     |   主观反馈    |    alco     |                binary                 |
|   体育运动   |   主观反馈    |   active    |                binary                 |
| CVD 风险指数 |   目标结果    |   cardio    |                binary                 |

## 进一步观察

1. 问题：数据集中有多少男性和女性？由于 `gender` 特征没有说明男女，你需要通过分析身高计算得出。

   > 通过对各 **性别** 标签进行统计，可以排除 C/D ；
   >
   > ```python
   > df['gender'].value_counts()
   > ```
   >
   > 对 **性别** 分组后统计各组平均 **身高** ，按常规判断 **女性比男性更为娇小** ，可以确定答案为 A 。
   >
   > ```python
   > df.groupby('gender')['height'].mean()
   > ```

2. 问题：数据集中男性和女性，哪个群体饮酒的频次更高？

   > ```python
   > df[df['alco'] == 1]['gender'].value_counts()
   > ```
   >
   > **[ B ] 男性** 更高，这恒河里～

3. 问题：数据集中男性和女性吸烟者所占百分比的差值是多少？

   > ```python
   > df.groupby('gender')['alco'].mean()
   > ```
   >
   > 先对性别分组，再对吸烟列平均值聚合。由于吸烟列是由 0/1 组成的二值属性，其平均值即为各性别吸烟者比值。

4. 问题：数据集中吸烟者和非吸烟者的年龄中位数之间的差值（以月计）近似是多少？你需要尝试确定出数据集中 `age` 合理的表示单位。

   > ```python
   > _cache = pd.pivot_table(
   > data=df, index='smoke', values='age', aggfunc=np.median
   > ).apply(lambda _: _ / 365.25 * 12)
   > abs(_cache.iloc[0, 0] - _cache.iloc[1, 0])
   > ```
   >
   > 结果接近 **20个月** 。

## 风险量表图

1. 问题：计算 $[60,65)$ 年龄区间下，较健康人群（胆固醇类别 1，收缩压低于 120）与高风险人群（胆固醇类别为 3，收缩压 $[160,180)$ ）各自心血管病患所占比例。并最终求得二者比例的近似倍数。

   > 后续步骤使用了 `age_years` 列，而原始给出的 `age` 列以天为单位。通过 `map()` 方法和前文提及的 1年=365.25天 ，计算生成 `age_years` 列。
   >
   > ```python
   > ## 整除配合类型转换获得整数
   > df['age_years'] = df['age'].map(lambda _: round(_ / 365.25)).astype(int)
   > ```
   >
   > 根据挑战内置的代码片段，我们计算得出的两个比例为 $27.8\%$ 和 $92.9\%$ ，比例约为 3.35 倍。

## BMI 指数分析

1. 问题：判断正确的描述。

   > 数据集提供的 **身高** 以厘米为单位，需要进行单位转换再计算 BMI 指数。
   >
   > ```
   > df['BMI'] = df['weight'] / np.power(df['height'].map(lambda _: _ / 100), 2)
   > ```
   >
   > - [ A ] 数据集样本中 BMI 中位数在正常范围内。
   >
   >   ```
   >   df['BMI'].median()
   >   ```
   >
   >   计算结果 26.3 左右，然而并没有
   >
   > - [ B ] 女性的平均 BMI 指数高于男性。
   >
   >   ```python
   >   print('女性平均BMI：', df[df['gender'] == 1]['BMI'].mean())
   >   print('男性平均BMI：', df[df['gender'] == 2]['BMI'].mean())
   >   ```
   >
   >   女性接近 30 ，男性接近 27 。
   >
   > - [ C ] 健康人群的 BMI 平均高于患病人群。
   >
   >   ```python
   >   print('健康人群：', df[df['cardio'] == 0]['BMI'].mean())
   >   print('患病人群：', df[df['cardio'] == 1]['BMI'].mean())
   >   ```
   >
   >   健康约 26.55 ，患病约 28.566 。
   >
   > - [ D ] 健康和不饮酒男性中，BMI 比健康不饮酒女性更接近正常值。
   >
   >   ```python
   >   ## 健康不饮酒人群
   >   health_noalco = df[(df['cardio'] == 0) & (df['alco'] == 0)]
   >   ## 获取不同性别的平均 BMI
   >   health_noalco.groupby(by='gender')['BMI'].mean().rename(index={1: 'Female', 2: 'Male'})
   >   ```
   >
   >   男性约 25.87 ，女性约 26.845 。

## 数据清洗

1. 问题：请按照以下列举的项目，过滤掉数据中统计有误的部分：

   > ```
   > ## 后续进行原地操作
   > df = df[
   >      ## 血压特征中，舒张压高于收缩压的样本
   >      (df['ap_lo'] <= df['ap_hi']) &
   >      ## 身高特征中，低于 2.5％ 分位数的样本
   >      (df['height'].quantile(0.025) <= df['height']) &
   >      ## 身高特征中，高于 97.5％ 分位数的样本
   >      (df['height'] <= df['height'].quantile(0.975)) &
   >      ## 体重特征中，低于 2.5％ 分位数的样本
   >      (df['weight'].quantile(0.025) <= df['weight']) &
   >      ## 体重特征中，高于 97.5％ 分位数的样本
   >      (df['weight'] <= df['weight'].quantile(0.975))
   > ]
   > ```

2. 问题：清洗掉的数据占原数据总量的近似百分比？

   > 清洗后剩余数据集数量约为 63259 条，洗去数据占比约为 13.34% 。

## 数据可视化分析

1. 问题：使用 Seaborn 热力图绘制特征之间的皮尔逊相关性系数矩阵。

   > ```
   > peason_matrix = df.corr()
   > sns.heatmap(data=peason_matrix, annot=True, fmt='.1f')
   > ```
   >
   > 先使用 `DataFrame.corr()` 计算相关系数矩阵，再对矩阵进行可视化，使用 `annot` 关键字在图表上显示相关性数值。

2. 问题：以下哪组特征与性别的相关性更强？

   > 根据色彩和数值，我们发现身高（0.5）和吸烟（0.3）与性别相关性更强（对应选项B）。

## 男女身高分布

1. 问题：绘制身高和性别之间的小提琴图。

   > 由于题目要求的小提琴图只涉及两个变量，因此并不需要使用 `hue` 参数来进行划分，将身高和性别分别设置成 $x$ 和 $y$ 即可。
   >
   > ```python
   > sns.violinplot(data=df, y='height', x='gender', scale='count')
   > ```

2. 问题：绘制身高和性别之间的核密度图。

   > ```python
   > (sns.FacetGrid(df, hue="gender", height=12)
   >  .map(sns.kdeplot, "height").add_legend())
   > ```
   >
   > 为了让两张独立的核密度图叠在一起，需要使用 `sns.FacetGrid` 构造多图层数据网格图，随后，借助 `.map()` 将不同性别的身高核密度图映射到网格中。

3. 问题：使用热力图绘制特征之间的斯皮尔曼等级相关系数矩阵。

   > ```python
   > sns.heatmap(data=df.corr(method='spearman'), annot=True, fmt='.1f')
   > ```
   >
   > 通过在 `DataFrame.corr()` 中指定 `method` 参数，可以切换相关系数的计算方式。除去主对角线上的 $1.0$ 之外，仅有 `ap_hi` 和 `ap_lo` 之间具备 $0.7$ 的相关度。

## 年龄可视化

1. 问题：请使用统计图绘制年龄分布计数图，横坐标为年龄，纵坐标为对应的人群数量。

   > ```python
   > sns.countplot(data=df, x='age_years', hue='cardio')
   > ```

2. 问题：在哪个年龄下，心血管疾病患者人数首次超过无心血管疾病患者人数？

   > 根据图表，55岁后心血管疾病患者数量远超常人数量。
