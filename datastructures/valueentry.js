class ValueEntry{
    #value;

    constructor(value){
        this.#value = value;
    }

    getValue(){
        return this.#value;
    }

    setValue(value){
        let old = this.#value;
        this.#value = value;
        return old;
    }

    /* Method built off assumption that every value entered is a number.
    this is checked when a value is typed into the corresponding input box
    on the website 
    
    param(e): ValueEntry to be compared to this
    return: int */
    compareTo(e){
        let i = this.#value;
        let j = e.getValue();

        return i - j;
    }

    toString(){
        console.log("(" + this.#value + ")");
    }
}