window.onload = () => {
  const REPETITION_COUNT = 2; // number of times each pixel is assigned to a canvas
  const NUM_FRAMES = 128;

  let members = [1, 2, 3, 4, 5, 6, 7, 8]
  let IDS = []

  let item = document.getElementById('1')
  let copyItem = item.querySelector('.item-body')

  /**
   * Generates the individual subsets of pixels that are animated to create the effect
   * @param {HTMLCanvasElement} ctx
   * @param {number} count the frame particles
   * @return {HTMLCanvasElement[]} Each canvas contains a subset of the original pixels
   */

  function generateFrames($canvas, count = 32) {
    const {
      width,
      height
    } = $canvas;
    const ctx = $canvas.getContext("2d");
    const originalData = ctx.getImageData(0, 0, width, height);
    const imageDatas = [...Array(count)].map(
      (_, i) => ctx.createImageData(width, height)
    );

    // assign the pixels to a canvas
    // each pixel is assigned to 2 canvas', based on its x-position
    for (let x = 0; x < width; ++x) {
      for (let y = 0; y < height; ++y) {
        for (let i = 0; i < REPETITION_COUNT; ++i) {
          const dataIndex = Math.floor(
            count * (Math.random() + 2 * x / width) / 3
          );
          const pixelIndex = (y * width + x) * 4;
          // copy the pixel over from the original image
          for (let offset = 0; offset < 4; ++offset) {
            imageDatas[dataIndex].data[pixelIndex + offset] = originalData.data[pixelIndex + offset];
          }
        }
      }
    }

    // turn image datas into canvas
    return imageDatas.map(data => {
      const $c = $canvas.cloneNode(true);
      $c.getContext("2d").putImageData(data, 0, 0);
      return $c;
    });
  }

  /**
   * Inserts a new element over an old one, hiding the old one
   */

  function replaceElementVisually($old, $new) {
    const $parent = $old.offsetParent;
    $new.style.top = `${$old.offsetTop}px`;
    $new.style.left = `${$old.offsetLeft}px`;
    $new.style.width = `${$old.offsetWidth}px`;
    $new.style.height = `${$old.offsetHeight}px`;
    $parent.appendChild($new);
    $old.style.visibility = "hidden";
  }

  /**
   * snapToDust
   * @param {HTMLElement} $elm
   */

  function snapToDust($elm, callback) {
    html2canvas($elm, {
      allowTaint: true,
    }).then($canvas => {
      // create the container we'll use to replace the element with
      const $container = document.createElement("div");
      $container.classList.add("disintegration-container");

      // setup the frames for animation
      const $frames = generateFrames($canvas, NUM_FRAMES);
      $frames.forEach(($frame, i) => {
        $frame.style.transitionDelay = `${1.35 * i / $frames.length}s`;
        $container.appendChild($frame);
      });

      // then insert them into the DOM over the element
      replaceElementVisually($elm, $container);

      // then animate them
      $container.offsetLeft; // forces reflow, so CSS we apply below does transition
      // set the values the frame should animate to
      // note that this is done after reflow so the transitions trigger
      $frames.forEach($frame => {
        const randomRadian = 2 * Math.PI * (Math.random() - 0.5);
        $frame.style.transform =
          `rotate(${15 * (Math.random() - 0.5)}deg) translate(${60 * Math.cos(randomRadian)}px, ${30 * Math.sin(randomRadian)}px)
rotate(${15 * (Math.random() - 0.5)}deg)`;
        $frame.style.opacity = 0;
      });

      callback()
    });
  }

  function reverseTime($elm) {
    $elm.style.visibility = "visible"
    addClass($elm, 'time')
  }

  /**
   * Click Gauntlet
   */

  let snap_btn = document.querySelector('#gauntlet-snap')
  let reverse_btn = document.querySelector('#gauntlet-reverse')

  snap_btn.onclick = () => {
    reverse_btn.style.display = 'none'
    playAudio('snap')
    animateGauntlet('snap')

    setTimeout(() => {
      snap_btn.style.display = 'none'
      reverse_btn.style.display = 'block'

      console.log('1111')

      makeRandom()
      console.log('IDS', IDS)

      let i = 0,
        l = IDS.length;
      let snapAction = function() {
        if (i < l) {
          let itm = document.getElementById(IDS[i])
          snapToDust(itm, function() {
            i++
            snapAction()
          })
        }
      }
      snapAction()

      // let itm = document.getElementById('1')
      // snapToDust(itm)

    }, 1500)
  }

  reverse_btn.onclick = () => {
    snap_btn.style.display = 'none'
    playAudio('reverse')
    animateGauntlet('reverse')

    setTimeout(() => {
      reverse_btn.style.display = 'none'
      snap_btn.style.display = 'block'

      let itm = document.getElementById('1')
      reverseTime(itm)
    }, 2500)
  }

  /**
   * Play Audio Files
   * @param {[snap]} type [play audio of making snap]
   * @param {[reverse]} type [play audio of reversing time]
   */

  function playAudio(type) {
    switch (type) {
      case 'snap':
        document.querySelector('#audio-snap').play()
        break
      case 'reverse':
        document.querySelector('#audio-reverse').play()
        break
      default:
        return
    }
  }

  /**
   * The Infinity Gauntlet Animation
   */

  function animateGauntlet(type) {
    removeClass(snap_btn, 'snaping')
    removeClass(reverse_btn, 'reversing')

    if (type == 'snap') {
      addClass(snap_btn, 'snaping')


    } else if (type == 'reverse') {
      addClass(reverse_btn, 'reversing')


    }
  }

  /**
   * Utils
   */

  function hasClass(ele, cls) {
    cls = cls || '';
    if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
    return new RegExp(' ' + cls + ' ').test(' ' + ele.className + ' ');
  }

  function addClass(ele, cls) {
    if (!hasClass(ele, cls)) {
      ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
    }
  }

  function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
      var newClass = ' ' + ele.className.replace(/[\t\r\n]/g, '') + ' ';
      while (newClass.indexOf(' ' + cls + ' ') >= 0) {
        newClass = newClass.replace(' ' + cls + ' ', ' ');
      }
      ele.className = newClass.replace(/^\s+|\s+$/g, '');
    }
  }

  function makeRandom() {
    IDS = []
    var arr = new Array()
    for (var i = 0; i < members.length; i++) {
      arr[i] = i + 1;
    }
    arr.sort(function() {
      return 0.5 - Math.random();
    });
    for (var i = 0; i < Math.ceil(members.length / 2); i++) {
      IDS.push(arr[i])
    }
  }
}