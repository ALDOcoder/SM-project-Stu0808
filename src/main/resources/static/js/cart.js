//======== 购物车模块 所需的DOM 元素
const DOM = {
    cartList: document.getElementById("cart-list"), // 购物车列表父元素
    cartContainer: document.getElementById("cart-container") ,// 建议外层加一个容器，用于承载加载/错误状态
    totalPrice: document.getElementById("total-price"), // 总价区域
    totalPriceAll: document.getElementById("total-price-all"), //结算金额区域
    priceDiscount: document.getElementById("discount-price"), //折扣区域
    priceDelivery: document.getElementById("delivery-price"), //运费区域
};

// ajax 获取购物车数据
function cartAjax() {
    return new Promise((resolve, reject) => {
        $.post("/user/cart/queryCarted")
            .done(res => {
                if (res && res.code === 200) {
                    resolve({
                        success: true,
                        message: res.msg,
                        data: res.data || []// 确保 data 是数组，避免无数据时报错
                    });
                } else {
                    reject(new Error(res.msg || '查询购物车失败，请稍后重试'));
                }
            })
            .fail(xhr => {
                // 捕获网络错误（如 404、500）
                reject(new Error(`网络错误：${xhr.status}，请刷新页面重试`));
            });
    });
}

//======== 核心功能：购物车渲染（处理加载/空状态/数据渲染）

function addCartDate(cartData) {
    let htmlStr = "";
    // 数据处理 1.判断数据是否为空
    if (!cartData || cartData.length === 0) {
        htmlStr = `<div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>您的购物车还是空的~</p>
                    <a href="/user/rooter/index" class="btn-go-shopping">去逛逛</a>
                </div>
                 `;
        DOM.cartList.innerHTML = htmlStr;
        return;
    }
    console.log(cartData)
    // 数据处理 2.  有数据 数据渲染
    cartData.forEach(item => {
        //提前计算总价（保留2位小数，避免浮点精度问题）
        const totalPrice = (item.price * item.quantity).toFixed(2);
        // 商品ID存入自定义属性，方便后续事件处理
        htmlStr += `
                    <div class="cart-item" data-product-id="${item.id}">
                        <img class="box" src="${item.photo}" alt="${item.productName}" >
                        <div class="name box" >${item.productName}</div>
                        <div class="category box">${item.categoryName}</div>
                        <div class="price box">${item.price}</div>
                        <div class="quantitly box">
                            <div class="quantity buttons_added" data-value="${item.productId}">
                                <input type="button" value="-" class="minus">
                                <input type="number" step="1" min="1" max="" name="quantity" value="${item.quantity}" title="Qty" class="input-text qty text" size="4" pattern="" inputmode="">
                                <input type="button" value="+" class="plus">
                            </div>
                        </div>
                        <div class="total box">${totalPrice}元</div>
                        <div class="action box">
                            <button data-value="${item.productId}"><i class="icon fas fa-trash-alt"></i></button> 
                        </div>
                    </div>
        
        
        `;
    });
    // 3. 渲染到DOM
    DOM.cartList.innerHTML = htmlStr;
}

//======== 核心功能：购物车查询（处理异步流程、加载状态、错误提示）
async function queryCart() {
    // 1. 校验DOM是否存在(避免DOM未加载时报错)
    if (!DOM.cartList || !DOM.cartContainer) return;

    // 2. 显示加载状态
    DOM.cartContainer.innerHTML = `
        <div class="cart-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>正在加载购物车...</p>
        </div>
    `;
    try {
        // 3. 异步获取购物车数据
        const {data} = await cartAjax();
        // 4. 渲染购物车列表（数据回来后再更新DOM，解决原代码"先渲染空值"问题）
        DOM.cartContainer.innerHTML = ''; // 清空加载状态
        //   b DOM.cartContainer.appendChild(DOM.cartList); // 放回列表容器
        addCartDate(data);
        calculateTotalPrice();
    } catch (error) {
        console.log(error);
        // 5. 处理错误状态（友好提示用户）
        DOM.cartContainer.innerHTML = `
            <div class="cart-error">
                <i class="fas fa-exclamation-circle"></i>
                <p>${error.message}</p>
                <button class="btn-reload" onclick="queryCart()">重新加载</button>
            </div>
        `;
    }


}


//======= 添加购物车功能: 删除购物车商品    <a href="/user/deleteByProductId" class="icon fas fa-trash-alt" data-product-id="${item.id}"></a>
function  addDeleteCart(e){
    const closest = e.target.closest('button[data-value]');
    if(!closest) return;
    console.log("添加删除购物车按钮");
    e.preventDefault();
    const productId= closest.getAttribute('data-value');
    console.log('productId',productId);
    deleteCart(productId)
        .then((res)=>{
            console.log("删除成功-商品-",productId);
            console.log(res.message);
            queryCart();
        }).catch((err)=>{
            console.log("删除失败-商品-",productId);
            alert(err.message);
    });
}
//======= 发送请求的逻辑
function deleteCart(productId){
    return new Promise((resolve, reject)=>{
        $.ajax({
            url:"/user/cart/deleteByProductId",
            type:"delete",
            data: { productId: productId }
        })
            .done(res=>{
                if(res&&res.code===200){
                    resolve({success:true,message:res.msg});
                    calculateTotalPrice();
                }else {
                    reject({success: false, message: res?.msg || '添加失败，请稍后重试'})
                }
            })
            .fail(xhr=>{
                reject({ success: false, message: '网络错误，添加失败' });
            });
    });
}

//======= 发送更新购物车数量的请求
function updateCartQuantity(productId, quantity) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "/user/cart/updateQuantity",
            type: "put",
            data: { productId: productId, quantity: quantity }
        })
            .done(res => {
                if (res && res.code === 200) {
                    resolve({ success: true, message: res.msg });
                } else {
                    reject({ success: false, message: res?.msg || '添加失败，请稍后重试' });
                }
            })
            .fail(xhr => {
                reject({ success: false, message: '网络错误，添加失败' });
            });
    });
}

//======= 添加购物车功能: 更新购物车商品数量
function  updateCart(e){
    // 处理加减按钮点击
    if (e.target.classList.contains('minus') || e.target.classList.contains('plus')) {
        console.log(e.target.classList.contains('minus'));
        console.log("添加更新购物车数量按钮");
        e.preventDefault();
        const cartList = e.target.closest('.buttons_added'); // 获取父元素
        const quantityInput = cartList.querySelector('.input-text'); // 获取数量输入框
        const productId = cartList.getAttribute('data-value');

        if (!quantityInput) return;

        // 处理按钮点击
        const isMinus = 'minus';
        const isPlus = 'plus';
        addCartButton(e.target, quantityInput, isMinus, isPlus);

        console.log('productId', productId);
        console.log('quantityInput', quantityInput);

        // 获取数量
        const quantity = parseInt(quantityInput.value);
        console.log('quantity', quantity);

        updateCartQuantity(productId, quantity)
            .then((res)=>{
                console.log("更新成功-商品-", productId);
                console.log(res.message);
                queryCart();
            }).catch((err)=>{
            console.log("更新失败-商品-", productId);
            alert(err.message);
        });
    }

    // 处理输入框键盘事件
    if (e.target.classList.contains('input-text')) {
        const quantityInput = e.target;
        const cartList = quantityInput.closest('.buttons_added');
        const productId = cartList.getAttribute('data-value');

        // 只在按下回车键时更新
        if (e.key === 'Enter') {
            const quantity = parseInt(quantityInput.value);
            if (!isNaN(quantity) && quantity > 0) {
                updateCartQuantity(productId, quantity)
                    .then((res)=>{
                        console.log("更新成功-商品-", productId);
                        console.log(res.message);
                        queryCart();
                    }).catch((err)=>{
                    console.log("更新失败-商品-", productId);
                    alert(err.message);
                });
            }
        }
    }
}
// 添加加减按钮事件
function addCartButton(button,quantityInput ,minus, plus) {
    // 1.判断是否是加减按钮
    if (!button.classList.contains(minus) && !button.classList.contains('plus')) {
        return;
    }
    // 2. 判断是否是加按钮
    if (button.classList.contains(plus)) {
       quantityInput.value++;
       return;
    }
    // 3. 减按钮
    if (button.classList.contains(minus)) {
        if (quantityInput.value > 1) {
            quantityInput.value--;
            return;
        }
    }
}


//======= 添加事件删除按钮
//======= 事件委托
function handlerCart(){
    if(!DOM.cartList) return;

    // 1. 先移除旧的监听器
    DOM.cartList.removeEventListener('click', addDeleteCart);
    DOM.cartList.removeEventListener('click', updateCart);
    DOM.cartList.removeEventListener('keyup', updateCart);

    // 2. 再添加新的监听器（分别绑定）
    DOM.cartList.addEventListener('click', addDeleteCart);
    DOM.cartList.addEventListener('click', updateCart);
    DOM.cartList.addEventListener('keyup', updateCart);
}


//======= 计算购物车总价
function calculateTotalPrice() {
    //1.前端计算 获取当前购物车数据 coumpted
    const cartList = document.querySelectorAll('.cart-item');
    console.log("计算总价-商品列表",cartList);
    let totalPrice = 0;
    cartList.forEach(item => {
        const price = parseFloat(item.querySelector('.price').textContent);
        const quantity = parseInt(item.querySelector('.input-text').value);
        totalPrice += price * quantity;
    });
    console.log("计算总价",totalPrice.toFixed(2));
    console.log("llll",DOM.totalPrice);
    DOM.totalPrice.innerText ="¥ "+ totalPrice.toFixed(2)+" 元";
    // 2.计算购物车总价
    console.log("discount",DOM.priceDiscount);
    let totalPriceAll = Number(totalPrice) +10;


    DOM.totalPriceAll.innerText = "¥ "+totalPriceAll.toFixed(2)+" 元";


}



$(document).ready(() => {
    queryCart();
    handlerCart();
});
