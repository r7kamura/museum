var MuseumController = {};

MuseumController['/pictures/new'] = function() {
  Museum.pallete.init($("#canvas"));
  Museum.saveOnSubmit($("#save-form"));
  Museum.clearOnClick($("#clear-button"));
  Museum.copyOnClick($(".copy-button"));
  Museum.undoOnClick($("#undo-button"));
  Museum.undoOnKey(function(e) { return e.ctrlKey && e.keyCode == 90 });
  Museum.trackOnChangeSlide(
    $("#pen-width-slider"),
    $("#pen-width-slider-value")
  );
  Museum.changeColorOnClick($(".pallete .color"));
};

$(MuseumController[location.pathname]);
