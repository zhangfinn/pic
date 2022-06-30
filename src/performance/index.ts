import MetricsStore from '@/performance/store'
import FC from '@/performance/web-vitals/FC'
import FCP from '@/performance/web-vitals/FCP'
import FID from '@/performance/web-vitals/FID'
import LCP from '@/performance/web-vitals/LCP'
import CLS from '@/performance/web-vitals/CLS'
import NT from '@/performance/web-vitals/NT'
import RF from '@/performance/web-vitals/RF'
import { afterLoad } from '@/utils'
export default class WebVitals {
  public metrics: MetricsStore
  public engineInstance: any
  constructor(engineInstance: any) {
    this.metrics = new MetricsStore()
    this.engineInstance = engineInstance
    LCP(this.metrics)
    CLS(this.metrics)
    RF(this.metrics)

    afterLoad(() => {
      NT(this.metrics)
      FC(this.metrics)
      FCP(this.metrics)
      FID(this.metrics)
    })
  }
}

export const getPerformanceByName = (name: string): PerformanceEntry | undefined => {
  const [entry] = performance.getEntriesByName(name)
  return entry
}

export interface PerformanceEntryHandler {
  (entry: any): void
}

export const observe = (
  type: string,
  callback: PerformanceEntryHandler
): PerformanceObserver | undefined => {
  // 类型合规，就返回 observe
  if (PerformanceObserver.supportedEntryTypes?.includes(type)) {
    const ob: PerformanceObserver = new PerformanceObserver(l => l.getEntries().map(callback))

    ob.observe({ type, buffered: true })
    return ob
  }
  return undefined
}
