import MetricsStore from '@/performance/store'
import FP from '@/performance/web-vitals/FP'
import FCP from '@/performance/web-vitals/FCP'
import FID from '@/performance/web-vitals/FID'
import LCP from '@/performance/web-vitals/LCP'
import CLS from '@/performance/web-vitals/CLS'
import NT from '@/performance/web-vitals/NT'
import RF from '@/performance/web-vitals/RF'
import { transportCategory } from '@/utils/transport'
import { afterLoad } from '@/utils'
export default class WebVitals {
  public metrics: MetricsStore
  public engineInstance: any
  constructor(engineInstance: any) {
    this.metrics = new MetricsStore()
    this.engineInstance = engineInstance
    // 最大内容绘制
    LCP(this.metrics)
    // 累计布局偏移
    CLS(this)
    // 静态资源加载
    RF(this.metrics)

    afterLoad(() => {
      // 首次非网页背景像素渲染（fp）(白屏时间)
      NT(this.metrics)
      // FP 首次绘制：页面视觉首次发生变化的时间点。FP不包含默认背景绘制，但包含非默认的背景绘制
      FP(this.metrics)
      // FCP 首次内容绘制：首次绘制任何文本、图像、非空白canvas或者SVG的时间点
      FCP(this.metrics)
      // 首次输入延迟
      FID(this)
      this.perfSendHandler()
    })
  }
  // 性能数据的上报策略
  perfSendHandler = (): void => {
    window.requestIdleCallback(() => {
      // 发送性能数据
      this.engineInstance.transportInstance.kernelTransportHandler(
        this.engineInstance.transportInstance.formatTransportData(
          transportCategory.PERF,
          this.metrics.state
        )
      )
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
