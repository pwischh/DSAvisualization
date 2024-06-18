
class Stack{
    constructor(two){
        this.items = new Array(2);
        this.size = 0;

        this.two = two;

        this.squareBuffer = 0; //used to tell where next square will go relative to center
        this.valueBuffer = 0; //same but with value text

        this.squareSize = 70; //width and height of squares
        this.textSize = 12; //size of text in each box

        this.arrayVis = this.two.makeGroup(); //group for the entire array
        this.squareArr = []; //used to easily access each individual box in the array

        for (let i = 0; i<this.items.length; i++){ //creates array of squares and sets buffer
            let valueBox = this.two.makeGroup(); //make a group for each box in array
            let square = this.two.makeRectangle((this.two.width/2)+this.squareBuffer, this.two.height/2, this.squareSize, this.squareSize);
            valueBox.add(square);
            this.squareArr.push(valueBox);
            this.arrayVis.add(valueBox);
            this.squareBuffer += this.squareSize;
        }
        this.centerVis();
    }

    centerVis(){ //used to re-center the array visualization after new boxes are added
        this.arrayVis.position.set(-(this.squareBuffer/2)+(this.squareSize/2), 0);
        this.two.update();
    }

    resetVisPosition(){ //reset visualization pos
        this.arrayVis.position.set(0, 0);
    }

    resizeUp(capacity){
        let newArr = new Array(capacity);
        this.resetVisPosition();

        for (let i = 0; i<this.size; i++){
            newArr[i] = this.items[i];
            
            let valueBox = this.two.makeGroup();
            let square = this.two.makeRectangle((this.two.width/2)+this.squareBuffer, this.two.height/2, this.squareSize, this.squareSize);
            valueBox.add(square);
            this.squareArr.push(valueBox);
            this.arrayVis.add(valueBox);
            this.squareBuffer += this.squareSize;
        }
        this.items = structuredClone(newArr);
        this.centerVis();
    }

    resizeDown(capacity){
        let newArr = new Array(capacity);
        this.resetVisPosition();
        let squaresRemoved = this.items.length/2;

        for (let i = 0; i<this.size; i++){
            newArr[i] = this.items[i];

        }
        this.items = structuredClone(newArr);

        for (let i = 0; i<squaresRemoved; i++){
            this.arrayVis.remove(this.squareArr.pop());
            this.squareBuffer -= this.squareSize;
        }
        this.centerVis();
    }

    isEmpty(){
        return this.size == 0;
    }

    push(item){
        if (this.size == this.items.length) this.resizeUp(this.size*2);
        this.items[this.size++] = item;

        this.resetVisPosition();
        let value = two.makeText("Val: " + item, this.two.width/2 + this.valueBuffer, this.two.height/2, {size: this.textSize})
        this.squareArr[this.size-1].add(value);
        this.valueBuffer += this.squareSize;
        this.centerVis();
    }

    pop(){
        let tmp = this.items[--this.size];
        this.items[this.size] = undefined;

        let valueToRemove = this.squareArr[this.size].getByType(Two.Text);
        this.squareArr[this.size].remove(valueToRemove);
        this.centerVis();
        this.valueBuffer -= this.squareSize;

        if (this.size != 0 && this.size == this.items.length/4) this.resizeDown(this.items.length/2);
        return tmp;
    }

    peek(){
        return (this.isEmpty() ? undefined : this.items[this.size-1]);
    }

    reset(){ 
            
        this.items = new Array(2);
        this.size = 0;

        this.squareBuffer = 0; 
        this.valueBuffer = 0; 

        this.arrayVis.remove(); 
        this.squareArr = [];
        this.arrayVis = this.two.makeGroup();

        for (let i = 0; i<this.items.length; i++){ 
            let valueBox = this.two.makeGroup();
            let square = this.two.makeRectangle((this.two.width/2)+this.squareBuffer, this.two.height/2, this.squareSize, this.squareSize);
            valueBox.add(square);
            this.squareArr.push(valueBox);
            this.arrayVis.add(valueBox);
            this.squareBuffer += this.squareSize;
        }
        this.centerVis();
    }
}

let visualizationArea = document.querySelector('.stack-vis');
let two = new Two({fitted: true}).appendTo(visualizationArea);

let svg = document.querySelector("svg");
svg.setAttribute("viewbox", "0 0 200 100");
svg.setAttribute("width", "100%");
svg.style.overflow = "auto";

const stack = new Stack(two);

let inputBox = document.getElementsByClassName("push-input");
inputBox[0].addEventListener("keyup", function(event){
    if (event.key == "Enter"){
        event.preventDefault();
        stack.push(this.value);
        this.value = "";
    }
})

let pushButton = document.getElementsByClassName("push-button");
pushButton[0].addEventListener("click", function(){
    stack.push(inputBox[0].value);
    inputBox[0].value = "";
})

let textDuration = 5000;

let popButton = document.getElementsByClassName("pop-button");
let popInfo = document.getElementsByClassName("pop-info");
popButton[0].addEventListener("click", function(){
    popInfo[0].innerHTML = stack.isEmpty() ? "Cannot pop an empty stack" : ("Value popped: " + stack.pop());
    setTimeout(function(){
        popInfo[0].innerHTML = "";
    }, textDuration)
})

let peekButton = document.getElementsByClassName("peek-button");
let peekInfo = document.getElementsByClassName("peek-info");
peekButton[0].addEventListener("click", function(){
    peekInfo[0].innerHTML = "Value at top of stack: " + stack.peek();
    setTimeout(function(){
        peekInfo[0].innerHTML = "";
    }, textDuration)
})

let isEmptyButton = document.getElementsByClassName("isempty-button");
let isEmptyInfo = document.getElementsByClassName("isempty-info");
isEmptyButton[0].addEventListener("click", function(){
    let isEmpty = stack.isEmpty() ? "True" : "False";
    isEmptyInfo[0].innerHTML = isEmpty;
    setTimeout(function(){
        isEmptyInfo[0].innerHTML = "";
    }, textDuration)
})

let resetButton = document.querySelector('.reset-button');
resetButton.addEventListener("click", function(){
    stack.reset();
})

let settingsButton = document.querySelector('.settings-panel-toggle');
let prevWidth = visualizationArea.offsetWidth;
settingsButton.addEventListener("click", function(){
    if (document.querySelector(".stack-vis").classList.contains("vis-open")){
        let visWidth = visualizationArea.offsetWidth;
        let widthDiff = (visWidth - prevWidth)/2;
        stack.arrayVis.position.set(stack.arrayVis.position.x + widthDiff, 0);
        two.update();
        prevWidth = visWidth;
    }
})