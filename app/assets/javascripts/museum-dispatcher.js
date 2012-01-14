var MuseumDispatcher = {};

MuseumDispatcher['/pictures/new'] = function() {
  Museum.pallete.init($('#canvas'), {
    width: $('#canvas').width()
  });
  Museum.saveOnSubmit({
    canvas: $('canvas'),
    form: $('#save-form')
  });
  Museum.clearOnClick($('#clear-button'));
  Museum.copyOnClick($('.copy-button'));
  Museum.undoOnClick($('#undo-button'));
  Museum.undoOnKey(function(e) { return e.ctrlKey && e.keyCode == 90 });
  Museum.trackOnChangeSlide(
    $('#pen-width-slider'),
    $('#pen-width-slider-value')
  );
  Museum.changeColorOnClick($('.pallete .color'));

  // FIXME move definition into pallete
  Museum.pallete.appendThumbnail({
    container: $('.thumbnails'),
    origin:    $('.thumbnail-clone li')
  });
  Museum.pallete.updateThumbnails($('.thumbnails img'));
};

$(MuseumDispatcher[location.pathname]);
