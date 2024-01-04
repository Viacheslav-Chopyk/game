const app = new PIXI.Application({width: 600, height: 400, backgroundColor: 0xFFFFFF});
document.body.appendChild(app.view);

class Shape {
	constructor(x, y, type, color, ...params) {
		this.sprite = new PIXI.Graphics();
		this.sprite.beginFill(color);
		switch (type) {
			case 'triangle':
				this.sprite.drawPolygon([0, -params[0], params[0], params[0], -params[0], params[0]]);
				break;
			case 'rectangle':
				this.sprite.drawRect(0, 0, params[0], params[1]);
				break;
			case 'pentagon':
				this.drawRegularPolygon(5, params[0]);
				break;
			case 'ellipse':
				this.drawEllipse(params[0], params[1]);
				break;
		}
		this.sprite.endFill();
		this.sprite.position.set(x, y);
		app.stage.addChild(this.sprite);

		this.speed = 5;
	}

	update() {
		this.sprite.y += this.speed;
	}

	destroy() {
		app.stage.removeChild(this.sprite);
	}

	drawRegularPolygon(sides, size) {
		const delta = (Math.PI * 2) / sides;
		let angle = -Math.PI / 2;
		this.sprite.moveTo(size * Math.cos(angle), size * Math.sin(angle));

		for (let i = 1; i <= sides; i++) {
			angle += delta;
			this.sprite.lineTo(size * Math.cos(angle), size * Math.sin(angle));
		}
	}
	drawEllipse(width, height) {
		this.sprite.drawEllipse(0, 0, width / 2, height / 2);
	}
}

const shapes = [];
let shapeCount = 0;
let totalSurfaceArea = 0;
let shapesPerSecond = 1;
let gravityValue = 1;

function generateRandomShape() {
	const types = ['triangle', 'rectangle', 'pentagon', 'ellipse'];
	const colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xE14AE7, 0x14E238];
	const type = types[Math.floor(Math.random() * types.length)];
	const color = colors[Math.floor(Math.random() * colors.length)];
	const size = 30;

	switch (type) {
		case 'triangle':
			return new Shape(Math.random() * app.renderer.width, 0, type, color, size);
		case 'rectangle':
			return new Shape(Math.random() * app.renderer.width, 0, type, color, size, size);
		case 'pentagon':
			return new Shape(Math.random() * app.renderer.width, 0, type, color, size);
		case 'ellipse':
			const width = size * 1.5; // Width of the ellipse
			const height = size; // Height of the ellipse
			return new Shape(Math.random() * app.renderer.width, 0, type, color, width, height);
	}
}

function update() {
	for (const shape of shapes) {
		shape.update();

		if (shape.sprite.y > app.renderer.height) {
			shape.destroy();
			const index = shapes.indexOf(shape);
			shapes.splice(index, 1);
		}
	}

	if (Math.random() < shapesPerSecond / 60) {
		const newShape = generateRandomShape();
		shapes.push(newShape);
		shapeCount++;
		totalSurfaceArea += newShape.sprite.width * newShape.sprite.height;
	}

	document.getElementById('shapeCount').innerText = `Shapes: ${shapeCount}`;
	document.getElementById('surfaceArea').innerText = `Surface Area: ${totalSurfaceArea}px^2`;

	requestAnimationFrame(update);
}

function handleCanvasClick(event) {
	const mouseX = event.clientX;
	const mouseY = event.clientY;

	const newShape = generateRandomShape();
	newShape.sprite.x = mouseX - newShape.sprite.width / 2;
	newShape.sprite.y = mouseY - newShape.sprite.height / 2;
	shapes.push(newShape);
	shapeCount++;
	totalSurfaceArea += newShape.sprite.width * newShape.sprite.height;
}

function handleShapeClick(event) {
	const mouseX = event.clientX;
	const mouseY = event.clientY;

	for (const shape of shapes) {
		const bounds = shape.sprite.getBounds();
		if (mouseX >= bounds.x && mouseX <= bounds.x + bounds.width &&
			mouseY >= bounds.y && mouseY <= bounds.y + bounds.height) {
			shape.destroy();
			const index = shapes.indexOf(shape);
			shapes.splice(index, 1);
			shapeCount--;
			totalSurfaceArea -= bounds.width * bounds.height;
			break;
		}
	}
}

function handleShapesPerSecondChange(value) {
	shapesPerSecond += value;
	document.getElementById('shapesPerSecond').innerText = `Shapes Per Second: ${shapesPerSecond}`;
}

function handleGravityChange(value) {
	gravityValue += value;
	document.getElementById('gravityValue').innerText = `Gravity: ${gravityValue}`;
}

app.view.addEventListener('click', handleCanvasClick);
app.view.addEventListener('mousedown', handleShapeClick);


const controlsContainer = document.createElement('div');
controlsContainer.innerHTML = `
	<p id="shapeCount">Shapes: 0</p>
	<p id="surfaceArea">Surface Area: 0px^2</p>
	<p id="shapesPerSecond">Shapes Per Second: ${shapesPerSecond}</p>
	<button onclick="handleShapesPerSecondChange(1)">+</button>
	<button onclick="handleShapesPerSecondChange(-1)">-</button>
	<p id="gravityValue">Gravity: ${gravityValue}</p>
	<button onclick="handleGravityChange(1)">+</button>
	<button onclick="handleGravityChange(-1)">-</button>
	`;
document.body.appendChild(controlsContainer);

update();