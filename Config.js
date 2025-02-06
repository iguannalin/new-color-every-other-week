let Config = {};

Config.speed = .0005;

Config.direction = [1]; // options, -1: inwards, 1:outwards

Config.colors = ['#000099', '#00FFFF', '#00A99D', '#29ABE2'];
  // '#6F00A4', '#FF0000', '#FFFF00', '#B8FFDE', '#C4E9FB',
  // '#ED1E79', '#FCCDFF', '#FF6200', '#FFFF9B'];

Config.colorCount = [14];

Config.margin = 0; // relative to height. > 0 inside, < 0 outside

Config.stopSize = [.5, .5]; // range, picked per token, so same for every per stop

Config.radius = 2; // 0..1, relative to largest viewport side

Config.ease = t => Math.pow(t, 1.5); // "in 1.5"; // ease with which stops move from center outwards (or vv)

