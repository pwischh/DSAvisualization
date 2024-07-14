class DoublyLinkedListNode{
    #two;
    #data;
    #pos;
    #vis;

    constructor(two, data, pos){
        this.#two = two;
        this.#data = data;
        this.next = null;
        this.prev = null;
        this.#pos = pos;
        this.#vis = new DoublyLinkedListNodeViz(this.#two, this.#pos, this.#data);
    }

    getData(){
        return this.#data;
    }

    getVis(){
        return this.#vis;
    }

    nodeSize(){
        return this.#vis.nodeSize;
    }
}

class DoublyLinkedList{
    #length;
    #tailPos;
    #headPos;
    #two;
    #nodeVis;

    constructor(two){
        this.#two = two;
        this.#length = 0;
        this.#tailPos = 0;
        this.#headPos = 0;
        this.head = null;
        this.#nodeVis = this.#two.makeGroup();
    }

    size(){
        return this.#length;
    }

    addAtTail(value){
        let node = new DoublyLinkedListNode(this.#two, value, this.#positionTail());
        this.#nodeVis.add(node.getVis().group);

        let n = this.head;
        this.#length++;

        if (n == null){
            this.head = node;
            this.head.getVis().toggleHead();
            this.#centerVisFromTail();
            return node;
        }

        while (n.next != null){
            n = n.next;
        }

        n.next = node;
        node.prev = n;
        this.#centerVisFromTail();
        return node
    }

    addAtHead(value){
        let node = new DoublyLinkedListNode(this.#two, value, -this.#positionHead());
        this.#nodeVis.add(node.getVis().group);

        this.#length++;

        if (this.head == null){
            this.head = node;
            this.head.getVis().toggleHead();
            this.#centerVisFromHead();
            return node;
        }

        node.next = this.head;
        this.head.prev = node;
        this.head = node;

        this.head.getVis().toggleHead();
        this.head.next.getVis().toggleHead();
        this.#centerVisFromHead();
        return node;
    }

    removeAt(position){
        let n = this.head;
        let deletedNode = null;
        let beforeNodeToDelete = null;
        let nodeToDelete = null;
        let count = 0;

        if (position == 0){
            this.head = n.next;
            if (this.head) this.head.prev = null;
            deletedNode = n;
            n = null;
            this.#length--;

            this.#nodeVis.remove(deletedNode.getVis().group);
            if (this.#length > 0) this.head.getVis().toggleHead();
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
        if (nodeToDelete.next) nodeToDelete.next.prev = beforeNodeToDelete;
        deletedNode = nodeToDelete;
        nodeToDelete = null;
        this.#length--;

        this.#nodeVis.remove(deletedNode.getVis().group);
        this.#centerVisFromRemoval(position);
        return deletedNode;
    }

    reset(){
        this.head = null;
        this.#length = 0;
        this.#headPos = 0;
        this.#tailPos = 0;
        this.#nodeVis.remove();
        this.#nodeVis = this.#two.makeGroup();
        this.#two.update();
    }

    #centerVisFromHead(){
        if (this.#length != 1){
            this.#nodeVis.position.set(this.#nodeVis.position.x + this.head.nodeSize()/2, 0);
        }
        this.#two.update();
    }

    #centerVisFromTail(){
        if (this.#length != 1){
            this.#nodeVis.position.set(this.#nodeVis.position.x - this.head.nodeSize()/2, 0);
        }
        this.#two.update();
    }

    #centerVisFromRemoval(position){
        if (this.#length == 0){
           this.reset();
           return;
        }

        this.#headPos += (this.#headPos == 0) ? 0.5 : -0.5;
        this.#tailPos += (this.#tailPos == 0) ? 0.5 : -0.5;

        let n = this.head;
        let moveX = this.head.nodeSize()/2;
        let count = 0;

        while (n != null){
            let vis = n.getVis().group;
            if (count < position) vis.position.set(vis.position.x + moveX, 0);
            else vis.position.set(vis.position.x - moveX, 0);

            count++;
            n = n.next;
        }
        this.#two.update();
    }

    #positionTail(){
        if (this.#headPos >= 1 && this.#tailPos == 0){
            this.#tailPos += 2;
            return 1;
        }
        else{
            return this.#tailPos++;
        }
    }

    #positionHead(){
        if (this.#tailPos >= 1 && this.#headPos == 0){
            this.#headPos += 2;
            return 1;
        }
        else{
            return this.#headPos++;
        }
    }
}

const DLLVis = document.querySelector('.doubly-linked-list-vis');

const dllIntervalListener = setInterval(function(){
    if (DLLVis.classList.contains("vis-open")){
        dllrunScript();
        clearInterval(dllIntervalListener);
    }
}, 100)

let DLL;
function dllrunScript(){
    const DLLTwo = new Two({fitted: true}).appendTo(DLLVis);
    const DLLsvg = DLLTwo.renderer.domElement;
    DLLsvg.setAttribute("width", "100%");
    DLLsvg.setAttribute("height", "100%");

    DLL = new DoublyLinkedList(DLLTwo);
    prevWidth = DLLVis.offsetWidth;
}

const dllAddAtTailInput = document.querySelector('.dll-add-at-tail-input')
const dllAddAtTailInfo = document.querySelector('.dll-add-at-tail-info');
dllAddAtTailInput.addEventListener("keyup", function(event){
    if (event.key == "Enter"){
        event.preventDefault();
        if (DLL.size() == 7){
            dllAddAtTailInfo.innerHTML = "Max list length reached";
            this.value = "";
            setTimeout(function(){
                dllAddAtTailInfo.innerHTML = "";
            }, textDuration)
        }
        else{
            DLL.addAtTail(this.value);
            this.value = "";
        }
    }
})

const dllAddAtTailButton = document.querySelector('.dll-add-at-tail-button');
dllAddAtTailButton.addEventListener("click", function(){
    if (DLL.size() == 7){
        dllAddAtTailInfo.innerHTML = "Max list length reached";
        dllAddAtTailInput.value = "";
        setTimeout(function(){
            dllAddAtTailInfo.innerHTML = "";
        }, textDuration)
    }
    else{
        DLL.addAtTail(dllAddAtTailInput.value);
        dllAddAtTailInput.value = "";
    }
})

const dllAddAtHeadInput = document.querySelector('.dll-add-at-head-input')
const dllAddAtHeadInfo = document.querySelector('.dll-add-at-head-info');
dllAddAtHeadInput.addEventListener("keyup", function(event){
    if (event.key == "Enter"){
        event.preventDefault();
        if (DLL.size() == 7){
            dllAddAtHeadInfo.innerHTML = "Max list length reached";
            this.value = "";
            setTimeout(function(){
                dllAddAtHeadInfo.innerHTML = "";
            }, textDuration)
        }
        else{
            DLL.addAtHead(this.value);
            this.value = "";
        }
    }
})

const dllAddAtHeadButton = document.querySelector('.dll-add-at-head-button');
dllAddAtHeadButton.addEventListener("click", function(){
    if (SLL.size() == 7){
        dllAddAtHeadInfo.innerHTML = "Max list length reached";
        dllAddAtHeadInput.value = "";
        setTimeout(function(){
            dllAddAtHeadInfo.innerHTML = "";
        }, textDuration)
    }
    else{
        DLL.addAtHead(sllAddAtHeadInput.value);
        dllAddAtHeadInput.value = "";
    }
})

const dllRemoveAtInput = document.querySelector('.dll-remove-at-input')
const dllRemoveAtInfo = document.querySelector('.dll-remove-at-info');
dllRemoveAtInput.addEventListener("keyup", function(event){
    if (event.key == "Enter"){
        event.preventDefault();
        if (this.value < 0 || this.value >= DLL.size() || isNaN(this.value)){
            dllRemoveAtInfo.innerHTML = "Invalid position";
            this.value = "";
            setTimeout(function(){
                dllRemoveAtInfo.innerHTML = "";
            }, textDuration)
        }
        else{
            DLL.removeAt(this.value);
            dllRemoveAtInfo.innerHTML = "Node removed at position " + this.value.toString();
            setTimeout(function(){
                dllRemoveAtInfo.innerHTML = "";
            }, textDuration)
            this.value = "";
        }
    }
})

const dllRemoveAtButton = document.querySelector('.dll-remove-at-button');
dllRemoveAtButton.addEventListener("click", function(){
    if (dllRemoveAtInput.value < 0 || dllRemoveAtInput.value >= DLL.size() || isNaN(dllRemoveAtInput.value)){
        dllRemoveAtInfo.innerHTML = "Invalid position";
        dllRemoveAtInput.value = "";
        setTimeout(function(){
            dllRemoveAtInfo.innerHTML = "";
        }, textDuration)
    }
    else{
        DLL.removeAt(dllRemoveAtInput.value);
        dllRemoveAtInfo.innerHTML = "Node removed at position " + dllRemoveAtInput.value.toString();
        setTimeout(function(){
            dllRemoveAtInfo.innerHTML = "";
        }, textDuration)
        dllRemoveAtInput.value = "";
    }
})

const dllResetButton = document.querySelector('.dll-reset-button');
dllResetButton.addEventListener("click", function(){
    DLL.reset();
    dllAddAtHeadInput.value = "";
    dllAddAtTailInput.value = "";
    dllRemoveAtInput.value = "";
})