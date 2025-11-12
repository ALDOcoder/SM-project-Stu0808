/*---------- Product Gallery ----------*/

var productTabs = document.querySelector('section.products .products-menu-btns');

productTabs.addEventListener('click', function(e){

    if(e.target.classList.contains('products-menu-btn') && !e.target.classList.contains('active')){
        
        var target = e.target.getAttribute('data-target');
        productTabs.querySelector('.active').classList.remove('active');
        e.target.classList.add('active');

        var productSection = document.querySelector('section.products');
        productSection.querySelector('.product-gallery.active').classList.remove('active');
        productSection.querySelector(target).classList.add('active');

    }
})