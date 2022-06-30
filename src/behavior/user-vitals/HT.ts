import { metricsName } from '@/behavior/store'
import { proxyXmlHttp, proxyFetch, httpMetrics } from '@/utils/proxy'

// 初始化 http 请求的数据获取和上报
export default (_this: any): void => {
  const loadHandler = (metrics: httpMetrics) => {
    if (metrics.status < 400) {
      // 对于正常请求的 HTTP 请求来说,不需要记录 请求体 和 响应体
      delete metrics.response
      delete metrics.body
    }
    // 记录到 UserMetricsStore
    _this.metrics.add(metricsName.HT, metrics)
    // 记录到用户行为记录栈
    _this.breadcrumbs.push({
      category: metricsName.HT,
      data: metrics,
      ..._this.getExtends()
    })
  }
  proxyXmlHttp(null, loadHandler)
  proxyFetch(null, loadHandler)
}
