// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

var Museum = {
  pallete: {
    init: function(canvas) {
      this.initCanvas(canvas);
      this.initContext(canvas);
      this.onMouseDown();
      this.onMouseMove();
      this.onMouseUp();
    },

    initCanvas: function(canvas) {
      canvas.get(0).width  = window.innerWidth  - 30;
      canvas.get(0).height = window.innerHeight - 30;

      var canvasPos = canvas.get(0).getBoundingClientRect();
      this.left   = canvasPos.left;
      this.top    = canvasPos.top;
      this.canvas = canvas;
    },

    initContext: function() {
      this.context = this.canvas.get(0).getContext('2d');
      this.context.lineWidth   = 5;
      this.context.strokeStyle = '#333';
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
  }
};

$(function() {
  Museum.pallete.init($('#canvas'));
});
