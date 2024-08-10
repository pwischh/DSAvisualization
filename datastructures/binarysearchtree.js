class BSTNode extends ValueEntry{
    left;
    right;
    count; //size of subtree with this as root, inclusive
    viz;

    constructor(value){
        super(value);

        this.left = this.right = null;
    }
}

class BinarySearchTree{
    #root;
    #two;
    #layout
    #anim
    
    constructor(two){
        this.#two = two;
        this.#root = null;
        this.#anim = new TreeNodeAnim(this.#two);

        this.#layout = this.#two.makeGroup();
    }

    //publicly accessible method for put, calls private method
    async put(value){
        await this.#put(value);
        this.#resetLayout();
        this.#createLayout(this.#root, 1, 1);
        this.#establishConnections(this.#root);
        this.#centerVis();
    }

    async #put(value){
        let newNode = new BSTNode(value);
        newNode.count = 1;

        let n = this.#root;

        if (n == null){
            this.#root = newNode;
            return;
        }

        while (n != null){
            let cmp = value - n.getValue();

            if (cmp < 0){
                if (n.left == null){
                    await this.#anim.resetAnim();
                    n.left = newNode;
                    break;
                }
                else n = await this.#anim.moveLeft(n);
            }
            else if (cmp > 0){
                if (n.right == null){
                    await this.#anim.resetAnim();
                    n.right = newNode;
                    break;
                }
                else n = await this.#anim.moveRight(n);
            }
            else{
                n.setValue(value);
                break;
            }
        }
    }

    async search(value){
        let n = this.#root;

        while (n != null){
            let cmp = value - n.getValue();

            if (cmp > 0) {
                n = await this.#anim.moveRight(n);
            }
            else if (cmp < 0) {
                n = await this.#anim.moveLeft(n);
            }
            else {
                await this.#anim.resetAnim();
                return n;
            }
        }

        await this.#anim.resetAnim();
        return null;
    }

    //helper method to find the minimum value of a subtree
    #min(n){
        if (n == null) return null;

        while (n.left != null){
            n = n.left;
        }

        return n;
    }

    //helper method that returns subtree rooted at n with its minimum value removed
    #deleteMin(n){
        if (n.left == null) return n.right;

        n.left = this.#deleteMin(n.left);

        n.count = 1 + this.#size(n.left) + this.#size(n.right);
        return n;
    }

    delete(value){
        if (value == this.#root.getValue() && this.size() == 1){
            this.reset();
        }
        else{
            this.#resetLayout();
            this.#root = this.#delete(this.#root, value);
            this.#createLayout(this.#root, 1, 1);
            this.#establishConnections(this.#root);
            this.#centerVis();
        }
    }

    #delete(n, value){
        if (n == null) return null; //base case, no node found

        let cmp = value - n.getValue();

        //searches tree for value
        if (cmp > 0) n.right = this.#delete(n.right, value); 
        else if (cmp < 0) n.left = this.#delete(n.left, value);
        else{ //value found

            //cases for if there's only one child
            if (n.right == null) return n.left; 
            else if (n.left == null) return n.right;

            //otherwise if there are two children:
            let tmp = n;
            n = this.#min(tmp.right); //set current node to be the minimum of it's right subtree

            n.right = this.#deleteMin(tmp.right); //set n.right to reference its subtree with min value removed (because n is min val)
            n.left = tmp.left //left is unchanged
        }

        n.count = 1 + this.#size(n.left) + this.#size(n.right);
        return n;
    }

    size(){
        return this.#size(this.#root);
    }

    #size(n){
        return (n == null) ? 0 : n.count;
    }

    isEmpty(){
        return this.size() == 0;
    }

    setAnimStep(step){
        this.#anim.setStep(step);
    }

    /* in-order traversal of the tree with passed-down x-position and depth variables. 
    x-position is incremented every time a new viz is created and depth is incremented
    every time a new recursive call is made. Default parameters should be
    (this.#root, 1, 1) */
    #createLayout(node, xPos, depth){
        if (node.left != null){
            xPos = this.#createLayout(node.left, xPos, depth + 1);
        }

        node.viz = new TreeNodeViz(this.#two, xPos++, depth, node.getValue());
        this.#layout.add(node.viz.group);

        if (node.right != null){
            xPos = this.#createLayout(node.right, xPos, depth + 1);
        }
        return xPos;
    }

    //pre-order traversal of the tree which creates all connection visualizations
    #establishConnections(node){
        if (node == null) return;

        if (node.left != null) node.viz.makeLeftConnection(node.left.viz);
        if (node.right != null) node.viz.makeRightConnection(node.right.viz);
        this.#establishConnections(node.left);
        this.#establishConnections(node.right);
    }

    //resets the layout group for the viz and viz of each individual node
    #resetLayout(){
        this.#layout.remove();
        this.#layout = this.#two.makeGroup();

        this.#resetLayoutFromRoot(this.#root);
    }

    //pre-order traversal of the tree resetting the viz of each node
    #resetLayoutFromRoot(node){
        if (node == null) return;

        if (node.viz != null){
            node.viz.group.remove();
            node.viz = null;
        }
        this.#resetLayoutFromRoot(node.left);
        this.#resetLayoutFromRoot(node.right);
    }

    //centers visualization at the root node
    #centerVis(){
        let rootPos = this.#root.viz.getX();
        let x = this.#two.width/2 - rootPos;
        this.#layout.position.set(x, this.#layout.position.y);
        this.#two.update();
    }

    reset(){
        this.#root = null;
        this.#resetLayout();
        this.#two.unbind('update');
        this.#two.update();
    }
}

const BSTVis = document.querySelector('.binary-search-tree-vis');

const bstIntervalListener = setInterval(function(){
    if (BSTVis.classList.contains("vis-open")){
        BSTrunScript();
        clearInterval(bstIntervalListener);
    }
}, 100)

let BST;
function BSTrunScript(){
    const BSTTwo = new Two({fitted: true}).appendTo(BSTVis);
    const BSTsvg = BSTTwo.renderer.domElement;
    BSTsvg.setAttribute("width", "100%");
    BSTsvg.setAttribute("height", "100%");

    BST = new BinarySearchTree(BSTTwo);
}

const bstPutInput = document.querySelector('.bst-put-input')
const bstPutInfo = document.querySelector('.bst-put-info');
bstPutInput.addEventListener("keyup", function(event){
    if (event.key == "Enter"){
        event.preventDefault();
        let animSpeed = document.querySelector('.bst-slider').value;
        BST.setAnimStep(animSpeed);

        if (BST.size() == 25){
            bstPutInfo.innerHTML = "Max list length reached";
            this.value = "";
            setTimeout(function(){
                bstPutInfo.innerHTML = "";
            }, textDuration)
        }
        else{
           BST.put(this.value);
            this.value = "";
        }
    }
})

const bstPutButton = document.querySelector('.bst-put-button');
bstPutButton.addEventListener("click", function(){
    let animSpeed = document.querySelector('.bst-slider').value;
    BST.setAnimStep(animSpeed);

    if (BST.size() == 25){
        bstPutInfo.innerHTML = "Max list length reached";
        bstPutInput.value = "";
        setTimeout(function(){
            bstPutInfo.innerHTML = "";
        }, textDuration)
    }
    else{
        BST.put(bstPutInput.value);
        bstPutInput.value = "";
    }
})

const bstDeleteInput = document.querySelector('.bst-delete-input')
bstDeleteInput.addEventListener("keyup", function(event){
    if (event.key == "Enter"){
        event.preventDefault();
        BST.delete(this.value);
        this.value = "";
    }
})

const bstDeleteButton = document.querySelector('.bst-delete-button');
bstDeleteButton.addEventListener("click", function(){
    BST.delete(bstDeleteInput.value);
    bstDeleteInput.value = "";
})

const bstSearchInput = document.querySelector('.bst-search-input')
const bstSearchInfo = document.querySelector('.bst-search-info');
bstSearchInput.addEventListener("keyup", async function(event){
    if (event.key == "Enter"){
        event.preventDefault();
        toggleAllInput();

        let animSpeed = document.querySelector('.bst-slider').value;
        BST.setAnimStep(animSpeed);

        let node = await BST.search(this.value);
        this.value = "";
        if (node == null){
            bstSearchInfo.innerHTML = "Node not found";
            setTimeout(function(){
                bstSearchInfo.innerHTML = "";
            }, textDuration)
        }
        else{
            bstSearchInfo.innerHTML = "Node found";
            setTimeout(function(){
                bstSearchInfo.innerHTML = "";
            }, 3000)
        }
        toggleAllInput();
    }
})

const bstSearchButton = document.querySelector('.bst-search-button');
bstSearchButton.addEventListener("click", async function(){
        toggleAllInput();

        let animSpeed = document.querySelector('.bst-slider').value;
        BST.setAnimStep(animSpeed);

        let node = await BST.search(bstSearchInput.value);
        bstSearchInput.value = "";
        if (node == null){
            bstSearchInfo.innerHTML = "Node not found";
            setTimeout(function(){
                bstSearchInfo.innerHTML = "";
            }, textDuration)
        }
        else{
            bstSearchInfo.innerHTML = "Node found";
            setTimeout(function(){
                bstSearchInfo.innerHTML = "";
            }, 3000)
        }
        toggleAllInput();
})

const bstResetButton = document.querySelector('.bst-reset-button');
bstResetButton.addEventListener("click", function(){
    BST.reset();
    bstPutInput.value = "";
})

function toggleAllInput(){
    if (bstPutInput.disabled){
        bstPutInput.disabled = false;
        bstPutButton.disabled = false;
        bstDeleteInput.disabled = false;
        bstDeleteButton.disabled = false;
        bstSearchInput.disabled = false;
        bstSearchButton.disabled = false;
        bstResetButton.disabled = false;
        document.querySelector('.bst-slider').disabled = false;
    }
    else{
        bstPutInput.disabled = true;
        bstPutButton.disabled = true;
        bstDeleteInput.disabled = true;
        bstDeleteButton.disabled = true;
        bstSearchInput.disabled = true;
        bstSearchButton.disabled = true;
        bstResetButton.disabled = true;
        document.querySelector('.bst-slider').disabled = true;
    }
}
