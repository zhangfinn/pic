import { proxyXmlHttp, proxyFetch, httpMetrics } from '@/utils/proxy'
import { mechanismType, ExceptionMetrics } from '@/error'
import { getErrorUid } from '@/utils/error'
// 初始化 HTTP请求异常 的数据获取和上报
export default (_this: any): void => {
  const loadHandler = (metrics: httpMetrics) => {
    // 如果 status 状态码小于 400,说明没有 HTTP 请求错误
    if (metrics.status < 400) return
    const value = metrics.response
    const exception = {
      // 上报错误归类
      mechanism: {
        type: mechanismType.HP
      },
      // 错误信息
      value,
      // 错误类型
      type: 'HttpError',
      // 错误的标识码
      errorUid: getErrorUid(`${mechanismType.HP}-${value}-${metrics.statusText}`),
      // 附带信息
      meta: {
        metrics
      }
    } as ExceptionMetrics
    // 一般错误异常立刻上报，不用缓存在本地
    _this.errorSendHandler(exception)
  }
  proxyXmlHttp(null, loadHandler)
  proxyFetch(null, loadHandler)
}
