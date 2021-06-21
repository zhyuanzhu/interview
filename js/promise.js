/**
 * Promise 的三种状态 等待 pengding 成功 fulfilled 失败 rejected
 * 
 * 
 */

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

/**
 * @param { Function } executor
 */
class MyPromise {

  constructor (executor) {
    executor(this.resolve, this.reject);
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
      const firstSuccessCb = this.successCallback.shift();
      firstSuccessCb(this.value)
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
    while(this.failCallback.length) {
      const firstFailCb = this.failCallback.shift()
      firstFailCb(this.reason)
    }
  }

  then (successCallback, failCallback) {

    let _promise = new MyPromise((resolve, reject) => {
      // 判断状态，根据状态调用对应的回掉函数
      if (this.status === FULFILLED) {
        // 使用异步函数是为了在函数内部获取到 _promise
        setTimeout(() => {
          let succ = successCallback(this.value)
          // 查看 succ 是普通值还是 promise 对象
          // 如果是 普通值，直接调用 resolve 传递下去
          // 如果是 promise，查看 promise 对象的返回结果
          // 根据上述的返回结果，决定调用 resolve 还是 reject
          resolvePromise(_promise, succ, resolve, reject)
        } ,0)
      } else if (this.status === REJECTED) {
        failCallback(this.reason)
      } else {
        // pending 状态
        this.successCallback.push(successCallback)
        this.failCallback.push(failCallback)
      }
    })

    return _promise
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


let promise = new MyPromise((resolve, reject) => {
  // setTimeout(() => {
    resolve(1)
  // }, 2000)
})

let p1 = promise.then((value) => {
  console.log(value)
  return p1
})

p1.then(v => {
  console.log(v)
}, err => {
  console.log(err.message)
})