(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _require = require('./tilda.js');

var Tilda = _require.Tilda;
var CanvasRenderer = _require.CanvasRenderer;


window.addEventListener('load', function () {
				var canvasRenderer = new CanvasRenderer(document.querySelector('canvas'));
				var game = new Tilda(canvasRenderer);
				game.loadLevel('levels/overworld.json').then(function (level) {
								game.start();
								//window.open('tileset.html');
				});
});

},{"./tilda.js":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FLAG_SIDE_SCROLLING = 0x1;
var TILE_SIZE = 16;
var NUM_SCREEN_TILES_X = 124;
var NUM_SCREEN_TILES_Y = 128;
var TILE_SOLID = 1;
var TILE_FLAG_JUMP_LEFT = 2;
var TILE_FLAG_JUMP_TOP = 4;
var TILE_FLAG_JUMP_RIGHT = 8;
var TILE_FLAG_JUMP_BOTTOM = 16;
var GAME_READY = 0;
var GAME_RUNNING = 1;
var TOOL_POINTER = 0;
var TOOL_DRAW = 1;
var TOOL_PROPERTIES = 2;
var TILESET = '';

var Renderer = function () {
	function Renderer() {
		_classCallCheck(this, Renderer);
	}

	_createClass(Renderer, [{
		key: 'loadImage',
		value: function loadImage(url) {}
	}, {
		key: 'translate',
		value: function translate(x, y) {}
	}, {
		key: 'renderImageChunk',
		value: function renderImageChunk(image, destX, destY, destWidth, destHeight, srcX, srcY, srcWidth, srcHeight) {}
	}, {
		key: 'clear',
		value: function clear() {}
	}]);

	return Renderer;
}();

var CanvasRenderer = exports.CanvasRenderer = function (_Renderer) {
	_inherits(CanvasRenderer, _Renderer);

	function CanvasRenderer(canvas) {
		_classCallCheck(this, CanvasRenderer);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CanvasRenderer).call(this));

		_this.canvas = canvas;
		_this.context = canvas.getContext('2d');
		return _this;
	}

	_createClass(CanvasRenderer, [{
		key: 'clear',
		value: function clear() {
			this.context.fillStyle = 'white';
			this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}, {
		key: 'translate',
		value: function translate(x, y) {
			this.context.translate(x, y);
		}
	}, {
		key: 'loadImage',
		value: function loadImage(url) {

			var image = new Image();
			image.src = 'img/tileset.png';
			return image;
		}
	}, {
		key: 'renderImageChunk',
		value: function renderImageChunk(image, destX, destY, destWidth, destHeight, srcX, srcY, srcWidth, srcHeight) {
			this.context.drawImage(image, srcX, srcY, srcWidth, srcHeight, destX, destY, destWidth, destHeight);
		}
	}]);

	return CanvasRenderer;
}(Renderer);

var Tilda = exports.Tilda = function () {
	function Tilda(renderer) {
		var _this2 = this;

		_classCallCheck(this, Tilda);

		this.renderer = renderer;
		this.zoom = {
			x: 1,
			y: 1
		};
		this.level = null;
		this.blockTypes = {};
		this.editor = {
			activeTile: -1
		};
		this.cameraX = 0;
		this.activeTile = {
			x: 0, y: 0
		};
		this.cameraY = 0;
		this.selectedX = 0;
		this.activeTool = 0;
		this.isJumpingOver = false;
		this.selectedY = 0;
		this.tileset = this.renderer.loadImage('img/tileset.png');
		this.loadTiles(TILESET);
		this.state = GAME_READY;
		var xmlHttp = new XMLHttpRequest();

		xmlHttp.onreadystatechange = function () {
			if (xmlHttp.readyState == 4) {
				if (xmlHttp.status == 200) {
					var lines = xmlHttp.responseText.split('\n');
					for (var i in lines) {
						_this2.blockTypes[i] = new Block(lines[i]);
					}
					window.addEventListener('mousedown', function (event) {
						var x = event.pageX;
						var y = event.pageY;
						var TILE_SIZE = 16;
						var tileX = Math.floor((x + 1) / TILE_SIZE);
						var tileY = Math.floor((y + 1) / TILE_SIZE);
						var selection = document.querySelector('#selection');
						selection.style.width = TILE_SIZE + 'px';
						selection.style.height = TILE_SIZE + 'px';
						selection.style.left = tileX * TILE_SIZE + 'px';
						selection.style.top = tileY * TILE_SIZE + 'px';
						var flags = 0;
						for (var t in _this2.blockTypes) {
							var tile = _this2.blockTypes[t];
							if (tile.tileX == tileX && tile.tileY == tileY) {
								flags = tile.flags;
							}
						}
						window.opener.postMessage({
							tile: {
								x: tileX,
								y: tileY,
								flags: flags
							}
						}, '*');
					});
				} else {}
			}
		};
		xmlHttp.open('GET', '/t.tileset', true);
		xmlHttp.send(null);
		window.addEventListener('click', function (event) {
			var width = _this2.renderer.canvas.width;
			var height = _this2.renderer.canvas.height;
			var pageWidth = _this2.renderer.canvas.getBoundingClientRect().width;
			var pageHeight = _this2.renderer.canvas.getBoundingClientRect().height;

			var cx = width;
			var cy = height;

			var x = event.pageX / pageWidth * cx;
			var y = event.pageY / pageHeight * cy - TILE_SIZE;

			_this2.selectedX = Math.floor((x + 1) / TILE_SIZE);
			_this2.selectedY = Math.floor((y + 1) / TILE_SIZE);
			if (_this2.activeTile.x > 0 && _this2.activeTile.y > 0) {
				_this2.level.setBlock(x, y, new Block(_this2.activeTile.x + ' ' + _this2.activeTile.y + ' ' + _this2.activeTile.flags));
			}
		});
		window.addEventListener('message', function (event) {
			if (event.data.tile) {
				var tileX = event.data.tile.x;
				var tileY = event.data.tile.y;
				_this2.activeTile.x = tileX;
				_this2.activeTile.y = tileY;
				if (tileX == 0 && tileY == 0) {
					_this2.activeTool = TOOL_POINTER;
				} else {
					_this2.activeTool = TOOL_DRAW;
				}
			}
		});
	}

	_createClass(Tilda, [{
		key: 'start',
		value: function start() {
			this.gameInterval = setInterval(this.tick.bind(this), 5);
			this.renderInterval = setInterval(this.render.bind(this), 5);
			this.state = GAME_RUNNING;
		}
	}, {
		key: 'stop',
		value: function stop() {
			clearInterval(this.gameInterval);
			clearInterval(this.renderInterval);
			this.state = GAME_READY;
		}
	}, {
		key: 'loadTiles',
		value: function loadTiles(tiles) {
			var tiles = tiles.split('\n');
			for (var i = 1; i < tiles.length; i++) {
				var tile = tiles[i];

				var blockType = new Block(tile);
				this.blockTypes[i] = blockType;
			}
		}
	}, {
		key: 'loadLevel',
		value: function loadLevel(url) {
			var _this3 = this;

			return new Promise(function (resolve, reject) {
				var xmlHttp = new XMLHttpRequest();
				xmlHttp.onreadystatechange = function () {
					if (xmlHttp.readyState == 4) {
						if (xmlHttp.status == 200) {
							var level = JSON.parse(xmlHttp.responseText);
							level = new Level(_this3, level);
							_this3.setLevel(level);
							resolve(level);
						} else {
							reject();
						}
					}
				};
				xmlHttp.open('GET', url, true);
				xmlHttp.send(null);
			});
		}
	}, {
		key: 'setLevel',
		value: function setLevel(level) {
			this.level = level;
		}
	}, {
		key: 'tick',
		value: function tick() {
			for (var i in this.level.objects) {
				var obj = this.level.objects[i];
				obj.tick();
			}
			for (var x in this.level.blocks) {
				for (var y in this.level.blocks[x]) {
					for (var i in this.level.objects) {
						var left = x * TILE_SIZE;
						var top = y * TILE_SIZE;
						var block = this.level.blocks[x][y];
						var blockType = this.blockTypes[block.type];
						if (!blockType) {
							continue;
						}
						if (this.isJumpingOver) {
							return;
						}
						var is_solid = (blockType.flags & TILE_SOLID) == TILE_SOLID;
						var obj = this.level.objects[i];
						if (obj.x > left - TILE_SIZE && obj.x < left + TILE_SIZE && block.x > left - TILE_SIZE && obj.x < left + TILE_SIZE && obj.moveX > 0 && is_solid) {
							if ((blockType.flags & TILE_FLAG_JUMP_LEFT) == TILE_FLAG_JUMP_LEFT) {
								this.isJumpingOver = true;
								obj.moveX = -4;
								obj.moveZ = 5;
							} else {
								obj.moveX = 0;
							}
						}

						if (obj.y > top - TILE_SIZE && obj.y < top + TILE_SIZE / 2 && obj.x < left + TILE_SIZE && obj.x > left && obj.moveX < 0 && is_solid) {

							if ((blockType.flags & TILE_FLAG_JUMP_RIGHT) == TILE_FLAG_JUMP_RIGHT) {
								this.isJumpingOver = true;
								obj.moveX = 3;
								obj.moveZ = 3;
							}
							obj.moveX = 0;
						}

						if (obj.x > left - TILE_SIZE && obj.x < left + TILE_SIZE / 2 && obj.y > top - TILE_SIZE && obj.y < top + TILE_SIZE && obj.moveY > 0 && is_solid) {

							if ((blockType.flags & TILE_FLAG_JUMP_BOTTOM) == TILE_FLAG_JUMP_BOTTOM) {
								this.isJumpingOver = true;
								obj.moveY = 1;
								obj.moveZ = 1;
							} else {
								obj.moveY = 0;
							}
						}

						if (obj.x > left - TILE_SIZE / 2 && obj.x < left + TILE_SIZE && obj.y < top + TILE_SIZE && obj.y > top - TILE_SIZE && obj.moveY < 0 && is_solid) {
							if ((blockType.flags & TILE_FLAG_JUMP_TOP) == TILE_FLAG_JUMP_TOP) {
								this.isJumpingOver = true;
								obj.moveY = -0.6;
								obj.moveZ = 1;
							} else {
								obj.moveY = 0;
							}
						}
					}
				}
			}
		}
	}, {
		key: 'render',
		value: function render() {
			this.renderer.clear();
			this.renderer.translate(0, TILE_SIZE);
			if (this.level) {
				for (var x in this.level.blocks) {
					for (var y in this.level.blocks[x]) {
						var left = (TILE_SIZE * x - this.cameraX) * this.zoom.x;
						var top = (TILE_SIZE * y - this.cameraY) * this.zoom.y;
						var width = TILE_SIZE * this.zoom.x;
						var height = TILE_SIZE * this.zoom.y;
						var block = this.level.blocks[x][y];
						var type = this.blockTypes[block.type];
						if (!type) {
							continue;
						}
						var tileX = type.tileX * TILE_SIZE;
						var tileY = type.tileY * TILE_SIZE;

						this.renderer.renderImageChunk(this.tileset, left, top, width, height, tileX, tileY, width, height);
					}
				}
				for (var i in this.level.objects) {
					var object = this.level.objects[i];
					var left = (object.x - this.cameraX) * this.zoom.x;
					var top = (object.y - this.cameraY) * this.zoom.y;
					var zeta = object.z * this.zoom.y;
					var width = TILE_SIZE * this.zoom.x;
					var height = TILE_SIZE * this.zoom.y;
					var tileX = object.tileX * TILE_SIZE;
					var tileY = object.tileY * TILE_SIZE;
					if (zeta > 0) {}
					this.renderer.renderImageChunk(this.tileset, left, top, width, height, 0, TILE_SIZE * 1, width, height);
					this.renderer.renderImageChunk(this.tileset, left, top - zeta, width, height, tileX, tileY, width, height); // Render shadow
				}
				for (var i in this.blockTypes) {
					var block = this.blockTypes[i];
					var width = TILE_SIZE * this.zoom.x;
					var height = TILE_SIZE * this.zoom.y;
					var left = i * TILE_SIZE * this.zoom.x;
					var top = this.renderer.canvas.height - TILE_SIZE * 2;
					//this.renderer.renderImageChunk(this.tileset, left, top, width, height, block.tileX * TILE_SIZE, block.tileY * TILE_SIZE, width, height);
				}
			}
			var width = TILE_SIZE * this.zoom.x;
			var height = TILE_SIZE * this.zoom.y;
			this.renderer.renderImageChunk(this.tileset, 0, this.renderer.canvas.height - TILE_SIZE * 2, TILE_SIZE, TILE_SIZE, this.activeTile.x * TILE_SIZE, this.activeTile.x * TILE_SIZE, TILE_SIZE, TILE_SIZE);

			/*	this.renderer.context.strokeStyle = 'yellow';
   	this.renderer.context.rect(this.selectedX * TILE_SIZE, this.selectedY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
   	this.renderer.context.stroke();*/
			this.renderer.translate(0, -TILE_SIZE);
		}
	}]);

	return Tilda;
}();

var Entity = function () {
	function Entity(game, level) {
		_classCallCheck(this, Entity);

		this.level = level;
		this.game = game;
		this.moveX = 0;
		this.moveY = 0;
		this.moveZ = 0;
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.tileX = 0;
		this.tileY = 0;
	}

	_createClass(Entity, [{
		key: 'tick',
		value: function tick() {
			this.x += this.moveX;
			this.y += this.moveY;
			this.z += this.moveZ;
			if (this.z > 0) {
				this.moveZ -= 0.03;
			}
			if (this.z < 0) {
				this.moveZ = 0;
				if (this.game.isJumpingOver) {
					this.game.isJumpingOver = false;
					this.moveX = 0;

					this.moveY = 0;
				}
				this.z = 0;
			}
		}
	}, {
		key: 'render',
		value: function render() {}
	}]);

	return Entity;
}();

var PlayerEntity = function (_Entity) {
	_inherits(PlayerEntity, _Entity);

	function PlayerEntity(game, level) {
		_classCallCheck(this, PlayerEntity);

		var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(PlayerEntity).call(this, game, level));

		_this4.level = level;
		_this4.x = _this4.level.player.x;
		_this4.tileX = 2;
		_this4.tileY = 1;
		_this4.y = _this4.level.player.y;
		window.onkeydown = function (event) {
			if (_this4.game.isJumpingOver) {
				return;
			}
			if (event.code == 'ArrowUp') {
				_this4.moveY = -.3;
			}
			if (event.code == 'ArrowDown') {
				_this4.moveY = .3;
			}
			if (event.code == 'ArrowLeft') {
				_this4.moveX = -.3;
			}
			if (event.code == 'ArrowRight') {
				_this4.moveX = .3;
			}
			if (event.code == 'KeyA') {
				_this4.moveZ = 1;
			}
		};
		window.onkeyup = function (event) {
			if (_this4.game.isJumpingOver) {
				return;
			}
			if (event.code == 'ArrowUp') {
				_this4.moveY = -0;
			}
			if (event.code == 'ArrowDown') {
				_this4.moveY = 0;
			}
			if (event.code == 'ArrowLeft') {
				_this4.moveX = -0;
			}
			if (event.code == 'ArrowRight') {
				_this4.moveX = 0;
			}
			if (event.code == 'KeyA') {
				_this4.moveZ = 0;
			}
		};
		return _this4;
	}

	_createClass(PlayerEntity, [{
		key: 'render',
		value: function render() {}
	}]);

	return PlayerEntity;
}(Entity);

var Block = function Block(tile) {
	_classCallCheck(this, Block);

	var parts = tile.split(' ');
	this.tileX = parseInt(parts[0]);
	this.tileY = parseInt(parts[1]);

	this.flags = parseInt(parts[2]);
};

var Level = function () {
	_createClass(Level, [{
		key: 'setBlock',
		value: function setBlock(x, y, block) {
			if (!(x in this.blocks)) {
				this.blocks[x] = {};
			}
			this.blocks[x][y] = block;
		}
	}]);

	function Level(game, level) {
		_classCallCheck(this, Level);

		this.game = game;

		this.blocks = {};
		this.flags = level.flags;
		this.objects = [];
		for (var i in level.blocks) {
			var block = level.blocks[i];
			var blockType = this.game.blockTypes[block.type];
			this.setBlock(block.x, block.y, block);
		}
		this.objects.push(new PlayerEntity(game, level));
	}

	_createClass(Level, [{
		key: 'render',
		value: function render() {}
	}]);

	return Level;
}();

},{}]},{},[1]);
