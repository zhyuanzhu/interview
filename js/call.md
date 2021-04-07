# call

- `call` 函数的作用

  - 改变 `this` 指针，指向第一个参数。如果第一个参数不传，则指向 `window`

  - 其他需要传入的参数以逗号分割，依次传入

- 模拟实现
```js
  Function.prototype._call = function (thisArg, ...args) {
    // 判断第一个参数是否传入
    // Object(thisArg) 是为了处理传入的第一个参数是 基础数据类型
    thisArg = thisArg ? Object(thisArg) : window
    
    // 给 thisArg 创建一个新的 fn 方法，该方法指向 调用 call 的函数
    thisArg.fn = this

    // 将剩余的参数传入 fn 方法中
    let result = thisArg.fn(...args)
    delete thisArg.fn
    return result
  }



```