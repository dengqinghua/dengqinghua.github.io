---
layout: post
categories: showed note
title: 机器学习
---

## 词汇

- ML, machine learning
- generic algorithms, 范式算法
- supervised learning, 监督式学习, 明确知道答案, 去推导答案
- unsupervised learning, 非监督学习, 不知道答案, 生产一个答案
- LEARNING, AKA: figuring out an equation to solve a specific problem based on some example data
- weight: 权重
- stateless algorithm: 无状态的算法, 比如神经网络的计算, 每次算法之间不存在关联
- RNN: Recurrent Neural Networks, 可重复使用的神经网络

## 方法
1. 线性关系 (linear relationship)

    f(x, y, z) = ax + by + cz

2. neuron 神经元

  > 1. We made a simple estimation function that takes in a set of inputs and multiplies them by weights to get an output. Call this simple function a **neuron**.
  > 2. By chaining lots of simple neurons together, we can model functions that are too complicated to be modeled by one single neuron.


3. 状态模拟

{% mermaid %}
graph LR;
    Input-->StatefulMode-->Output;
    StatefulMode-- SaveState -->StatefulMode
{% endmermaid %}
