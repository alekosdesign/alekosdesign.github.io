// wow = new WOW({
//   animateClass: 'animated',
//   offset: 100
// });
// wow.init();

// Preloader
// jQuery(function () {
//   const svg = document.getElementById("svg");
//   const tl = gsap.timeline();
//   const curve = "M0 502S175 272 500 272s500 230 500 230V0H0Z";
//   const flat = "M0 2S175 1 500 1s500 1 500 1V0H0Z";

//   tl.to(".loader-wrap-heading .load-text , .loader-wrap-heading .cont", {
//     delay: 1.5,
//     y: -100,
//     opacity: 0,
//   });
//   tl.to(svg, {
//     duration: 0.5,
//     attr: { d: curve },
//     ease: "power2.easeIn",
//   }).to(svg, {
//     duration: 0.5,
//     attr: { d: flat },
//     ease: "power2.easeOut",
//   });
//   tl.to(".loader-wrap", {
//     y: -1500,
//   });
//   tl.to(".loader-wrap", {
//     zIndex: -1,
//     display: "none",
//   });
//   tl.from(
//     "header",
//     {
//       y: 200,
//     },
//     "-=1.5"
//   );
//   tl.from(
//     "header .container",
//     {
//       y: 40,
//       opacity: 0,
//       delay: 0.3,
//     },
//     "-=1.5"
//   );
// });

// Headers
jQuery(document).ready(function () {
  jQuery("body").on("click", ".navbar__toggle", function () {
    jQuery(".navbar__toggle").addClass("openmenu");
  }),
  jQuery("body").on("click", ".navbar__toggle", function () {
    jQuery(".navbar__toggle").removeClass("openmenu");
  });
});
// jQuery(window).scroll(function () {
//   var scrolled = jQuery(this).scrollTop();
//   jQuery("header").css({
//     transform: "translate3d(0, " + -(scrolled * 0.2) + "px, 0)",
//     // opacity: 1 - scrolled / 600,
//     // 'transition': 'all 0.3s ease-in-out;'
//     transition: "0",
//   });
// });

// Hero
jQuery(function () {
  jQuery(".accordion .accordion__links li").on("mouseenter", function () {
    var tab_id = jQuery(this).attr("data-tab");
    jQuery(".accordion__links__img li").removeClass("current");
    jQuery(this).addClass("current");

    jQuery(".accordion__links__img .img").removeClass("current");
    jQuery("#" + tab_id).addClass("current");

    if (jQuery(this).hasClass("current")) {
      return false;
    }
  });

  jQuery(".accordion .accordion__links li").on("mouseleave", function () {
    jQuery(".accordion__links li").removeClass("current");
    jQuery(".accordion__links__img .img").removeClass("current");
  });

  jQuery(".accordion .accordion__links li").on("mouseenter", function () {
    jQuery(this).removeClass("no-active").siblings().addClass("no-active");
  });

  jQuery(".accordion .accordion__links li").on("mouseleave", function () {
    jQuery(".accordion .accordion__links li").removeClass("no-active");
  });

  jQuery(".accordion .accordion__links__img .img").on(
    "mouseenter",
    function () {
      var tab_id = jQuery(this).attr("data-tab");
      jQuery(".accordion__links__img .img").removeClass("current");
      jQuery(this).addClass("current");

      jQuery(".accordion__links li").removeClass("current");
      jQuery("#" + tab_id).addClass("current");

      if (jQuery(this).hasClass("current")) {
        return false;
      }
    }
  );

  jQuery(".accordion .accordion__links__img .img").on(
    "mouseleave",
    function () {
      jQuery(".accordion__links li").removeClass("current");
      jQuery(".accordion__links__img .img").removeClass("current");
    }
  );
  var pageSection = jQuery(".bg-img, section");
  pageSection.each(function (indx) {
    if (jQuery(this).attr("data-background")) {
      jQuery(this).css(
        "background-image",
        "url(" + jQuery(this).data("background") + ")"
      );
    }
  });

  var pageSectionColor = jQuery(".bg-solid-color, section");
  pageSectionColor.each(function (indx) {
    var color = jQuery(this).attr("data-solid-color");

    if (jQuery(this).attr("data-solid-color")) {
      jQuery(this).css("background-color", color);
    }
  });
});
