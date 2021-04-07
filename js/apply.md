# apply

- `apply` 函数的作用

  - 改变调用者 `this` 指针，指向第一个参数。如果第一个参数不传，则指向 `window`

  - 其他传入的参数以一个 `数组` 或者 `伪数组` 的形式传入

  - 返回函数的执行结果

- 模拟实现
```js
  Function.prototype._apply = function (thisArg, args) {
    thisArg = thisArg ? Object(thisArg) : window
    thisArg.fn = this
    let result
    if (args) {
      result = thisArg.fn(...args)
    } else {
      result = thisArg.fn()
    }

    delete thisArg.fn
    return result

  }



```