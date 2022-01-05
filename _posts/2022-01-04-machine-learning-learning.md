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
- 目标 $$minimize_{\theta_0\theta_1} J(\theta_0, \theta_1)$$ 为平方差代价函数


## Reference
- [机器学习的思考故事](https://aistudio.baidu.com/aistudio/education/group/info/1138)
- [零基础实践机器学习](https://aistudio.baidu.com/aistudio/course/introduce/1297)
- [吴恩达在 coursera 的机器学习课程](https://www.coursera.org/learn/machine-learning/home/welcome)
