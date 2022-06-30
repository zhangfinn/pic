import { getPageInfo } from '@/behavior/user-vitals/PI'
import { metricsName, IMetrics } from '@/behavior/store'
import { behaviorStack } from '@/behavior/BehaviorStore'

// 初始化 CBR 点击事件的获取和返回
export default (_this: any): void => {
  const handler = (e: MouseEvent | any) => {
    // 这里是根据 tagName 进行是否需要捕获事件的依据，可以根据自己的需要，额外判断id\class等
    // 先判断浏览器支持 e.path ，从 path 里先取

    let target = e.path?.find((x: Element) =>
      _this.clickMountList.includes(x.tagName?.toLowerCase())
    )
    // 不支持 path 就再判断 target
    target =
      target ||
      (_this.clickMountList.includes(e.target.tagName?.toLowerCase()) ? e.target : undefined)
    if (!target) return
    const metrics = {
      tagInfo: {
        id: target.id,
        classList: Array.from(target.classList),
        tagName: target.tagName,
        text: target.textContent
      },
      // 创建时间
      timestamp: new Date().getTime(),
      // 页面信息
      pageInfo: getPageInfo()
    } as IMetrics
    // 除开商城业务外，一般不会特意上报点击行为的数据，都是作为辅助检查错误的数据存在;
    _this.metrics.add(metricsName.CBR, metrics)
    // 行为记录 不需要携带 完整的pageInfo
    delete metrics.pageInfo
    // 记录到行为记录追踪
    const behavior = {
      category: metricsName.CBR,
      data: metrics,
      ..._this.getExtends()
    } as behaviorStack
    _this.breadcrumbs.push(behavior)
  }
  window.addEventListener(
    'click',
    e => {
      handler(e)
    },
    true
  )
}
