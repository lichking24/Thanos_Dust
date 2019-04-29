# Thanos Dust Effect

## Effects Demo

As Thanos making a snap with the Infinite Gauntlet, half the heros vanish to dust. As using the time stone, people come back.


![](public/img/demo.gif)

## Details

The procedures:

1. Click the Gauntlet button, and display animation to make a snap, and play audio file;
2. Select half heros by random, the random method is to resort members array;

  ```
  arr.sort(function() {
    return 0.5 - Math.random();
  });
  ```

3. Make selected item to dust

  - 3.1 use html2canvas library to convert dom to a canvas image
  - 3.2 split the canvas images into many pieces by pixel, `function generateFrames()`
  - 3.3 create a container which has the same size and position as the converted dom
  - 3.4 appendChild to the container with the pieces
  - 3.5 rotate random degrees and translate random pixel for each piece, which shows the dust animation
  - 3.6 set converted dom item to be invisible and finish the SNAP action

4. Reverse time to bring heros back by adjusting the visibility of converted dom items

## FAQ

**Why use a nodejs express server?**

A static html file will show errors with "Unable to get image data from canvas because the canvas has been tainted by cross-origin data", even if I set allowTaint to be true.
