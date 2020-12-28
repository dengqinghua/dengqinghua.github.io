---
layout: post
category: showed
title: typescript
---

---------------
{: data-content=" 安装 "}

- node
- yarn, brew install yarn
- typescript, yard add -g typescript
- ts-node, yard add -g ts-node

```
brew install node, yarn
yarn add -g typescript ts-node
# 获取安装的二进制地址
yarn bin
```

------------
{: data-content=" ts -> js "}

可以通过 tsc 去理解当前的 ts 的语法糖

    tsc class.ts --lib es2016,dom --pretty

{% mermaid %}
graph LR;
    ts-->tsc-->js;
{% endmermaid %}

---------------
{: data-content=" 类型和语法 "}

{% mermaid %}
graph TD;
    any-->内置类型;
    any-->用户定义类型;
{% endmermaid %}

内置类型

- string
- number, 包括 整数 和 浮点数
- void
- null, 值是 undefined 的对象
- undefined 初始化后的默认值

---------------
{: data-content=" 变量 "}

定义变量

| var a:string = "a" | 设置为 string  |
| var a = "a" | 和 上面 等价, a 的类型会被设置为 string (Inferred Typing) |
| var a:string | 和 上面 等价, a 的类型会被设置为 string |
| var a | a 的类型会被设置为 any, 值是 undefined |

作用域

- global
- class variable & class static variable
- local (method)

---------------
{: data-content=" 函数 "}

Optional Parameters: `function a(id:number, name: string, desc?:string) {}`

Rest Parameters: `function a(id:number, ...restParams:string[]) {}`

---------------
{: data-content=" tuple "}

```
var a = [10, "d"]
var x:string|number = a[0]
var y:string|number = a[1]
console.log("x is " + x)
console.log("y is " + y)
var [x, y] = a
```

---------------
{: data-content=" union "}

```
let a:string|number;
a = 12
a = "d"
```

一般多个类型的时候, 会使用 typeof 来做判断

---------------
{: data-content=" interface "}

```
interface IPerson {
  name:string
  other:number|string
}

const person:IPerson = { name: "a", other: 1 }
```

---------------
{: data-content=" class "}

{% mermaid %}
graph TD;
    clazz-->Fields;
    clazz-->Constructors;
    clazz-->Functions;
{% endmermaid %}

typescipt 不支持多继承

- static; 静态, 类变量/方法 的关键词
- instanceof typeof;
- implement; class 可以实现某个接口

---------------
{: data-content=" namespace, module "}

```
namespace A {
  export interface IPerson {}
  export class IClazz {}
}
```

module: external 和 internal
