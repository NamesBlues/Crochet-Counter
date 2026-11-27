class Counter{
    private n: number;

    constructor(){
        this.n = Number(localStorage.getItem("n")??0);
    }
    get value():number{
        return this.n
    }
    add():number{
        this.n += 1;
        this.save();
        return this.n;
    }
    reset():void{
        this.n = 0;
        this.save();
    }
    private save():void{
        localStorage.setItem("n",String(this.n));
    }
}

const counter = new Counter();

const numEl = document.querySelector<HTMLDivElement>("#num")!;
const addBtn = document.querySelector<HTMLButtonElement>("#add")!;
const resetBtn = document.querySelector<HTMLButtonElement>("#reset")!;

function render():void{
    numEl.textContent = String(counter.value);
}
addBtn.addEventListener("click",()=>{
    counter.add();
    render();
});

resetBtn.addEventListener("click",()=>{
    counter.reset();
    render();
});

render();