class DoublyLinkedListNode{
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
        this.nextSquare = this.two.makeRectangle(this.valueSquare.position.x + this.squareSize, this.two.height/2, this.squareSize/2, this.squareSize);
        this.prevSquare = this.two.makeRectangle(this.valueSquare.position.x - this.squareSize, this.two.height/2, this.squareSize/2, this.squareSize);
        this.nextText = this.two.makeText("Next", this.nextSquare.position.x, this.nextSquare.position.y + (this.squareSize/4), {size: this.textSize});
        this.prevText = this.two.makeText("Prev", this.prevSquare.position.x, this.prevSquare.position.y + (this.squareSize/4), {size: this.textSize});
        this.value = this.two.makeText("Val: " + value, this.valueSquare.position.x, this.valueSquare.position.y, {size: this.textSize});
        this.headText = this.two.makeText("Head", this.valueSquare.position.x, this.valueSquare.position.y - (this.squareSize/4), {size: 12, fill: "green", visible: false});
        this.group.add(this.valueSquare);
        this.group.add(this.refSquare);
        this.group.add(this.nextText);
        this.group.add(this.value);
        this.group.add(this.headText);
    }
}