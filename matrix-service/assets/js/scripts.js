function afterloader() {
    gsap.from(".offer__img", 1.2, {
        x: "20%",
        delay: .3,
        opacity: 0,
        ease: Expo.easeInOut
    }),
    gsap.from(".offer h1", 2, {
        x: "-20%",
        delay: .1,
        opacity: 0,
        ease: Expo.easeInOut
    }),
    gsap.from(".offer p", 2, {
        x: "-20%",
        delay: .2,
        opacity: 0,
        ease: Expo.easeInOut
    }),
    gsap.from(".cta", 2, {
        x: "-30%",
        delay: .3,
        opacity: 0,
        ease: Expo.easeInOut
    }),
    gsap.from(".uk-slidenav-previous", 2, {
        x: "-30%",
        delay: .4,
        opacity: 0,
        ease: Expo.easeInOut
    }),
    gsap.from(".uk-slidenav-next", 2, {
        x: "30%",
        delay: .4,
        opacity: 0,
        ease: Expo.easeInOut
    }),
    gsap.from("header", {
        y: "-50%",
        delay: -1,
        duration: 1,
        opacity: 0,
        ease: Expo.easeInOut
    })
}
function afterloadermobile() {
    gsap.from(".offer__img", 1.2, {
        delay: .5,
        opacity: 0,
        y: "20%",
        ease: Expo.easeInOut
    }),
    gsap.from(".offer h1", 2, {
        delay: .1,
        opacity: 0,
        ease: Expo.easeInOut
    }),
    gsap.from(".offer p", 2, {
        delay: .2,
        opacity: 0,
        ease: Expo.easeInOut
    }),
    gsap.from(".cta", 2, {
        delay: .3,
        opacity: 0,
        ease: Expo.easeInOut
    })
}
document.body.onload = function() {
    setTimeout(function() {
        var e = document.getElementById("page-preloader");
        e.classList.contains("done") || (e.classList.add("done"),
        $("body").css("overflow", "auto"),
        setTimeout(function() {
            $(".done").detach()
        }, 500),
        ($(window).width() < 640 ? afterloadermobile : afterloader)())
    }, 4e3)
}
,
$(window).width() < 620 && $(".arrow, .feedback__item").detach(),
$(document).ready(function() {
    $(".slider").slick({
        centerMode: !1,
        centerPadding: "60px",
        slidesToShow: 5,
        responsive: [{
            breakpoint: 1921,
            settings: {
                arrows: !0,
                centerMode: !0,
                centerPadding: "40px",
                slidesToShow: 3
            }
        }, {
            breakpoint: 1e3,
            settings: {
                arrows: !0,
                centerMode: !0,
                centerPadding: "40px",
                slidesToShow: 3
            }
        }, {
            breakpoint: 769,
            settings: {
                arrows: !0,
                centerMode: !0,
                centerPadding: "40px",
                slidesToShow: 1
            }
        }]
    })
}),
$(document).ready(function() {
    $(".arrow").click(function() {
        $(".map__info").toggleClass("mobile__map")
    }),
    $(".mobile__bot").click(function() {
        $("header .mainmenu").toggleClass("mobile__menu"),
        $(".mobile__bot__top").toggleClass("mobile__bot__top__active"),
        $(".mobile__bot__bot").toggleClass("mobile__bot__bot__active"),
        $(".header__logo").css({
            "z-index": "1000"
        })
    }),
    $("#feedback").click(function() {
        $(".feedback__over").css({
            left: "0"
        }),
        $(".feedback__form").css({
            right: "-50%"
        })
    }),
    $("#contact").click(function() {
        $(".feedback__form").css({
            right: "0"
        }),
        $(".feedback__over").css({
            left: "-50%"
        })
    })
}),
$(document).ready(function() {
    var e = $("html, body");
    $('a[href*="#"]').click(function() {
        return e.animate({
            scrollTop: $($.attr(this, "href")).offset().top
        }, 1e3),
        !1
    }),
    $(".bot__top").click(function() {
        return e.animate({
            scrollTop: 0
        }, "slow"),
        !1
    })
}),
$(document).ready(function() {
    $(window).width(),
    $(".hero").mousemove(function(e) {
        var o = .01 * ($(window).width() / 2 - e.pageX)
          , e = .02 * ($(window).width() / 2 - e.pageX);
        $(".hero .offer").css("transform", "translate(" + e + "px, 0px)"),
        $(".hero .offer__img").css("transform", "translate(" + o + "px,0px)")
    }),
    $(".repairs").mousemove(function(e) {
        var o = .01 * ($(window).width() / 2 - e.pageX);
        $(window).width(),
        e.pageX,
        $(".repear__nav__img").css("transform", "translate(" + o + "px,0px)")
    })
}),
$(window).scroll(function() {
    var e = $(window).scrollTop() / 2
      , o = $(window).scrollTop();
    $(".blog__title img").css("top", "calc(50% + " + e + "px)"),
    $(".blog__title h1").css("top", "calc(50% + " + o + "px)")
}),
$(window).scroll(function() {
    50 < $(window).scrollTop() ? $("header").addClass("scroll") : $("header").removeClass("scroll")
}),
$(document).ready(function() {
    $(".prog__item__count").each(function() {
        $(this).prop("Counter", 0).animate({
            Counter: $(this).text()
        }, {
            duration: 8e3,
            easing: "swing",
            step: function(e) {
                $(this).text(Math.ceil(e))
            }
        })
    })
}),
$(document).ready(function() {
    $("body").on("click", "#modal", function() {
        $(".modal").fadeIn(300),
        $(".modal__overlay").fadeIn(300),
        $("body").css("overflow", "hidden")
    }),
    $(".cross, .modal__overlay").click(function() {
        $(".modal").fadeOut(300),
        $(".modal__overlay").fadeOut(300),
        $("body").css("overflow", "auto")
    })
}),
$(document).ready(function() {
    var e = $(this).scrollTop()
      , o = $(this).outerHeight()
      , t = $(".come");
    $(".hero"),
    $(t).offset().top,
    $(window).scroll(function(e) {})
});

  