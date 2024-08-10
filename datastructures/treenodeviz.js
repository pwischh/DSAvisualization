class TreeNodeViz{
    #two;
    #node;
    #value;
    #xPos;
    #depth;
    #leftConnection
    #rightConnection
    
    constructor(two, xPos, depth, value){
        this.#two = two
        this.group = this.#two.makeGroup();

        this.circleSize = 25;
        this.textSize = 15;
        this.widthOffset = 75; //space between nodes
        this.heightOffset = 75;

        this.#xPos = xPos * this.widthOffset;
        this.#depth = depth * this.heightOffset;
        
        this.makeNode(value);
    }

    //Creates the circle containing the node's value
    makeNode(value){
        this.#node = this.#two.makeCircle(this.#xPos, this.#depth, this.circleSize);
        this.#node.fill = "#fc815b";
        this.#node.stroke = "#ff4f19";
        this.#node.linewidth = 3;
        this.#value = this.#two.makeText(value, this.getX(), this.getY(), {size: this.textSize, fill: "white"});
        this.group.add(this.#node, this.#value);
        this.#two.update();
    }

    //calls private #createConnection method with isLeft set to true
    makeLeftConnection(leftNodeViz){
        this.#leftConnection = this.#createConnection(leftNodeViz.getX(), leftNodeViz.getY(), true);
        this.group.add(this.#leftConnection);
        this.#two.update();
    }

    makeRightConnection(rightNodeViz){
        this.#rightConnection = this.#createConnection(rightNodeViz.getX(), rightNodeViz.getY(), false);
        this.group.add(this.#rightConnection);
        this.#two.update();
    }
    
    /* Creates the line connecting parent and child nodes. Lines created do not pass through the center of nodes.
    xPos: x position of child node; yPos: y position of child node; isLeft: lets method know if child is left or right*/
    #createConnection(xPos, yPos, isLeft){

        //trig makes sure lines begin at the edge of each node to ensure no overlap of node/line
        let slope = (yPos - this.getY())/(this.getX() - xPos);
        let angle = Math.atan(slope);
        let xOffset = this.circleSize * Math.cos(angle);
        let yOffset = this.circleSize * Math.sin(angle);

        let connection;
        if (isLeft) connection = this.#two.makeLine(this.getX() - xOffset, this.getY() + yOffset, xPos + xOffset, yPos - yOffset);
        else connection = this.#two.makeLine(this.getX() + xOffset, this.getY() - yOffset, xPos - xOffset, yPos + yOffset);

        connection.linewidth = 3;
        connection.stroke = "#ff4f19";
        return connection;
    }

    setColor(color){
        this.#node.fill = color;
        this.#two.update();
    }

    getX(){
        return this.#xPos;
    }

    getY(){
        return this.#depth;
    }
}