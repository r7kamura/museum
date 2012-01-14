var Museum = {
  pallete: {
    canvas:   undefined,
    canvases: undefined,
    context:  undefined,

    init: function($canvas, opt) {
      this.initCanvas($canvas, opt);
      this.initContext(opt);
      this.onMouseDown();
      this.onMouseMove();
      this.onMouseUp();
    },

    initCanvas: function($canvas, opt) {
      var width = opt.width; // canvas size

      if (!width) {
        width  = $canvas.parent().innerWidth();
        var height = width * 3 / 4;
        var margin = 150;
        if (height > window.innerHeight - margin) {
          height = window.innerHeight - margin;
          width  = height * 4 / 3;
        }
      }

      $canvas[0].width  = width;
      $canvas[0].height = width * 3 / 4;

      var canvasPos = $canvas[0].getBoundingClientRect();
      this.left     = canvasPos.left;
      this.top      = canvasPos.top;
      this.canvas   = $canvas;
      this.canvases = [$canvas];
    },

    initContext: function(opt) {
      opt = $.extend({
        color: "#333",    // pen color
        lineCap: "round", // pen shape
        lineWidth: 5      // pen width
      }, opt);

      var context = this.canvas[0].getContext("2d");
      context.lineCap     = opt.lineCap;
      context.lineWidth   = opt.lineWidth;
      context.strokeStyle = opt.color;

      var canvas = this.canvas;
      context.histories = [];
      context.save = function() {
        this.histories.push(
          this.getImageData(0, 0, canvas.width(), canvas.height())
        );
      };
      context.save();

      this.context = context;
    },

    // FIXME merge with init()
    addCanvas: function() {
      var $canvas    = $('<canvas width="800" height="600"></canvas>')
      var $last      = $(this.canvases).last();
      $canvas.width  = $last[0].width;
      $canvas.height = $last[0].height;
      $canvas.insertAfter($last);

      var context = $canvas[0].getContext('2d');
      context.lineCap     = this.context.lineCap;
      context.lineWidth   = this.context.lineWidth;
      context.strokeStyle = this.context.color;

      this.context = context;
      this.canvas  = $canvas;
      this.canvases.push($canvas);

      // FIXME
      $('#canvas').replaceWith($canvas);
      this.appendThumbnail({
        container: $('.thumbnails'),
        origin:    $('.thumbnail-clone li')
      })
    },

    appendThumbnail: function(args) {
      var $origin    = args.origin;
      var $container = args.container;

      $origin.clone().appendTo($container);
    },

    updateThumbnails: function($imgs) {
      this.imgs = $imgs || this.imgs;
      for (var i = 0; i < this.imgs.length; i++) {
        var width  = this.imgs[i].width;
        var height = this.imgs[i].height;
        this.imgs[i].src    = this.canvases[i][0].toDataURL();
        this.imgs[i].onload = function() {
          this.width  = width;
          this.height = height;
        };
      }
    },

    isDowned: false,

    onMouseMove: function() {
      var self = this;
      $(window).mousemove(function(e) {
        if (!self.isDowned) { return }
        self.context.lineTo(e.clientX - self.left, e.clientY - self.top);
        self.context.stroke();
      });
    },

    onMouseUp: function(canvas, context) {
      var self = this;
      $(window).mouseup(function(e) {
        if (!self.isDowned) { return }
        self.context.lineTo(e.clientX - self.left, e.clientY - self.top);
        self.context.stroke();
        self.context.closePath();
        self.isDowned = false;
        self.updateThumbnails();
      });
    },

    onMouseDown: function(canvas, context) {
      var self = this;
      $(window).mousedown(function(e) {
        self.isDowned = true;
        self.context.save();
        self.context.beginPath();
        self.context.moveTo(e.clientX - self.left, e.clientY - self.top);
      });
    },

    clear: function() {
      this.context.clearRect(0, 0, this.canvas.width(), this.canvas.height());
    },

    copy: function($img) {
      var self = this;
      var copy = new Image();
      copy.src = $img.attr("src");
      copy.onload = function() {
        self.overwrite(copy);
        self.context.save();
      };
    },

    undo: function() {
      var context = this.context;
      var history = context.histories.pop();
      if (history) { context.putImageData(history, 0, 0) }
    },

    overwrite: function(image) {
      this.clear();
      this.context.drawImage(image, 0, 0);
    }
  },

  saveOnSubmit: function(args) {
    var $canvas = args.canvas;
    var $form   = args.form;
    var self = this;
    $form.submit(function() {
      $canvas.each(function() {
        $("<input />").attr({
          id:    "data-url",
          type:  "hidden",
          name:  "data",
          value: this.toDataURL()
        }).appendTo($form);
      });
    });
  },

  copyOnClick: function($button) {
    var self = this;
    $button.click(function() {
      var $img = $(this).closest(".picture").find("img");
      self.pallete.copy($img);
      return false;
    });
  },

  clearOnClick: function($button) {
    var self = this;
    $button.click(function() { self.pallete.clear() });
  },

  undoOnClick: function($button) {
    var self = this;
    $button.click(function() { self.pallete.undo() });
  },

  undoOnKey: function(filterFunc) {
    var self = this;
    $(window).keydown(function(e) {
      if (filterFunc(e)) { self.pallete.undo() }
    });
  },

  trackOnChangeSlide: function($slider, $sliderValue) {
    var self = this;
    $slider.change(function() {
      var lineWidth = $(this).val();
      self.pallete.context.lineWidth = lineWidth;

      var str = lineWidth;
      if (str.length == 1) { str = "0" + str }
      $sliderValue.text(str);
    });
  },

  changeColorOnClick: function($color) {
    var self = this;
    $color.click(function() {
      var color = $(this).css("background-color");
      self.pallete.context.strokeStyle = color;

      $color.removeClass("selected");
      $(this).addClass("selected");
    });
    $color.eq(0).click();
  }
};
