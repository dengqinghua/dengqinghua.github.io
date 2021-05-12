---
layout: post
categories: showed note
title: Rust 学习笔记
---

## 词汇

- crate, a collection of Rust source code files
- immutable varibale, immutable by default
- shadowing, mutable varibales can be shadowed 

  <details>
  <summary  markdown="0">
  eg.
  </summary>
  ```
  let a = 1
  let a = 2
  ```
  </details>

- scalar types, integers, floating-point numbers, booleans and characters
- two’s complement wrapping. i8 when 256 -> 0
- turple and array. turple is a multi types data source with fixed length like array
- (), an empty tuple
- ownership, make memory safely guarantees
