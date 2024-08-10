class Cell{
    constructor(two, buffer){
        this.two = two;
        this.squareSize = 70;
        this.textSize = 15;
        this.group = this.two.makeGroup();
        this.makeCell(buffer);
    }

    makeCell(buffer){
        this.square = this.two.makeRectangle(this.two.width/2 + buffer, this.two.height/2, this.squareSize, this.squareSize);
        this.square.fill = "#fc815b";
        this.square.stroke = "#ff4f19";
        this.square.linewidth = 3;
        this.group.add(this.square);
        this.two.update();
    }

    addVal(value){
        this.text = this.two.makeText(value, this.square.position.x, this.square.position.y, {size: this.textSize, fill: "white"});
        this.group.add(this.text);
        this.two.update();
    }

    removeVal(){
        this.group.remove(this.text);
        this.two.update();
    }

    replaceVal(value){
        this.group.remove(this.text);
        this.text = this.two.makeText(value, this.square.position.x, this.square.position.y, {size: this.textSize, fill: "white"});
        this.group.add(this.text);
        this.two.update();
    }

    getVal(){
        return this.text.value;
    }
}