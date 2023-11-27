window.addEventListener("load", windowLoad);

class blinkButton {
    constructor() {
        this.addTaskBtn = document.querySelector('.add__btn');
        this.createListBtn = document.querySelector('.newlist__btn');

        setInterval(()=> {
            this.addTaskBtn.classList.toggle('hidden');
            this.createListBtn.classList.toggle('hidden');
        }, 3000);
    }
}
