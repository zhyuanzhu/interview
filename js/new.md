# new

- `new` 运算符的作用

  - 创建一个空的js对象 (`即{}`)

  - 新对象内部的 `[[Prototype]]` 被赋值为构造函数的 `prototype` 属性 (`原型连接`)

  - 构造函数内部的 `this` 被赋值为这个新对象（即 `this`指向新对象）

  - 执行构造函数内部的代码（给新对象添加属性）

  - 如果构造函数返回非空对象，则返回该对象；否则，返回刚创建的新对象


- 实现一个 `new` 运算符
```js
  function createNew (Ctor, ...args) {
    const isFn = Object.prototype.toString.call(Ctor) === '[Object Function]'
    if (!isFn) {
      throw new Error(`expect Ctor is a function, but get others`)
    }
    // let obj = {}
    // Object.setPrototype(obj, Ctor.prototype)
    // let result = Ctor.apply(obj, args)
    // return result instanceof Object ? result : obj
    
    // 创建对象，并且将对象的原型指向 Ctor.prototype
    let obj = Object.create(Ctor.prototype)

    // 绑定 this
    let ret = Ctor.apply(obj, args)
    return ret instanceof Object ? ret : obj
  }

  // Object.create 函数
  function create(proto) {
    function F () {}
    F.prototype = proto
    return new F()
  }

```
