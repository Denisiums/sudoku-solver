window.onload = function() {
	console.log('Welcome to the sudoku solver!');

	class Element {
		constructor(value, x, y, locked) {
			this.value = value;
			this.x = x;
			this.y = y;
			// this.areaKey = area || null;
			this.locked = (typeof this.locked !== 'undefined') ? locked : false;
			this.denied = [];
		}
	}

	class Area {
		constructor() {
			this.elements = [];
		}

		checkElement(element) {
			let elements = this.elements;
			return !(elements.some((item, index) => {
				return element.value === item.value;
			}));
		}
	}

	class Sudoku {
		constructor(grid) {
			this.grid = grid || Sudoku.getEmptyGrid();
			this.numbers = this.generateNumbers();
			// this.areas = {};
		}

		static getEmptyGrid() {
			const result = [];
			for (let i = 0; i < 9; i++) {
				const row = [];
				for (let j = 0; j < 9; j++) {
					row.push(new Element(null, i, j, 'area'));
				}
				result.push(row);
			}
			return result;
		}

		init() {
			this.generateAreas();

		}
		//
		// generateAreas() {
		// 	for (let i = 0; i < 9; i++) {
		// 		this.areas[i] = new Area();
		// 	}
		// }
		//
		// setElementArea() {
		// 	const keys = this.areas.keys;
		//
		// 	for (let key of keys) {
		// 		if (!Object.hasOwnProperty(key)) return;
		// 		const area = this.areas[key];
		//
		//
		// 	}
		// }


		setValue(x, y, value) {
			if (isNaN(value) || !this.isInGrid(x) || !this.isInGrid(y)) return;
			this.grid[y][x].value = value;
		}

		lockValue(x, y) {
			if (!this.isInGrid(x) || !this.isInGrid(y)) return;
			this.grid[y][x].locked = true;
		}

		unlockValue(x, y) {
			if (!this.isInGrid(x) || !this.isInGrid(y)) return;
			this.grid[y][x].locked = false;
		}

		checkRow(element) {
			let row = element.y;
			return !(this.grid[row].some((item, index) => {
				return element.value === item;
			}));
		}

		checkColumn(element) {
			let column = element.x;
			return !this.grid.some((row, index) => {
				return element.value === row[column];
			});
		}

		checkArea(element) {
			const area = this.getElementArea(element);
			return !(area.some((item, index) => {
				return element.value === item.value;
			}));
		}

		cleckDiagonals() {
			// TODO
		}

		checkElement(element) {
			return this.checkRow(element)
				&& this.checkColumn(element)
				&& this.checkArea(element);
		}

		getElementArea(element) {
			if (!element) return;
			const result = [];
			const cornerX = Math.floor(element.x / 3) * 3;
			const cornerY = Math.floor(element.y / 3) * 3;
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					result.push(this.grid[i][j]);
				}
			}
			return result;
		}

		isInGrid(coordinate) {
			return (coordinate <= 8 && coordinate >= 0);
		}

		isGridFill() {
			//TODO
		}

		isGridValid() {
			//TODO
		}

		fillElement(x, y) {

		}

		generateNumbers() {
			const result = [];
			for (let i = 1; i < 10; i++) {
				result.push(i);
			}
			return result;
		}

		getNumbers() {
			return [...this.numbers];
		}

		getPossibleRowValues(y) {
			if (!this.isInGrid(y)) return [];
			const row = [...this.grid[y]];
			const result = this.getNumbers();
			row.forEach(item => {
				const index = result.indexOf(item);
				if (index !== -1) {
					result.splice(index, 1);
				}
			});
			return result;
		}





	}

	const sudoku = new Sudoku();
	sudoku.init();

	console.log('sudoku: ', sudoku);



};
