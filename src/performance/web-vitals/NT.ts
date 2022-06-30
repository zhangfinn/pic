import MetricsStore, { metricsName, IMetrics } from '@/performance/store'

export interface MPerformanceNavigationTiming {
  FP?: number
  TTI?: number
  DomReady?: number
  Load?: number
  FirseByte?: number
  DNS?: number
  TCP?: number
  SSL?: number
  TTFB?: number
  Trans?: number
  DomParse?: number
  Res?: number
}

// 获取 NT
const getNavigationTiming = (): MPerformanceNavigationTiming | undefined => {
  const resolveNavigationTiming = (
    entry: PerformanceNavigationTiming
  ): MPerformanceNavigationTiming => {
    const {
      domainLookupStart,
      domainLookupEnd,
      connectStart,
      connectEnd,
      secureConnectionStart,
      requestStart,
      responseStart,
      responseEnd,
      domInteractive,
      domContentLoadedEventEnd,
      loadEventStart,
      fetchStart
    } = entry

    return {
      // 关键时间点
      FP: responseEnd - fetchStart,
      TTI: domInteractive - fetchStart,
      DomReady: domContentLoadedEventEnd - fetchStart,
      Load: loadEventStart - fetchStart,
      FirseByte: responseStart - domainLookupStart,
      // 关键时间段
      DNS: domainLookupEnd - domainLookupStart,
      TCP: connectEnd - connectStart,
      SSL: secureConnectionStart ? connectEnd - secureConnectionStart : 0,
      TTFB: responseStart - requestStart,
      Trans: responseEnd - responseStart,
      DomParse: domInteractive - responseEnd,
      Res: loadEventStart - domContentLoadedEventEnd
    }
  }

  const navigation =
    // W3C Level2  PerformanceNavigationTiming
    // 使用了High-Resolution Time，时间精度可以达毫秒的小数点好几位。
    performance.getEntriesByType('navigation').length > 0
      ? performance.getEntriesByType('navigation')[0]
      : performance.timing // W3C Level1  (目前兼容性高，仍然可使用，未来可能被废弃)。
  return resolveNavigationTiming(navigation as PerformanceNavigationTiming)
}

// 初始化 NT 的获取以及返回
export default (metrics: MetricsStore): void => {
  const navigationTiming = getNavigationTiming()
  metrics.set(metricsName.NT, navigationTiming as IMetrics)
}
