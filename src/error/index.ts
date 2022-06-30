import { behaviorStack } from '@/behavior/BehaviorStore'
import JS from '@/error/error-vitals/JS'
import RS from '@/error/error-vitals/RS'
import UJ from '@/error/error-vitals/UJ'
import HP from '@/error/error-vitals/HP'
import CS from '@/error/error-vitals/CS'
import VUE from '@/error/error-vitals/VUE'
import { transportCategory } from '@/utils/transport'

// 错误类型
export enum mechanismType {
  JS = 'js',
  RS = 'resource',
  UJ = 'unhandledrejection',
  HP = 'http',
  CS = 'cors',
  VUE = 'vue'
}

// 格式化后的 异常数据结构体
export interface ExceptionMetrics {
  mechanism: Object
  value?: string
  type: string
  stackTrace?: Object
  pageInformation?: Object
  breadcrumbs?: Array<behaviorStack>
  errorUid: string
  meta?: any
}

// 初始化用参
export interface ErrorVitalsInitOptions {
  Vue?: any
}

// 判断是 JS异常、静态资源异常、还是跨域异常
export const getErrorKey = (event: ErrorEvent | Event) => {
  const isJsError = event instanceof ErrorEvent
  if (!isJsError) return mechanismType.RS
  return event.message === 'Script error.' ? mechanismType.CS : mechanismType.JS
}

// 初始化的类
export default class ErrorVitals {
  private engineInstance: any

  // 已上报的错误 uid
  private submitErrorUids: Array<string>

  constructor(engineInstance: any, options: ErrorVitalsInitOptions) {
    const { Vue } = options
    this.engineInstance = engineInstance
    this.submitErrorUids = []
    JS(this) // 初始化 js错误
    RS(this) // 初始化 静态资源加载错误
    UJ(this) // 初始化 Promise异常
    HP(this) // 初始化 HTTP请求异常
    CS(this) // 初始化 跨域异常
    if (Vue) VUE(Vue, this) // 初始化 Vue异常
  }

  // 封装错误的上报入口，上报前，判断错误是否已经发生过
  errorSendHandler = (data: ExceptionMetrics) => {
    // 统一加上 用户行为追踪 和 页面基本信息
    const submitParams = {
      ...data,
      breadcrumbs: this.engineInstance.userInstance.breadcrumbs.get(),
      pageInformation: this.engineInstance.userInstance.metrics.get('page-information')
    } as ExceptionMetrics
    // 判断同一个错误在本次页面访问中是否已经发生过;
    const hasSubmitStatus = this.submitErrorUids.includes(submitParams.errorUid)
    // 检查一下错误在本次页面访问中，是否已经产生过
    if (hasSubmitStatus) return
    this.submitErrorUids.push(submitParams.errorUid)
    // 记录后清除 breadcrumbs
    this.engineInstance.userInstance.breadcrumbs.clear()
    // 一般来说，有报错就立刻上报;
    this.engineInstance.transportInstance.kernelTransportHandler(
      this.engineInstance.transportInstance.formatTransportData(
        transportCategory.ERROR,
        submitParams
      )
    )
  }
}
