---
layout: post
toc: true
categories: showed note
title: 检索技术探索
---

## 方案设计
### 可选的搜索方案

| 方案 | 优点 | 缺点 | 扩展性 | 难度 | 实现方式 |
| :-------------: | :-------------: | :-------------: |
| MySQL | 接入成本小, 原生的 MySQL 支持简单的全文索引 和 ngram 分词 | 功能[有限](https://dev.mysql.com/doc/refman/5.7/en/fulltext-restrictions.html), 不支持复杂的分词逻辑, 不支持预先设置字段权重 | ⭐️ | ⭐️ | 直接接入并使用 MyBatisPlus 进行查询即可 |
| 内存(H2) | 速度快，可使用 [H2](https://www.h2database.com/html/main.html) 和 [Lucene](http://www.h2database.com/javadoc/index.html) 结合进行检索, 当前数据量大概为 500K, 可考虑全部导入 | 数据量变大之后容易导致 OOM, 需要处理多实例的数据同步问题 | ⭐️⭐️ | ⭐️⭐️⭐️ | 1. 接入 H2<br/> 2. 提供同步更新机制 <br/>3. OOM 优化 <br/>4. 分词优化方案和调试方案 |
| ES | 主流, 满足基本的搜索需求, 丰富的 API, 分词功能支持较好 | 引入第三方组件, 容易造成单点, 服务可靠性无法保证 | ⭐️⭐️⭐️⭐️⭐️ | ⭐️⭐️ | 1. 接入 ES<br/> 2. 实现 ES Wrapper <br/>3. 提供统一的搜索接口 |

### 例子
#### MySQL
给 media 表的 content 字段 添加全文索引, 这里使用了 [ngram](https://dev.mysql.com/doc/refman/5.7/en/fulltext-search-ngram.html) 作为分词器

分词的字数由 `ngram_token_size` 参数进行控制

```sql
ALTER TABLE `media` ADD FULLTEXT(`content`) WITH PARSER ngram
```

```sql
select id, content  from media where id in (230, 231)\G

*************************** 1. row ***************************
     id: 230
content: {"description":"【为什么失眠】\n\n\n【专注练习】\n 为了避免大脑走神，"}

*************************** 2. row ***************************
     id: 231
content: {"description":"描述文案","title":"播放器标题"}
```

查看匹配的分数, 这里拿了两个 id 作为例子
```sql
select id,match (content) AGAINST ('为什么失眠') as score from media where id in (230, 231)

+-----+--------------------+
| id  | score              |
+-----+--------------------+
| 230 | 4.3379950523376465 |
| 231 |                  0 |
+-----+--------------------+
2 rows in set (0.05 sec)

mysql> select id,match (content) AGAINST ('失眠') as score from media where id in (230, 231);
+-----+-------------------+
| id  | score             |
+-----+-------------------+
| 230 | 8.675990104675293 |
| 231 |                 0 |
+-----+-------------------+

mysql> select id,match (content) AGAINST ('眠') as score from media where id in (230, 231);
+-----+-------+
| id  | score |
+-----+-------+
| 230 |     0 |
| 231 |     0 |
+-----+-------+
2 rows in set (0.04 sec)
```

#### H2
例子见 [H2 的全文检索功能](https://zhuanlan.zhihu.com/p/142833556)

H2 可以结合 Lucene 一起进行使用, 但是从 API 的设计和扩展性来说，都有比较大的限制，可以作为测试使用，不适合用在生产环境中

#### ES
ES 作为专业的搜索引擎，有丰富的功能和 API，在[之前](./3-month-sharing#elk)我们便使用了 ELK 做日志相关的收集和查询，
在稳定性和查询速度上面都要对应的保证。

相比于 MySQL，ES 提供更细粒度的相关度控制([Relevance Tuning](https://www.elastic.co/guide/en/app-search/current/relevance-tuning-guide.html)), 即可以指定每个字段的搜索权重，例子

```bash
curl -X GET 'https://es/search' -H 'Content-Type: application/json' \
-d '{
  "search_fields": {
    "title": {
      "weight": 10
    },
    "description": {
      "weight": 1
    },
    "states": {
      "weight": 2
    }
  },
  "query": "mountains"
}'
```

对比于 MySQL, 更提供了全套的管理后台，可在 Kibana 进行对应的索引管理和监控等操作

另外，除了 weight/boost 设置之外, ES 还支持前缀匹配，同义词检索，分词插件等功能，其中 同义词，分词插件 可直接在腾讯云后台中更新

## 落地方案
### 搜索

<div class="mermaid" markdown="0">
flowchart TD;
    onMemeroy([缓存 获取搜索结果<br />热词检索/TopK 等]);
    es([es 检索]);
    E([返回搜索结果]);
    E1([返回推荐数据]);
    MySQL([MySQL 降级检索]);
    onMemeroy-->|有结果| E
    onMemeroy-->|无结果| es
    es-->|超时或者异常| MySQL
    es-->|有结果| E
    es-->|无结果| E1
    MySQL-->|有结果| E
    MySQL-->|无结果| E1
</div>

### 索引
1. 采用 ES 作为主要的搜索引擎, 通过事件维护索引的更新
2. 使用 MySQL 的 fulltext 作为容灾方案

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
    subgraph 宽表 Schema
      field(索引字段);
      weight(搜索权重值);
    end

    event1 & event2 & field & weight-->EventHandler-->storage1 & storage2 & storage3;
    cache-->storage1;
    es-->storage2;
    MySQL-->storage3;
</div>

### 部署
1. 如果采用 H2 作为搜索引擎, 为了服务的简单行来说，需要考虑 **新建项目**, 而且需要维护好数据更新的问题
2. 如果使用 ES 或者 MySQL 作为搜索引擎, 则可不需要考虑单独起项目，在原有项目上开发即可
3. 无论使用哪一种方案，都需要将搜索服务部署到单独的服务器中，通过 Nginx 的二级域名进行流量转发和分流处理, 该部分在 Nginx 层控制即可

### 任务分析
1. 热词维护

    后台配置，存储 MySQL，使用 guava cache，全量缓存 热词对应的id 至 内存中

2. 索引维护

    - 确定可供搜索的字段来源
    - 字段更新之后，需要发送对应的事件，使得 ES/MySQL 进行索引的更新

3. 搜索

    - 优先匹配 热词, 该部分直接从缓存中获取
    - 热词中不存在时, 则使用 ES 进行查询

      ```java
      QueryBuilders.multiMatchQuery("搜索词").fields(Map.of("词汇1", 1f, "词汇2", 2f));
      ```

4. 冷启动数据

    未获取到搜索结果时处理如下:

      + 如果是搜索超时或者是 es 服务异常, 则 使用 MySQL 作为备选方案
      + 如果是搜索 es 未找到对应的数据结果, 则使用 人工配置的 推荐数据

5. 搜索词数据统计

    logstash 收集搜索相关的词, 下面的 `searchQ` 为搜索的词汇

    ```ruby
    filter {
       grok {
        match => { "message" => ['%{TIMESTAMP_ISO8601:reqTime}  %{GREEDYDATA} params =[{"q":%{searchQ}}] %{GREEDYDATA}time cost = %{NUMBER:reqCostMs} ms'] }
      }
      mutate {
        convert => { "reqCostMs" => "integer" }
      }
      date {
        match => [ "reqTime", "ISO8601", "YYYY-MM-dd HH:mm:ss", "YYYY-MM-dd HH:mm:ss.ZZZ" ]
        target => "reqTime"
        locale => "en"
      }
    }
    ```

6. 其他的优化
    - 分词优化，考虑使用不同的分词引擎(如 ik, ngram 等)
    - 同义词优化，配置对应的同义词进行检索优化
    - 拼音，错别字纠正
    - 搜索词补全

## 检索基础理论
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

## Reference
- [检索技术核心20讲-极客时间](https://time.geekbang.org/column/intro/298)
- [H2 全文检索](https://zhuanlan.zhihu.com/p/142833556)
- [MySQL Full-Text Search Functions](https://dev.mysql.com/doc/refman/8.0/en/fulltext-search.html)
- [Relevance Tuning Guide, Weights and Boosts](https://www.elastic.co/guide/en/app-search/current/relevance-tuning-guide.html#relevance-tuning-guide)
