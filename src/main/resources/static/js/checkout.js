//==== 加载所需的数据
"use strict";
const DOM ={


    $addBtn : $('#addAddressBtn'),     // “添加地址”按钮
    $form : $('#addressFormDate'),      // 地址表单
    $cancelBtn : $('#cancelAddressForm'), //取消按钮
    $sendBtn : $('#sendAddress'),//添加 和 修改地址 的按钮
    $addressList : $('#addressList'), //地址列表
    $addressLoading : $('#addressLoading'), // 地址列表无数据时显示的loading
    $isSumbmitting : false ,//阻止表单短时间内重复提交
    $selectAddressId:'', //选中的地址ID
    $checkOutBtn : $('#checkout-Btn'), //结账提交按钮
    // 购物车汇总相关DOM元素
    $totalPrice : $('#total-price'), // 小计
    $deliveryPrice : $('#delivery-price'), // 配送费
    $discountPrice : $('#discount-price'), // 折扣
    $totalPriceAll : $('#total-price-all') ,// 总计
    // 全国地址相关DOM元素
    $province : $(' #province '),//省份
    $city : $(' #city '),//城市
    $district : $(' #district '),//区县
    $provinceMap:{},//省份容器
    $cityMap:{},//城市容器
    $districtMap:{},//区县容器

};

//===== 1. 添加地址按钮功能 =====//
//===== 1.1.1 控制输入下面输入form的弹出  (事件总线)
function controllerForm() {


    DOM.$addBtn.on('click',()=>{
        DOM.$sendBtn.off('click',evenEditBtn);
        DOM.$form.removeClass('hidden'); // 显示表单
        DOM.$form[0].reset(); // 重置表单（清空输入框、下拉框）
        $('#addressId').val(''); // 清空隐藏的地址ID（新增地址时用）
        DOM.$sendBtn.on('click',evenAddBtn);
    });

    //控制表单隐藏
    DOM.$cancelBtn.on('click',()=>{
        DOM.$form[0].reset(); // 重置表单（清空输入框、下拉框）
        DOM.$form.addClass('hidden');
    });

    // 绑定表单回车提交（增强交互）
    DOM.$form.on('submit', (e) => {
        e.preventDefault(); // 阻止默认提交
        DOM.$sendBtn.trigger('click'); // 触发保存按钮逻辑
    });
    // 事件绑定前先解绑：避免重复绑定导致多次触发
    DOM.$addressList.off('click', evenDeleteBtn);
    DOM.$addressList.off('click', evenEditBtn);
    DOM.$addressList.off('click', evenSetDefaultBtn);
    DOM.$addressList.off('click', evenSelectBtn); // 添加这一行

    //再添加监听器
    DOM.$addressList.on('click',evenDeleteBtn);
    DOM.$addressList.on('click',evenEditBtn);
    DOM.$addressList.on('click',evenSetDefaultBtn);
    DOM.$addressList.on('click',evenSelectBtn); // 添加这一行

    DOM.$province.on('change',renderCitySelect);
    DOM.$city.on('change',renderDistrictSelect);

}
// ===== 1.2 发送请求 =======
function  sendAddAddress(){
    // 1，校验表单数据
    if( !checkData()){
        return new Error('数据校验失败');
    }
    const formData=createFormData();
    // 2，发送请求
    return new Promise((resolve, reject)=>{
        $.post("/user/address/addAddress",{
            zipCode: formData.zipCode,
            recipient: formData.recipient,
            phone: formData.phone,
            address: formData.address,
            province: formData.province,
            city: formData.city,
            district: formData.district,
            detail: formData.detail,
            addressTag: formData.addressTag,
            isDefault: formData.isDefault
        }).done(res=>{
            console.log("请求的数据为",formData);
            if(res && res.code===200){
                alert('地址保存成功！');
                console.log("地址数据添加成功", res.data);
                DOM.$form.addClass('hidden'); // 保存后隐藏表单
                resetFrom();
                loadAddressList();
                resolve(res);
            }else {
                reject(new Error(res.msg || '添加地址失败，请稍后重试'));
            }
        }).fail(xhr => {
            // 捕获网络错误（如 404、500）
            reject(new Error(`网络错误：${xhr.status}，请刷新页面重试`));
        });
    });

}

//===== 1.3 提交新增address 事件
function  evenAddBtn() {
    // 判断前面是否正在提交
    if(DOM.$isSumbmitting) return;

    DOM.$isSumbmitting=true; // 上锁
    sendAddAddress().catch(err =>{
        // 统一错误提示（避免Promise reject未捕获）
        alert(err.message);
        console.log('保存地址失败：', err);
    }).finally(()=>{
        // 解锁
       DOM.$isSumbmitting = false;
    });
}
// 重置表单数据
function  resetFrom(){
    DOM.$form[0].reset();//清空输入的内容
    $('.error-text').remove(); //清除错误css样式
}
// 数据校验
function  checkData(){
    // 获取表单数据
    let isValid = true; // 表单数据是否合法
    $('.error-text').remove();
    // 1.校验表单数据 收货人姓名地址(非空 + 长度限制)
    const name = $('#recipient').val().trim();
    if(name === ''){
        showError('#recipient', '请输入收货人姓名');
        isValid = false;
    } else if (name.length > 20) {
        showError('#recipient', '姓名不能超过20个字符');
        isValid = false;
    }
    // 2. 联系电话校验（非空 + 手机号格式）
    const phone =$('#phone').val().trim();
    console.log("手机电话为",phone);
    if(phone === ''){
        showError('#phone', '请输入联系电话');
        isValid = false;
    } else if (!/^1[3456789]\d{9}$/.test(phone)) {
        showError('#phone', '请输入正确的手机号');
        isValid = false;
    }
    // 3. 详细地址校验（非空 + 长度限制）
    const address = $('#detail').val().trim();
    if(address === ''){
        showError('#detail', '请输入详细地址');
        isValid = false;
    } else if (address.length > 100) {
        showError('#detail', '详细地址不能超过100个字符');
    }
    // 4. 省份校验（必选）
    const province = $('#province').val();
    if (province === '') {
        showError('#province', '请选择省份');
        isValid = false;
    }

    // 5. 城市校验（必选）
    const city = $('#city').val();
    if (city === '') {
        showError('#city', '请选择城市');
        isValid = false;
    }

    // 6. 区县校验（必选）
    const district = $('#district').val();
    if (district === '') {
        showError('#district', '请选择区县');
        isValid = false;
    }
    // 7. 邮政编码校验（可选，但填写需为6位数字）
    const zip = $('#zip').val().trim();
    const zipReg = /^\d{6}$/;
    if (zip !== '' && !zipReg.test(zip)) {
        showError('#zip', '请输入正确的6位邮政编码');
        isValid = false;
    }

    // 8. 地址标签校验（非空 + 长度限制）
    const addressTag = $('#addressTag').val().trim();
    if (addressTag === '') {
        showError('#addressTag', '地址标签不能为空');
        isValid = false;
    } else if (addressTag.length > 10) {
        showError('#addressTag', '标签不能超过10个字符（如：家、公司）');
    }
    return isValid;
}
// 构造 数据表单
function  createFormData(){
    let formDateKey = false;
      return {
            id: $('#addressId').val() ||  null,
            recipient: $('#recipient').val(),
            phone: $('#phone').val(),
            address: $('#address').val(),
            province: $('#province').val(),
            city: $('#city').val(),
            district: $('#district').val(),
            zipCode: $('#zip').val(),
            detail: $('#detail').val(),
            addressTag: $('#addressTag').val(),
            isDefault: $('#isDefault').is(':checked') ? 1 : 0
       };
}
// ===== 数据校验错误提示
function showError(selector, message) {
    const $element = $(selector);
    // 1. 标记输入框为错误状态（应用 CSS 样式）
    $element.addClass('error');
    // 2. 添加错误提示文本
    $element.after(`<span class="error-text">${message}</span>`);

    // 3. 输入框聚焦时，清除错误状态
    $element.on('focus', function() {
        $(this).removeClass('error');       // 移除输入框错误类
        $(this).next('.error-text').remove(); // 移除错误提示
    });
}

// ======= 2.获取地址列表 =======


// ======= 2.1 发送请求 =======
function  fetchAddressList(){
     return new Promise((resolve, reject)=>{
        $.get('/user/address/queryAddress').done(res=>{
            if(res && res.code===200){
                console.log("地址列表数据获取成功",res.data);
                resolve(res.data);
            }else {
                reject(new Error(res.msg || '地址列表数据获取失败'));
            }
        }).fail(xhr => {
            // 捕获网络错误（如 404、500）
            reject(new Error(`网络错误：${xhr.status}，请刷新页面重试`));
        });
     });
}

// ======== 2.3.渲染地址列表 ========
function renderAddressList(addressList){
    DOM.$addressLoading.hide();

    if(!addressList || addressList.length === 0){
        DOM.$addressList.html('<div class="no-address">\n' +
            '                <p>暂无保存的地址</p>\n' +
            '                <button class="btn-flex" id="addFirstAddress">\n' +
            '                    <i class="fas fa-plus"></i> 添加第一个地址\n' +
            '                </button>\n' +
            '            </div>');
        // 添加点击事件 绑定已有的 事件
        DOM.$addressList.on('click', '#addFirstAddress', function () {
            DOM.$addBtn.trigger('click');// 触发已有的点击事件
        });
        return;
    }
    // 1.定义渲染HTML模板
    let htmlStr = '';
    addressList.forEach(item=>{
        //判断是否为默认地址
        const isDefault = item.isDefault === 1;
        console.log("是否为默认地址",item.isDefault);
        if(item.isDefault) DOM.$selectAddressId=item.id;
        const provinceName=DOM.$provinceMap[item.province]; // 获取省份名称,加载时把从后端获取code的省市区数据name映射到当前页面
        const cityName=DOM.$cityMap[item.city];
        const districtName=DOM.$districtMap[item.district];// 获取区县名称
        htmlStr += `
             <div class="address-card ${item.isDefault ? 'active' : ''}" data-address-id="${item.id}">
                            <div class="card-content">
                                <div class="address-header">
                                    <div class="address-title">${item.addressTag || '未命名地址'}</div>
                                     ${item.isDefault ? '<span class="default-badge">默认</span>' : ''}
                                </div>
                          
                                 <div class="card-title">
                                     <p><span>${item.recipient}</span> • ${item.phone}</p>
                                     <p>${provinceName? provinceName.name:item.province}${cityName? cityName.name:item.city}${districtName? districtName.name:item.district}${item.detail}</p>
                                     <p>邮政编码：${item.zipCode || '未填写'}</p>
                                 </div>
                            
                                <div class="address-actions">
                                    <button class="action-btn edit-btn" data-address-id="${item.id}">
                                        <i class="fas fa-edit"></i> 编辑
                                    </button>
                                    <button class="action-btn delete-btn" data-address-id="${item.id}">
                                        <i class="fas fa-trash"></i> 删除
                                    </button>
                                    <button class="action-btn  select-btn  ${item.isDefault ? 'action-btn-bg':''}" 
                                      data-address-id="${item.id}" ${item.isDefault ? 'disabled':''} >
                                        <i class="fas fa-check-circle"></i> ${item.isDefault ? '已选':'选择'}
                                    </button>
                                    ${!item.isDefault ? `
                                    <button class="action-btn set-default-btn" data-address-id="${item.id}">
                                        <i class="fas fa-check-circle"></i> 设为默认
                                    </button>
                                ` : ''}
                                </div>
                            </div>
              </div>
            `;
    });
    // 2.渲染HTML
    DOM.$addressList.html(htmlStr);

    console.log("地址列表数据渲染成功----已选择addressId",DOM.$selectAddressId);

}
//========= 2.4 添加事件
function loadAddressList() {
    try{
        DOM.$addressLoading.show(); //显示加载动画
        fetchAddressList().then(addressList => { //获取地址列表
            renderAddressList(addressList); //渲染地址列表

        }).catch(err => {
            DOM.$addressLoading.hide();
            DOM.$addressList.html(`<div class="address-error">加载失败：${err.message}</div>`);
            console.log('地址列表加载错误：', err);
        });

    }catch (err){
        DOM.$addressLoading.hide();
        DOM.$addressList.html(`<div class="address-error">加载失败：${err.message}</div>`);
        console.log('地址列表加载错误：', err);
    }
}

// =========== 3.删除按钮的实现

// =========== 3.1 删除按钮的请求发送
function  sendDeleteAddress(id){

    return new Promise((resolve, reject)=>{
        $.ajax({
            url:"/user/address/deleteAddress",
            type:"delete",
            data:{id:id}
        }).done(res=>{
            if(res&&res.code===200){
                resolve({success:true,message:res.msg});
                console.log("地址删除成功",id);
                loadAddressList();
            }else {
                reject({success: false, message: res?.msg || '添加失败，请稍后重试'});
            }
        }).fail(xhr=>{
            reject({success: false, message: '网络错误${xhr.status}，添加失败'});
        });
    });
}

//=========== 3.2 添加事件 ---- 事件委托
function evenDeleteBtn(e){
    if(!DOM.$addressList) return;
    if(!e.target.classList.contains('delete-btn')) return;
    e.preventDefault();
    const deleteBtn = e.target.closest('.delete-btn'); //获取按钮元素
    // 获取address Id
    const  id = deleteBtn.getAttribute('data-address-id');
    // 获取并校验地址ID
    if (!id) {
        alert('未获取到地址信息，请刷新页面重试');
        return;
    }

    // 删除前确认：避免用户误操作
    console.log("地址的id,为:",id);
    if (!confirm('确定要删除该地址吗？\n（提示：默认地址无法删除）')) {
        return;
    }
    // 触发删除事件
    sendDeleteAddress(id)
        .then((res) => {
            alert(res.message||"地址删除成功"); // 成功提示（如：地址删除成功）
            loadAddressList(); // 刷新地址列表，同步页面状态
    }).catch((err) => {
        // 捕获所有错误（包括默认地址不能删的场景）
        console.error('删除地址失败：', err);
        alert(err.message); // 给用户友好提示（如：用户默认地址不能被删除）
    });
}

//==========  4. 编辑按钮的事件的实现

//=========  4.1 获取指定的数据 发送请求
function sendGetAddress(id) {
    return new Promise((resolve, reject)=>{
        $.get("/user/address/selectAddressOne",{id:id})
            .done(res=>{
                if(res&& res.code==200){
                    console.log("成功获取单个地址数据",res.data);
                    resolve({success:true,msg:res.msg,data:res.data});
                }else {
                    reject({success:false,msg:res.msg||"数据获取失败"});
                }
            })
            .fail(xhr=>{
                reject({success:false,message: '网络错误${xhr.status}，添加失败'});
            });
    });
}

//========= 4.2 发送修改请求
function  sendEditAddress(){
    // 1，校验表单数据
    if( !checkData()){
        return new Error('数据校验失败');
    }
    const formData=createFormData();
    // 2，发送请求
    return new Promise((resolve, reject)=>{
        $.ajax({
            url:"/user/address/updateAddress",
            type:"put",
            data:{
                id:formData.id,
                zipCode: formData.zipCode,
                recipient: formData.recipient,
                phone: formData.phone,
                address: formData.address,
                province: formData.province,
                city: formData.city,
                district: formData.district,
                detail: formData.detail,
                addressTag: formData.addressTag,
                isDefault: formData.isDefault
            }
        }).done(res=>{
            console.log("请求的数据为",formData);
            if(res && res.code===200){
                alert('修改成功！');
                DOM.$form.addClass('hidden'); // 保存后隐藏表单
                resetFrom();
                loadAddressList();
                resolve(res);
            }else {
                reject(new Error(res.msg || '添加地址失败，请稍后重试'));
            }
        }).fail(xhr => {
            // 捕获网络错误（如 404、500）
            reject(new Error(`网络错误：${xhr.status}，请刷新页面重试`));
        });
    });
}

//======== 4.3 添加事件 绑定按钮edit-btn

function evenEditBtn(e){
    if(!e.target.classList.contains('edit-btn')) return;
    e.preventDefault();
    const editBtn = e.target.closest('.edit-btn'); //获取按钮元素
    if(!editBtn) return;
    const id = editBtn.getAttribute('data-address-id');
    // 获取并校验地址ID
    if (!id) {
        alert('未获取到地址信息，请刷新页面重试');
        return;
    }
    //获取该idAddress数据
    sendGetAddress(id)
        //动态去渲染值给form 表单
        .then((res)=>{
            console.log("res.data",res.data);
            AddressDataForm(res.data);
        }).catch((err) => {
           // 捕获所有错误（包括默认地址不能删的场景）
            console.error('修改地址失败', err);
            alert(err.message); // 给用户友好提示（如：用户默认地址不能被删除）
      });
    // 绑定修改表单提交事件
    // 移除添加按钮的默认提交事件
    DOM.$sendBtn.off('click',evenAddBtn);
    // 绑定修改表单提交事件
    DOM.$sendBtn.on('click',evenEditSubmit);

}
//======= 4.4 修改表单提交，让其绑定sendPutAddress
function evenEditSubmit(){
    // 判断前面是否正在提交
    if(DOM.$isSumbmitting) return;

    DOM.$isSumbmitting=true; // 上锁
    sendEditAddress().catch(err =>{
        // 统一错误提示（避免Promise reject未捕获）
        alert(err.message);
        console.log('保存地址失败：', err);
    }).finally(()=>{
        // 解锁
        DOM.$isSumbmitting = false;
    });
}

//====== 4.5  赋值给form表单
function  AddressDataForm(address){
    // 打开表单 清空表单数据
    DOM.$form.removeClass('hidden');
    resetFrom();
    // 开始为表单赋值
    if(address){
        //------  $("addressId")这个返回的是jquery对象 如果使用原生value 属性赋值就会失效
        $("#addressId").val(address.id);
        $("#zip").val(address.zipCode);
        $("#recipient").val(address.recipient);
        $("#phone").val(address.phone);
        $("#detail").val(address.detail);
        $("#addressTag").val(address.addressTag);
        $("#isDefault").prop('checked',address.isDefault);
        
        // 省市县联动赋值 - 需要按顺序设置并触发change事件
        //方法一：直接设置，去触发change事件 代码复用: 复用 现有的renderCitySelect和renderDistrictSelect函数 耦合度: 与现有事件处理逻辑耦合
       // 时序控制:依赖setTimeout确保执行顺序  代码可读性:逻辑可能较难跟踪，因为涉及事件触发和回调  性能:可能稍差，因为涉及事件分发和处
        //方法二：直接生成市县的html: 代码可读性:逻辑更清晰，因为直接生成HTML，不需要事件触发和回调  性能:可能更好，因为不需要事件分发和回调
        //代码复用需要重写生成HTML的逻辑 耦合度：更独立，不依赖事件机制
        //果要进一步优化，可以考虑将生成HTML的逻辑提取为独立函数，以便在其他地方需要时也能复用，保持代码的DRY（Don't Repeat Yourself）原则。
        if(address.province) {
            // 1. 设置省份值并触发change事件加载城市
            $("#province").val(address.province);
            // 使用setTimeout确保DOM更新后再触发change事件
            setTimeout(() => {
                $("#province").trigger('change');
                
                // 2. 在省份change事件回调后设置城市值并触发change事件加载区县
                setTimeout(() => {
                    if(address.city) {
                        $("#city").val(address.city);
                        $("#city").trigger('change');
                        
                        // 3. 在城市change事件回调后设置区县值
                        setTimeout(() => {
                            if(address.district) {
                                $("#district").val(address.district);
                            }
                        }, 50);
                    }
                }, 50);
            }, 50);
        }

    }
}

//=====  5  cartList 表单内设置默认地址的 事件
//=====  5.1 设置默认地址
function evenSetDefaultBtn(e){
    // 判断是否点击了按钮
    if(!e.target.classList.contains('set-default-btn')) return;
    //获取地址元素的Id
    const defaultBtn = e.target.closest('.set-default-btn');
    const id = defaultBtn.getAttribute('data-address-id');
    if (!id) return;
    sendSetDefaultAddress(id)
        .then((res)=>{
            console.log("res.data",res.data);
            alert('设置成功！');
            loadAddressList();
        }).catch((err) => {
        console.error('设置默认地址失败', err);
    });
}
// ====== 5.2 设置按钮设置默认地址
function sendSetDefaultAddress(id){
    return new Promise((resolve, reject)=>{
        $.ajax({
            url:"/user/address/setDefaultAddress",
            type:"put",
            data:{
                id:id
            }
        }).done(res=>{
            console.log("请求的数据为",res);
            if(res && res.code===200){
                resolve(res);
            }else {
                reject(new Error(res.msg || '设置默认地址失败，请稍后重试'));
            }
        }).fail(xhr => {
            // 捕获网络错误（如 404、500）
            reject(new Error(`网络错误：${xhr.status}，请刷新页面重试`));
        });
    });
}

// ======  6  cartList 表单内选择按钮的事件

// ====== 6.1 选择按钮
function evenSelectBtn(e){
    // 使用closest确保点击按钮内任何位置都能触发
    const selectBtn = $(e.target).closest('.select-btn')[0];
    if (!selectBtn) return;
    
    // 获取地址ID
    const addressId = selectBtn.dataset.addressId;
    if (!addressId) return;
    
    // 2. 移除所有地址卡片的“选中样式”
    const allAddressCards = document.querySelectorAll('.address-card');
    allAddressCards.forEach(card => {
        if (card.classList.contains('active')) {
            // 2.1 移除卡片的“选中样式”
            card.classList.remove('active');

            // 2.2 找到该卡片内的“选择按钮”，清除其样式但保留图标
            const prevSelectBtn = card.querySelector('.select-btn');
            if (prevSelectBtn) {
                prevSelectBtn.classList.remove('action-btn-bg'); // 移除背景
                // 使用innerHTML保留<i>标签
                prevSelectBtn.innerHTML = '<i class="fas fa-check-circle"></i> 选择';
                prevSelectBtn.removeAttribute('disabled'); // 移除禁用
            }
        }
    });

    // 3. 为当前地址卡片添加“选中样式”
    const currentCard = selectBtn.closest('.address-card'); // 从按钮向上找父容器
    currentCard.classList.add('active');
    selectBtn.classList.add('action-btn-bg');
    // 使用innerHTML保留<i>标签
    selectBtn.innerHTML = '<i class="fas fa-check-circle"></i> 已选';
    selectBtn.setAttribute('disabled', 'disabled');

    // 4. 同步更新隐藏域（保存选中的地址 ID）
    DOM.$selectAddressId = addressId;
}


// ====== 7 获取购物车数据并计算汇总信息

// 7.1 发送请求获取购物车数据
function fetchCartData() {
    return new Promise((resolve, reject)=>{
        $.post('/user/cart/queryCarted')
            .done(res=>{
                if(res && res.code===200){
                    console.log("购物车数据获取成功",res.data);
                    resolve(res.data);
                }else {
                    reject(new Error(res.msg || '购物车数据获取失败'));
                }
            }).fail(xhr => {
                // 捕获网络错误（如 404、500）
                reject(new Error(`网络错误：${xhr.status}，请刷新页面重试`));
            });
    });
}

// 7.2 计算购物车汇总信息
function calculateCartSummary(cartData) {
    // 计算商品小计
    let totalPrice = 0;
    cartData.forEach(item => {
        totalPrice += item.price * item.quantity;
    });
    
    // 设置配送费和折扣（这里使用固定值，实际项目中可能需要根据业务规则计算）
    const deliveryPrice = 20.00;
    const discountPrice = 10.00;
    
    // 计算总计
    const totalPriceAll = totalPrice + deliveryPrice - discountPrice;
    
    // 更新DOM显示
    if(DOM.$totalPrice) {
        DOM.$totalPrice.text(" ¥ "+totalPrice.toFixed(2) );
    }
    if(DOM.$deliveryPrice) {
        DOM.$deliveryPrice.text("+ ¥ " + deliveryPrice.toFixed(2) );
    }
    if(DOM.$discountPrice) {
        DOM.$discountPrice.text("- ¥ " + discountPrice.toFixed(2) );
    }
    if(DOM.$totalPriceAll) {
        DOM.$totalPriceAll.text(" ¥ "+totalPriceAll.toFixed(2) );
    }
    
    console.log("购物车汇总信息计算完成", { totalPrice, deliveryPrice, discountPrice, totalPriceAll });
}

// 7.3 加载购物车汇总信息
async function loadCartSummary() {
    try {
        const cartData = await fetchCartData();
        calculateCartSummary(cartData);
    } catch (err) {
        console.error('加载购物车汇总信息失败：', err);
        // 可以在这里添加错误提示
    }
}



// ====== 8 checkout-btn提交按钮

// ====== 8.1 绑定事件(checkout-btn提交按钮)
function  eventCheckOutBtn(){
    // 绑定结账按钮点击事件
    DOM.$checkOutBtn.on('click', async () => {
        // 1. 数据校验
        if (!validateData()) {
            return; // 校验失败，不继续执行
        }

        try {
            // 2. 收集订单数据
            const orderData = {
                addressId: DOM.$selectAddressId,
                paymentMethod: $('input[name="payment"]:checked').val(),
                subtotal: parseFloat(DOM.$totalPrice.text().replace(/[^\d.-]/g, '')),
                shippingFee: parseFloat(DOM.$deliveryPrice.text().replace(/[^\d.-]/g, '')),
                discount: parseFloat(DOM.$discountPrice.text().replace(/[^\d.-]/g, '')),
                total: parseFloat(DOM.$totalPriceAll.text().replace(/[^\d.-]/g, '')),
                totalAmount: parseFloat(DOM.$totalPriceAll.text().replace(/[^\d.-]/g, '')), // 实际支付金额
                discountCouponId: null, // 优惠券ID（如果有）
                discountCoupon: null // 优惠券信息（如果有）
            };

            // 3. 显示加载状态
            DOM.$isSumbmitting = true;
            DOM.$checkOutBtn.prop('disabled', true).text('处理中...');

            // 4. 提交订单
            // const orderResult =
            await sendCheckout(DOM.$selectAddressId, orderData)
                .then(res=>{
                    if(res && res.code===200){
                        console.log("订单提交成功",res.msg);
                        alert('订单提交成功！'+res.msg);
                        window.location.href='/user/rooter/index';
                    }else {
                        reject(new Error(res.msg || '订单提交失败'));
                    }
                });

            // // 5. 订单提交成功后的处理
            // alert('订单提交成功！');
            // console.log('订单提交成功', orderResult);
            // 6. 跳转到订单详情页面或支付页面
           //  window.location.href = '/user/rooter/orderDetails?id=' + orderResult.id;

        } catch (error) {
            // 错误处理
            console.log('订单提交失败:', error);
            alert('订单提交失败：' + error.message);
        } finally {
            // 恢复按钮状态
            DOM.$isSumbmitting = false;
            DOM.$checkOutBtn.prop('disabled', false).text('提交订单');
        }
    });
}
//===== 8.2 发送请求(checkout)  发送请求后 1.生成order 表  2.生成order Detail表oderId(主键回显) 3.删除cart表中的数据
// 4 .数据一致性如何去保证
function sendCheckout(addressId,orderData){
    console.log('提交订单数据:', orderData);
    
   return new Promise((resolve, reject)=>{
       $.post("/user/order/payfor",{
           addressId:orderData.addressId,
           paymentMethod:orderData.paymentMethod,
           subtotal:orderData.subtotal,
           shippingFee:orderData.shippingFee,
           discount:orderData.discount,
           total:orderData.total,
           totalAmount:orderData.totalAmount,
           discountCouponId:orderData.discountCouponId,
           discountCoupon:orderData.discountCoupon,
       }).done(res=>{
           if(res && res.code === 200){
               console.log("订单提交成功", res.data);
               resolve(res);
           }else {
               reject(new Error(res.msg || '订单生成失败'));
           }
       }).fail(xhr => {
           // 捕获网络错误（如 404、500）
           reject(new Error(`网络错误：${xhr.status}，请刷新页面重试`));
       });
   });

}
//=======8.3 数据校验
function validateData(){
    // 1. 检查是否选择了收货地址
    if (!DOM.$selectAddressId) {
        alert('请选择收货地址');
        return false;
    }
    
    // 2. 检查是否选择了支付方式
    const paymentMethod = $('input[name="payment"]:checked').val();
    if (!paymentMethod) {
        alert('请选择支付方式');
        return false;
    }
    
    // 3. 检查购物车是否有商品（可以根据购物车总计判断）
    const totalPriceAll = parseFloat(DOM.$totalPriceAll.text().replace(/[^\d.-]/g, ''));
    if (isNaN(totalPriceAll) || totalPriceAll <= 0) {
        alert('购物车为空，请先添加商品');
        return false;
    }
    
    // 所有校验通过
    return true;
}

//======= 9 跟新地址列表 添加全国事件
//======= 9.1 获取全国三级地址JSON数据
async function loadAddressSelectData() {
    $.get('/address/pca-code.json',function (rawData){
        rawData.forEach(province=>{
           DOM.$provinceMap[province.code] = province;
           //生成城市映射
            province.children.forEach(city=>{
                DOM.$cityMap[city.code] = city;
                //生成地区映射
                city.children.forEach(area=>{
                    DOM.$districtMap[area.code] = area;
                });
            });
            //渲染省份下拉框
            const provinceSelect =['<option value="">选择省份</option>'];
            resetSelect(DOM.$city, "选择城市");
            resetSelect(DOM.$district, "选择县/区");
            Object.values(DOM.$provinceMap).forEach( province=>{
                provinceSelect.push(`<option value="${province.code}">${province.name}</option>`);
            });
            DOM.$province.html(provinceSelect.join(''));
        });
    },'json').fail(()=>{
        alert('加载JSON全国三级地址数据失败，请刷新页面重试');
    });
}
//======= 9.2 渲染地址城市列表
function renderCitySelect() {
    const provinceCode = $(this).val();
    resetSelect(DOM.$city, "选择城市");
    resetSelect(DOM.$district, "选择县/区");


    if (provinceCode) {
        // 直接通过映射取省份，O(1) 速度
        const currentProvince =DOM.$provinceMap[provinceCode];
        const cityData = currentProvince?.children || [];
        const citySelectData = ['<option value="">选择城市</option>'];

        cityData.forEach(city => {
            citySelectData.push(`<option value="${city.code}">${city.name}</option>`);
        });
        DOM.$city.html(citySelectData.join(''));
    }
}
//======= 9.3 渲染地址地区列表
function renderDistrictSelect() {
    const cityCode = $(this).val();
    resetSelect(DOM.$district, "选择县/区");

    if (cityCode) {
        const currentCity = DOM.$cityMap[cityCode];
        const districtData = currentCity?.children || [];
        const districtSelectData = ['<option value="">选择县/区</option>'];
        districtData.forEach(district => {
            districtSelectData.push(`<option value="${district.code}">${district.name}</option>`);
        });
        DOM.$district.html(districtSelectData.join(''));
    }
}

//======= 9.4 重置下拉框工具函数
function resetSelect(selectElem, defaultText = "请选择") {
    selectElem.html(`<option value="">${defaultText}</option>`);
}

//======= 9.5 测试地址选择功能
// function testAddressSelection() {
//     console.log("开始测试地址选择功能...");
//
//     // 检查地址数据是否正确加载
//     setTimeout(() => {
//         console.log("省份数据数量:", Object.keys(DOM.$provinceMap).length);
//         console.log("城市数据示例:", Object.keys(DOM.$cityMap).slice(0, 5));
//
//         // 测试省份下拉框
//         if (DOM.$province.find('option').length > 1) {
//             console.log("✓ 省份下拉框加载成功");
//
//             // 测试省份变更触发城市加载
//             const firstProvince = DOM.$province.find('option:not([value=""]):first');
//             if (firstProvince.length) {
//                 console.log(`选择第一个省份: ${firstProvince.text()}`);
//                 firstProvince.prop('selected', true);
//                 DOM.$province.trigger('change');
//
//                 // 检查城市是否加载
//                 setTimeout(() => {
//                     if (DOM.$city.find('option').length > 1) {
//                         console.log("✓ 城市下拉框加载成功");
//
//                         // 测试城市变更触发区县加载
//                         const firstCity = DOM.$city.find('option:not([value=""]):first');
//                         if (firstCity.length) {
//                             console.log(`选择第一个城市: ${firstCity.text()}`);
//                             firstCity.prop('selected', true);
//                             DOM.$city.trigger('change');
//
//                             // 检查区县是否加载
//                             setTimeout(() => {
//                                 if (DOM.$district.find('option').length > 1) {
//                                     console.log("✓ 区县下拉框加载成功");
//                                     console.log("✓ 地址选择三级联动测试通过");
//                                 } else {
//                                     console.error("✗ 区县下拉框加载失败");
//                                 }
//                             }, 100);
//                         }
//                     } else {
//                         console.error("✗ 城市下拉框加载失败");
//                     }
//                 }, 100);
//             }
//         } else {
//             console.error("✗ 省份下拉框加载失败");
//         }
//     }, 500); // 给数据加载一些时间
// }

$(document).ready(async ()=>{
    try {
        loadAddressSelectData(); // 加载全国三级地址数据
        controllerForm(); // 初始化事件绑定
        eventCheckOutBtn(); // 绑定结账按钮事件
        await loadAddressList(); // 加载地址列表（若loadAddressList返回Promise）
        await loadCartSummary(); // 加载购物车汇总信息
        
        // // 测试地址选择功能（在开发环境使用，生产环境可注释）
        // setTimeout(testAddressSelection, 1000);
    } catch (err) {
        console.error('页面初始化失败：', err);
        alert('页面加载失败，请刷新页面重试');
    }
});