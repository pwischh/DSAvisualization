class SinglyLinkedListNodeViz{
    constructor(two, buffer, value){
        this.two = two;
        this.buffer = buffer;

        this.squareSize = 70;
        this.textSize = 12;
        this.group = this.two.makeGroup();
        this.makeNode(value);
        this.headToggled = false;
    }

    makeNode(value){
        this.valueSquare = this.two.makeRectangle(this.two.width/2 + this.buffer, this.two.height/2, this.squareSize, this.squareSize);
        this.refSquare = this.two.makeRectangle(this.two.width/2 + this.buffer + this.squareSize, this.two.height/2, this.squareSize, this.squareSize);
        this.nextText = this.two.makeText("Next", this.refSquare.position.x, this.refSquare.position.y + (this.squareSize/4), {size: this.textSize});
        this.value = this.two.makeText("Val: " + value, this.valueSquare.position.x, this.valueSquare.position.y, {size: this.textSize});
        this.headText = this.two.makeText("Head", this.valueSquare.position.x, this.valueSquare.position.y - (this.squareSize/4), {size: 12, fill: "green", visible: false});
        this.group.add(this.valueSquare);
        this.group.add(this.refSquare);
        this.group.add(this.nextText);
        this.group.add(this.value);
        this.group.add(this.headText);
        this._addArrow();
    }

    _addArrow(){
        this.arrow = this.two.makeArrow(this.refSquare.position.x, this.two.height/2, this.refSquare.position.x + this.squareSize, this.two.height/2);
        this.arrow.linewidth = 2;
        this.group.add(this.arrow);
        this.two.update();
    }

    toggleHead(){
        if (this.headToggled){
            this.headText.visible = false;
            this.headToggled = false;
        }
        else {
            this.headText.visible = true;
            this.headToggled = true;
        }
    }

}