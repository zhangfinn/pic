import { metricsName, IMetrics } from '@/behavior/store'

export interface OriginInformation {
  referrer: string
  type: number | string
}
// 返回 OI 用户来路信息
export const getOriginInfo = (): OriginInformation => {
  return {
    referrer: document.referrer,
    type: window.performance?.navigation.type || ''
  }
}

// 初始化 OI 用户来路的获取以及返回
export default (_this: any): void => {
  const info: OriginInformation = getOriginInfo()
  const metrics = info as IMetrics
  _this.metrics.set(metricsName.OI, metrics)
}
