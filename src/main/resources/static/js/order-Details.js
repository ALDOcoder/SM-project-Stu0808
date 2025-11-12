DOM={
    $orderDetailsContainer:$('#order-details-container'),// order-details 地址栏 容器
    $totalPrice: $('#total-price'),// order-details 订单总价 //JS 执行时机太早：你的 DOM.$totalPrice = $('#total-price')
    // 在 Thymeleaf 片段还没完成服务器端替换、客户端 DOM 还没渲染 时就执行了，此时 #total-price 还不存在；

    $orderDataContainer:$('#order-data-container') //order-items 订单列数据容器
}
//============ 1.从导航中获取orderId //TODO 可以它进行加密处理
function getOrderIdFromUrl(){
    //获取url的信息
    const  searchParams = new URLSearchParams(window.location.search);
    //获取orderId 的值
    try{
        const id =searchParams.get('orderId');
        if(!id||id.trim().length ===0) return null;

        if (isNaN(Number(id.trim()))) {
            console.warn('orderId格式错误，应为数字');
            return null;
        }

        return id.trim();
    }catch (err){
        console.error('解析URL中的orderId失败：', err);
        return null;
    }
}
// =========== 2. 请求后端获取相关数据  (1.订单数据 付款数据  运费数据)  (2.Address 选择的地址数据)  (3. 订单货物数据)
// 方法一:分三个接口,分别去获取这个数据,通过order表的Id(订单数据),获取到addressId(地址栏的信息) 。也可以直接通过orderId获取到订单货物信息。
// 方法二:通过一个接口:直接得到这个所有的数据。
async function  getOrderDetails(id){
    return new Promise((resolve,reject)=>{
        $.get('/user/order/orderId',{orderId: id})
            .done(res=>{
                console.log("获取的订单数据为:",res);
                if(res.code===200){
                    resolve(res.data);
                }else {
                    reject(new Error(res.msg || '订单详情数据获取失败'));
                }
            }).fail(xhr=>{
                    reject(new Error(`网络错误：${xhr.status}，请刷新页面重试`));
            });
    });
}
//============ 3.获取订单列表数据(orderItems)
async  function  getOrderItems(id){
    return new Promise((resolve, reject)=>{
        $.get('/user/order/orderItems',{orderId:id})
            .done(res=>{
                console.log("获取订单列表数据：",res);
                if (res.code===200){
                    console.log("数据获取成功");
                    resolve(res.data);
                }else {
                    reject(new Error(res.msg || '订单详情数据获取失败'));
                }
            }).fail(xhr=>{
            reject(new Error(`网络错误：${xhr.status}，请刷新页面重试`));
        });
    });
}

//============ 4.异步渲染数据 order-item的数据
async function loadOrderItem() {
    const id = getOrderIdFromUrl();
    try {
        if (!id) {
            // 无有效 ID：显示错误
            DOM.$orderDataContainer.html(`
                <div class="error-state">
                    <div class="error-icon">⚠️</div>
                    <p class="error-message">无法访问订单详情</p>
                    <p class="error-submessage">未找到有效的订单ID，请返回订单列表重新选择</p>
                    <button class="back-btn">返回订单列表</button>
                </div>
            `);
            $('.back-btn').on('click', () => window.history.back());
            return;
        }

        // 有 ID：发起请求（带错误捕获）
        const data = await getOrderItems(id);
        // 渲染数据（用正确的 jQuery 方法和容器）
        let orderDataHtml = '';
        data.forEach(item => {
            const totalPrice = (item.price * item.quantity).toFixed(2);
            orderDataHtml += `
                <div class="order-item" data-product-id="${item.id}">
                    <img class="box" src="${item.photo}" alt="${item.productName || '商品图片'}" >
                    <div class="name box">${item.name || '未命名商品'}</div>
                    <div class="price box">${item.price}</div>
                    <div class="quantitly box">
                        <div class="quantity buttons_added" data-value="${item.productId}">
                            <input type="button" value="-" class="minus" disabled> <!-- 订单详情建议禁用修改 -->
                            <input type="number" step="1" min="1" value="${item.quantity}" class="input-text qty text" disabled>
                            <input type="button" value="+" class="plus" disabled>
                        </div>
                    </div>
                    <div class="total box">${totalPrice}元</div>
                </div>
            `;
        });
        //原生的html DOM 元素 document.getElementId('..')使用的是 inertHtml
        DOM.$orderDataContainer.html(orderDataHtml);


    } catch (error) {
        // 捕获所有错误（请求失败/渲染错误）并显示
        console.error("加载订单详情失败：", error.message);
        DOM.$orderDataContainer.html(`
            <div class="error-state">
                <div class="error-icon">❌</div>
                <p class="error-message">加载失败</p>
                <p class="error-submessage">${error.message}</p>
                <button class="reload-btn">重新加载</button>
                <button class="back-btn" style="margin-left: 10px;">返回订单列表</button>
            </div>
        `);
        // 绑定重新加载和返回按钮事件
        $('.reload-btn').on('click', loadOrderDetail); // 重新加载当前页面
        $('.back-btn').on('click', () => window.history.back());
    }
}
//=========== 5.异步渲染数据 order-details 订单总价 和地址栏
async function loadOrderDetails(){
    const id = getOrderIdFromUrl();
    // try {
    //     if(!id){
    //
    //     }
    // }

    const data = await getOrderDetails(id);
    console.log(data);
    console.log('totalPrice',DOM.$totalPriceAll);



}
$(document).ready(() => {
        loadOrderItem();
        loadOrderDetails();
});