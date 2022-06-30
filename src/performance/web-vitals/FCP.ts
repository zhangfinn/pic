import MetricsStore, { metricsName, IMetrics } from '@/performance/store'
import { getPerformanceByName } from '@/performance'

export default (metrics: MetricsStore): void => {
  const entry = getPerformanceByName('first-contentful-paint')
  metrics.set(metricsName.FCP, {
    startTime: entry?.startTime.toFixed(2),
    entry
  } as IMetrics)
}
