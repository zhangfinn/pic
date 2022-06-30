import MetricsStore, { metricsName, IMetrics } from '@/performance/store'
import { observe } from '@/performance'

export interface ResourceFlowTiming {
  name: string
  transferSize: number
  initiatorType: string
  startTime: number
  responseEnd: number
  dnsLookup: number
  initialConnect: number
  ssl: number
  request: number
  ttfb: number
  contentDownload: number
}

// 获取 RF
export const getResourceFlow = (
  resourceFlow: Array<ResourceFlowTiming>
): PerformanceObserver | undefined => {
  const entryHandler = (entry: PerformanceResourceTiming) => {
    const {
      name,
      transferSize,
      initiatorType,
      startTime,
      responseEnd,
      domainLookupEnd,
      domainLookupStart,
      connectStart,
      connectEnd,
      secureConnectionStart,
      responseStart,
      requestStart
    } = entry
    resourceFlow.push({
      // name 资源地址
      name,
      // transferSize 传输大小
      transferSize,
      // initiatorType 资源类型
      initiatorType,
      // startTime 开始时间
      startTime,
      // responseEnd 结束时间
      responseEnd,
      // 贴近 Chrome 的近似分析方案，受到跨域资源影响
      dnsLookup: domainLookupEnd - domainLookupStart,
      initialConnect: connectEnd - connectStart,
      ssl: connectEnd - secureConnectionStart,
      request: responseStart - requestStart,
      ttfb: responseStart - requestStart,
      contentDownload: responseStart - requestStart
    })
  }

  return observe('resource', entryHandler)
}

// 初始化 RF 的获取以及返回
export default (metrics: MetricsStore): void => {
  const resourceFlow: Array<ResourceFlowTiming> = []
  const resObserve = getResourceFlow(resourceFlow)

  const stopListening = () => {
    if (resObserve) {
      resObserve.disconnect()
    }
    metrics.set(metricsName.RF, resourceFlow as IMetrics)
  }
  // 当页面 pageshow 触发时，中止
  window.addEventListener('pageshow', stopListening, { once: true, capture: true })
}
