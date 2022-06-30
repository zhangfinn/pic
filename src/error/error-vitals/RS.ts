import { mechanismType, ExceptionMetrics, getErrorKey } from '@/error'
import { getErrorUid } from '@/utils/error'
// 静态资源错误的 ErrorTarget
export interface ResourceErrorTarget {
  src?: string
  tagName?: string
  outerHTML?: string
}

// 初始化 静态资源异常 的数据获取和上报
export default (_this: any): void => {
  const handler = (event: Event) => {
    event.preventDefault() // 阻止向上抛出控制台报错
    // 如果不是跨域脚本异常,就结束
    if (getErrorKey(event) !== mechanismType.RS) return
    const target = event.target as ResourceErrorTarget
    const exception = {
      // 上报错误归类
      mechanism: {
        type: mechanismType.RS
      },
      // 错误信息
      value: '',
      // 错误类型
      type: 'ResourceError',
      // 用户行为追踪 breadcrumbs 在 errorSendHandler 中统一封装
      // 页面基本信息 pageInformation 也在 errorSendHandler 中统一封装
      // 错误的标识码
      errorUid: getErrorUid(`${mechanismType.RS}-${target.src}-${target.tagName}`),
      // 附带信息
      meta: {
        url: target.src,
        html: target.outerHTML,
        type: target.tagName
      }
    } as ExceptionMetrics
    // 一般错误异常立刻上报，不用缓存在本地
    _this.errorSendHandler(exception)
  }
  window.addEventListener('error', event => handler(event), true)
}
