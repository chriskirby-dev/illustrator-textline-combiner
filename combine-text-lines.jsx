#target illustrator

function nearlyEqual(a, b, tolerance) {
  return Math.abs(a - b) <= tolerance;
}

function groupByY(textFrames, tolerance) {
  var rows = [];
  for (var i = 0; i < textFrames.length; i++) {
    var tf = textFrames[i];
    var y = tf.position[1];
    var added = false;

    for (var j = 0; j < rows.length; j++) {
      if (nearlyEqual(rows[j].y, y, tolerance)) {
        rows[j].frames.push(tf);
        added = true;
        break;
      }
    }

    if (!added) {
      rows.push({ y: y, frames: [tf] });
    }
  }
  return rows;
}

function unlockLayers(layers) {
  for (var i = 0; i < layers.length; i++) {
    try {
      layers[i].locked = false;
      layers[i].visible = true;
      if (layers[i].layers && layers[i].layers.length > 0) {
        unlockLayers(layers[i].layers);
      }
    } catch (e) {}
  }
}

function main() {
  if (app.documents.length === 0) {
    alert("Please open a document.");
    return;
  }

  var doc = app.activeDocument;
  unlockLayers(doc.layers);

  var allTextFrames = [];
  for (var i = 0; i < doc.textFrames.length; i++) {
    var tf = doc.textFrames[i];
    if (!tf.locked && tf.editable) {
      allTextFrames.push(tf);
    }
  }

  if (allTextFrames.length === 0) {
    alert("No editable text frames found.");
    return;
  }

  var tolerance = 2;
  var spaceGapThreshold = 5; // pixels between letters to be considered a space
  var rows = groupByY(allTextFrames, tolerance);

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var frames = row.frames;

    // Sort letters left to right
    frames.sort(function (a, b) {
      return a.position[0] - b.position[0];
    });

    var currentWord = "";
    var wordStartX = null;
    var wordBaselineY = null;
    var wordOffset = null;
    var lastRightEdge = null;
    var font = null;
    var fontSize = null;
    var layer = frames[0].layer;

    for (var j = 0; j < frames.length; j++) {
      var tf = frames[j];
      var letter = tf.contents;
      var x = tf.position[0];
      var baselineY = tf.position[1];
      var topY = tf.top;  // bounding box top coordinate
      var offset = baselineY - topY; // baseline offset from top
      var width = tf.width;
      var rightEdge = x + width;

      if (j === 0 || (x - lastRightEdge >= spaceGapThreshold)) {
        // Save last word if any
        if (currentWord.length > 0) {
          var newWord = layer.textFrames.add();
          newWord.contents = currentWord;
          newWord.position = [wordStartX, wordBaselineY - wordOffset];
          if (font && fontSize) {
            newWord.textRange.characterAttributes.textFont = font;
            newWord.textRange.characterAttributes.size = fontSize;
          }
        }

        // Start new word
        currentWord = letter;
        wordStartX = x;
        wordBaselineY = baselineY;
        wordOffset = offset;

        try {
          font = tf.textRange.characterAttributes.textFont;
          fontSize = tf.textRange.characterAttributes.size;
        } catch (e) {}

      } else {
        currentWord += letter;
      }

      lastRightEdge = rightEdge;
    }

    // Add the final word
    if (currentWord.length > 0) {
      var newWord = layer.textFrames.add();
      newWord.contents = currentWord;
      newWord.position = [wordStartX, wordBaselineY - wordOffset];
      if (font && fontSize) {
        newWord.textRange.characterAttributes.textFont = font;
        newWord.textRange.characterAttributes.size = fontSize;
      }
    }

    // Remove the original letters
    for (var j = 0; j < frames.length; j++) {
      try {
        frames[j].remove();
      } catch (e) {}
    }
  }

  alert("Words reconstructed exactly where they were.");
}

main();
