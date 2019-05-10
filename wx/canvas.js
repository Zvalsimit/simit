const canvas = {
  /**
   * 获取转化px比例
   * params  e  [number]  屏幕宽度
  */
  ratioRPX(e) {
    return e.screenWidth <= 320 && 0.426 ||
      e.screenWidth <= 360 && 0.48 ||
      e.screenWidth <= 375 && 0.5 ||
      e.screenWidth <= 395 && 0.526 ||
      0.552
  },
  /**
   * rpx批量转化px
   * params e   [number/object]
   * params arg [object]
   *        object.property  [number] 换算目标
   * 
  */
  convert (e) {
    let arr = [...arguments].splice(1)
    let ratio = typeof e === 'number' && e || this.ratioRPX(e)
    arr.map(item => {
      for(let i in item) {
        item[i] = typeof item[i] === 'number' && item[i] * ratio || item[i]
      }
      return item
    })
    return arr
  },
  /**
   * params tar   [object] canvas对象
   * params x     [number] 圆心x坐标
   * params y     [number] 圆心y坐标
   * params lr    [number] 外圆半径
   * params r     [number] 内圆半径
   * params start [number] 起始弧度
   * params end   [number] 终止弧度
   * params bg    [string] 填充颜色
  */
  layerCirque(tar, x, y, lr, r, start, end, bg) {
    tar.beginPath()
    tar.arc(x, y, lr, start * Math.PI, end * Math.PI, )
    tar.arc(x, y, r, end * Math.PI, start * Math.PI, true)
    tar.closePath()
    tar.setFillStyle(bg)
    tar.fill()
  },
  /**
   * params tar   [object] canvas对象
   * params x     [number] x坐标
   * params y     [number] y坐标
   * params size  [number] 字体大小
   * params color [string] 字体颜色
   * params text  [string] 文字
   * params width [number] 屏幕width
   */
  layerText(tar, x, y, size, color, text, width) {
    if (width && !x) {
      tar.setFontSize(size)
      x = (width - (tar.measureText && tar.measureText(text).width || text.length * size))/2
    }
    tar.setFontSize(size)
    tar.setFillStyle(color)
    tar.fillText(text, x, y)
  },
  /**
   * params tar   [object] canvas对象
   * params x     [number] x坐标
   * params y     [number] y坐标
   * params r     [number] 半径
   * params path  [string] 本地路径
   */
  layerPhoto(tar, x, y, r, path){
    tar.save()
    tar.beginPath()
    tar.arc(x, y, r, 0, 2 * Math.PI)
    tar.clip()
    tar.drawImage(path, x - r, y - r, r * 2, r * 2)
    tar.restore()
  },
  /*
   *@param {object} tar canvas对象
   *@param {number} x x坐标
   *@param {number} y y坐标
   *@param {number} w 长
   *@param {number} h 宽
   */
  rect (tar, x, y, w, h, bg) {
    tar.beginPath()
    tar.rect(x, y, w, h)
    tar.setFillStyle(bg)
    tar.fill()
  }
}
module.exports = canvas