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
    init: function(canvas, opt) {
      this.initCanvas(canvas, opt);
      this.initContext(opt);
      this.onMouseDown();
      this.onMouseMove();
      this.onMouseUp();
    },

    initCanvas: function(canvas, opt) {
      opt = $.extend({
        width:  window.innerWidth - 20,
        height: 600
      }, opt);
      canvas[0].width  = opt.width;
      canvas[0].height = opt.height;

      var canvasPos = canvas[0].getBoundingClientRect();
      this.left   = canvasPos.left;
      this.top    = canvasPos.top;
      this.canvas = canvas;
    },

    initContext: function(opt) {
      opt = $.extend({
        color: "#333",
        lineWidth: 5
      }, opt);
      this.context = this.canvas[0].getContext("2d");
      this.context.lineWidth   = opt.lineWidth;
      this.context.strokeStyle = opt.color;
    },

    isDowned: false,

    onMouseMove: function() {
      var self = this;
      $(window).mousemove(function(e) {
        if (!self.isDowned) { return };
        self.context.lineTo(e.clientX - self.left, e.clientY - self.top);
        self.context.stroke();
      });
    },

    onMouseUp: function(canvas, context) {
      var self = this;
      $(window).mouseup(function(e) {
        if (!self.isDowned) { return };
        self.context.lineTo(e.clientX - self.left, e.clientY - self.top);
        self.context.stroke();
        self.context.closePath();
        self.isDowned = false
      });
    },

    onMouseDown: function(canvas, context) {
      var self = this;
      this.canvas.mousedown(function(e) {
        self.isDowned = true;
        self.context.beginPath();
        self.context.moveTo(e.clientX - self.left, e.clientY - self.top);
      });
    }
  },

  onSaveButton: function() {
    $(".pallete form").submit(function() {
      $(this).find("#data").remove();
      $("<input />").attr({
        id:    "data",
        type:  "hidden",
        name:  "data",
        value: Museum.pallete.canvas[0].toDataURL()
      }).appendTo($(this));
    });
  }
};

$(function() {
  Museum.pallete.init($("#canvas"), { color: "red" });
  Museum.onSaveButton();
});
