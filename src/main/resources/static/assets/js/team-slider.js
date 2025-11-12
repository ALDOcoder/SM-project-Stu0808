/*--------------- Team Slider ---------------*/ 
var swiper = new Swiper(".team-slider", {

    spaceBetween: 20,
    loop:true,
    autoplay: {
      delay: 8000, 
      disableOnInteraction: false, 
    },

    pagination: {
        el: ".swiper-pagination3",
        clickable:true,
      },

    breakpoints: {
        450: {
            slidesPerView: 2,
        },

        768: {
            slidesPerView: 2,
        },

        991: {
            slidesPerView: 3,
        },
    },

}); 