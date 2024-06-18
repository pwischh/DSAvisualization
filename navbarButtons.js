const navbarButtons = document.querySelectorAll('[data-panel]');

navbarButtons.forEach(button => {
    button.addEventListener("click", function(){
        let openPanel = document.getElementsByClassName("panel-open");
        openPanel[0].classList.toggle("panel-open");
        let openVis = document.getElementsByClassName("vis-open");
        openVis[0].classList.toggle("vis-open");
        let panel = document.getElementsByClassName(this.dataset.panel);
        panel[0].classList.toggle("panel-open");
        let vis = document.getElementsByClassName(this.dataset.vis);
        vis[0].classList.toggle("vis-open");
    })
})