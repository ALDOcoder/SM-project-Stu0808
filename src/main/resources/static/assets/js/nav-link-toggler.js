/*---------- Mobile-Navbar Nav Toggler ----------*/
/*
 实现移动端导航菜单中 “主菜单与子菜单的折叠 / 展开交互”
 */
$(document).ready(function(){
  
    $(".main-nav-link").click(function(){
      // self clicking close
      if($(this).next(".sub-nav-link").hasClass("active")){
        $(this).removeClass("active");
        $(this).next(".sub-nav-link").removeClass("active").slideUp()
        $(this).find(".nav-btn i").removeClass("fa-minus").addClass("fa-plus")	
      }

      else if($(this).hasClass("active")){
        $(this).removeClass("active");
      }

      else{
        $(".nav-link .main-nav-link").removeClass("active");
        $(".nav-link .sub-nav-link").removeClass("active").slideUp()
        $(".nav-link .main-nav-link .nav-btn i").removeClass("fa-minus").addClass("fa-plus");
        $(this).addClass("active");
        $(this).next(".sub-nav-link").addClass("active").slideDown()
        $(this).find(".nav-btn i").removeClass("fa-plus").addClass("fa-minus")
      }
    })
  })