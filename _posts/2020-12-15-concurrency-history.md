---
layout: post
category: concurrency conf
title: Concurrency History
---

本文为视频 [From Concurrent to Parallel](https://www.youtube.com/watch?v=NsDE7E8sIdQ) 的学习笔记

{% mermaid %}
graph TD;
    performance-->error;
    performance-->lantency;
    performance-->throughput;
{% endmermaid %}


---------------
{: data-content=" 硬件性能 "}

[The Free Lunch Is Over: A Fundamental Turn Toward Concurrency in Software](http://www.gotw.ca/publications/concurrency-ddj.htm)

![](assets/images/CPU_history.png)

**Software cannot keep the chip busy**

---------------
{: data-content=" 问题模型 "}

- 最大限度利用 CPU
- 最大限度的方式
  + 单核
    + blocking/non-blocking IO, 后台IO型任务 (background task), 让出任务时钟
  + 多核
    + 粗粒度(coarsed-grained) task-based concurrency, 如服务器多线程的形式, 目的是 增加吞吐量(throughput)
  + 超级多的核
    + 更重视 lantency, 更多的是任务形式的, 是否能很快处理任务


```
Task -> Throughput -> Latency
```

---------------
{: data-content=" 硬件驱动软件进步(解空间) "}

```
Java1 threads,locks
Java5 threads pools, blocking queue, concurrency collections
Java7 fork join
Java8 parallel stream
```

---------------
{: data-content=" 并发还是并行 "}

并发 资源的维护和处理, 资源更高效地，更正确地使用 hard

并行 处理得更快 easy

并行的目的是更快，但是实际上不一定会更快, 因为 worker 之间处理的事情会更多

---------------
{: data-content=" 是否使用并行 "}

- Analyse
- Implement
- Measure
- Repeat

使用串行(sequential)直到并发是被验证有效的

speedup 为测量指标

---------------
{: data-content=" 并串行更多的 "}

- 分解问题
- 并发处理
- 收集问题

---------------
{: data-content=" dataflow dependecy? "}

一些问题是无法用 串行 的方式解决

---------------
{: data-content=" Divide & Conquer "}


```
# All parallel algorithems
R solve(Problem<R> problem)
  if problem.isSmall()
    return problem.solveSequentially()

  R leftResult, rightResult;
  CONCURRENT {
    leftResult = R(solve(problem.left()))
    rightResult = R(solve(problem.right()))
  }

  return problem.combine(leftResult, rightResult)
```

在这里划分 problem.left() 和 problem.right() 比较重要

- No shared access, No mutable data (means no lock)
- Yes task coordinate

---------------
{: data-content=" Key Points "}

- Keep CPU busy
  + divide one, run one, instead of divide all, run all
- Tasks handle
  + 串行?
  + 多少个线程?
  + 继续拆分为子任务?

设计: 只需要子任务，而不要关心 coordinate 的事情

---------------
{: data-content=" 性能怎么样 "}

性能损耗在哪里

- split the source？
- task management
- result combine
  + add numbers are cheap, merging sets is expensive
- locality (elephant in the room)

需要有很多的数据来进行测试和计算

---------------
{: data-content=" Fork Join and streams "}

Fork Join

> Fork a task and wait it to complete

- task management, scales from 1 to 100 threads (细粒度, CPU敏感的任务)
- 专属的 divide and conquer
- 基于 work stealing(keep CPU busy)

streams

- possibly parallel
- not always faster

---------------
{: data-content=" 评估是否该使用并行 "}

NQ model

> 
NQ model <br />
N = data items 的数目<br />
Q = amount of work performed per item

NQ > 10_000 才有可能获得 speedup

[see also](https://developer.ibm.com/languages/java/articles/j-java-streams-5-brian-goetz/#thenqmodel)

---------------
{: data-content=" 性能的关键 "}

Source Splitting

  - cost of source split
  - evenness of split
  - predictability of split

  > Array 是最好的选择！ Linked List 不是, iterator 也不是

  例子: `IntStream.range(0, 100).sum()` 和 `IntStream.iterate(0, i -> i + 1).limit(100).sum()`

Locality(elephant in the room)

  - cache heats
  - use Array and int

Enconter Order

  - source 是否跟 order 相关?
  - 在 stream 中使用 unordered (告诉 stream 这个是无序的有助于优化)

Merging

  - sum numbers is cheap, while group by is not
  - merge map,sets are expensive (并行有可能更慢)

  > IntStream.range(0, n) 使用并行时候会慢 4x (n = 10K)

  所以， 在并发的时候, 应该说 split 是什么样的, 数据量(N\*Q)大吗? 跟顺序相关吗? 合并的数据是什么, 合并使用的结果集是什么, 可以使用 基础类型 吗?

并发效果不好的几个原因

  - NQ not high
  - Cache-miss ratio is high
  - source split cost is high
  - combination cost is high
  - order-sensitive

---------------
{: data-content=" 结论 "}

parallel is an optimization (not magic)

在优化之前

- 真的有优化需求吗? (not for fun)
- 有优化后的性能测试吗？(往往很难)
- 性能达不到满足的条件吗?


A few hundred is ok

没有最好的标准, 但是有坏标准
