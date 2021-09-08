---
layout: post
toc: true
categories: showed note
title: 检索技术学习笔记
---

## 检索的本质
需要关注下面几点

- 快速的缩小检索范围
    + 二分查找法, 缩小一半
    + 跳表, 跳动步长 > 1
    + B/B+树, 以磁盘片为步长，一次过滤掉一个(4K)或者多个快
    + 位图/Hash/布隆过滤器, 利用概率/数组下标 快速寻找或者判断元素
    + Roaring Bitmap, 高位存储 bucket 信息，低位存储位图信息
    + TopK & 非精准 TopK
- 利用存储、访问特性进行检索优化, 估算内存和磁盘的空间占比, 减少磁盘IO(磁盘), 利用磁盘的顺序读, 避免随机读
    + B+ 树
    + 日志记录使用 LSM 树
- 空间冗余换取时间
    + 跳表, 冗余步长
    + AVL, 冗余叶子高度信息
    + 倒排索引
- 缓存
    + 热点数据使用 LRU 缓存

在工业界中，往往会几个算法组合起来进行使用，如使用跳表来实现 posting-list, 两个 posting-list 求交集的时候，直接将小的那个变成 Hash 等

另外，要注意两点

>
1. 内存的检索效率比磁盘高许多，因此，能加载到内存中的数据，我们要尽可能加载到内存中。
2. 大数据集合拆成小数据集合处理(快速缩小检索范围)


![speed-in-2020.png](assets/images/speed-in-2020.png)

参考: [数字](https://colin-scott.github.io/personal_website/research/interactive_latency.html)

更新策略

- Double Buffer, 利用冗余减少更新频率
- 全量(只读) + 增量更新(可读可写)

指导思想

- 索引和数据分离
- 减少磁盘IO
- 读写分离, 避免锁
- 分层处理 (非精准 TopK -> TopK), 搜索降级

## 方案设计
### 搜索方案
<div class="mermaid" markdown="0">
graph LR
    subgraph 查询
      cache(内存);
      es(ES API);
      MySQL(降级 MySQL);
    end
    subgraph 索引更新
      EventHandler(Pulsa队列);
      storage1(存储1 <br > ES-主查询引擎);
      storage2(存储2 <br > MySQL-容灾);
      storage3(存储3 <br > 内存-热词,TopK 等信息);
    end
    subgraph 源数据事件
      event1(单曲/合集/QE/DE 更新);
      event2(老师更新);
      event3(标签更新);
    end
    subgraph 宽表Schema
      field(索引字段);
      weight(搜索权重值);
    end

    event1 & event2 & field & weight-->EventHandler-->storage1 & storage2 & storage3;
    cache-->storage1;
    es-->storage2;
    MySQL-->storage3;
</div>

| 方案 | 优点 | 缺点 | 扩展性 | 难度 |
| :-------------: | :-------------: | :-------------: |
| 内存 | 速度快，可使用 [H2](https://www.h2database.com/html/main.html) 和 [Lucene](http://www.h2database.com/javadoc/index.html) 结合进行检索, 当前数据量大概为 500K, 可考虑全部导入 | 数据量变大之后容易导致 OOM, 需要处理多实例的数据同步问题 | 一般 | ⭐️⭐️⭐️ |
| ES | 主流, 满足基本的搜索需求, 丰富的 API, 分词功能支持较好 | 引入第三方组件, 容易造成单点, 服务可靠性无法保证 | 好 | ⭐️⭐️ |
| MySQL | 接入成本小, 原生的 MySQL 支持简单的全文索引 和 ngram 分词 | 功能有限, 不支持复杂的分词逻辑, 不支持预先设置字段权重 | 差 | ⭐️⭐️ |

### 部署方案
分开部署

## Reference
- [检索技术核心20讲-极客时间](https://time.geekbang.org/column/intro/298)
- [H2 全文检索](https://zhuanlan.zhihu.com/p/142833556)
- [MySQL Full-Text Search Functions](https://dev.mysql.com/doc/refman/8.0/en/fulltext-search.html)
