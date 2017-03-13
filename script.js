window.onload = function() {
	console.log('Welcome to the sudoku solver!');

	/* TODO LIST:
	1) calculate the number of all possible variants;
	2) add optional diagonal-checking;
	3) allow user to set predefined;
	...
	42) add mobile support or create an app by nativeScript

	*/


	class Element {
		constructor(value, x, y, locked) {
			this.value = value;
			this.x = x;
			this.y = y;
			// this.areaKey = area || null;
			this.locked = (typeof this.locked !== 'undefined') ? locked : false;
			this.banned = [];
		}

		isBanned(value) {
			if (isNaN(value) || value === null) return true;
			return (this.banned.indexOf(value) !== -1);
		}

		ban(value) {
			this.banned.push(value);
		}

		unbanAll() {
			this.banned = [];
		}

		setAndLock(value) {
			if (isNaN(value) || value === null) return;
			this.locked = true;
			this.value = value;
		}
	}

	class Sudoku {
		constructor(grid) {
			this.grid = grid || Sudoku.getEmptyGrid();
			this.numbers = this.generateNumbers();
			this.currentElement = null;
			this.finished = false;
			this.lastMove = 'forward'; // forward || back
		}

		static getEmptyGrid() {
			const result = [];
			for (let i = 0; i < 9; i++) {
				const row = [];
				for (let j = 0; j < 9; j++) {
					row.push(new Element(null, j, i, false));
				}
				result.push(row);
			}
			return result;
		}

		init() {

		}

		start() {
			// todo: reset grid here?
			this.finished = false;
			this.currentElement = this.grid[0][0];
			this.tryNextValue();
		}

		finish() {
			console.log('Finished! ', this.grid);
			this.finished = true;
			drawSudoku(this.grid);
		}

		goForward() {
			this.lastMove = 'forward';

			if (!this.currentElement) {
				return this.currentElement = this.grid[0][0];
			}

			if (this.currentElement.x < 8) {
				this.currentElement = this.grid[this.currentElement.y][this.currentElement.x + 1];
				return;
			}

			if (this.currentElement.y < 8) {
				this.currentElement = this.grid[this.currentElement.y + 1][0];
				return;
			}

			this.finish();

		}

		goBack() {
			this.lastMove = 'back';

			if (!this.currentElement) {
				return this.currentElement = this.grid[0][0];
			}

			this.currentElement.unbanAll();
			if (this.currentElement.x > 0) {
				return this.currentElement = this.grid[this.currentElement.y][this.currentElement.x - 1];
			}

			if (this.currentElement.y > 0) {
				return this.currentElement = this.grid[this.currentElement.y - 1][8];
			}

			this.finish();
		}

		tryNextValue() {
			if (this.currentElement.locked) {
				console.log('Locked!');
				if (this.lastMove === 'back') {
					this.goBack();
				} else {
					this.goForward();
				}
				this.tryNextValue();
			}

			if (this.currentElement.value !== null) {
				this.currentElement.ban(this.currentElement.value);
				this.currentElement.value = null;
			}

			const newValue = this.getNextValue();

			if (!newValue) {
				this.goBack();
			} else {
				this.currentElement.value = newValue;
				this.goForward();
			}

			if (!this.finished) this.tryNextValue();
		}

		getNextValue() {
			if (!this.currentElement) return null;
			const numbers = this.getNumbers();
			let result = null;
			numbers.some((value) => {
				if (this.checkValue(this.currentElement, value) && !this.currentElement.isBanned(value)) {
					result = value;
					return true;
				}
			});
			return result;
		}

		getElement(x, y) {
			return this.grid[y][x];
		}

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

		checkRow(element, value) {
			let row = this.getElementRow(element);
			return !(row.some((item) => {
				return item.value === value;
			}));
		}

		checkColumn(element, value) {
			const column = this.getElementColumn(element);
			return !column.some((item) => {
				return item.value === value;
			});
		}

		checkArea(element, value) {
			const area = this.getElementArea(element);
			return !(area.some((item) => {
				return item.value === value;
			}));
		}

		checkDiagonals() {
			// TODO
		}

		checkValue(element, value) {
			return this.checkRow(element, value)
				&& this.checkColumn(element, value)
				&& this.checkArea(element, value);
		}

		getElementArea(element) {
			if (!element) return;
			const result = [];
			const cornerX = Math.floor(element.x / 3) * 3;
			const cornerY = Math.floor(element.y / 3) * 3;
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					result.push(this.grid[cornerY + i][cornerX + j]);
				}
			}
			return result;
		}

		getElementRow(element) {
			if (!element) return;
			return [...this.grid[element.y]]
		}

		getElementColumn(element) {
			if (!element) return;
			const x = element.x;
			return this.grid.map(row => {
				return row[x]
			})
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

	}

	const sudoku = new Sudoku();
	sudoku.init();

	document.getElementById('start').addEventListener('click', function() {
		sudoku.start();
	});

	function drawSudoku(grid) {
		let text = '';
		grid.forEach(row => {
			row.forEach(element => {
				text += `${element.value || 'null'}, `;
			});
			text += '<br>'
		});
		document.getElementById('sudoku').innerHTML = text;
	}

	console.log('sudoku: ', sudoku);



};
