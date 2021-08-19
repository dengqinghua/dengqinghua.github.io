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
  ```rust
  let a = 1
  let a = 2
  ```
  </details>

- scalar types, integers, floating-point numbers, booleans and characters
- two’s complement wrapping. i8 when 256 -> 0
- turple and array. turple is a multi types data source with fixed length like array
- (), an empty tuple
- ownership, make memory safely guarantees
- mutation only once, can prevent data races at compile time
  + borrow as immutable, should not used after borrowed as mutable

    <details>
    <summary  markdown="0">
    why?
    </summary>
    data race reason:

    + Two or more pointers access the same data at the same time.
    + At least one of the pointers is being used to write to the data.
    + There’s no mechanism being used to synchronize access to the data.
    </details>
- reference rule
  + any given time, you can have either one mutable ref or any number of immutable refs
  + refs must always be valid (no dangling refs)
- all things are private by default
- package -> crate(executable binary) -> module
- deref coercion, turn &s2 to &s2[..]
- trait, interface like
