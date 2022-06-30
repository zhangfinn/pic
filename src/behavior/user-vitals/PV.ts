import { IMetrics } from '@/behavior/store'
import { proxyHash, proxyHistory } from '@/behavior'
import { getPageInfo } from '@/behavior/user-vitals/PI'
import { getOriginInfo } from '@/behavior/user-vitals/OI'
import { afterLoad } from '@/utils'

// 初始化 PV 的获取以及返回
export default (_this: any): void => {
  const handler = () => {
    const metrics = {
      // 还有一些标识用户身份的信息，由项目使用方传入，任意拓展 eg:userId
      // 创建时间
      timestamp: new Date().getTime(),
      // 页面信息
      pageInfo: getPageInfo(),
      // 用户来路
      originInformation: getOriginInfo()
    } as IMetrics
    _this.userSendHandler(metrics)
    // 一般来说， PV 可以立即上报
  }
  afterLoad(() => {
    handler()
  })
  proxyHash(handler)
  // 为 pushState 以及 replaceState 方法添加 Evetn 事件
  proxyHistory(handler)
}
