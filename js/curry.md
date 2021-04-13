# 函数柯里化

> 柯里化函数的参数为一个函数，返回值也是一个函数。返回函数可以处理传入函数的额外参数

```js

  function curry (func) {

    return function curriedFn (...args) {
      // 传入的实参小于 func 函数的形参个数
      if (args.length < func.length) {
        // 递归调用 curriedFn，合并参数
        return function () {
          // 合并处理参数
          return curriedFn(...args.concat(Array.from(arguments)))
        }
      }

      // 传入的实参个数等于 func 的形参个数
      return func(...args)
    }
    
  }

  function getSum (a, b, c) {
    return a + b + c
  }

  const curryFn = curry(getSum)

  console.log(curryFn(1, 2)(3))        // 6
  console.log(curryFn(1)(2, 3))        // 6
  console.log(curryFn(1, 2, 3))        // 6

```
