import MetricsStore, { IMetrics } from '@/behavior/store'
import PI from '@/behavior/user-vitals/PI'
import RCR from '@/behavior/user-vitals/RCR'
import PV from '@/behavior/user-vitals/PV'
import OI from '@/behavior/user-vitals/OI'
import CBR from '@/behavior/user-vitals/CBR'
import CDR from '@/behavior/user-vitals/CDR'
import HT from '@/behavior/user-vitals/HT'
import BehaviorStore from '@/behavior/BehaviorStore'
import { getPageInfo } from '@/behavior/user-vitals/PI'
import { transportCategory } from '@/utils/transport'

export default class UserVitals {
  public metrics: MetricsStore
  public engineInstance: any
  // 最大行为追踪记录数
  public maxBehaviorRecords: number
  public breadcrumbs: BehaviorStore
  public customHandler: Function
  // 允许捕获click事件的DOM标签 eg:button div img canvas
  clickMountList: Array<string>
  constructor(engineInstance: any) {
    this.engineInstance = engineInstance
    this.metrics = new MetricsStore()
    this.maxBehaviorRecords = 100
    // 作为 真实sdk 的时候，需要在初始化时传入与默认值合并;
    this.clickMountList = ['button'].map(x => x.toLowerCase())
    // 初始化 用户自定义 事件捕获
    this.customHandler = CDR(this)
    // 初始化行为追踪记录
    this.breadcrumbs = new BehaviorStore({ maxBehaviorRecords: this.maxBehaviorRecords })
    wrHistory()
    PI(this)
    RCR(this)
    PV(this)
    OI(this)
    CBR(this)
    HT(this)
  }
  // 封装用户行为的上报入口
  userSendHandler = (data: IMetrics) => {
    // this.engineInstance.transportInstance.kernelTransportHandler(
    //   this.engineInstance.transportInstance.formatTransportData(transportCategory.PV, data)
    // )
    // 进行通知内核实例进行上报;
  }
  // 补齐 pathname 和 timestamp 参数
  getExtends = (): { page: string; timestamp: number | string } => {
    return {
      page: getPageInfo().pathname,
      timestamp: new Date().getTime()
    }
  }
}

// 派发出新的 Event
const wr = (type: keyof History) => {
  const orig = history[type]
  return function (this: unknown) {
    const rv = orig.apply(this, arguments)
    const e = new Event(type)
    window.dispatchEvent(e)
    return rv
  }
}

// 添加 pushState replaceState 事件
export const wrHistory = (): void => {
  history.pushState = wr('pushState')
  history.replaceState = wr('replaceState')
}

// 为 pushState 以及 replaceState 方法添加 Event 事件
export const proxyHistory = (handler: any): void => {
  // 添加对 replaceState 的监听
  window.addEventListener('replaceState', e => handler(e), true)
  // 添加对 pushState 的监听
  window.addEventListener('pushState', e => handler(e), true)
}

export const proxyHash = (handler: any): void => {
  // 添加对 hashchange 的监听
  // hash 变化除了触发 hashchange ,也会触发 popstate 事件,而且会先触发 popstate 事件，我们可以统一监听 popstate
  // 这里可以考虑是否需要监听 hashchange,或者只监听 hashchange
  window.addEventListener('hashchange', e => handler(e), true)
  // 添加对 popstate 的监听
  // 浏览器回退、前进行为触发的 可以自己判断是否要添加监听
  window.addEventListener('popstate', e => handler(e), true)
}
