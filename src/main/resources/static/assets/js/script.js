$(document).ready(function(){

  $('.scroll-top').hide();

  /*--------------- Search Form ---------------*/
  let searchForm = document.querySelector('.header .header-1 .form-container');

  document.querySelector('.header .icon-container #search-btn').onclick = () =>{
      searchForm.classList.toggle('active');
  }

  /*---------- Mobile-Navbar Toggler ----------*/
  let sideBar = document.querySelector('.mobile-menu');

  document.querySelector('#menu-btn').onclick = () =>{
      sideBar.classList.toggle('active');
  }

  document.querySelector('#close-side-bar').onclick = () =>{  
      sideBar.classList.remove('active');
      $(".main-nav-link").removeClass("active");
      $(".main-nav-link").next(".sub-nav-link").removeClass("active").slideUp()
      $(".main-nav-link").find(".nav-btn i").removeClass("fa-minus").addClass("fa-plus")	
  }
  
  // On Load/Scroll
  $(window).on('load scroll',function(){

    /*--------------- Sticky Header ---------------*/
    if($(window).scrollTop() > 68){
        $('header .header-2').addClass('active');
    }else{
        $('header .header-2').removeClass('active');
    }

    /*--------------- Scroll-Top ---------------*/
    if ($(this).scrollTop() > 100) {
      $('.scroll-top').fadeIn();
    } else {
      $('.scroll-top').fadeOut();
    }

  
  });

});


