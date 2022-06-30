import { behaviorStack } from '@/behavior/BehaviorStore'
import { IMetrics, metricsName } from '@/behavior/store'
import { getPageInfo } from '@/behavior/user-vitals/PI'
import { proxyHash, proxyHistory } from '@/behavior'

// 初始化 RCR 路由跳转的获取以及返回
export default (_this: any): void => {
  const handler = (e: Event) => {
    // 正常记录
    // 一般路由跳转的信息不会进行上报，根据业务形态决定；
    _this.metrics.add(metricsName.RCR, {
      // 跳转的方法 eg:replaceState
      jumpType: e.type,
      // 创建时间
      timestamp: new Date().getTime(),
      // 页面信息
      pageInfo: getPageInfo()
    } as IMetrics)
    // 记录到行为记录追踪
    _this.breadcrumbs.push({
      category: metricsName.RCR,
      data: _this.metrics,
      ..._this.getExtends()
    } as behaviorStack)
  }
  proxyHash(handler)
  // 为 pushState 以及 replaceState 方法添加 Evetn 事件
  proxyHistory(handler)
}
