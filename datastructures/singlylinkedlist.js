class SinglyLinkedListNode{
    #data;

    constructor(data){
        this.#data = data;
        this.next = null;
    }

    getData(){
        return this.#data;
    }
}

class SinglyLinkedList{
    #length;

    constructor(two){
        this.#length = 0;
        this.head = null;

        this.two = two
        this.nodeVis = this.two.makeGroup();
        this.nodeArr = [];
        this.nodeSize = 177;
        this.tailBuffer = 0;
        this.headBuffer = 0;
    }

    size(){
        return this.#length;
    }

    addAtTail(value){
        let node = new SinglyLinkedListNode(value);
        let n = this.head;

        if (n == null){
            this.head = node;
            this.#length++;

            this.#makeNodeTail(value);
            this.tailBuffer += this.nodeSize;  
            return node;
        }
        
        while (n.next != null){
            n = n.next;
        }
        n.next = node;
        this.#length++;

        this.#makeNodeTail(value);
        this.tailBuffer += this.nodeSize;
    
        return node;
    }

    addAtHead(value){
        let node = new SinglyLinkedListNode(value);
        node.next = this.head;
        this.head = node;
        this.#length++;

        this.headBuffer -= this.nodeSize;
        this.#makeNodeHead(value);

        return node;
    }

    removeAt(position){
        let n = this.head;
        let deletedNode = null;
        let beforeNodeToDelete = null;
        let nodeToDelete = null;
        let count = 0;

        this.nodeVis.remove(this.nodeArr[position].group);
        this.nodeArr.splice(position, 1);

        if (this.#length == 0 || position < 0 || position > this.#length){
            return -1;
        }

        if (position == 0){
            this.head = n.next;
            deletedNode = n;
            n = null;
            this.#length--;
            
            if (this.#length > 0) this.nodeArr[0].toggleHead();
            this.#centerVisFromRemoval(position);
            
            return deletedNode;
        }

        while (count < position){
            beforeNodeToDelete = n;
            nodeToDelete = n.next;
            n = n.next;
            count++;
        }

        beforeNodeToDelete.next = nodeToDelete.next;
        deletedNode = nodeToDelete;
        nodeToDelete = null;
        this.#length--;
        this.#centerVisFromRemoval(position);

        return deletedNode;
    }

    reset(){
        this.head = null;
        this.#length = 0;
        this.nodeVis.remove();
        this.nodeVis = this.two.makeGroup();
        this.nodeArr = [];
        this.tailBuffer = 0;
        this.headBuffer = 0;
        this.two.update();
    }

    #centerVisFromHead(){
        this.nodeVis.position.set(this.nodeVis.position.x + this.nodeSize/2, 0);
        this.two.update();
    }

    #centerVisFromTail(){
        this.nodeVis.position.set(this.nodeVis.position.x - this.nodeSize/2, 0);
        this.two.update();
    }

    #centerVisFromRemoval(position){        
        if (this.#length == 0){
            this.headBuffer = 0;
            this.tailBuffer = 0;
            this.two.update();
            return;
        }

        for (let i = 0; i < this.nodeArr.length; i++){
            let node = this.nodeArr[i].group;
            if (i < position) node.position.set(node.position.x + this.nodeSize/2, node.position.y);
            else if (i >= position) node.position.set(node.position.x - this.nodeSize/2, node.position.y);
        }
       
        this.headBuffer += this.nodeSize/2;
        this.tailBuffer -= this.nodeSize/2;
        this.two.update();
    }

    #makeNodeHead(value){
        let node = new SinglyLinkedListNodeViz(this.two, this.headBuffer, value);
        this.nodeArr.unshift(node);
        this.nodeVis.add(node.group);
        this.nodeArr[0].toggleHead();

        if (this.#length == 1){
            this.nodeVis.position.set((this.nodeSize/2 + this.nodeArr[0].squareSize/2), 0);
            this.two.update();
            return;
        }

        this.nodeArr[1].toggleHead();
        
       this.#centerVisFromHead();
    }

    #makeNodeTail(value){
        let node = new SinglyLinkedListNodeViz(this.two, this.tailBuffer, value);
        this.nodeArr.push(node);
        this.nodeVis.add(node.group);

        if (this.#length == 1) {
            this.nodeArr[0].toggleHead();
            this.nodeVis.position.set((-this.nodeSize/2 + this.nodeArr[0].squareSize/2), 0);
            this.two.update();
            return;
        }

        this.#centerVisFromTail();
    }
}

const SLLVis = document.querySelector('.singly-linked-list-vis');

const sllIntervalListener = setInterval(function(){
    if (SLLVis.classList.contains("vis-open")){
        sllrunScript();
        clearInterval(sllIntervalListener);
    }
}, 100)

let SLL;
function sllrunScript(){
    const SLLtwo = new Two({fitted: true}).appendTo(SLLVis);

    const SLLsvg = SLLtwo.renderer.domElement;
    SLLsvg.setAttribute("width", "100%");
    SLLsvg.setAttribute("height", "100%");

    SLL = new SinglyLinkedList(SLLtwo);
}

const sllAddAtTailInput = document.querySelector('.sll-add-at-tail-input')
const sllAddAtTailInfo = document.querySelector('.sll-add-at-tail-info');
sllAddAtTailInput.addEventListener("keyup", function(event){
    if (event.key == "Enter"){
        event.preventDefault();
        if (SLL.size() == 7){
            sllAddAtTailInfo.innerHTML = "Max list length reached";
            this.value = "";
            setTimeout(function(){
                sllAddAtTailInfo.innerHTML = "";
            }, textDuration)
        }
        else{
            SLL.addAtTail(this.value);
            this.value = "";
        }
    }
})

const sllAddAtTailButton = document.querySelector('.sll-add-at-tail-button');
sllAddAtTailButton.addEventListener("click", function(){
    if (SLL.size() == 7){
        sllAddAtTailInfo.innerHTML = "Max list length reached";
        sllAddAtTailInput.value = "";
        setTimeout(function(){
            sllAddAtTailInfo.innerHTML = "";
        }, textDuration)
    }
    else{
        SLL.addAtTail(sllAddAtTailInput.value);
        sllAddAtTailInput.value = "";
    }
})

const sllAddAtHeadInput = document.querySelector('.sll-add-at-head-input')
const sllAddAtHeadInfo = document.querySelector('.sll-add-at-head-info');
sllAddAtHeadInput.addEventListener("keyup", function(event){
    if (event.key == "Enter"){
        event.preventDefault();
        if (SLL.size() == 7){
            sllAddAtHeadInfo.innerHTML = "Max list length reached";
            this.value = "";
            setTimeout(function(){
                sllAddAtHeadInfo.innerHTML = "";
            }, textDuration)
        }
        else{
            SLL.addAtHead(this.value);
            this.value = "";
        }
    }
})

const sllAddAtHeadButton = document.querySelector('.sll-add-at-head-button');
sllAddAtHeadButton.addEventListener("click", function(){
    if (SLL.size() == 7){
        sllAddAtHeadInfo.innerHTML = "Max list length reached";
        sllAddAtHeadInput.value = "";
        setTimeout(function(){
            sllAddAtHeadInfo.innerHTML = "";
        }, textDuration)
    }
    else{
        SLL.addAtHead(sllAddAtHeadInput.value);
        sllAddAtHeadInput.value = "";
    }
})

const sllRemoveAtInput = document.querySelector('.sll-remove-at-input')
const sllRemoveAtInfo = document.querySelector('.sll-remove-at-info');
sllRemoveAtInput.addEventListener("keyup", function(event){
    if (event.key == "Enter"){
        event.preventDefault();
        if (this.value < 0 || this.value >= SLL.size() || isNaN(this.value)){
            sllRemoveAtInfo.innerHTML = "Invalid position";
            this.value = "";
            setTimeout(function(){
                sllRemoveAtInfo.innerHTML = "";
            }, textDuration)
        }
        else{
            SLL.removeAt(this.value);
            sllRemoveAtInfo.innerHTML = "Node removed at position " + this.value.toString();
            setTimeout(function(){
                sllRemoveAtInfo.innerHTML = "";
            }, textDuration)
            this.value = "";
        }
    }
})

const sllRemoveAtButton = document.querySelector('.sll-remove-at-button');
sllRemoveAtButton.addEventListener("click", function(){
    if (sllRemoveAtInput.value < 0 || sllRemoveAtInput.value >= SLL.size() || isNaN(sllRemoveAtInput.value)){
        sllRemoveAtInfo.innerHTML = "Invalid position";
        sllRemoveAtInput.value = "";
        setTimeout(function(){
            sllRemoveAtInfo.innerHTML = "";
        }, textDuration)
    }
    else{
        SLL.removeAt(sllRemoveAtInput.value);
        sllRemoveAtInfo.innerHTML = "Node removed at position " + sllRemoveAtInput.value.toString();
        setTimeout(function(){
            sllRemoveAtInfo.innerHTML = "";
        }, textDuration)
        sllRemoveAtInput.value = "";
    }
})

const sllResetButton = document.querySelector('.sll-reset-button');
sllResetButton.addEventListener("click", function(){
    SLL.reset();
    sllAddAtHeadInput.value = "";
    sllAddAtTailInput.value = "";
    sllRemoveAtInput.value = "";
})