import { metricsName, IMetrics } from '@/performance/store'
import { observe, PerformanceEntryHandler } from '@/performance'

export const getFID = (entryHandler: PerformanceEntryHandler): PerformanceObserver | undefined => {
  return observe('first-input', entryHandler)
}

export default (_this: any): void => {
  const entryHandler = (entry: PerformanceEventTiming) => {
    _this.metrics.set(metricsName.FID, {
      delay: entry.processingStart - entry.startTime,
      entry
    } as IMetrics)
  }
  getFID(entryHandler)
}
