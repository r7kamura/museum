// This is a manifest file that"ll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they"ll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It"s not advisable to add code directly here, but if you do, it"ll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

var Museum = {
  pallete: {
    init: function($canvas, opt) {
      this.initCanvas($canvas, opt);
      this.initContext(opt);
      this.onMouseDown();
      this.onMouseMove();
      this.onMouseUp();
    },

    initCanvas: function($canvas, opt) {
      opt = $.extend({
        width:  $canvas.parent().innerWidth(),
        height: 600
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
        lineWidth: 5
      }, opt);
      this.context = this.canvas[0].getContext("2d");
      this.context.lineWidth   = opt.lineWidth;
      this.context.strokeStyle = opt.color;

      var canvas = this.canvas;
      this.context.prevStack = [];
      this.context.savePrev  = function() {
        var prev = this.getImageData(0, 0, canvas.width(), canvas.height());
        this.prevStack.push(prev);
      };
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
        self.context.beginPath();
        self.context.moveTo(e.clientX - self.left, e.clientY - self.top);
        self.context.savePrev();
      });
    },

    clear: function() {
      this.context.clearRect(0, 0, this.canvas.width(), this.canvas.height());
    },

    copy: function($img) {
      var self = this;
      var copy = new Image();
      copy.src = $img.attr("src");
      copy.onload = function() { self.overwrite(copy) };
    },

    undo: function() {
      var prev = this.context.prevStack.pop();
      if (prev) { this.context.putImageData(prev, 0, 0) }
    },

    overwrite: function(image) {
      this.clear();
      this.context.drawImage(image, 0, 0);
    }
  },

  saveOnSubmit: function($form) {
    var self = this;
    $form.submit(function() {
      $(this).find("#data-url").remove();
      $("<input />").attr({
        id:    "data-url",
        type:  "hidden",
        name:  "data",
        value: self.pallete.canvas[0].toDataURL()
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
  }
};

$(function() {
  Museum.pallete.init($("#canvas"));
  Museum.saveOnSubmit($(".pallete form"));
  Museum.clearOnClick($("#clear-button"));
  Museum.undoOnClick($("#undo-button"));
  Museum.copyOnClick($(".copy-button"));
});
