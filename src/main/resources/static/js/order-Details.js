DOM={
    $orderDetailsContainer:$('#order-details-container'),// order-details 地址栏 容器
    $totalPrice: $('#total-price'),// order-details 订单总价 //JS 执行时机太早：你的 DOM.$totalPrice = $('#total-price')
    // 在 Thymeleaf 片段还没完成服务器端替换、客户端 DOM 还没渲染 时就执行了，此时 #total-price 还不存在；
    $orderDataContainer:$('#order-data-container') ,//order-items 订单列数据容器
    $totalPriceAll:$('#order-total-price-all'),// order-details 订单总价
    $orderNo:$('#orderNo'),// order-details 订单编号
    $orderDate:$('#orderDate'),// order-details 订单日期
    $orderTotalPrice:$('#order-total-price'),// order-details 商品小计总价
    $orderDelivery:$('#order-delivery-price'),// order-details 订单运费
    $orderDiscount:$('#order-discount-price'),// order-details 订单优惠信息
    $addressInfo:$('#address-info'),// order-details 收货地址信息
    $provinceMap:{},//全国三级地址数据 省份Map
    $cityMap:{},//全国三级地址数据 市Map
    $districtMap:{},

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
                            <input type="number" step="1" min="1" value="${item.quantity}" class="input-text qty text" disabled>
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
    try {
        const data = await getOrderDetails(id);
        console.log(data);
        DOM.$orderNo.html('订单号:'+data.orderNo); // 订单编号
        var orderDate = new Date(data.createdTime);
        orderDate = Dateformat(orderDate);
        DOM.$orderDate.html('下单时间:'+orderDate);//下单时间
        DOM.$orderTotalPrice.html("¥"+ Number(data.subtotal).toFixed(2)+"元");
        DOM.$orderDelivery.html("¥"+Number(data.shippingFee).toFixed(2)+"元");//运费
        DOM.$orderDiscount.html("¥"+Number(data.discount).toFixed(2)+"元"); //折扣
        DOM.$totalPriceAll.html("¥"+Number(data.totalAmount).toFixed(2)+"元");



        let provinceName=DOM.$provinceMap[data.province];
        let cityName=DOM.$cityMap[data.city];
        let districtName=DOM.$districtMap[data.district];
        //======开始渲染地址栏数据
        // 构建地址HTML，保持与HTML示例相同的格式
        let addressHtml = `
            <p><span>${data.recipient|| '未填写'}</span></p>
            <P><span>联系电话:</span>${data.phone}</P>
            <p><span>省份:</span> ${provinceName? provinceName.name:data.province || '未填写'}</p>
            <p><span>城市:</span> ${cityName? cityName.name:data.city|| '未填写'}</p>
            <p><span>区/县</span>${districtName? districtName.name:data.district||'未填写'}</p>
            <p><span>详细地址:</span> ${data.detail || '未填写'}</p>
            <p><span>邮政编号:</span> ${data.zipCode|| '未填写'}</p>
        `;
        
        // 将构建好的HTML设置到地址容器中
        DOM.$addressInfo.html(addressHtml);
        
    } catch (error) {
        console.error("加载订单详情失败：", error.message);
        // 显示错误信息
        DOM.$orderNo.html('加载失败');
        DOM.$orderDate.html('');
        DOM.$orderTotalPrice.html('¥0.00元');
        DOM.$orderDelivery.html('¥0.00元');
        DOM.$orderDiscount.html('¥0.00元');
        DOM.$totalPriceAll.html('¥0.00元');
        DOM.$addressInfo.html('<p><span>加载地址信息失败</span></p>');
    }
}
async function loadAddressSelectData() {
   return new Promise((resolve, reject) => {
       $.get('/address/pca-code.json',(rawData)=>{
           if (!rawData || !rawData.length) {
               alert('地址数据为空，请检查文件！');
               reject();
               return;
           }
           //1,构建省份映射
           rawData.forEach(province => {
               DOM.$provinceMap[province.code] = province;

               // 2. 构建城市映射
               province.children.forEach(city => {
                   DOM.$cityMap[city.code] = city;

                   // 3. 构建区县映射
                   city.children.forEach(district => {
                       DOM.$districtMap[district.code] = district;
                   });
               });
           });

           resolve(); // 数据加载完成，允许后续操作
       },'json').fail(() => {
           alert('加载JSON全国三级地址数据失败，请刷新页面重试');
           reject();
       });
   });
}
function  Dateformat(date){
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes= date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}
$(document).ready(() => {
        loadAddressSelectData();
        loadOrderItem();
        loadOrderDetails();
});