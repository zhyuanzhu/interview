/**
 * Promise 的三种状态 等待 pengding 成功 fulfilled 失败 rejected
 * 
 * 
 */

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

const DEFAULT_SUCCESS_CALLBACK = value => value;
const DEFAULT_FAIL_CALLBACK = reason => {
  throw reason
}

/**
 * @param { Function } executor
 */
class MyPromise {

  constructor (executor) {
    // 执行器执行异常捕获
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error)
    }
  }

  // promise 状态
  status = PENDING
  // 成功之后的值
  value = undefined
  // 失败的原因
  reason = undefined
  // 成功回调函数，处理异步 resolve 方法    成功回调函数队列 
  successCallback = []
  // 失败回调函数，处理异步 reject 方法 
  failCallback = []

  // 将状态更改为成功
  resolve = (value) => {
    // 将状态更改为成功
    if (this.status !== PENDING) return
    this.status = FULFILLED

    // 保存成功之后的值
    this.value = value
    // 判断是否是异步，即成功回调函是否存在
    // this.successCallback && this.successCallback(value)
    while(this.successCallback.length) {
      // console.log(firstSuccessCb)
      const firstSuccessCb = this.successCallback.shift();
      firstSuccessCb()
    }
  }

  // 将状态更改为失败
  reject = reason => {
    // 将状态更改为失败
    if (this.status !== PENDING) return
    this.status = REJECTED

    // 保存失败的原因
    this.reason = reason
    // 异步调用 reject 
    // this.failCallback && this.failCallback(reason)
    // console.log
    while(this.failCallback.length) {
      const firstFailCb = this.failCallback.shift()
      firstFailCb()
    }
  }

  then (successCallback=DEFAULT_SUCCESS_CALLBACK, failCallback=DEFAULT_FAIL_CALLBACK) {
    let _promise = new MyPromise((resolve, reject) => {
      // 判断状态，根据状态调用对应的回掉函数
      if (this.status === FULFILLED) {
        // 使用异步函数是为了在函数内部获取到 _promise
        setTimeout(() => {
          // success 回调函数错误捕获
          try {
            let succ = successCallback(this.value)
            // 查看 succ 是普通值还是 promise 对象
            // 如果是 普通值，直接调用 resolve 传递下去
            // 如果是 promise，查看 promise 对象的返回结果
            // 根据上述的返回结果，决定调用 resolve 还是 reject
            resolvePromise(_promise, succ, resolve, reject)
          } catch (error) {
            reject(error)
          }
        } ,0)
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          // error 回调函数错误捕获
          try {
            let err = failCallback(this.reason)
            resolvePromise(_promise, err, resolve, reject)
          } catch (error) {
            reject(error)
          }
        } ,0)
      } else {
        // pending 状态
        // this.successCallback.push(successCallback)
        // this.failCallback.push(failCallback)
        this.successCallback.push(() => {
          setTimeout(() => {
            // success 回调函数错误捕获
            try {
              let succ = successCallback(this.value)
              resolvePromise(_promise, succ, resolve, reject)
            } catch (error) {
              reject(error)
            }
          } ,0)
        })
        this.failCallback.push(() => {
          setTimeout(() => {
            // success 回调函数错误捕获
            try {
              let error = successCallback(this.reason)
              resolvePromise(_promise, error, resolve, reject)
            } catch (error) {
              reject(error)
            }
          } ,0)
        })
      }
    })

    return _promise
  }

  finally (callback) {
    return this.then((value) => {
      return MyPromise.resolve(callback()).then((v) => {
        if (!callback()) return value
        return v
      })    // 为了处理 callback 中是异步调用的 promise
      // callback()
      // return value
    }, err => {
      // callback(err)
      // throw err
      return MyPromise.resolve(callback()).then(() => {
        throw err
      }) 
    })
  }

  static all (array) {
    let result = []
    let index = 0
    const { length } = array

    return new MyPromise((resolve, reject) => {

      function addData (key, value) {
        result[key] = value
        index++
        if (index === length) {
          resolve(result)
        }
      }

      for (let i = 0; i < length; i++) {
        let current = array[i];
        if (current instanceof MyPromise) {
          current.then(value => addData(i, value), reason => reject(reason))
        } else {
          addData(i, current)
        }
      }
    })
  }

  static resolve (data) {
    if (data instanceof MyPromise) return data
    return new MyPromise(resolve => resolve(data))
  }

  static reject (reason) {
    if (reason instanceof MyPromise) {
      return reason
    }
    return new MyPromise((_, rejcet) => rejcet(reason))
  }


}

function resolvePromise (promise, data, resolve, reject) {
  if (promise === data) {
    const typeError = new TypeError('Chaining cycle detected for promise #<Promise>')
    return reject(typeError)
  }
  if (data instanceof MyPromise) {
    // promise 对象
    // data.then(value => resolve(value), err => reject(err))
    data.then(resolve, reject)
  } else {
    resolve(data)
  }
}

// console.log(MyPromise)


let promise = new MyPromise((resolve, reject) => {
  // setTimeout(() => {
    // throw new Error(`executor error`)
    // console.log('promise')
    resolve(1)
    // reject('error')
  // }, 2000)
})

let p1 = new MyPromise((resolve, reject) => {
  reject('fail')
})
// promise.then().then().then(v => {
//   console.log(v)
// })

function p0 () {
  return new MyPromise((resolve) => {
    setTimeout(() => {
      resolve('p0')
    }, 2000);
  })
}

let p2 = MyPromise.resolve(100)
// p2.finally(() => {
//   console.log('finally')
// }).then((d) => {
//   console.log(d)
// }, (e) => {
//   console.log(e)
// })

let p3 = MyPromise.reject('reject')
// p3.then(() => {}, e => console.log(e))
// console.log(p3)
// p3.finally(() => {
//   console.log('finally')
// }).then((d) => {
//   console.log(d)
// }, (e) => {
//   console.log('p3')
//   console.log(e)
// })

// MyPromise.all([p3, p2, 2, 3, 'a', promise]).then(val => {
//   console.log(val)
// })

// let p1 = promise.then((value) => {
//   console.log(value)
//   throw new Error('then error')
//   return 2
// }, err => {
//   console.log(err)
//   // throw new Error('11then error')
//   return 3
// })

// p1.then(val => {
//   console.log(`链式2`, val)
// }, (err2) => {
//   console.log(`err2`, err2)
// })

function px () {
  return new MyPromise((rs) => {
    rs(222)
  })
}

px().finally(() => {
  let x = p0()
  console.log('x', x)
  // return x
})
.then(val => {
  console.log('finall then')
  console.log(val)
})