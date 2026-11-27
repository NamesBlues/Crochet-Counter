"use strict";
class Counter {
    n;
    constructor() {
        this.n = Number(localStorage.getItem("n") ?? 0);
    }
    get value() {
        return this.n;
    }
    add() {
        this.n += 1;
        this.save();
        return this.n;
    }
    reset() {
        this.n = 0;
        this.save();
    }
    save() {
        localStorage.setItem("n", String(this.n));
    }
}
const counter = new Counter();
const numEl = document.querySelector("#num");
const addBtn = document.querySelector("#add");
const resetBtn = document.querySelector("#reset");
function render() {
    numEl.textContent = String(counter.value);
}
addBtn.addEventListener("click", () => {
    counter.add();
    render();
});
resetBtn.addEventListener("click", () => {
    counter.reset();
    render();
});
render();
