import { mechanismType, ExceptionMetrics, getErrorKey } from '@/error'
import { getErrorUid } from '@/utils/error'
// 初始化 HTTP请求异常 的数据获取和上报
export default (_this: any): void => {
  const handler = (event: ErrorEvent) => {
    // 阻止向上抛出控制台报错
    event.preventDefault()
    // 如果不是跨域脚本异常,就结束
    if (getErrorKey(event) !== mechanismType.CS) return
    const exception = {
      // 上报错误归类
      mechanism: {
        type: mechanismType.CS
      },
      // 错误信息
      value: event.message,
      // 错误类型
      type: 'CorsError',
      // 错误的标识码
      errorUid: getErrorUid(`${mechanismType.JS}-${event.message}`),
      // 附带信息
      meta: {}
    } as ExceptionMetrics
    // 自行上报异常，也可以跨域脚本的异常都不上报;
    _this.errorSendHandler(exception)
  }
  window.addEventListener('error', event => handler(event), true)
}
