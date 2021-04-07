# Function.prototype.bind()

- `bind函数的作用`

  > `bind` 方法创建一个新的函数，这个新函数的 `this` 指向 `bind` 方法的第一个参数，而其余参数将作为新函数的参数，供调用时使用

  - 返回一个新的函数

- 实现一个 `bind` 函数
```js
  Function.prototype.bindFn = function (thisArg, ...args) {
    if (typeof this !== 'function') {
      throw new Error(`${this} must be a function`)
    }

    const _self = this
    return function () {
      // arguments 和 ...args 合并是为了 生成的新函数可以传入 参数
      _self.apply(thisArg, [...args, ...arguments])
    }
  }
  // 存在的问题 new (构造函数.bindFn(thisArg)) 报错

```
