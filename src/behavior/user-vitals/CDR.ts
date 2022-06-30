import { metricsName } from '@/behavior/store'

// 这里参考了 谷歌GA 的自定义埋点上报数据维度结构
export interface customAnalyticsData {
  // 事件类别 互动的对象 eg:Video
  eventCategory: string
  // 事件动作 互动动作方式 eg:play
  eventAction: string
  // 事件标签 对事件进行分类 eg:
  eventLabel: string
  // 事件值 与事件相关的数值   eg:180min
  eventValue?: string
}

// 初始化用户自定义埋点数据的获取上报
export default (_this: any): Function => {
  const handler = (options: customAnalyticsData) => {
    // 记录到 UserMetricsStore
    _this.metrics.add(metricsName.CDR, options)
    // 自定义埋点的信息一般立即上报
    _this.userSendHandler(options)
    // 记录到用户行为记录栈
    _this.breadcrumbs.push({
      category: metricsName.CDR,
      data: options,
      ..._this.getExtends()
    })
  }

  return handler
}
