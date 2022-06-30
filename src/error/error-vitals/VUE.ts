import { mechanismType, ExceptionMetrics } from '@/error'
import { getErrorUid, parseStackFrames } from '@/utils/error'
import { Vue, ViewModel, formatComponentName } from '@/utils/vue'
// 只需要在外部把初始化好的 Vue 对象传入即可~
// 初始化 Vue异常 的数据获取和上报
export default (app: Vue, _this: any): void => {
  app.config.errorHandler = (err: Error, vm: ViewModel, info: string): void => {
    const componentName = formatComponentName(vm, false)
    const exception = {
      // 上报错误归类
      mechanism: {
        type: mechanismType.VUE
      },
      // 错误信息
      value: err.message,
      // 错误类型
      type: err.name,
      // 解析后的错误堆栈
      stackTrace: {
        frames: parseStackFrames(err)
      },
      // 错误的标识码
      errorUid: getErrorUid(`${mechanismType.JS}-${err.message}-${componentName}-${info}`),
      // 附带信息
      meta: {
        // 报错的Vue组件名
        componentName,
        // 报错的Vue阶段
        hook: info
      }
    } as ExceptionMetrics
    // 一般错误异常立刻上报，不用缓存在本地
    _this.errorSendHandler(exception)
  }
}
