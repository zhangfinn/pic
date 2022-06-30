import { mechanismType, ExceptionMetrics, getErrorKey } from '@/error'
import { parseStackFrames, getErrorUid } from '@/utils/error'

// 初始化 JS异常 的数据获取和上报
export default (_this: any): void => {
  const handler = (event: ErrorEvent) => {
    // 阻止向上抛出控制台报错
    event.preventDefault()
    // 如果不是 JS异常 就结束
    if (getErrorKey(event) !== mechanismType.JS) return
    const exception = {
      // 上报错误归类
      mechanism: {
        type: mechanismType.JS
      },
      // 错误信息
      value: event.message,
      // 错误类型
      type: (event.error && event.error.name) || 'UnKnowun',
      // 解析后的错误堆栈
      stackTrace: {
        frames: parseStackFrames(event.error)
      },
      // 用户行为追踪 breadcrumbs 在 errorSendHandler 中统一封装
      // 页面基本信息 pageInformation 也在 errorSendHandler 中统一封装
      // 错误的标识码
      errorUid: getErrorUid(`${mechanismType.JS}-${event.message}-${event.filename}`),
      // 附带信息
      meta: {
        // file 错误所处的文件地址
        file: event.filename,
        // col 错误列号
        col: event.colno,
        // row 错误行号
        row: event.lineno
      }
    } as ExceptionMetrics
    // 一般错误异常立刻上报，不用缓存在本地
    _this.errorSendHandler(exception)
  }
  window.addEventListener('error', event => handler(event), true)
}
