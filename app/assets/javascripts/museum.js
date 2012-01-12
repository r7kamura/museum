var Museum = {
  pallete: {
    canvas:  undefined,
    context: undefined,

    init: function($canvas, opt) {
      this.initCanvas($canvas, opt);
      this.initContext(opt);
      this.onMouseDown();
      this.onMouseMove();
      this.onMouseUp();
    },

    initCanvas: function($canvas, opt) {
      var width  = $canvas.parent().innerWidth();
      var height = $canvas.parent().innerWidth() * 3 / 4;
      var margin = 150;
      if (height > window.innerHeight - margin) {
        height = window.innerHeight - margin;
        width  = height * 4 / 3;
      }

      opt = $.extend({
        width:  width,
        height: height,
      }, opt);
      $canvas[0].width  = opt.width;
      $canvas[0].height = opt.height;

      var canvasPos = $canvas[0].getBoundingClientRect();
      this.left   = canvasPos.left;
      this.top    = canvasPos.top;
      this.canvas = $canvas;
    },

    initContext: function(opt) {
      opt = $.extend({
        color: "#333",
        lineCap: "round",
        lineWidth: 5
      }, opt);
      this.context = this.canvas[0].getContext("2d");
      this.context.lineCap     = opt.lineCap;
      this.context.lineWidth   = opt.lineWidth;
      this.context.strokeStyle = opt.color;

      var canvas = this.canvas;
      this.context.histories = [];
      this.context.save = function() {
        var history = this.getImageData(0, 0, canvas.width(), canvas.height());
        this.histories.push(history);
      };
      this.context.save();
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
      });
    },

    onMouseDown: function(canvas, context) {
      var self = this;
      this.canvas.mousedown(function(e) {
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

  saveOnSubmit: function($form) {
    var self = this;
    $form.submit(function() {
      var data = self.pallete.canvas[0].toDataURL();
      $(this).find("#data-url").remove();
      $("<input />").attr({
        id:    "data-url",
        type:  "hidden",
        name:  "data",
        value: data
      }).appendTo($(this));
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
