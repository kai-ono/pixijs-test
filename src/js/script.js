'use strict'

const PIXI = window.PIXI

const UTILS = {
  HoverImg: (args) => {
    const elmArr = [].slice.call(args.elm)
    for (let i = 0; i < elmArr.length; i++) {
      const alt = elmArr[i].children[0].getAttribute('alt')
      const hoverStr = elmArr[i].children[0].src.replace(args.off, args.on)
      const hoverImg = new Image()
      hoverImg.src = hoverStr
      hoverImg.alt = alt
      hoverImg.classList.add(args.on)
      elmArr[i].appendChild(hoverImg)

      elmArr[i].addEventListener('mouseenter', (e) => {
        e.target.querySelector('.hover').classList.add('active')
      })
      elmArr[i].addEventListener('mouseleave', (e) => {
        e.target.querySelector('.hover').classList.remove('active')
      })
    }
  },

  /**
   * http://www.sitepoint.com/smooth-scrolling-vanilla-javascript
   * The MIT License (MIT)
   * Copyright (c) 2016 SitePoint
   * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
   * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  Jump (target, options) {
    this.start = window.pageYOffset
    this.opt = {
      duration: options.duration,
      offset: options.offset || 0,
      callback: options.callback,
      easing: options.easing || easeInOutQuad
    }
    this.distance = typeof target === 'string' ? this.opt.offset + document.querySelector(target).getBoundingClientRect().top : target
    this.duration = typeof this.opt.duration === 'function' ? this.opt.duration(this.distance) : this.opt.duration
    this.timeStart = 0
    this.timeElapsed = 0

    requestAnimationFrame((time) => {
      this.timeStart = time
      loop(time)
    })

    const loop = (time) => {
      this.timeElapsed = time - this.timeStart

      window.scrollTo(0, this.opt.easing(this.timeElapsed, this.start, this.distance, this.duration))

      if (this.timeElapsed < this.duration) {
        requestAnimationFrame(loop)
      } else {
        end()
      }
    }

    const end = () => {
      window.scrollTo(0, this.start + this.distance)
      if (typeof this.opt.callback === 'function') this.opt.callback()
    }

    function easeInOutQuad (t, b, c, d) {
      t /= d / 2
      if (t < 1) return c / 2 * t * t + b
      t--
      return -c / 2 * (t * (t - 2) - 1) + b
    }
  }
}

class DelayLoader {
  constructor (args) {
    this.args = (typeof args !== 'undefined') ? args : {}
    this.elmNodes = (typeof this.args.elms !== 'undefined') ? this.args.elms : document.querySelectorAll('.delayload')
    this.cls = (typeof this.args.cls !== 'undefined') ? this.args.cls : 'loaded'
    this.Init()
  }

  Init () {
    for (let i = 0; i < this.elmNodes.length; i++) {
      const elm = this.elmNodes[i]
      const time = (typeof elm.dataset.time !== 'undefined') ? elm.dataset.time : 300

      setTimeout(() => {
        elm.classList.add(this.cls)
      }, time)
    }
  }
}

class BgCanvas {
  /**
   * コンストラクタ
   */
  constructor (progressBar) {
    this.progressBar = (typeof progressBar !== 'undefined') ? progressBar : ''
    this.InitPIXI()
  }

  InitPIXI () {
    this.CheckContentSize()
    this.app = new PIXI.Application({
      width: this.contentW,
      height: this.contentH,
      antialias: true
    })
    document.querySelector('.contentWrap').insertBefore(this.app.view, document.querySelector('.content'))

    PIXI.loader
      .add('mainBg', 'img/sample3.jpg')
      .add('sub1Bg', 'img/sample1.jpg')
      .add('sub2Bg', 'img/sample2.jpg')
      .add('sub3Bg', 'img/sample4.jpg')
      .on('progress', (loader, resource) => {
        this.progressBar.style.width = loader.progress + '%'
      })
      .load((loader, resources) => {
        // void new DelayLoader({ elm: document.querySelector('.delayload') })
        document.querySelector('.loading').classList.add('hide')
        document.querySelector('.contentWrap').classList.add('loaded')
        this.SetObjects(resources)
        this.InitWave()
        this.InitMask()
        this.SetEvent()
      })
  }

  InitWave () {
    const centerX = Math.floor(this.contentW / 2)
    const centerY = Math.floor(this.contentH / 2)
    const r = 80
    this.rectPos = {
      lt: {
        x: centerX - r,
        y: centerY - r
      },
      rt: {
        x: centerX + r,
        y: centerY - r
      },
      rb: {
        x: centerX + r,
        y: centerY + r
      },
      lb: {
        x: centerX - r,
        y: centerY + r
      }
    }
    this.waveArr = []
    this.waveArr.push(this.WaveFactory({
      color: 0x9000ff,
      alpha: 0.2,
      zoom: 2,
      delay: 0
    }))
    this.waveArr.push(this.WaveFactory({
      color: 0x0055ff,
      alpha: 0.2,
      zoom: 2,
      delay: 500
    }))
    this.waveArr.push(this.WaveFactory({
      color: 0x00cbff,
      alpha: 0.2,
      zoom: 2,
      delay: 1000
    }))
    this.waveCont = new PIXI.Container()
    this.contAlpha = 1
    this.waveCont.x = this.contentW / 2
    this.waveCont.y = this.contentH / 2
    this.waveCont.pivot.x = this.contentW / 2
    this.waveCont.pivot.y = this.contentH / 2

    this.ticker = new PIXI.ticker.Ticker()
    this.ticker.fps = 60
    this.ticker.add(() => {
      for (let i = 0; i < this.waveArr.length; i++) {
        this.DrawWave(this.waveArr[i])
        this.waveArr[i].seconds = this.waveArr[i].seconds + 0.009
        this.waveArr[i].t = this.waveArr[i].seconds * Math.PI
      }
    })
    this.mainCont.addChild(this.waveCont)
    this.ticker.start()
  }

  WaveFactory (args) {
    return {
      graphics: new PIXI.Graphics(),
      unit: 30,
      seconds: 0,
      t: 1,
      color: args.color,
      alpha: args.alpha,
      zoom: args.zoom,
      delay: args.delay
    }
  }

  DrawWave (obj) {
    obj.graphics.clear()
    obj.graphics.beginFill(obj.color)
    obj.graphics.alpha = obj.alpha
    this.DrawSine(obj, obj.t / 0.5, obj.zoom, obj.delay)
    this.waveCont.addChild(obj.graphics)
  }

  DrawSine (obj, t, zoom, delay) {
    const sideLength = 30
    const calcBasePos = (args) => {
      return obj.t + (-args.pt + args.cnt) / obj.unit / zoom
    }
    const calcSinPt = (pt) => {
      return Math.sin(pt - delay) / 3
    }
    const calcEndPos = (args) => {
      return obj.unit * args.pt + args.axis
    }
    const basePt = calcBasePos({
      pt: this.rectPos.lt.x,
      cnt: this.rectPos.lt.x
    })
    const startPos = {
      x: this.rectPos.lt.x + 20,
      y: calcEndPos({
        pt: calcSinPt(basePt),
        axis: this.rectPos.lt.y
      })
    }

    // 開始位置
    obj.graphics.moveTo(startPos.x, startPos.y)

    // 上辺
    for (let i = startPos.x; i <= this.rectPos.rt.x - sideLength; i += 10) {
      const basePt = calcBasePos({
        pt: this.rectPos.lt.x,
        cnt: i
      })
      const endPos = {
        wave: calcEndPos({
          pt: calcSinPt(basePt),
          axis: this.rectPos.lt.y
        }),
        axis: i
      }
      obj.graphics.lineTo(endPos.axis, endPos.wave)
    }

    // 右辺
    for (let i = this.rectPos.rt.y + sideLength; i <= this.rectPos.rb.y - sideLength; i += 10) {
      const basePt = calcBasePos({
        pt: this.rectPos.rt.y,
        cnt: i
      })
      const endPos = {
        wave: calcEndPos({
          pt: calcSinPt(basePt),
          axis: this.rectPos.rt.x
        }),
        axis: i
      }
      if (i === this.rectPos.rt.y + sideLength) {
        obj.graphics.quadraticCurveTo(this.rectPos.rt.x, this.rectPos.rt.y, endPos.wave, endPos.axis)
      }
      obj.graphics.lineTo(endPos.wave, endPos.axis)
    }

    // 下辺
    for (let i = this.rectPos.rb.x - sideLength; i >= this.rectPos.lb.x + sideLength; i -= 10) {
      const basePt = calcBasePos({
        pt: this.rectPos.rb.x,
        cnt: i
      })
      const endPos = {
        wave: calcEndPos({
          pt: calcSinPt(basePt),
          axis: this.rectPos.rb.y
        }),
        axis: i
      }
      if (i === this.rectPos.rb.x - sideLength) {
        obj.graphics.quadraticCurveTo(this.rectPos.rb.x, this.rectPos.rb.y, endPos.axis, endPos.wave)
      }
      obj.graphics.lineTo(endPos.axis, endPos.wave)
    }

    // 左辺
    for (let i = this.rectPos.lb.y - sideLength; i >= this.rectPos.lt.y + sideLength; i -= 10) {
      const basePt = calcBasePos({
        pt: this.rectPos.lb.y,
        cnt: i
      })
      const endPos = {
        wave: calcEndPos({
          pt: calcSinPt(basePt),
          axis: this.rectPos.lb.x
        }),
        axis: i
      }
      if (i === this.rectPos.lb.y - sideLength) {
        obj.graphics.quadraticCurveTo(this.rectPos.lb.x, this.rectPos.lb.y, endPos.wave, endPos.axis)
      }
      obj.graphics.lineTo(endPos.wave, endPos.axis)
      if (i <= this.rectPos.lt.y + sideLength) {
        obj.graphics.quadraticCurveTo(this.rectPos.lt.x, this.rectPos.lt.y, startPos.x, startPos.y)
      }
    }

    this.waveCont.addChild(obj.graphics)
  }

  CheckContentSize () {
    this.contentW = window.innerWidth
    this.contentH = window.innerHeight
  }

  SetObjects (resources) {
    this.mainCont = new PIXI.Container()
    this.mainBgOrg = resources.mainBg.texture
    this.mainBg = new PIXI.Sprite(resources.mainBg.texture)

    this.sub1BgOrg = resources.sub1Bg.texture
    this.sub1Bg = new PIXI.Sprite(resources.sub1Bg.texture)

    this.mainCont.addChild(this.mainBg)
    this.app.stage.addChild(this.mainCont, this.sub1Bg)

    this.InitImgs()
  }

  InitImgs () {
    const mainBgSize = this.ImgSizeAdjustor(this.mainBgOrg)
    const sub1BgSize = this.ImgSizeAdjustor(this.sub1BgOrg)

    this.mainBg.width = mainBgSize.width
    this.mainBg.height = mainBgSize.height
    this.mainBg.x = this.app.renderer.width / 2
    this.mainBg.y = this.contentH - mainBgSize.height
    this.mainBg.anchor.x = 0.5
    this.mainBg.anchor.y = 0

    this.sub1Bg.width = sub1BgSize.width
    this.sub1Bg.height = sub1BgSize.height
    this.sub1Bg.x = this.app.renderer.width / 2
    this.sub1Bg.y = this.contentH - sub1BgSize.height
    this.sub1Bg.anchor.x = 0.5
    this.sub1Bg.anchor.y = 0
  }

  InitMask () {
    this.maskCont = new PIXI.Container()
    this.mask = new PIXI.Graphics()
    this.mask.beginFill(0xe74c3c)
    this.mask.drawCircle(this.contentW / 2, this.contentH / 2, 40)
    this.mask.endFill()
    this.mask.alpha = 0
    this.mask.x = 0
    this.mask.y = 0
    this.maskCont.x = this.contentW / 2
    this.maskCont.y = this.contentH / 2
    this.maskCont.pivot.x = this.contentW / 2
    this.maskCont.pivot.y = this.contentH / 2
    this.destScale = this.destStartScale = this.maskCont.scale.x
    this.dest2Scale = this.dest2StartScale = this.waveCont.scale.x
    this.sub1Bg.mask = this.mask
    this.maskCont.addChild(this.mask)
    this.app.stage.addChild(this.maskCont)
  }

  SetEvent () {
    window.addEventListener('resize', () => {
      this.CheckContentSize()
      this.app.renderer.resize(this.contentW, this.contentH)
      this.InitImgs()
    })
    window.addEventListener('scroll', (e) => {
      if (window.pageYOffset > 0) {
        if (window.pageYOffset <= 0) {
          this.contAlpha = 1
        } else {
          const value = 1 - window.pageYOffset / 1000
          this.contAlpha = (value < 0) ? 0 : value
        }
      } else {
        this.contAlpha = 1
      }

      if (window.pageYOffset > this.contentH * 2) {
        this.app.view.classList.add('static')
      } else {
        this.app.view.classList.remove('static')
      }

      if (this.contAlpha > 0) {
        this.destScale = window.pageYOffset / 300 + this.destStartScale
        this.dest2Scale = window.pageYOffset / 300 + this.dest2StartScale
      }
    })
    this.app.ticker.add(() => {
      this.maskCont.scale.x += (this.destScale - this.maskCont.scale.x) * 0.15
      this.maskCont.scale.y += (this.destScale - this.maskCont.scale.y) * 0.15
      this.waveCont.scale.x += (this.dest2Scale - this.waveCont.scale.x) * 0.15
      this.waveCont.scale.y += (this.dest2Scale - this.waveCont.scale.y) * 0.15
      this.waveCont.alpha += (this.contAlpha - this.waveCont.alpha) * 0.15
      this.maskCont.alpha += (this.contAlpha - this.maskCont.alpha) * 0.15
      if (this.contAlpha <= 0) {
        this.destScale = 25
      }
    })
  }

  ImgSizeAdjustor (resource) {
    let tmpRatio = this.contentH / resource.height
    let tmpWidth = resource.width * tmpRatio
    let tmpHeight = this.contentH

    if (tmpWidth < this.contentW) {
      tmpRatio = this.contentW / resource.width
      tmpWidth = this.contentW
      tmpHeight = resource.height * tmpRatio
    }

    return {
      width: tmpWidth,
      height: tmpHeight
    }
  }
};

class VTuber {
  /**
   * コンストラクタ
   */
  constructor (args) {
    this.args = (typeof args !== 'undefined') ? args : {}
    this.progressBar = (typeof args.progressBar !== 'undefined') ? args.progressBar : ''
    this.hoverArgs = (typeof this.args.hoverArgs !== 'undefined') ? this.args.hoverArgs : ''
    this.Init()
  }

  Init () {
    void new BgCanvas(this.progressBar)
    // UTILS.HoverImg(this.hoverArgs)
    // this.SetEvent()
  }

  SetEvent () {
    let scrollElmsArr = [].slice.call(document.querySelectorAll('.smooth'))

    for (let i = 0; i < scrollElmsArr.length; i++) {
      scrollElmsArr[i].addEventListener('click', (e) => {
        const hash = e.currentTarget.dataset.hash
        UTILS.Jump(hash, { duration: 500 })
      })
    }
  }
}

window.addEventListener('DOMContentLoaded', function () {
  void new VTuber({
    hoverArgs: {
      elm: document.querySelectorAll('.imgHover'),
      off: 'default',
      on: 'hover'
    },
    progressBar: document.querySelector('.loading .bar > div')
  })
})
