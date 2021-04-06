# 节流

- 定义
  
  > 某个函数在一定时间内只执行一次，在这段时间之内无视后来产生的函数调用请求，也不会延长时间间隔。间隔时间结束后第一次遇到新的函数调用会触发执行，然后在新的时间间隔内依旧无视后来产生的函数调用请求，依次类推

  [可视化效果展示](http://demo.nimius.net/debounce_throttle/)

- 适用场景

  > 非常适用于函数被频繁调用的场景，例如 `window.resize()事件`、`mousemove事件`等

- 实现思路

  - 利用时间戳
  ```js
    /**
     * @param { Function } fn 需要执行的函数
     * @param { Number } wait 需要等待的时间
     * @param { Boolean } immediate 是否立即执行 
     * @return { Function }
     */
    function throttle (fn, wait) {
      // 上一次执行时间
      let prev = 0
      return function (...args) {
        // 获取当前时间戳
        let now = +new Date()
        // 如果当前时间 - 上一次执行时间大于需要等待的时间，执行函数
        if (now - prev > wait) {
          prev = now
          fn.apply(this, args)
        }
      }
    }

    // 每 1000 毫秒执行一次
    const mouseMoveFn = throttle(() => console.log('mouse move'), 1000)
    document.documentElement.addEventListener('mousemove', mouseMoveFn)

  ```

  - 使用定时器
  ```js
    function throttle (fn, wait) {
      let timer = null
      return function (...args) {
        if (timer) return
        timer = setTimeout(() => {
          fn.apply(this, args)
          timer = null
        }, wait)
      }
    }
  ```





