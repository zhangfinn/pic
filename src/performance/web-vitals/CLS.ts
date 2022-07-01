import { metricsName, IMetrics } from '@/performance/store'
import { observe, PerformanceEntryHandler } from '@/performance'

export interface LayoutShift extends PerformanceEntry {
  value: number
  hadRecentInput: boolean
}

// 获取 CLS
export const getCLS = (entryHandler: PerformanceEntryHandler): PerformanceObserver | undefined => {
  return observe('layout-shift', entryHandler)
}

export default (_this: any): void => {
  let clsValue = 0
  let clsEntries = []

  let sessionValue = 0
  let sessionEntries: Array<LayoutShift> = []

  const entryHandler = (entry: LayoutShift) => {
    if (!entry.hadRecentInput) {
      const firstSessionEntry = sessionEntries[0]
      const lastSessionEntry = sessionEntries[sessionEntries.length - 1]

      // 如果条目与上一条目的相隔时间小于 1 秒且
      // 与会话中第一个条目的相隔时间小于 5 秒，那么将条目
      // 包含在当前会话中。否则，开始一个新会话。
      if (
        sessionValue &&
        entry.startTime - lastSessionEntry.startTime < 1000 &&
        entry.startTime - firstSessionEntry.startTime < 5000
      ) {
        sessionValue += entry.value
        sessionEntries.push(entry)
      } else {
        sessionValue = entry.value
        sessionEntries = [entry]
      }

      // 如果当前会话值大于当前 CLS 值，
      // 那么更新 CLS 及其相关条目。
      if (sessionValue > clsValue) {
        clsValue = sessionValue
        clsEntries = sessionEntries

        // 记录 CLS 到 Map 里
        _this.metrics.set(metricsName.CLS, {
          entry,
          clsValue,
          clsEntries
        } as IMetrics)
      }
    }
  }
  getCLS(entryHandler)
}
