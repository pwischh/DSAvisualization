class TreeNodeAnim{
    #two;
    ring;
    #rootNodeViz;
    #step;

    constructor(two){
        this.#two = two;
        this.ring = this.#two.makeCircle(this.#two.width/2, 75, 29);
        this.ring.fill = "rgba(0, 0, 0, 0)"
        this.ring.stroke = "green";
        this.ring.linewidth = 6;
        this.ring.visible = false;
        this.#two.add(this.ring);
        this.#step = 175;
    }

    move(currentNode, destinationNode){
        if (destinationNode == null) return null;

        let destinationNodeViz = destinationNode.viz;
        let currentNodeViz = currentNode.viz;

        if (!this.ring.visible) {
            this.#rootNodeViz = currentNodeViz;
            this.ring.visible = true;
        }
        let ring = this.ring;
        let two = this.#two;
        let destX = this.#getGlobalX(destinationNodeViz);
        let destY = this.#getGlobalY(destinationNodeViz);
        let stepX = (destX - this.#getGlobalX(currentNodeViz))/this.#step;
        let stepY = (destY - this.#getGlobalY(currentNodeViz))/this.#step;
        let step = this.#step;

        return new Promise((resolve) => {
            two.bind('update', function(){
                ring.position.set(ring.position.x + stepX, ring.position.y + stepY);
                if (step >= 100){
                    if ((ring.position.x <= destX + 0.2 || ring.position.x >= destX - 0.2) && ring.position.y >= destY + 0.2){
                        two.unbind('update');
                        setTimeout(function(){
                            resolve(destinationNode);
                        }, step * 10);
                    }
                }
                else{
                    if (ring.position.x == destX && ring.position.y == destY){
                        two.unbind('update');
                        setTimeout(function(){
                            resolve(destinationNode);
                        }, step * 10);
                    } 
                }
            }).play();
          });
    }

    async moveLeft(currentNode){
        let nodeToReturn = await this.move(currentNode, currentNode.left);
        return nodeToReturn;
    }

    async moveRight(currentNode){
        let nodeToReturn = await this.move(currentNode, currentNode.right);
        return nodeToReturn;
    }

    resetAnim(){
        let two = this.#two;
        let step = this.#step;
        let ring = this.ring;

        if (this.ring.position.x == this.#two.width/2 && this.ring.position.y == 75){
            this.ring.visible = true;
            this.#two.update();

            return new Promise((resolve) =>{
                setTimeout(function(){
                    ring.visible = false;
                    two.update();
                }, step * 5);
                resolve();
            });
        }
        else{
            this.#two.pause();
            this.ring.visible = false;
            this.ring.position.set(this.#getGlobalX(this.#rootNodeViz), this.#getGlobalY(this.#rootNodeViz));
            
            return new Promise((resolve) =>{
                setTimeout(function(){
                    two.update();
                }, step * 5);
                resolve();
            });
        }
    }

    setStep(step){
        this.#step = 175 - step;
    }

    #getGlobalX(nodeViz){
        return (this.#two.width/2 - this.#rootNodeViz.getX()) + nodeViz.getX();
    }

    #getGlobalY(node){
        return node.getY();
    }
}