class Queue{
    constructor(two){
        this.items = new Array(2);
        this.head = 0;
        this.tail = 0;
        this.size = 0;

        this.two = two;

        this.cellBuffer = 0;  

        this.arrayVis = this.two.makeGroup();
        this.cellArr = []; 
        this.makeVis();
    }

    centerVis(){
        this.arrayVis.position.set(-(this.cellBuffer/2)+(this.cellArr[0].squareSize/2), 0);
        this.two.update();
    }

    resizeUp(capacity){
        let newArr = new Array(capacity);
        let newCellArr = [];
        for (let i = 0; i < this.size; i++){
            newArr[i] = this.items[(this.head+i)%this.items.length];
            newCellArr.push(this.cellArr[(this.head+i)%this.items.length].getVal());
            this.newCell();
        }

        for (let i = 0; i < this.size; i++){
            this.cellArr[i].replaceVal(newCellArr[i]);
        }
        this.newHeadTail();
        this.centerVis();

        this.items = structuredClone(newArr);
        this.head = 0;
        this.tail = this.size;
    }

    resizeDown(capacity){
        let newArr = new Array(capacity);
        let newCellArr = [];
        for (let i = 0; i < this.size; i++){
            newArr[i] = this.items[(this.head+i)%this.items.length];
            newCellArr.push(this.cellArr[(this.head+i)%this.items.length].getVal());
            this.cellArr[(this.head+i)%this.items.length].removeVal();
        }

        for (let i = 0; i < this.size*2; i++){
            if (i < this.size) this.cellArr[i].replaceVal(newCellArr[i]);
            this.arrayVis.remove(this.cellArr.pop().group);
            this.cellBuffer -= this.cellArr[i].squareSize;
        }
        this.headText.position.set(this.cellArr[0].square.position.x, this.headText.position.y);
        this.tailText.position.set(this.cellArr[this.size].square.position.x, this.tailText.position.y);
        this.centerVis();

        this.items = structuredClone(newArr);
        this.head = 0;
        this.tail = this.size;
    }

    dequeue(){
        let tmp = this.items[this.head];

        this.cellArr[this.head].removeVal();

        this.items[this.head++] = undefined;
        this.size--;

        if (this.head == this.items.length) {
            this.head = 0;
            this.headText.position.set(this.cellArr[0].square.position.x, this.headText.position.y);
        }
        else{
            this.headText.position.set(this.cellArr[0].square.position.x + (this.head * this.cellArr[0].squareSize), this.headText.position.y);
        } 
        if (this.size == this.items.length/4) this.resizeDown(this.items.length/2);
        this.two.update();

        return tmp;
    }

    enqueue(item){
        let resize = false;
        if (this.size == this.items.length) {
            this.resizeUp(this.items.length*2);
            resize = true;
        }

        this.cellArr[this.tail].addVal(item);

        this.items[this.tail++] = item;
        if (this.tail == this.items.length) {
            this.tail = 0;
            this.tailText.position.set(this.cellArr[0].square.position.x, this.tailText.position.y);
        }
        else if (!resize) {
            this.tailText.position.set(this.cellArr[0].square.position.x + (this.tail * this.cellArr[0].squareSize), this.tailText.position.y);
        }
        this.two.update();
        this.size++;

    }

    isEmpty(){
        return this.size == 0;
    }

    makeVis(){
        for (let i = 0; i<this.items.length; i++){ 
            this.newCell();
        }
        this.headText = this.two.makeText("Head", this.two.width/2, this.two.height/2 - (this.cellArr[0].squareSize/4), {size: 12, fill: "green"});
        this.tailText = this.two.makeText("Tail", this.two.width/2, this.two.height/2 + (this.cellArr[0].squareSize/4), {size: 12, fill: "red"});
        this.arrayVis.add(this.headText);
        this.arrayVis.add(this.tailText);
        this.centerVis();
    }

    newCell(){
        let cell = new Cell(this.two, this.cellBuffer);
        this.cellArr.push(cell);
        this.arrayVis.add(cell.group);
        this.cellBuffer += cell.squareSize;
    }

    newHeadTail(){
        this.arrayVis.remove(this.tailText);
        this.arrayVis.remove(this.headText);
        this.tailText = this.two.makeText("Tail", this.cellArr[this.size+1].square.position.x, this.tailText.position.y, {size: 12, fill: "red"});
        this.headText = this.two.makeText("Head", this.cellArr[0].square.position.x, this.headText.position.y, {size: 12, fill: "green"});
        this.arrayVis.add(this.tailText);
        this.arrayVis.add(this.headText);
    }

    reset(){
        this.items = new Array(2);
        this.head = 0;
        this.tail = 0;
        this.size = 0;

        this.cellBuffer = 0; 
        this.textBuffer = 0; 

        this.arrayVis.remove();
        this.arrayVis = this.two.makeGroup();
        this.cellArr = [];

        this.makeVis();
    }
}

const queueVis = document.querySelector('.queue-vis');
let intervalListener = setInterval(function(){
    if (queueVis.classList.contains("vis-open")){
        runScript();
        clearInterval(intervalListener);
    }
}, 100)

let queue;
function runScript(){
    const queueTwo = new Two({fitted: true}).appendTo(queueVis);

    const queueSvg = queueTwo.renderer.domElement;
    queueSvg.setAttribute("width", "100%");
    queueSvg.setAttribute("height", "100%");

    queue = new Queue(queueTwo);
    prevWidth = queueVis.offsetWidth;
}

let enqueueInput = document.querySelector('.enqueue-input');
enqueueInput.addEventListener("keyup", function(event){
    if (event.key == "Enter"){
        event.preventDefault();
        if (queue.size == 16){
            enqueueInfo.innerHTML = "Max enqueue limit reached";
            setTimeout(function(){
                enqueueInfo.innerHTML = "";
            }, textDuration)
        }
        else{
            queue.enqueue(this.value);
            this.value = "";
        }
    }
})

let enqueueButton = document.querySelector('.enqueue-button');
let enqueueInfo = document.querySelector('.enqueue-info');
enqueueButton.addEventListener("click", function(){
    if (queue.size == 16){
        enqueueInfo.innerHTML = "Max enqueue limit reached";
        setTimeout(function(){
            enqueueInfo.innerHTML = "";
        }, textDuration)
    }
    else{
        queue.enqueue(enqueueInput.value);
        enqueueInput.value = "";
    }
})

let dequeueButton = document.querySelector('.dequeue-button');
let dequeueInfo = document.querySelector('.dequeue-info');
dequeueButton.addEventListener("click", function(){
    dequeueInfo.innerHTML = queue.isEmpty() ? "Cannot dequeue an empty queue" : ("Value dequeued: " + queue.dequeue());
    setTimeout(function(){
        dequeueInfo.innerHTML = "";
    }, textDuration)
})

let qIsEmptyButton = document.getElementsByClassName("queue-isempty-button");
let qIsEmptyInfo = document.getElementsByClassName("queue-isempty-info");
qIsEmptyButton[0].addEventListener("click", function(){
    let isEmpty = queue.isEmpty() ? "True" : "False";
    qIsEmptyInfo[0].innerHTML = isEmpty;
    setTimeout(function(){
        qIsEmptyInfo[0].innerHTML = "";
    }, textDuration)
})

let qResetButton = document.querySelector('.queue-reset-button');
qResetButton.addEventListener("click", function(){
    queue.reset();
})

settingsButton.addEventListener("click", function(){
    if (document.querySelector(".queue-vis").classList.contains("vis-open")){
        let visWidth = queueVis.offsetWidth;
        let widthDiff = (visWidth - prevWidth)/2;
        queue.arrayVis.position.set(queue.arrayVis.position.x + widthDiff, 0);
        queue.two.update();
        prevWidth = visWidth;
    }
})