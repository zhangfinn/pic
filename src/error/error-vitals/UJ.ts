import { mechanismType, ExceptionMetrics } from '@/error'
import { parseStackFrames, getErrorUid } from '@/utils/error'
// 初始化 Promise异常 的数据获取和上报
export default (_this: any): void => {
  const handler = (event: PromiseRejectionEvent) => {
    event.preventDefault() // 阻止向上抛出控制台报错
    const value = event.reason.message || event.reason
    const type = event.reason.name || 'UnKnowun'
    const exception = {
      // 上报错误归类
      mechanism: {
        type: mechanismType.UJ
      },
      // 错误信息
      value,
      // 错误类型
      type,
      // 解析后的错误堆栈
      stackTrace: {
        frames: parseStackFrames(event.reason)
      },
      // 用户行为追踪 breadcrumbs 在 errorSendHandler 中统一封装
      // 页面基本信息 pageInformation 也在 errorSendHandler 中统一封装
      // 错误的标识码
      errorUid: getErrorUid(`${mechanismType.UJ}-${value}-${type}`),
      // 附带信息
      meta: {}
    } as ExceptionMetrics
    // 一般错误异常立刻上报，不用缓存在本地
    _this.errorSendHandler(exception)
  }

  window.addEventListener('unhandledrejection', event => handler(event), true)
}
