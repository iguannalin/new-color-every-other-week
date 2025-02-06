
let colors, stopSize, direction, stops, offset, tickCount;

let generate = _ => {
  tickCount = 0;
  let colorCount = RandomUtil.pick(Config.colorCount);
  colors = RandomUtil.pickMultiple(Config.colors, colorCount);
  stopSize = RandomUtil.range(Config.stopSize);
  direction = RandomUtil.pick(Config.direction);
  stops = [];
  offset = 1 + (1 + Math.random()) * Config.stopSize[1];
  update();
}

let addStop = _ => {
  let except = stops.slice(0, Math.min(colors.length - 1, 2)).map(s => s.color)
  let color = RandomUtil.pick(colors, except);
  let size = stopSize;
  stops.unshift({ color, size });
  offset -= size;
}

let update = _ => {
  offset += Config.speed;
  while (offset > 0) {
    let except = stops.slice(0, Math.min(colors.length - 1, 2)).map(s => s.color)
    let color = RandomUtil.pick(colors, except);
    stops.unshift({ color, size: stopSize });
    offset -= stopSize;
  }
  let pop = false;
  do {
    let sum = stops.slice(0, -2).reduce((sum, s) => sum + s.size, 0);
    pop = offset + sum > 1;
    if (pop) stops.pop();
  } while (pop);
}

let draw = _ => {
  [1, -1].forEach(scaleY => {
    ctx.save();
    ctx.scale(1, scaleY);
    // Generate list of colors and ratios for gradients
    // We know that stop 0 lies before 0, and only last stop lies after 1
    let getRatio = r => Config.ease(direction === 1 ? r : 1 - r);
    // interpolate first color
    let offset0 = stops[0].size + offset;
    let r = MathUtil.lerpInv(offset, offset0, 0);
    let colorsLerped = [interpolateHex(stops[0].color, stops[1].color, r)];
    let ratios = [getRatio(0)];
    // Add colors and ratios for stops
    stops.slice(1, -1).forEach(({ color, size }) => {
      colorsLerped.push(color);
      ratios.push(getRatio(offset0));
      offset0 += size;
    });
    // interpolate last color
    let r2 = MathUtil.lerpInv(offset0 - stops.at(-2).size, offset0, 1);
    colorsLerped.push(interpolateHex(stops.at(-2).color, stops.at(-1).color, r2));
    ratios.push(getRatio(1));

    let w2 = width / 2, h2 = height / 2;
    // Always use max dimension for radial gradient:
    let maxRadius = Config.radius * (w2 > h2 ? w2 : h2);
    let y = h2 * (1 - Config.margin);
    let gradient = ctx.createRadialGradient(0, 0, 0, 0, y, maxRadius);
    colorsLerped.forEach((color, i) => gradient.addColorStop(ratios[i], color));
    ctx.fillStyle = ctx.strokeStyle = gradient;
    ctx.strokeRect(-w2, 0, width, h2);
    ctx.fillRect(-w2, 0, width, h2);
    ctx.restore();
  });
}

let updateRAF = _ => {
  draw();
  requestAnimationFrame(updateRAF);
}


/**@type {CanvasRenderingContext2D} */
let ctx, canvas, width, height;

let resize = window.onresize = _ => {
  let w = window.innerWidth, h = window.innerHeight, s = window.devicePixelRatio;
  if (w) {
    width = Math.ceil(w * s);
    height = Math.ceil(h * s);
    ctx.scale(s, s);
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.translate(width / 2, height / 2);
  }
}

window.onload = () => {
  canvas = document.querySelector("canvas");
  canvas.style.margin = "0";
  ctx = canvas.getContext("2d");
  resize();
  generate();
  setInterval(update, 17);
  updateRAF();
}

document.body.style.overflow = 'hidden';
// document.body.addEventListener("keypress", (e) => e.key === ' ' ? addStop('#B8FFDE') : console.log("not"));