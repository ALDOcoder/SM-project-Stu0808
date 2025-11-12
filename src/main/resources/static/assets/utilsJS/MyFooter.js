class MyFooter extends HTMLElement{
    constructor() {
        super();
       this.loadHTML();
    }
    loadHTML(){
        if(window.jQuery){
            $.get("/user/rooter/footer",(html)=>{
                this.innerHTML=html;
            }).fail(()=>{console.log("加载 header.html 失败")});
        }
        else {
            fetch('/user/rooter/footer')
                .then(res=>res.text())
                .then(html=>{
                    this.innerHTML = html;
                });
        }

    }
}
customElements.define("my-foot",MyFooter);