import MetricsStore, { metricsName, IMetrics } from '@/performance/store'
import { observe, PerformanceEntryHandler } from '@/performance'

export const getLCP = (entryHandler: PerformanceEntryHandler): PerformanceObserver | undefined => {
  return observe('largest-contentful-paint', entryHandler)
}

export default (metrics: MetricsStore): void => {
  const entryHandler = (entry: PerformanceEventTiming) => {
    metrics.set(metricsName.LCP, {
      startTime: entry?.startTime.toFixed(2),
      entry
    } as IMetrics)
  }
  getLCP(entryHandler)
}
