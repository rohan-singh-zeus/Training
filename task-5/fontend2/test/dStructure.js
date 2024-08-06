class GridDataStructure {
  constructor(x, y, val, isSelected) {
    this.x = x;
    this.y = y;
    this.val = val;
    this.isSelected = isSelected;
  }
}

export class GridDS {
  constructor() {
    if (GridDS.instance) {
      return GridDS.instance;
    }
    this.elements = [];
    GridDS.instance = this;
  }

  addElement(x, y, val, isSelected=false) {
    const newGrid = new GridDataStructure(x, y, val, isSelected);
    this.elements.push(newGrid);
  }

  getElement(index) {
    return this.elements[index];
  }

  getAllElements() {
    return this.elements;
  }

  removeElements(index) {
    if (index >= 0 && index < this.elements.length) {
      this.elements.splice(index, 1);
    }
  }

  static getInstance() {
    if (!GridDS.instance) {
      GridDS.instance = new GridDS();
    }
    return GridDS.instance;
  }
}
