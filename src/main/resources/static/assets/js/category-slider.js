/*--------------- Category Slider ---------------*/ 
var swiper = new Swiper(".category-slider", {

    spaceBetween: 20,

    observer: true,
    observeParents: true,
    freeMode: true,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
    loop:true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false, 
    },

    pagination: {
        el: ".swiper-pagination2",
        clickable:true,
      },

      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      
      breakpoints: {
        450: {
            slidesPerView: 2,
        },

        768: {
            slidesPerView: 3,
        },

        991: {
            slidesPerView: 4,
        },

        1024: {
            slidesPerView: 5,
        },
    },

}); 