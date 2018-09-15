/*产生随机数*/
(function() {
	function RandomDate() {};
	RandomDate.prototype.getRandomDate = function(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	};
	window.random = new RandomDate();
}());

/*动态产生方块对象*/
(function() {
	function Food(width, height, color, x, y) {
		this.width = width || 20;
		this.height = height || 20;
		this.color = color || 'blue';
		this.div = document.createElement("div");
		this.x = x || 0;
		this.y = y || 0;
	};

	/*初始化方块*/
	Food.prototype.init = function(map) {
		var div = this.div;
		map.appendChild(div);
		div.style.width = this.width + 'px';
		div.style.height = this.height + 'px';
		div.style.backgroundColor = this.color;
		div.style.position = 'absolute';
		this.render(map);
	};

	/*将方块渲染到地图上*/
	Food.prototype.render = function(map) {
		var x = random.getRandomDate(0, map.offsetWidth / this.width) * this.width;
		var y = random.getRandomDate(0, map.offsetHeight / this.height) * this.height;
		var div = this.div;
		this.x = x;
		this.y = y;
		div.style.left = this.x + "px";
		div.style.top = this.y + "px";
	};

	/*从地图中删除方块*/
	Food.prototype.remove = function(map) {
		this.div.parentNode.removeChild(this.div);
	};
	window.Food = Food;
}());

/*创建一个蛇对象*/
(function() {
	var divs = [];
	/*蛇对象的构造函数*/
	function Snake(width, height, color, x, y, direction) {
		this.width = width || 20;
		this.height = height || 20;
		this.direction = direction || "right";
		this.list = [{
				x: 3,
				y: 2,
				color: 'red'
			},
			{
				x: 2,
				y: 2,
				color: 'yellow'
			},
			{
				x: 1,
				y: 2,
				color: 'yellow'
			}
		]
	};

	/*初始化蛇*/
	Snake.prototype.init = function(map) {
		remove();
		this.move(map);
		for(var i = 0, len = this.list.length; i < len; i++) {
			var bodyPart = this.list[i];
			var div = document.createElement("div");
			div.style.width = this.width + 'px';
			div.style.height = this.height + 'px';
			div.style.backgroundColor = bodyPart.color;
			div.style.position = 'absolute';
			div.style.left = bodyPart.x * this.width + 'px';
			div.style.top = bodyPart.y * this.height + 'px';
			map.appendChild(div);
			divs.push(div);
		};

	};
	/*蛇对象的移动效果*/
	Snake.prototype.move = function(map) {
		/*改变蛇身体坐标*/
		var i = this.list.length - 1;
		for(; i > 0; i--) {
			this.list[i].x = this.list[i - 1].x;
			this.list[i].y = this.list[i - 1].y;
		};
		/*改变蛇头坐标*/
		switch(this.direction) {
			case 'right':
				this.list[0].x += 1;
				break;
			case 'left':
				this.list[0].x -= 1;
				break;
			case 'up':
				this.list[0].y -= 1;
				break;
			case 'down':
				this.list[0].y += 1;
				break;
		};
	};

	/*让蛇跑起来*/
	Snake.prototype.runSnake = function(food, map) {
		var that = this;
		var timer = setInterval(function() {
			/*判断蛇头坐标是否已达map边界*/
			var maxX, maxY, headX, headY;
			maxX = map.offsetWidth / this.width - 1;
			maxY = map.offsetHeight / this.height - 1;
			headX = this.list[0].x;
			headY = this.list[0].y;
			if(headX < 0 || headX > maxX || headY < 0 || headY > maxY) {
				clearInterval(timer);
				alert("Game over!")
			};

			/*通过keyCode重置蛇头方向*/
			var that = this;
			document.addEventListener("keydown", function(e) {
				switch(e.keyCode) {
					case 37:
						this.direction = 'left';
						break;
					case 38:
						this.direction = 'up';
						break;
					case 39:
						this.direction = 'right';
						break;
					case 40:
						this.direction = 'down';
						break;
				};
			}.bind(that));
			/*判断蛇是否吃到了食物，若是则给蛇身体添加一个方块，并且初始化食物*/
			var foodX = food.x;
			var foodY = food.y;
			var headX = this.list[0].x * this.width;
			var headY = this.list[0].y * this.height;
			if(foodX == headX && foodY == headY) {
				food.init(map);
				var newFoodX = this.list[(this.list.length - 1)].x;
				var newFoody = this.list[(this.list.length - 1)].y;
				var newFood = {
					x: newFoodX,
					y: newFoody,
					color: "yellow"
				};
				this.list.push(newFood);
			};
			this.init(map);
		}.bind(that), 300);
	};

	/*删除蛇*/
	function remove() {
		var i = divs.length - 1;
		for(; i >= 0; i--) {
			var div = divs[i];
			div.parentNode.removeChild(div);
			divs.splice(i, 1);
		}
	};

	/*暴露全局变量Snake*/
	window.Snake = Snake;
}());

/*创建一个Game 对象*/
(function(){
	function Game(map){
	}
	Game.prototype.init = function(){
		var food = new Food();
		food.init(map);
		var snake = new Snake(20, 20);
		snake.init(map);
		snake.runSnake(food, map);
	}
	window.Game = Game;
}())

/*初始化游戏对象*/
var game = new Game(document.querySelector('#map'));
game.init();
