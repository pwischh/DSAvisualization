class DoublyLinkedListNodeViz{

    constructor(two, pos, value){
        this.two = two;

        this.squareSize = 70;
        this.textSize = 15;
        this.nodeSize = 177;
        this.group = this.two.makeGroup();
        this.headToggled = false;

        let posX = this.two.width/2 + (this.nodeSize * pos);
        this.makeNode(posX, value);
    }

    makeNode(posX, value){
        this.valueSquare = this.two.makeRectangle(posX, this.two.height/2, this.squareSize, this.squareSize);
        this.valueSquare.fill = "#fc815b";
        this.valueSquare.stroke = "#ff4f19";
        this.valueSquare.linewidth = 3;
        this.nextSquare = this.two.makeRectangle(posX + (3*this.squareSize)/4, this.two.height/2, this.squareSize/2, this.squareSize);
        this.nextSquare.fill = "#fc815b";
        this.nextSquare.stroke = "#ff4f19";
        this.nextSquare.linewidth = 3;
        this.prevSquare = this.two.makeRectangle(posX - (3*this.squareSize)/4, this.two.height/2, this.squareSize/2, this.squareSize);
        this.prevSquare.fill = "#fc815b";
        this.prevSquare.stroke = "#ff4f19";
        this.prevSquare.linewidth = 3;
        this.nextText = this.two.makeText("Next", this.nextSquare.position.x, this.nextSquare.position.y, {size: 3*this.textSize/4, fill: "white"});
        this.prevText = this.two.makeText("Prev", this.prevSquare.position.x, this.prevSquare.position.y, {size: 3*this.textSize/4, fill: "white"});
        this.value = this.two.makeText(value, this.valueSquare.position.x, this.valueSquare.position.y, {size: this.textSize, fill: "white"});
        this.headText = this.two.makeText("Head", this.valueSquare.position.x, this.valueSquare.position.y - (this.squareSize/4), {size: 3*this.textSize/4, fill: "white", visible: false});

        this.nextArrow = this.two.makeArrow(this.nextSquare.position.x, this.two.height/2 - (this.squareSize/4), this.nextSquare.position.x + (3*this.squareSize)/4, this.two.height/2 - (this.squareSize/4));
        this.nextArrow.linewidth = 2;
        this.nextArrow.stroke = "#ff4f19";
        this.prevArrow = this.two.makeArrow(this.prevSquare.position.x, this.two.height/2 + (this.squareSize/4), this.prevSquare.position.x - (3*this.squareSize)/4, this.two.height/2 + (this.squareSize/4));
        this.prevArrow.linewidth = 2;
        this.prevArrow.stroke = "#ff4f19";

        this.group.add(this.valueSquare);
        this.group.add(this.nextSquare);
        this.group.add(this.prevSquare);
        this.group.add(this.nextText);
        this.group.add(this.prevText);
        this.group.add(this.value);
        this.group.add(this.headText);
        this.group.add(this.nextArrow);
        this.group.add(this.prevArrow);
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