(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PIXI = window.PIXI;

var UTILS = {
  HoverImg: function HoverImg(args) {
    var elmArr = [].slice.call(args.elm);
    for (var i = 0; i < elmArr.length; i++) {
      var alt = elmArr[i].children[0].getAttribute('alt');
      var hoverStr = elmArr[i].children[0].src.replace(args.off, args.on);
      var hoverImg = new Image();
      hoverImg.src = hoverStr;
      hoverImg.alt = alt;
      hoverImg.classList.add(args.on);
      elmArr[i].appendChild(hoverImg);

      elmArr[i].addEventListener('mouseenter', function (e) {
        e.target.querySelector('.hover').classList.add('active');
      });
      elmArr[i].addEventListener('mouseleave', function (e) {
        e.target.querySelector('.hover').classList.remove('active');
      });
    }
  },

  Jump: function Jump(target, options) {
    var _this = this;

    this.start = window.pageYOffset;
    this.opt = {
      duration: options.duration,
      offset: options.offset || 0,
      callback: options.callback,
      easing: options.easing || easeInOutQuad
    };
    this.distance = typeof target === 'string' ? this.opt.offset + document.querySelector(target).getBoundingClientRect().top : target;
    this.duration = typeof this.opt.duration === 'function' ? this.opt.duration(this.distance) : this.opt.duration;
    this.timeStart = 0;
    this.timeElapsed = 0;

    requestAnimationFrame(function (time) {
      _this.timeStart = time;
      loop(time);
    });

    var loop = function loop(time) {
      _this.timeElapsed = time - _this.timeStart;

      window.scrollTo(0, _this.opt.easing(_this.timeElapsed, _this.start, _this.distance, _this.duration));

      if (_this.timeElapsed < _this.duration) {
        requestAnimationFrame(loop);
      } else {
        end();
      }
    };

    var end = function end() {
      window.scrollTo(0, _this.start + _this.distance);
      if (typeof _this.opt.callback === 'function') _this.opt.callback();
    };

    function easeInOutQuad(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }
  }
};

var DelayLoader = function () {
  function DelayLoader(args) {
    _classCallCheck(this, DelayLoader);

    this.args = typeof args !== 'undefined' ? args : {};
    this.elmNodes = typeof this.args.elms !== 'undefined' ? this.args.elms : document.querySelectorAll('.delayload');
    this.cls = typeof this.args.cls !== 'undefined' ? this.args.cls : 'loaded';
    this.Init();
  }

  _createClass(DelayLoader, [{
    key: 'Init',
    value: function Init() {
      var _this2 = this;

      var _loop = function _loop(i) {
        var elm = _this2.elmNodes[i];
        var time = typeof elm.dataset.time !== 'undefined' ? elm.dataset.time : 300;

        setTimeout(function () {
          elm.classList.add(_this2.cls);
        }, time);
      };

      for (var i = 0; i < this.elmNodes.length; i++) {
        _loop(i);
      }
    }
  }]);

  return DelayLoader;
}();

var BgCanvas = function () {
  function BgCanvas(progressBar) {
    _classCallCheck(this, BgCanvas);

    this.progressBar = typeof progressBar !== 'undefined' ? progressBar : '';
    this.InitPIXI();
  }

  _createClass(BgCanvas, [{
    key: 'InitPIXI',
    value: function InitPIXI() {
      var _this3 = this;

      this.CheckContentSize();
      this.app = new PIXI.Application({
        width: this.contentW,
        height: this.contentH,
        antialias: true
      });
      document.querySelector('.contentWrap').insertBefore(this.app.view, document.querySelector('.content'));

      PIXI.loader.add('mainBg', 'img/sample3.jpg').add('sub1Bg', 'img/sample1.jpg').add('sub2Bg', 'img/sample2.jpg').add('sub3Bg', 'img/sample4.jpg').on('progress', function (loader, resource) {
        _this3.progressBar.style.width = loader.progress + '%';
      }).load(function (loader, resources) {
        document.querySelector('.loading').classList.add('hide');
        document.querySelector('.contentWrap').classList.add('loaded');
        _this3.SetObjects(resources);
        _this3.InitWave();
        _this3.InitMask();
        _this3.SetEvent();
      });
    }
  }, {
    key: 'InitWave',
    value: function InitWave() {
      var _this4 = this;

      var centerX = Math.floor(this.contentW / 2);
      var centerY = Math.floor(this.contentH / 2);
      var r = 80;
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
      };
      this.waveArr = [];
      this.waveArr.push(this.WaveFactory({
        color: 0x9000ff,
        alpha: 0.2,
        zoom: 2,
        delay: 0
      }));
      this.waveArr.push(this.WaveFactory({
        color: 0x0055ff,
        alpha: 0.2,
        zoom: 2,
        delay: 500
      }));
      this.waveArr.push(this.WaveFactory({
        color: 0x00cbff,
        alpha: 0.2,
        zoom: 2,
        delay: 1000
      }));
      this.waveCont = new PIXI.Container();
      this.contAlpha = 1;
      this.waveCont.x = this.contentW / 2;
      this.waveCont.y = this.contentH / 2;
      this.waveCont.pivot.x = this.contentW / 2;
      this.waveCont.pivot.y = this.contentH / 2;

      this.ticker = new PIXI.ticker.Ticker();
      this.ticker.fps = 60;
      this.ticker.add(function () {
        for (var i = 0; i < _this4.waveArr.length; i++) {
          _this4.DrawWave(_this4.waveArr[i]);
          _this4.waveArr[i].seconds = _this4.waveArr[i].seconds + 0.009;
          _this4.waveArr[i].t = _this4.waveArr[i].seconds * Math.PI;
        }
      });
      this.mainCont.addChild(this.waveCont);
      this.ticker.start();
    }
  }, {
    key: 'WaveFactory',
    value: function WaveFactory(args) {
      return {
        graphics: new PIXI.Graphics(),
        unit: 30,
        seconds: 0,
        t: 1,
        color: args.color,
        alpha: args.alpha,
        zoom: args.zoom,
        delay: args.delay
      };
    }
  }, {
    key: 'DrawWave',
    value: function DrawWave(obj) {
      obj.graphics.clear();
      obj.graphics.beginFill(obj.color);
      obj.graphics.alpha = obj.alpha;
      this.DrawSine(obj, obj.t / 0.5, obj.zoom, obj.delay);
      this.waveCont.addChild(obj.graphics);
    }
  }, {
    key: 'DrawSine',
    value: function DrawSine(obj, t, zoom, delay) {
      var sideLength = 30;
      var calcBasePos = function calcBasePos(args) {
        return obj.t + (-args.pt + args.cnt) / obj.unit / zoom;
      };
      var calcSinPt = function calcSinPt(pt) {
        return Math.sin(pt - delay) / 3;
      };
      var calcEndPos = function calcEndPos(args) {
        return obj.unit * args.pt + args.axis;
      };
      var basePt = calcBasePos({
        pt: this.rectPos.lt.x,
        cnt: this.rectPos.lt.x
      });
      var startPos = {
        x: this.rectPos.lt.x + 20,
        y: calcEndPos({
          pt: calcSinPt(basePt),
          axis: this.rectPos.lt.y
        })
      };

      obj.graphics.moveTo(startPos.x, startPos.y);

      for (var i = startPos.x; i <= this.rectPos.rt.x - sideLength; i += 10) {
        var _basePt = calcBasePos({
          pt: this.rectPos.lt.x,
          cnt: i
        });
        var endPos = {
          wave: calcEndPos({
            pt: calcSinPt(_basePt),
            axis: this.rectPos.lt.y
          }),
          axis: i
        };
        obj.graphics.lineTo(endPos.axis, endPos.wave);
      }

      for (var _i = this.rectPos.rt.y + sideLength; _i <= this.rectPos.rb.y - sideLength; _i += 10) {
        var _basePt2 = calcBasePos({
          pt: this.rectPos.rt.y,
          cnt: _i
        });
        var _endPos = {
          wave: calcEndPos({
            pt: calcSinPt(_basePt2),
            axis: this.rectPos.rt.x
          }),
          axis: _i
        };
        if (_i === this.rectPos.rt.y + sideLength) {
          obj.graphics.quadraticCurveTo(this.rectPos.rt.x, this.rectPos.rt.y, _endPos.wave, _endPos.axis);
        }
        obj.graphics.lineTo(_endPos.wave, _endPos.axis);
      }

      for (var _i2 = this.rectPos.rb.x - sideLength; _i2 >= this.rectPos.lb.x + sideLength; _i2 -= 10) {
        var _basePt3 = calcBasePos({
          pt: this.rectPos.rb.x,
          cnt: _i2
        });
        var _endPos2 = {
          wave: calcEndPos({
            pt: calcSinPt(_basePt3),
            axis: this.rectPos.rb.y
          }),
          axis: _i2
        };
        if (_i2 === this.rectPos.rb.x - sideLength) {
          obj.graphics.quadraticCurveTo(this.rectPos.rb.x, this.rectPos.rb.y, _endPos2.axis, _endPos2.wave);
        }
        obj.graphics.lineTo(_endPos2.axis, _endPos2.wave);
      }

      for (var _i3 = this.rectPos.lb.y - sideLength; _i3 >= this.rectPos.lt.y + sideLength; _i3 -= 10) {
        var _basePt4 = calcBasePos({
          pt: this.rectPos.lb.y,
          cnt: _i3
        });
        var _endPos3 = {
          wave: calcEndPos({
            pt: calcSinPt(_basePt4),
            axis: this.rectPos.lb.x
          }),
          axis: _i3
        };
        if (_i3 === this.rectPos.lb.y - sideLength) {
          obj.graphics.quadraticCurveTo(this.rectPos.lb.x, this.rectPos.lb.y, _endPos3.wave, _endPos3.axis);
        }
        obj.graphics.lineTo(_endPos3.wave, _endPos3.axis);
        if (_i3 <= this.rectPos.lt.y + sideLength) {
          obj.graphics.quadraticCurveTo(this.rectPos.lt.x, this.rectPos.lt.y, startPos.x, startPos.y);
        }
      }

      this.waveCont.addChild(obj.graphics);
    }
  }, {
    key: 'CheckContentSize',
    value: function CheckContentSize() {
      this.contentW = window.innerWidth;
      this.contentH = window.innerHeight;
    }
  }, {
    key: 'SetObjects',
    value: function SetObjects(resources) {
      this.mainCont = new PIXI.Container();
      this.mainBgOrg = resources.mainBg.texture;
      this.mainBg = new PIXI.Sprite(resources.mainBg.texture);

      this.sub1BgOrg = resources.sub1Bg.texture;
      this.sub1Bg = new PIXI.Sprite(resources.sub1Bg.texture);

      this.mainCont.addChild(this.mainBg);
      this.app.stage.addChild(this.mainCont, this.sub1Bg);

      this.InitImgs();
    }
  }, {
    key: 'InitImgs',
    value: function InitImgs() {
      var mainBgSize = this.ImgSizeAdjustor(this.mainBgOrg);
      var sub1BgSize = this.ImgSizeAdjustor(this.sub1BgOrg);

      this.mainBg.width = mainBgSize.width;
      this.mainBg.height = mainBgSize.height;
      this.mainBg.x = this.app.renderer.width / 2;
      this.mainBg.y = this.contentH - mainBgSize.height;
      this.mainBg.anchor.x = 0.5;
      this.mainBg.anchor.y = 0;

      this.sub1Bg.width = sub1BgSize.width;
      this.sub1Bg.height = sub1BgSize.height;
      this.sub1Bg.x = this.app.renderer.width / 2;
      this.sub1Bg.y = this.contentH - sub1BgSize.height;
      this.sub1Bg.anchor.x = 0.5;
      this.sub1Bg.anchor.y = 0;
    }
  }, {
    key: 'InitMask',
    value: function InitMask() {
      this.maskCont = new PIXI.Container();
      this.mask = new PIXI.Graphics();
      this.mask.beginFill(0xe74c3c);
      this.mask.drawCircle(this.contentW / 2, this.contentH / 2, 40);
      this.mask.endFill();
      this.mask.alpha = 0;
      this.mask.x = 0;
      this.mask.y = 0;
      this.maskCont.x = this.contentW / 2;
      this.maskCont.y = this.contentH / 2;
      this.maskCont.pivot.x = this.contentW / 2;
      this.maskCont.pivot.y = this.contentH / 2;
      this.destScale = this.destStartScale = this.maskCont.scale.x;
      this.dest2Scale = this.dest2StartScale = this.waveCont.scale.x;
      this.sub1Bg.mask = this.mask;
      this.maskCont.addChild(this.mask);
      this.app.stage.addChild(this.maskCont);
    }
  }, {
    key: 'SetEvent',
    value: function SetEvent() {
      var _this5 = this;

      window.addEventListener('resize', function () {
        _this5.CheckContentSize();
        _this5.app.renderer.resize(_this5.contentW, _this5.contentH);
        _this5.InitImgs();
      });
      window.addEventListener('scroll', function (e) {
        if (window.pageYOffset > 0) {
          if (window.pageYOffset <= 0) {
            _this5.contAlpha = 1;
          } else {
            var value = 1 - window.pageYOffset / 1000;
            _this5.contAlpha = value < 0 ? 0 : value;
          }
        } else {
          _this5.contAlpha = 1;
        }

        if (window.pageYOffset > _this5.contentH * 2) {
          _this5.app.view.classList.add('static');
        } else {
          _this5.app.view.classList.remove('static');
        }

        if (_this5.contAlpha > 0) {
          _this5.destScale = window.pageYOffset / 300 + _this5.destStartScale;
          _this5.dest2Scale = window.pageYOffset / 300 + _this5.dest2StartScale;
        }
      });
      this.app.ticker.add(function () {
        _this5.maskCont.scale.x += (_this5.destScale - _this5.maskCont.scale.x) * 0.15;
        _this5.maskCont.scale.y += (_this5.destScale - _this5.maskCont.scale.y) * 0.15;
        _this5.waveCont.scale.x += (_this5.dest2Scale - _this5.waveCont.scale.x) * 0.15;
        _this5.waveCont.scale.y += (_this5.dest2Scale - _this5.waveCont.scale.y) * 0.15;
        _this5.waveCont.alpha += (_this5.contAlpha - _this5.waveCont.alpha) * 0.15;
        _this5.maskCont.alpha += (_this5.contAlpha - _this5.maskCont.alpha) * 0.15;
        if (_this5.contAlpha <= 0) {
          _this5.destScale = 25;
        }
      });
    }
  }, {
    key: 'ImgSizeAdjustor',
    value: function ImgSizeAdjustor(resource) {
      var tmpRatio = this.contentH / resource.height;
      var tmpWidth = resource.width * tmpRatio;
      var tmpHeight = this.contentH;

      if (tmpWidth < this.contentW) {
        tmpRatio = this.contentW / resource.width;
        tmpWidth = this.contentW;
        tmpHeight = resource.height * tmpRatio;
      }

      return {
        width: tmpWidth,
        height: tmpHeight
      };
    }
  }]);

  return BgCanvas;
}();

;

var VTuber = function () {
  function VTuber(args) {
    _classCallCheck(this, VTuber);

    this.args = typeof args !== 'undefined' ? args : {};
    this.progressBar = typeof args.progressBar !== 'undefined' ? args.progressBar : '';
    this.hoverArgs = typeof this.args.hoverArgs !== 'undefined' ? this.args.hoverArgs : '';
    this.Init();
  }

  _createClass(VTuber, [{
    key: 'Init',
    value: function Init() {
      void new BgCanvas(this.progressBar);
    }
  }, {
    key: 'SetEvent',
    value: function SetEvent() {
      var scrollElmsArr = [].slice.call(document.querySelectorAll('.smooth'));

      for (var i = 0; i < scrollElmsArr.length; i++) {
        scrollElmsArr[i].addEventListener('click', function (e) {
          var hash = e.currentTarget.dataset.hash;
          UTILS.Jump(hash, { duration: 500 });
        });
      }
    }
  }]);

  return VTuber;
}();

window.addEventListener('DOMContentLoaded', function () {
  void new VTuber({
    hoverArgs: {
      elm: document.querySelectorAll('.imgHover'),
      off: 'default',
      on: 'hover'
    },
    progressBar: document.querySelector('.loading .bar > div')
  });
});

},{}]},{},[1]);
