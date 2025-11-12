


document.addEventListener("DOMContentLoaded", function() {
    const DOM = {
        swiperContainer: document.querySelector(".category-slider"), // 对应Swiper容器
        categoryWrapper: document.getElementById("category"), // 幻灯片容器
        productContainer: document.getElementById('product-container'),
    };
    var productTabs = document.querySelector('section.products .products-menu-btns');
    // 初始化Swiper（核心修正）
    function initSwiper() {
        return new Swiper('.category-slider', {
            // 1. 每页显示5个（与视觉一致）
            slidesPerView: 5,
            // 2. 幻灯片间距（根据设计调整，如20px）
            spaceBetween: 20,
            // 3. 关闭 Loop（7 < 5+1，避免警告和逻辑异常）
            loop: true,
            // 4. 自动播放（3秒切换一次，交互后不停止）
            autoplay: {
                delay: 3000,
                disableOnInteraction: false
            },
            // 5. 分页器（与页数联动，自动计算为2个）
            pagination: {
                el: '.swiper-pagination2',
                clickable: true
            },
            // 6.启用左右翻页按钮
            navigation: {
                nextEl: '.swiper-button-next', // 右按钮类名
                prevEl: '.swiper-button-prev', // 左按钮类名
                clickable: true                // 允许点击
            },
           //  响应式断点（合并category-slider.js的配置）
            breapoints: {
                450: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                991: { slidesPerView: 4 },
                1024: { slidesPerView: 5 } // 大屏显示5个（与视觉一致）
            },
            //动态适配（确保异步渲染后正常工作）
            observer: true,
            observeParents: true
        });
    }

    // 动态加载数据并初始化-----Category物品分类
    $(document).ready(() => {
        $.get("/user/category/getAll", (res) => {
            if (res.code !== 200) {
                alert("数据加载失败");
                return;
            }
            console.log("加载分类数据",res.data);
            // 渲染幻灯片
            let htmlStr = "";
            res.data.forEach(item => {
                htmlStr += `
                    <a href="./Shop Grid.html" class="category-item swiper-slide">
                        <h3>${item.name}</h3>
                        <img src="${item.photo}" alt="${item.name}" />
                    </a>
                `;
            });
            DOM.categoryWrapper.innerHTML = htmlStr;

            // 传入真实数量初始化Swiper（res.total为后端返回的总数）
            initSwiper();
        });
    });

    // 评星加载工具
    /**
     * 动态生成星级评分HTML
     * @param {number} rating - 后端返回的评分（如4.5）
     * @returns {string} - 生成的HTML片段
     */
    function generateRating(rating) {
        console.log("加的小星星",rating);
        // 处理无评分场景（0或null/undefined）
        if (rating === 0 || rating === null || rating === undefined) {
            return '<div class="rating">及不好</div>';
        }

        let html = '<div class="rating">';
        const fullStars = Math.floor(rating); // 全星数量（如4.5 → 4）

        const hasHalf = rating % 1 >= 0.5;    // 是否有半星（如4.5 → true）

        // 1. 生成全星（实心）
        for (let i = 0; i < fullStars; i++) {
            html += '<i class="fas fa-star"></i>'; // 实心星（需Font Awesome支持）
        }

        // 2. 生成半星（若有）
        if (hasHalf) {
            html += '<i class="fas fa-star-half-alt"></i>'; // 半实心星
        }

        // 3. 生成空心星（补满5个）
        const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            html += '<i class="far fa-star"></i>'; // 空心星（需引入Font Awesome Regular样式）
        }

        html += '</div>';
        return html;
    }

    // 加载产品数据的函数
    function loadProducts(type) {
        let params = {};
        if (type === 'latest') {
            params = { isNew: 1, isFeatured: '', isBestSeller: '' };
        } else if (type === 'featured') {
            params = { isNew: '', isFeatured: 1, isBestSeller: '' };
        } else if (type === 'Best-Seller') {
            params = { isNew: '', isFeatured: '', isBestSeller: 1 };
        }

        $.get("/user/products/getSpecificProducts", params, (res) => {
            if (res.code !== 200) {
                alert("数据加载失败");
                return;
            }
            console.log("加载产品数据",res.data);
            let htmlStr = "";
            console.log("加载产品数据",res.data);
            res.data.forEach(item => {

                htmlStr += `
                    <div class="product-item">
                        <div class="discount">${item.discountPercentage}%</div>
                        <div class="options">
                            <a href="#"><i class="fas fa-heart"></i></a>
                            <a href="#"><i class="fas fa-share"></i></a>
                            <a href="#"><i class="fas fa-eye"></i></a>
                        </div>
                        <img src="${item.photo}" alt="${item.name}" />
                        <h3>${item.name}</h3>
                        ${generateRating(item.rating)} 
                        <div class="price">
                            <p>${item.salePrice} 元<span>${item.originalPrice} 元</span></p>
                        </div>
                        <a  class="btn"  data-id="${item.id}">
                           <i class="fas fa-shopping-cart"></i>
                        添加购物车</a>
                    </div>
                `;

            });

            // 动态获取当前type对应的容器（替代之前的targetContainer）
            const targetContainer = document.querySelector(`#${type}`);
            if (targetContainer) {
                targetContainer.innerHTML = htmlStr;
                // 加载完成后在添加点击事件监听器
                attachClickEventListeners();
            } else {
                console.error(`未找到ID为${type}的产品容器`);
            }
        });

    }

    // 为购物车添加点击事件监听器
    // 为卡片中的所有的添加购物车按钮添加点击事件监听器
    // 通过事件委托向父元素添加监听器productContainer
    function attachClickEventListeners() {
        if (!DOM.productContainer) return; // 父容器不存在，直接退出
        console.log(DOM.productContainer);
        // 2. 关键：先移除旧监听器（防止重复绑定）
        DOM.productContainer.removeEventListener('click', handleCartClick);
        // 再添加新监听器（每次调用仅绑定1次）
        DOM.productContainer.addEventListener('click', handleCartClick);
    }
    // 1. 定义命名处理函数（全局/局部可访问，确保移除时能找到）
    function handleCartClick(e) {
        const cartLink = e.target.closest('a[data-id]');
        if (!cartLink) return; // 不是购物车按钮，直接退出

        // 阻止a标签默认跳转
        e.preventDefault();
        const productId = cartLink.getAttribute('data-id');
        const linkElement = cartLink;
        console.log("点击的购物车按钮",productId);
        // 加载状态
        linkElement.classList.add('loading');
        linkElement.innerHTML = '<i class="fas fa-spinner"></i> 添加中...';

        // 调用addToCart（单次触发，无重复）
        addToCart(productId)
            .then((res) => {
                linkElement.classList.remove('loading');
                linkElement.innerHTML = '<i class="fas fa-shopping-cart"></i> 添加购物车';
                alert(res.message); // 仅触发1次
            })
            .catch((err) => {
                linkElement.classList.remove('loading');
                linkElement.innerHTML = '<i class="fas fa-shopping-cart"></i> 添加购物车';
                alert(err.message); // 仅触发1次
            });
    }


    // 发送添加购物车请求
    function addToCart(productId) {
        // 关键：返回一个Promise
        return new Promise((resolve, reject) => {
            $.post("/user/cart/addCarted", { productId: productId })
                .done(res => {// 成功回调（接口响应）
                    console.log("添加购物车结果",res);
                    if (res && res.code === 200) {
                        resolve({ success: true, message: '商品已成功添加到购物车' });
                    } else {
                        reject({ success: false, message: res?.msg || '添加失败，请稍后重试' });
                    }
                })
                .fail(xhr => { // 失败回调（网络错误、接口报错等）
                    reject({ success: false, message: '网络错误，添加失败' });
                });
        });
    }

    // 初始化加载默认分类
    loadProducts('latest');

    // 按钮点击事件
    productTabs.addEventListener('click', function(e) {
        console.log("按钮被点击了");
        if (e.target.classList.contains('products-menu-btn') && !e.target.classList.contains('active')) {
            productTabs.querySelector('.active').classList.remove('active');
            e.target.classList.add('active');

            // 解析type（从data-target中提取，如#latest → latest）
            const type = e.target.getAttribute('data-target').slice(1);
            loadProducts(type);

            // 切换容器显示状态
            const productSection = document.querySelector('section.products');
            productSection.querySelectorAll('.product-gallery').forEach(container => {
                container.classList.remove('active');
            });
            productSection.querySelector(`#${type}`).classList.add('active');
        }
    });

    //添加购物车

});

