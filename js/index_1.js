
~ function () {

  'use strict';

  var over = false, overlast = false;

  var camera = {
    x       : 0,
    y       : 11100,
    z       : 10000,
    zEye    : -101,
    visible : true,

    zoom : function (z) {

      var z0 = this.zEye - z;
      if (z0 > 0 ) z0 = -0.1;
      z0 = this.zEye / z0;
      this.visible = (z > this.zEye * 0.9);
      return z0;

    },

    ease: function (pointer) {

      var xm = (canvas.centerX - pointer.x) * (250 / canvas.centerX);
      var ym = (canvas.centerY - pointer.y) * (110 / canvas.centerY);
      this.x += (xm - this.x) / 20;
      this.y += (pointer.z - this.y) / 20;
      this.z += (ym - this.z) / 20;

    }
  };

  var Wall = function (x, y, z) {

    this.x = x;
    this.y = y;
    this.z = z;

  };

  Wall.prototype.anim = function () {

    ctx.beginPath();
    ctx.fillStyle = '#fff';

    for (var i = 0; i < 4; i++) {

      var z0 = camera.zoom(camera.y + this.z[i] * 100);

      ctx.lineTo(

        canvas.centerX + (camera.x + this.x[i] * 100) * z0,
        canvas.centerY + (camera.z + this.y[i] * 100) * z0

      );

    }

    ctx.fill();

  };



  var Pict = function (img, title, text, x, y, z, w, h) {

    this.x = x * 100;
    this.y = y * 100;
    this.z = z * 100;
    this.w = w * 100;
    this.h = h * 100;
    this.loaded = false;
    this.img = document.createElement('canvas');
    this.img.width = 1000;
    this.img.height = 1000;
    this.srcimg = new Image();
    this.srcimg.onload = function () {
      var ict = this.img.getContext('2d');
      ict.fillStyle = 'rgba(0,0,0,0.3)';
      ict.fillRect(0,0,1000,1000);
      ict.drawImage(this.srcimg, 100, 100, 800, 800);
      this.loaded = true;
    }.bind(this);
    this.srcimg.src = 'js/' + img;
    this.text = document.createElement('canvas');
    this.text.width = 1000;
    this.text.height = 300;
    var ict = this.text.getContext('2d');
    ict.font = 'bold 140px arial';
    ict.fillStyle = '#ddd';
    ict.textAlign = 'center';
    ict.fillText(title, 500, 120);
    ict.font = '48px arial';
    ict.fillText(text, 500, 200);

  };

  Pict.prototype.isPointerInside = function (x, y, z0) {
    return (
      pointer.x > canvas.centerX + x && 
      pointer.y > canvas.centerY + y && 
      pointer.x < canvas.centerX + x + this.w * z0 &&
      pointer.y < canvas.centerY + y + this.w * z0 
    );
  }

  Pict.prototype.anim = function () {

    if (!this.loaded) return;

    var z0 = camera.zoom(camera.y + this.z);

    if (camera.visible) {

      var x = (camera.x + this.x) * z0,
        y = (camera.z + this.y) * z0;

      if (this.isPointerInside(x, y, z0)) over = this;

      ctx.drawImage(this.img,
        canvas.centerX + x,
        canvas.centerY + y,
        this.w * z0,
        this.h * z0
      );

      if (z0 > 0.3 ) {

        var z1 = camera.zoom(camera.y + this.z - 5);
        x = (camera.x + this.x + (this.w - 100) * 0.5) * z1;
        y = (camera.z + this.y + this.h - 30) * z1;

        ctx.drawImage(this.text,

          canvas.centerX + x,
          canvas.centerY + y,
          100 * z1,
          30 * z1

        );

      }

    }

  };

  var anim = function () {

    over = false;

    for (

      var i = 0, that;
      that = objects[i++];
      that.anim()

    );

    if (over !== overlast) {

      overlast = over;
      canvas.elem.style.cursor = over ? 'pointer' : 'default';

    }

  }

  
  // main loop 

  var run = function () {

    requestAnimFrame(run);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.1);
    ctx.fillRect(0, canvas.height * 0.9, canvas.width, canvas.height * 0.1);
    camera.ease(pointer);
    anim(); 

  }

  // canvas

  var canvas = {  

    elem: document.createElement('canvas'),

    resize: function () {

      this.left    = 0;
      this.top     = 0;
      this.width   = this.elem.width  = this.elem.offsetWidth;
      this.height  = this.elem.height = this.elem.offsetHeight;
      this.centerX = this.width / 2;
      this.centerY = this.height / 2;

    },
    init: function () {

      var ctx = this.elem.getContext('2d');
      document.body.appendChild(this.elem);
      window.addEventListener('resize', this.resize.bind(this), false);
      this.resize();
      return ctx;

    }

  };

  var ctx = canvas.init();
  var requestAnimFrame = window.__requestAnimationFrame || requestAnimationFrame;

  // pointer

  var pointer = (function (canvas) {

    var scaling = false, oldDist = 0;

    var pointer = {
      x: canvas.width  / 2,
      y: canvas.height / 2,
      z: 10,
      canvas: canvas,
      touchMode: false
    };

    var distance = function (dx, dy) {
      return Math.sqrt(dx * dx + dy * dy);
    };

    [[window, 'mousemove,touchmove', function (e) {

      this.touchMode = e.targetTouches;
      e.preventDefault();
      if (scaling && this.touchMode) {
        var x0 = this.touchMode[0].clientX,
          x1 = this.touchMode[1].clientX,
          y0 = this.touchMode[0].clientY,
          y1 = this.touchMode[1].clientY;
        this.x = (x0 + x1) / 2;
        this.y = (y0 + y1) / 2;
        var d = distance(x0 - x1, y0 - y1);
        var s = d > oldDist ? -1 : 1;
        oldDist = d;
        this.z += s;
        if (this.z < -160) this.z = -160;
        return;
      }

      var pointer = this.touchMode ? this.touchMode[0] : e;
      this.x = pointer.clientX - this.canvas.left;
      this.y = pointer.clientY - this.canvas.top;

    }],
    [canvas.elem, 'mousedown,touchstart', function (e) {

      this.touchMode = e.targetTouches;
      e.preventDefault();
      if (this.touchMode && e.touches.length === 2) {
        scaling = true;
      } else {
        var pointer = this.touchMode ? this.touchMode[0] : e;
        this.x = pointer.clientX - this.canvas.left;
        this.y = pointer.clientY - this.canvas.top;
        anim();
        if (over) {
          this.z = -80 - over.z;
        }
        else this.z = 0;
      }

    }],

    [window, 'mouseup,touchend', function (e) {

      e.preventDefault();
      scaling = false;

    }]].forEach(function (e) {
      for (var i = 0, events = e[1].split(','); i < events.length; i++) {
        e[0].addEventListener(events[i], e[2].bind(pointer), false );
      }
    }.bind(pointer));

    window.addEventListener('wheel', function (e) {
      e.preventDefault();
      var s = e.deltaY > 0 ? -10 : 10;
      this.z += s;
      if (this.z < -160) this.z = -160;
    }.bind(pointer), false);

    return pointer;

  }(canvas));

  // walls
  var objects = [];

  objects.push(
    new Wall(
      [-2.5,-2.5,-2.5,-2.5],
      [-1,-1,1,1],
      [-1,1,1,-1]
    )
  );

  objects.push(
    new Wall(
      [-2.5,2.5,2.5,-2.5],
      [-1,-1,1,1],
      [1,1,1,1]
    )
  );

  objects.push(
    new Wall(
      [2.5,2.5,2.5,2.5],
      [-1,-1,1,1],
      [1,-.5,-.5,1]
    )
  );

  objects.push(
    new Wall(
      [2.5,2.7,2.7,2.5],
      [-1,-1,1,1],
      [-.5,-.5,-.5,-.5]
    )
  );

  objects.push(
    new Wall(
      [-2.5,-2.7,-2.7,-2.5],
      [-1,-1,1,1],
      [-1,-1,-1,-1]
    )
  );
  

  objects.push(
    new Pict(
      'discoveries.JPG',
      'Discoveries', "are made by not following instructions",
      -1,-.8,.8,2,1.4
    )
  );

  objects.push(
    new Pict(
      'resting.jpg',
      "Hard day's night", "sleeping like a log",
      -2,-0.7,.6,2,1.4
    )
  );

  objects.push(
    new Pict(
      'attention.jpg',
      'Attention', "to details is key",
      0.5,-.6,.4,2,1.4
    )
  );

  objects.push(
    new Pict(
      'herding.jpg',
      'Always Ready', "to organize problems",
      -1.5,-.8,.2,2,1.4
    )
  );
  objects.push(
    new Pict(
      'challenges.jpg',
      'Challenges', "no puzzle is safe from Buddy",
      .5,-1,-.2,2,2
    )
  );

  objects.push(
    new Pict(
      'always_ready.JPG',
      'Work Ethic', "always ready to go",
      -2,-1,-.6,2,2.4
    )
  );

  run();

} ();
