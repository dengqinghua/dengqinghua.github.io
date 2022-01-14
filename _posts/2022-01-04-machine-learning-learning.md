---
layout: post
categories: showed note
title: 机器学习
---

## 机器学习的思考故事

## 吴恩达
### Machine Learning
#### Week1
> 1. 学习算法，模拟人类大脑的学习方式
> 2. Machine Learning defined by Arthur Samuel(1959), ability to learn without explictly programmed
> 3. E, T, P

- Supervised Learning
  + 给出现有的结果集(Right Answers for each example)，去推导因果关系
  + Regression Problem, 回归问题, 预测的是 连续的数据
  + Classification Problem, 分类问题，预测的是 有限的取值
  + Infinite number of features, 无限的特征和属性
- UnSupervised Learning
  + No labels
  + clusters，聚类
- 工具: octave
- 鸡尾酒会效应(cocktail-party-effect), 人们可以在嘈杂的环境进行交谈，忽略掉背景噪声而听到对方的谈话。属于 图形-背景现象 的听觉版本

线性代数算法

- Training Set
- m: numbers of training examples
- x's = input / features
- y's = output / target variable
- $$(x, y)$$ training example
- $$(x^{(i)}, y^{(i)})$$ case of i, i 为 index
- h hypothesis, 假设 $$y = h(x)$$
- linare regression with one variable $$h_\theta = \theta_0 + \theta_1 x$$
- univariate linear regression 单变量线性回归
- 目标, 找到最小值: $$minimize_{\theta_0\theta_1} {1 \over2m} \sum_{i=0}^m(h_\theta(x^{(i)}) - y^{(i)})^2 $$
- Cost Function 定义为 $$J(\theta_0, \theta_1) = {1 \over2m} \sum_{i=0}^m(\hat y_i - y^{(i)})^2 = {1 \over2m} \sum_{i=0}^m(h_\theta(x^{(i)}) - y^{(i)})^2$$
- 目标: $$minimize_{\theta_0\theta_1} J(\theta_0, \theta_1)$$ 为平方差代价函数
- 目标: $$J(\theta_0, \theta_1)$$ 导数为 0 的那个 $$\theta_1$$ 的值

| Hypothesis(假设) | Paramemters(参数) | CostFunction | Goal |
| :-------------: | :-------------: | :-------------: | :-------------: |
| $$h_\theta = \theta_0 + \theta_1 x$$ | $$\theta_0, \theta_1$$  | $$J(\theta_0, \theta_1) = {1 \over2m} \sum_{i=0}^m(h_\theta(x^{(i)}) - y^{(i)})^2$$  | $$minimize_{\theta_0\theta_1} J(\theta_0, \theta_1)$$ |

- contour plot, 画图的软件, 见 [这里](https://www.itl.nist.gov/div898/handbook/eda/section3/contour.htm) 和 [JS 版本](https://plotly.com/javascript/contour-plots/)

梯度下降算法 Gradient Descent

每次寻找对应的 $$\theta_0, \theta_1$$，使得下面的值越来越小

$$J(\theta_0, \theta_1)$$

步骤:

$$\text{repeat untile convergence} \\
\\ \theta_j := \theta_j - \alpha \frac{\partial}{\partial \theta_j} {J(\theta_0, \theta_1)},\text{ for (j=0 and j=1)}$$

- $$ \alpha $$ 为 learning rate，越大代表下降越快。
- 需要同时更新 $$\theta_0, \theta_1$$ 的值

    | $$temp0 := \theta_0 - \alpha \frac{\partial}{\partial \theta_0} {J(\theta_0, \theta_1)}$$ |
    | $$temp1 := \theta_1 - \alpha \frac{\partial}{\partial \theta_1} {J(\theta_0, \theta_1)}$$ |
    | $$\theta_0 := temp0$$ |
    | $$\theta_1 := temp1$$ |

![gradient-descent](assets/images/gradient-descent.png)

- 通过斜率的变化，来动态调整参数的值，使得达到收敛(converge)的点, 也就是图中的最低点的位置
- 偏离 diverge
- $$ \alpha $$ 很小，则找到具体的点会比较慢, 过大，则容易错过最优点
- 根据导数的值的大小，动态地调整 $$ \alpha $$ 的值

- convex 凸函数(bowl shaped function)

第一个机器学习的算法

| Hypothesis(假设) | Paramemters(参数) | CostFunction | Goal |
| :-------------: | :-------------: | :-------------: | :-------------: |
| $$h_\theta = \theta_0 + \theta_1 x$$ | $$\theta_0, \theta_1$$  | $$J(\theta_0, \theta_1) = {1 \over2m} \sum_{i=0}^m(h_\theta(x^{(i)}) - y^{(i)})^2$$  | $$minimize_{\theta_0\theta_1} J(\theta_0, \theta_1)$$ |

1. 对 CostFunction 求导数

    $$
    \begin{align}
    \frac{\partial}{\partial \theta_j} J(\theta) &= {1 \over m} \sum_{i=0}^m(h_\theta(x^{(i)}) - y^{(i)}) \\
           &= {1 \over m} \sum_{i=0}^m(h_\theta(x^{(i)}) - y^{(i)}) \\
           &= {1 \over m} \sum_{i=0}^m((\theta_0 + \theta_1 x) - y^{(i)})
    \end{align}
    $$

2. 将 导数 部分代入到 梯度下降算法中

    $$
    \begin{align}
    \text{repeat untile convergence...} &\{ \\
    temp0 &:= \theta_0 - {\alpha \over m} \sum_{i=0}^m((\theta_0 + \theta_1 x) - y^{(i)}) \\
    temp1 &:= \theta_1 - {\alpha \over m} \sum_{i=0}^m((\theta_0 + \theta_1 x) - y^{(i)}) \\
    \theta_0 &:= temp0 \\
    \theta_1 &:= temp1 \\
    &\}
    \end{align} \\
    $$


## Reference
- [机器学习的思考故事](https://aistudio.baidu.com/aistudio/education/group/info/1138)
- [零基础实践机器学习](https://aistudio.baidu.com/aistudio/course/introduce/1297)
- [吴恩达在 coursera 的机器学习课程](https://www.coursera.org/learn/machine-learning/home/welcome)
