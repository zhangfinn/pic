import Performance from '@/performance'
import Behavior from '@/behavior'
import Error from '@/error'
import Transport from '@/utils/transport'

function Pic(this: any, options: any) {
  this._init(options || {})
}

Pic.prototype._init = function (options: any) {
  this.transportInstance = new Transport(options)
  this.userInstance = new Behavior(this)
  this.performanceInstance = new Performance(this)
  this.errorInstance = new Error(this, options)
}

export default Pic as unknown
