---
layout: post
categories: showed note
title: MySQL 子查询笔记
---

### Outer Query & Subquery

```
SELECT * FROM a WHERE c1 = (SELECT c1 FROM b)
```
- Outer Query: `SELECT * FROM a`
- subQuery: `(SELECT c1 FROM b)`

### scalar, column, row, and table subqueries
- scalar 单个值
- column 返回一个列
- row 返回一行
- table 返回一个表(多行数据)

这里只能返回单个值 `count(*)` 这里只返回一个值

```
SELECT (SELECT count(*) FROM advertisement) # OK
SELECT (SELECT code FROM advertisement LIMIT 1) # OK
SELECT (SELECT code FROM advertisement) # NOT OK 包含多行
```

比较

```
SELECT * FROM advertisement WHERE code = (SELECT code FROM tag LIMIT 1) # 必须单行
SELECT * FROM advertisement WHERE code IN (SELECT code FROM tag) # 可以多行
```

### ANY, IN, SOME, ALL
ANY, IN, SOME 都是存在的意思

```
SELECT * FROM advertisement WHERE code = ANY (select code from tag) # 这个的 = ANY 跟 IN 是一样的
```

ALL 全部满足条件

```
SELECT s1 FROM t1 WHERE s1 > ALL (SELECT s1 FROM t2);
```

### EXISTS
```
SELECT * FROM t1 WHERE EXISTS (SELECT * FROM t2)
```

如果 `SELECT * FROM t2` 有值，则为 true

### Derived Table
从几张表中拿出数据，组成一个新表

```
INSERT INTO t1 VALUES (1,'1',1.0);
INSERT INTO t1 VALUES (2,'2',2.0);
SELECT sb1,sb2,sb3
  FROM (SELECT s1 AS sb1, s2 AS sb2, s3*2 AS sb3 FROM t1) AS sb
  WHERE sb1 > 1;
```
