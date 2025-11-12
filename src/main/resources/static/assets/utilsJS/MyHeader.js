// 1. 自定义一个元素，继承原生HTML元素
// 要将一个独立的HTML封装成一个Web Component(自定义元素) , 核心是利用Web Component标准的三大技术
//Custom Elements(自定义元素)、Shadow DOM(影子DOM ,实现样式/结构隔离) 、 HTML Templates(模板,承载HTML内容)
//整体思路是：通过 fetch 加载外部 HTML 文件内容 → 将 HTML 内容注入到组件的 Shadow DOM 中 → 注册为可复用的自定义元素
class MyHeader extends HTMLElement {
    constructor() {
        super();// 必须调用父类构造函数
        // 2. 加载独立的 header.html
        this.loadHeaderHtml();
    }
    loadHeaderHtml() {

        if(window.jQuery) {
            $.get('/user/rooter/header',(html)=>{
                this.innerHTML = html;
            }).fail(()=>{console.log("加载 header.html 失败")});
        }
        else {
            fetch('/user/rooter/header')
                .then(res=>res.text())
                .then(html=>{
                    this.innerHTML = html;
                });
        }
    }
}

customElements.define('my-header', MyHeader);