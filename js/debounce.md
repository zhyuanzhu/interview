# 防抖

- 定义

  > 防抖函数指的是在某个时间段内，无论触发多少次回调，**都只执行最后一次**

  - 举个🌰

    公交车到站，需要最后一名乘客上车之后等待1分钟才可以关门发车，每次进入一个人，司机就重置等待时间，直至满足条件之后触发关门

- 适用场景

  > input 输入回调事件等

- 实现思路

  - 利用定时器
  ```js
    /**
     * @param { Function } fn 需要执行等函数
     * @param { Number } wait 需要等待的时间
     * @param { Boolean } immediate 第一次是否立即执行
     */
    function debounce (fn, wait, immediate) {
      let timer = null
      return function (...args) {
        // 如果定时器已经设置了，清除上一次的定时器
        if (timer) clearTimeout(timer)

        if (immediate && !timer) {
          fn.apply(this, args)
        }

        // 设置新的定时器，wait 后执行函数 fn
        timer = setTimeout(() => {
          fn.apply(this, args)
        }, wait)
      }
    }

    // 1000 毫秒后执行
    const mouseMoveFn = debounce(() => console.log('mouse move'), 1000)
    document.documentElement.addEventListener('mousemove', mouseMoveFn)


  ```

## 存在的问题

  **如果用户操作非常频繁，不等延迟时间结束就进行下次操作，会频繁的清除计时器并重新生成，所以函数 `fn` 一直都没有办法执行，导致用户操作迟迟得不到响应**

  **应该在 `wait` 时间内，可以重新生成定时器，但时间到了必须给用户一个响应**

  ```js
    const debounce = (fn, wait) => {
      let prev = 0
      let timer = null
      return function (...args) {
        let now = +new Date()
        if (now - prev > wait) {
          // 第一次执行
          // 或者超出等待的 wait 时间之后执行
          prev = now
          fn.apply(this, args)
        } else {
          // 如果定时器存在，清除上一次的
          if (timer) clearTimeout(timer)
          // 设置一个新的定时器
          timer = setTimeout(() => {
            prev = now
            fn.apply(this, args)
          }, wait)
        }
      }
    }



  ```