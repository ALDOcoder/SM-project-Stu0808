//============ 订单列表页面 order List.html ==============
const DOM ={
    $orderListContainer: $('#order-list-container'),  // 订单列表容器
    pageSize:8,//固定页面容量
    pageNO:1,// 固定当前页面序号
    $searchForm:$('#search-form'),//模糊查询form
    $searchOrderId:$('#order-id'), //模糊查询订单编号
    $searchUserId:$('#user-id'), //模糊查询用户编号
    $searchCreateTime:$('#order-time'),///模糊查询创建时间
    $searchStatus:$('#order-status'), //模糊查询订单状态
    $resetBtn:$('#reset-btn'),//重置按钮
    $searchBtn:$('#searchOrder-btn'),//查询按钮
    $pageContainer:$('#page-container'), //分页容器
    $prevBtn: $('#page-btn'), // 上一页按钮
    $nextBtn: $('#page-addbtn'), // 下一页按钮
    totalPage: 1, // 总页数（由接口返回后更新）
}

// ====== 1.初始化异步加载订单列表 ======
function getOrderList(){
    console.log('获取订单列表');
    return new Promise((resolve, reject) => {
        $.post('/user/order/list',{
            pageNO:DOM.pageNO,
            pageSize:DOM.pageSize,
        }).done(res=>{
            if(res && res.code === 200){
                console.log("订单列表获取成功", res.data);
                resolve(res.data);
            }else {
                reject(new Error(res.msg || '订单列表获取失败'));
            }
        }).fail(xhr => {
            // 捕获网络错误（如 404、500）
            reject(new Error(`网络错误：${xhr.status}，请刷新页面重试`));
        });
    });
}

// ====== 2.异步渲染订单列表 ======
async function loadOrderList(){
    // 1. 获取订单列表
    try {
        const orders =await getOrderList();
        DOM.pageNO = orders.page;
        const total = orders.total;
        const orderList = orders.list;
        // 更新总页数
        DOM.totalPage = orders.pageTotal;
        if (!orderList || orderList.length === 0) {
            // 1.2 处理订单列表为空情况
            DOM.$orderListContainer.html(`<div class="empty-order">
                <img src="/static/images/empty-order.png" alt="">
                <p>您还没有订单</p>
            </div>`);
        }

        // 2 遍历订单数据，拼接 HTML（匹配你的原有样式）
        let orderHtml = '';
        orderList.forEach(order => {
            // 日期格式化：将后端 LocalDateTime（如 "2021-01-01T12:00:00"）转为 "Jan 1, 2021"
            const formattedDate = formatOrderDate(order.createdTime);
            const formattedCSS = getOrderStatusClass(order.paymentStatus);

            // 拼接单个订单卡片
            orderHtml += `
                <div class="order-list-item">
                    <div class="box order-id">#${order.orderNo}</div>
                    <div class="box order-id">#${order.userId}</div>
                    <div class="box price">${formattedDate}</div>
                    <div class="box total">￥${order.totalAmount}</div>
                    <!-- 动态添加状态样式（依赖 OrderListVO 的 statusClass） -->
                    <div class="box status ${formattedCSS}">${order.paymentStatus === 1 ? '已付款' :order.paymentStatus === 2 ?'待付款':'已取消'}</div>
                    <div class="box action">
                        <a href="/user/rooter/orderDetails?orderId=${order.id}" class="icon fas fa-eye"></a> 
                    </div>
                </div>
            `;
            //在orderDatails去获取orderId
        });

        // 3. 渲染订单列表
        DOM.$orderListContainer.html(orderHtml);
        console.log(DOM.totalPage+'页' +total+'条数据'+'当前页'+DOM.pageNO);
        // 4. 渲染分页
        renderPage(total);
    }catch (err) {
        // 2.5 捕获所有错误（网络错误/接口错误），显示友好提示
        console.error('渲染订单列表失败：', err);
        DOM.$orderListContainer.html(`<div class="order-error">加载失败：${err.message}</div>`);
    }
}

// 3. 辅助函数：格式化订单日期（适配后端 LocalDateTime）
function formatOrderDate(dateTimeStr) {
    // 后端返回的 LocalDateTime 格式通常是 "2021-01-01T12:00:00"，先转成 JS Date 对象
    const date = new Date(dateTimeStr);
    // 定义月份缩写（匹配你的原有格式）
    const monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // 拼接格式：Jan 1, 2021
    return `${monthAbbr[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
// 4. 辅助函数，根据订单状态，返回对应的样式类
function getOrderStatusClass(status) {
    switch (status) {
        case 1:
            return 'completed';
            break;
        case 2:
            return 'processing';
            break;
        case 3:
            return 'cancelled';
            break;
    }
}

// 5. 渲染分页
///DOM.$pageContainer 是一个 jQuery 对象（而非原生 DOM 元素），而 querySelector 是原生 DOM 元素的方法，jQuery 对象没有这个方法，因此报错。
function renderPage(total) {
   const $p = DOM.$pageContainer.find('p');

   // $p.val('共'+totalPage+'页/'+total+'条'); //p标签没有value属性

    $p.text('共'+DOM.totalPage+'页/'+total+'条');
   const $pageNumber =DOM.$pageContainer.find('input');
    $pageNumber.val('第 '+DOM.pageNO+' 页');
   updatePaginationControls();
}

//=========== 2.模糊查询功能加载 =========
 //========== 2.1 重置表单数据功能
function clearSearchDate() {
    //清除表单数据
   DOM.$searchOrderId.val('');
   DOM.$searchUserId.val('');
   DOM.$searchCreateTime.val('');
   DOM.$searchStatus.val('');
   DOM.pageNO = 1;
   loadOrderList();
}
//========== 2.2 模糊查询功能
function searchOrderList() {
    console.log('模糊查询');
    DOM.pageNO >1?DOM.pageNO=1:DOM.pageNO;
    return new Promise((resolve, reject) => {
        $.post('/user/order/list',{
            pageNO:DOM.pageNO,
            pageSize:DOM.pageSize,
            orderNo:DOM.$searchOrderId.val(),
            userId:DOM.$searchUserId.val(),
            createdTime:DOM.$searchCreateTime.val(),
            paymentStatus:DOM.$searchStatus.val(),
        }).done(res=>{
            console.log('模糊查询数据:', res);
            if(res && res.code === 200){
                console.log("订单列表获取成功", res.data);
                resolve(res.data);
            }else {
                reject(new Error(res.msg || '订单列表获取失败'));
            }
        }).fail(xhr => {
            reject(new Error(`网络错误：${xhr.status}，请刷新页面重试`));
        });
    });
}
//=========== 2.3 渲染模糊查询结果
async function loadSearchOrderList(){
    try {
        const orders =await searchOrderList();
        // 更新页信息（若接口提供）
        DOM.pageNO = orders.page ?? DOM.pageNO; //?? 是 空值合并运算符（Nullish Coalescing Operator），是 ES2020 引入的新特性
        // 它的作用是：当左侧的操作数为 null 或 undefined 时，返回右侧的操作数；否则返回左侧的操作数。
        const totalPage = orders.pageTotal ?? DOM.totalPage;
        const total = orders.total ?? 0;
        DOM.totalPage = totalPage;
        //获取订单列表
        const orderList = orders.list;
        if (!orderList || orderList.length === 0) {
            DOM.$orderListContainer.html(`<div class="empty-order">
                <img src="/static/images/empty-order.png" alt="不好意思，小编的图片找不到了，请稍后等待。">
                <p>没有查询结果</p>
            </div>`);
            renderPage(total, DOM.totalPage);
            return;
        }
        let orderHtml = '';
        orderList.forEach(order => {
            const formattedDate = formatOrderDate(order.createdTime);
            const formattedCSS = getOrderStatusClass(order.paymentStatus);
            orderHtml += `
                <div class="order-list-item">
                    <div class="box order-id">#${order.orderNo}</div>
                    <div class="box order-id">#${order.userId}</div>
                    <div class="box price">${formattedDate}</div>
                    <div class="box total">￥${order.totalAmount}</div>
                    <!-- 动态添加状态样式（依赖 OrderListVO 的 statusClass） -->
                    <div class="box status ${formattedCSS}">${order.paymentStatus === 1 ? '已付款' :order.paymentStatus === 2 ?'待付款':'已取消'}</div>
                    <div class="box action">
                        <a href="/user/rooter/orderDetails?orderId=${order.id}" class="icon fas fa-eye"></a>
                    </div>
                </div>
            `;
        });
        // 3. 渲染订单列表
        DOM.$orderListContainer.html(orderHtml);
        renderPage(total, DOM.totalPage);
    }catch (err){
        console.error('渲染订单列表失败：', err);
        DOM.$orderListContainer.html(`<div class="order-error">加载失败：${err.message}</div>`);
    }
}

//========== 2.6 绑定事件
function bindEvent() {
    // 绑定点击事件(重置按钮)
    DOM.$resetBtn.on('click', clearSearchDate);

    // 绑定点击事件(查询按钮)
    DOM.$searchBtn.on('click', loadSearchOrderList);

    // 分页按钮事件
    DOM.$prevBtn.on('click', () => gotoPage(DOM.pageNO - 1));
    DOM.$nextBtn.on('click', () => gotoPage(DOM.pageNO + 1));
}


// 辅助：当前是否有查询条件
function isSearchActive(){
    return !!(DOM.$searchOrderId.val() || DOM.$searchUserId.val() || DOM.$searchCreateTime.val() || DOM.$searchStatus.val());
}

// 翻页入口：限制边界、加载数据、更新UI //gotoPage 是上下页功能的 “大脑”，负责 页码合法性校验、避免重复请求、条件加载数据
async function gotoPage(newPage){
    if (DOM.totalPage < 1) DOM.totalPage = 1;
    if (newPage < 1) newPage = 1;
    if (newPage > DOM.totalPage) newPage = DOM.totalPage;
    if (newPage === DOM.pageNO) return;

    DOM.pageNO = newPage;
    // 加载中禁止重复点击
    DOM.$prevBtn.prop('disabled', true);
    DOM.$nextBtn.prop('disabled', true);

    try{
        if (isSearchActive()){
            //数据渲染
            await loadSearchOrderList();
        }else{
            //数据渲染重现加载
            await loadOrderList();
        }
    }finally{
        // 更新按钮可用态与页码显示
        updatePaginationControls();
    }
}

// 更新按钮可用态与页码显示
function updatePaginationControls(){
    if (!DOM.$prevBtn || !DOM.$nextBtn) return;
    DOM.$prevBtn.prop('disabled', DOM.pageNO <= 1);
    DOM.$nextBtn.prop('disabled', DOM.pageNO >= DOM.totalPage);
    const $pageNumber =DOM.$pageContainer.find('input');
    $pageNumber.val('第 '+DOM.pageNO+' 页');
}
// ============ 3.订单详情页面

// 页面加载完成后，触发订单渲染
$(document).ready(() => {
    loadOrderList(); // 页面加载时自动渲染订单
    bindEvent();

});