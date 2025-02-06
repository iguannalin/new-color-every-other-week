let RandomUtil = {};

RandomUtil.pick = (pool, exceptions = []) => {
  pool = pool.filter(elem => exceptions.indexOf(elem) == -1);
  return pool[(Math.random() * pool.length) >> 0];
}

RandomUtil.pickMultiple = (pool, n) => RandomUtil.shuffle(pool.slice()).slice(0, n);

RandomUtil.range = ([min, max]) => min + Math.random() * (max - min);

RandomUtil.shuffle = a => {
  let j, x, i;
  for (i = a.length; i; i--) {
    j = (Math.random() * i) >> 0;
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
  return a;
}

RandomUtil.getSeededRNG = s => () => (Math.imul(1597334677, s ^= s << 25, s ^= s >>> 7, s ^= s << 2) >>> 0) / 2 ** 32;


let MathUtil = {};
MathUtil.lerpInv = (v0, v1, v) => (v - v0) / (v1 - v0);

let interpolateHex = (from, to, ratio) => {
  let [r0, g0, b0] = splitHex(from);
  let [r1, g1, b1] = splitHex(to);
  return "#" + (((r1 - r0) * ratio + r0 << 16) + ((g1 - g0) * ratio + g0 << 8) + ((b1 - b0) * ratio + b0 << 0)).toString(16).padStart(6, "0");
}
let splitHex = color => color.slice(-6).match(/.{2}/g).map((value) => parseInt(value, 16));
