import Performance from '@/performance'
import Behavior from '@/behavior'
import Error from '@/error'
import Transport from '@/utils/transport'

function Yeux(this: any, options: any) {
  this._init(options || {})
}

Yeux.prototype._init = function (options: any) {
  this.transportInstance = new Transport(options)
  this.errorInstance = new Error(this, options)
  this.userInstance = new Behavior(this)
  this.performanceInstance = new Performance(this)
}

export default Yeux as unknown
