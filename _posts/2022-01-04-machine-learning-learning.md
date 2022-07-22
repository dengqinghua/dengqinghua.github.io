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
- 目标, 找到最小值: $$minimize_{\theta_0\theta_1} {1 \over2m} \sum_{i=1}^m(h_\theta(x^{(i)}) - y^{(i)})^2 $$
- Cost Function 定义为 $$J(\theta_0, \theta_1) = {1 \over2m} \sum_{i=1}^m(\hat y_i - y^{(i)})^2 = {1 \over2m} \sum_{i=1}^m(h_\theta(x^{(i)}) - y^{(i)})^2$$
- 目标: $$minimize_{\theta_0\theta_1} J(\theta_0, \theta_1)$$ 为平方差代价函数
- 目标: $$J(\theta_0, \theta_1)$$ 导数为 0 的那个 $$\theta_1$$ 的值

| Hypothesis(假设) | Paramemters(参数) | CostFunction | Goal |
| :-------------: | :-------------: | :-------------: | :-------------: |
| $$h_\theta = \theta_0 + \theta_1 x$$ | $$\theta_0, \theta_1$$  | $$J(\theta_0, \theta_1) = {1 \over2m} \sum_{i=1}^m(h_\theta(x^{(i)}) - y^{(i)})^2$$  | $$minimize_{\theta_0\theta_1} J(\theta_0, \theta_1)$$ |

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

>
在这之前，需要复习几个[求导法则](https://baike.baidu.com/item/%E6%B1%82%E5%AF%BC/1063861)。有助于理解下面的公式计算
>
假设 $$u(x),v(x)$$ 均可导, 则
>
  $$
  \begin{align}
  (u(x) \pm v(x))^{'} &= u^{'}(x) \pm v^{'}(x) \\
  (u(x)v(x))^{'} &= u^{'}(x)v(x) + u(x)v^{'}(x) \\
  (u(v(x)))^{'} &= u^{'}(x)v(x) \\
  ({u(x) \over v(x)})^{'} &= \frac{u^{'}(x)v(x) - u(x)v^{'}(x)}{v^2(x)} \\
  (cu(x))^{'} &= cu^{'}(x) \text{, c 为常数} \\
  \end{align}
  $$

| Hypothesis(假设) | Paramemters(参数) | CostFunction | Goal |
| :-------------: | :-------------: | :-------------: | :-------------: |
| $$h_\theta = \theta_0 + \theta_1 x$$ | $$\theta_0, \theta_1$$  | $$J(\theta_0, \theta_1) = {1 \over2m} \sum_{i=1}^m(h_\theta(x^{(i)}) - y^{(i)})^2$$  | $$minimize_{\theta_0\theta_1} J(\theta_0, \theta_1) $$ |

1. 对 CostFunction 求导数

    $$
    \begin{align}
    \frac{\partial}{\partial \theta_j} J(\theta) &= {1 \over m} \sum_{i=1}^m((h_\theta(x^{(i)}) - y^{(i)})^{'}(h_\theta(x^{(i)}) - y^{(i)})) \\
           &= {1 \over m} \sum_{i=1}^m(h^{'}_\theta(x^{(i)})(h_\theta(x^{(i)}) - y^{(i)})) \\
           &= {1 \over m} \sum_{i=1}^m(\theta_0 + \theta_1 x^{(i)})^{'}(h_\theta(x^{(i)}) - y^{(i)})) \\
    \end{align}
    $$

    $$
    \begin{align}
    \frac{\partial}{\partial \theta_0} J(\theta) &= {1 \over m} \sum_{i=1}^m(\theta_0 + \theta_1 x^{(i)})^{'}(h_\theta(x^{(i)}) - y^{(i)})) \\
           &= {1 \over m} \sum_{i=1}^m(h_\theta(x^{(i)}) - y^{(i)})) \\
           &= {1 \over m} \sum_{i=1}^m(\theta_0 + \theta_1 x^{(i)} - y^{(i)}))
    \end{align}
    $$

    $$
    \begin{align}
    \frac{\partial}{\partial \theta_1} J(\theta) &= {1 \over m} \sum_{i=1}^m(\theta_0 + \theta_1 x^{(i)})^{'}(h_\theta(x^{(i)}) - y^{(i)})) \\
           &= {1 \over m} \sum_{i=1}^m(x^{(i)})(\theta_0 + \theta_1 x^{(i)} - y^{(i)}))
    \end{align}
    $$

2. 将 导数 部分代入到 梯度下降算法中

    $$
    \begin{align}
    \text{repeat untile convergence...} &\{ \\
    temp0 &:= \theta_0 - {\alpha \over m} \sum_{i=1}^m(\theta_0 + \theta_1 x^{(i)} - y^{(i)})) \\
    temp1 &:= \theta_1 - {\alpha \over m} \sum_{i=1}^m(x^{(i)})(\theta_0 + \theta_1 x^{(i)} - y^{(i)})) \\
    \theta_0 &:= temp0 \\
    \theta_1 &:= temp1 \\
    &\}
    \end{align} \\
    $$

metrics 和 vectors

下面为一个 2 x 3 的矩阵

$$
A = \begin{bmatrix}
1 & 2 & 3 \\
1 & 3 & 5 \\
\end{bmatrix}
$$

$$ A_{ij}$$ 为 第 i 行，第 j 列的值，注意 i，j 都是从 1 开始的

vector: n x 1 的矩阵, 如下为 3维 vector

$$
A = \begin{bmatrix}
1 \\
2 \\
3 \\
\end{bmatrix}
$$


- 矩阵的乘法: $$A_{m,n} \times x_{n,1} = y_{m,1}\\
A_{m,n} \times B_{n,o} = C_{m,o} $$
- 1-indexed vs 0-indexed vector
- 大写字母表示矩阵，小写字母表示向量
- 矩阵运算见[这里](https://baike.baidu.hk/item/%E7%9F%A9%E9%99%A3/18069)
- scalar 标量，raw number
- 使用 矩阵运算，而不是 for 运算，能够更加简洁，高效地计算。
    ![for-matrix-example](assets/images/for-matrix-example.png)
- 不满足交换律: $$A \times B \neq B \times A$$ (not commutative)
- 满足结合律: $$(A \times B) \times C  = A \times (B \times C)$$ (associative)
- 单位矩阵，Diagonal or Identity Matrix：$$I_{n \times n}$$
- 单位矩阵满足：$$ A_{m,n} \times I_{n,n} = I_{m,m} \times A_{m,n} = A_{m,n} $$
- 逆矩阵 matrix inverse。$$AA^{-1} = A^{-1}A = I$$ 则 $$A^{-1}$$ 为 A 的 逆矩阵 (A为 mxm 矩阵，也就是 square matrix, 方阵)
- 奇异矩阵 sigular matrix，没有逆矩阵的矩阵
- 转置矩阵 transpose matrix

  $$
  A = \begin{bmatrix}
  1 & 2 & 3 \\
  1 & 3 & 5 \\
  \end{bmatrix},

  A^T = \begin{bmatrix}
  1 & 1 \\
  2 & 3 \\
  3 & 5 \\
  \end{bmatrix}
  $$
- octave 中矩阵的操作可参考[这里](http://www.philender.com/courses/multivariate/notes/matoctave.html)

#### Week2
使用 vector 和 matrix 来表示 multi feature hypothesis，多维度的假设函数

$$
\begin{align}h(\theta) &= \theta_0 + \theta_1 x_1 + \theta_2 x_2 + \cdots + \theta_n x_n \\
&= \theta_0 x_0 + \theta_1 x_1 + \theta_2 x_2 + \cdots + \theta_n x_n \text{ for } x_0 = 1 \\
&= \begin{bmatrix}
\theta_0 & \theta_1 & \cdots & \theta_n
\end{bmatrix}
\times \begin{bmatrix}
x_0 \\
x_1 \\
\vdots \\
x_n
\end{bmatrix} \\
&= \theta^T \times x
\end{align}
$$

其中 $$\theta$$ 和 $$x$$ 均为 vector

使用矢量/矩阵来实现多特征梯度下降 (multi feature gradient descent)

| Hypothesis(假设) | Paramemters(参数) | CostFunction | Goal |
| :-------------: | :-------------: | :-------------: | :-------------: |
| $$\begin{align}y^{(i)} &= \theta_0 x_0^{(i)} + \theta_1 x_1^{(i)} + \cdots + \theta_n x_n^{(i)} \\ &= (x^{(i)})^{T} \times \theta \\ Y &= X \times \theta \end{align}$$ |$$\theta = \begin{bmatrix} \theta_0 \\ \theta_1 \\ \cdots \\ \theta_n \end{bmatrix}$$ | $$J(\theta) = {1 \over2m} \sum_{i=1}^m(h_\theta(x^{(i)}) - y^{(i)})^2$$  | $$minimize_{\theta} J(\theta_0, \theta_1, \cdots, \theta_n) $$ |

Gradient Descent

$$\begin{align}
\text{repeat } &\{ \\
\theta_j &:= \theta_j - \alpha \frac{\partial}{\partial \theta_j} {J(\theta)},\text{ for } j=0, 1, \cdots, n \\
         &:= \theta_j - \alpha \sum_{i=1}^m(x^{(i)}_{j})(h_\theta - y^{(i)})) \\
\}
\end{align}
$$

- feature scaling, 将特征值进行缩放，使得图形能够更快地收敛

    ![feature-scale](assets/images/feature-scale.png)

- 使得所有的特征的值接近 $$-1 \leq x \leq 1$$ 的区间，建议是差别不超过三倍
- Mean Normalization, 归一化 $$ x = \frac{ x - \mu }{s} $$, 其中 $$\mu$$ 为特征 x 的均值, s 为(最大值-最小值) 或者是标准差
- 特征缩放不需要非常准备
- 选择 $$\alpha$$ (Learning rate) 的技巧。变小的幅度小于 $$10^{-3}$$ 便可停止了
- Polynomial Regression 多项式回归, 如 $$h_\theta = \theta_0 x_0 + \theta_1 x_1^2 + \cdots + \theta_n x_n^n$$
- Polynomial Regression 的参数的 scaling 很重要，因为数值会随着 $$x^n$$ 的 n 指数型增长
- 模型变量的选择：可以是原始变量的组合。
- Normal Equation, 一次性求解出所有的 $$\theta$$，类似于解矩阵方程的思路，下面是结果。参考 [机器学习笔记03：Normal equation与梯度下降的比较](https://blog.csdn.net/artprog/article/details/51172025) 其中 m 为样本数，n 为特征数 和 [复杂度分析](https://stanford.edu/~rezab/classes/cme323/S15/notes/lec11.pdf)

    | Hypothesis(假设) | features $$X_{(m, n+1)}$$ | Paramemters $$\theta$$ | Normal Equation Answer |
    | :-------------: | :-------------: | :-------------: | :-------------: |
    | $$\begin{align}y^{(i)} &= \theta_0 x_0^{(i)} + \theta_1 x_1^{(i)} + \cdots + \theta_n x_n^{(i)} \\ &= (x^{(i)})^{T} \times \theta \\ Y &= X \times \theta \end{align}$$ | $$X = \begin{bmatrix} (x^{(1)})^{T} \\ (x^{(2)})^{T} \\ \cdots \\  (x^{(m)})^{T} \\ \end{bmatrix}$$ |  $$\theta = \begin{bmatrix} \theta_0 \\ \theta_1 \\ \cdots \\ \theta_n \end{bmatrix}$$ | $$\theta = (X^TX)^{(-1)}X^TY$$ |

- Normal Equation 不需要做 feature scaling，但是在 n 比较大(>10000)的时候比较慢，计算 $$(X^TX)^{(-1)}$$ 的复杂度为 $$O(n^3)$$
- 什么时候矩阵是奇异矩阵，见[这里](https://byjus.com/maths/singular-matrix/#:~:text=What%20is%20Singular%20Matrix%3F,if%20its%20determinant%20is%200.)

### octave tutorial
```
a = 1:0.1:2 % 从 1 到 2 以 0.1 为步长
zeros(2, 3) % 2行3列的全是0的矩阵
ones(2, 3) % 2行3列的全是1的矩阵
rand(2, 3) % 2行3列的【0到1之间的】随机数的矩阵
randn(1, 3) % 平均值为0，方差为1的高斯分布的随机矩阵
w = -6 + sqrt(10) * (randn(1, 10000)); hist(w) % 画出直方图(histogram)
eye(10) % 单位矩阵，eye 代表的是 I 的意思
pwd % 当前的路劲 类似还可以用 cd, ls 等
who % 查看当前的作用域 whos
save % 保存矩阵到对应的文件 save new.dat v
C = [3 4;2 2] % 可以省去逗号
1./C % =[1/3 1/4; 1/2 1/2]
```

plot
```
% 还可以设置坐标名称，线名称，颜色等等
t = [0:0.01:0.98]
y1 = sin(2 * pi * t)
plot(t, y1)
hold on % 画第二个图
y2 = cos(2 * pi * t)
plot(t, y2)
xlabel("横坐标")
ylabel("纵坐标")
legend("线的定义")
title("图片标题")
print -dpng % 保存文件
close % 关闭

% 定义图一和图二
figure(1); plot(t, y1)
figure(2); plot(t, y2)

% 将图分隔展示
subplot(1,2,1);plot(t, y1)
subplot(1,2,2);plot(t, y2)

% 修改中轴线
axis
```

vectorization

将数值运算，变成矩阵运算

#### Week3
分类 classification

## Reference
- [机器学习的思考故事](https://aistudio.baidu.com/aistudio/education/group/info/1138)
- [零基础实践机器学习](https://aistudio.baidu.com/aistudio/course/introduce/1297)
- [吴恩达在 coursera 的机器学习课程](https://www.coursera.org/learn/machine-learning/home/welcome)
