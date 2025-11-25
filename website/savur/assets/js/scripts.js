/*-----------------------------------------------------------------------------------

    Theme Name: GeekFolio
    Theme URI: http://
    Description: Creative Agency & Portfolio
    Author: UI-ThemeZ
    Author URI: http://themeforest.net/user/UI-ThemeZ
    Version: 1.0

-----------------------------------------------------------------------------------*/


jQuery(function () {

    "use strict";

    var wind = jQuery(window);


    /* =============================================================================
    -----------------------------  Smooth Scroll nav   -----------------------------
    ============================================================================= */


    $.scrollIt({
        upKey: 38,                // key code to navigate to the next section
        downKey: 40,              // key code to navigate to the previous section
        easing: 'linear',          // the easing function for animation
        scrollTime: 600,          // how long (in ms) the animation takes
        activeClass: 'active',    // class given to the active nav element
        onPageChange: null,       // function(pageIndex) that is called when page is changed
        topOffset: -75            // offste (in px) for fixed top navigation
    });


    /* =============================================================================
    --------------------------------  Navbar Menu   --------------------------------
    ============================================================================= */

    jQuery('.navbar .dropdown').hover(function () {
        jQuery(this).find('.dropdown-menu').addClass('show');
    }, function () {
        jQuery(this).find('.dropdown-menu').removeClass('show')
    });

    jQuery('.navbar .dropdown-item').hover(function () {
        jQuery(this).find('.dropdown-side').addClass('show');
    }, function () {
        jQuery(this).find('.dropdown-side').removeClass('show')
    });

    jQuery(".navbar .search-form").on("click", ".search-icon", function () {

        jQuery(".navbar .search-form").toggleClass("open");

        if (jQuery(".navbar .search-form").hasClass('open')) {

            jQuery(".search-form .close-search").slideDown();

        } else {

            jQuery(".search-form .close-search").slideUp();
        }
    });

    jQuery(".navbar").on("click", ".navbar-toggler", function () {

        jQuery(".navbar .navbar-collapse").toggleClass("show");
    });

    wind.on("scroll", function () {

        var bodyScroll = wind.scrollTop(),
            navbar = jQuery(".navbar"),
            logo = jQuery(".navbar.change .logo> img");

        if (bodyScroll > 300) {

            navbar.addClass("nav-scroll");
            logo.attr('src', 'assets/imgs/logo-dark.png');

        } else {

            navbar.removeClass("nav-scroll");
            logo.attr('src', 'assets/imgs/logo-light.png');
        }
    });

    function noScroll() {
        window.scrollTo(0, 0);
    }

    jQuery('.navbar .menu-icon').on('click', function () {

        jQuery('.hamenu').addClass("open");

        jQuery('.hamenu').animate({ left: 0 });

    });

    jQuery('.hamenu .close-menu, .one-scroll .menu-links .main-menu > li').on('click', function () {

        jQuery('.hamenu').removeClass("open").delay(300).animate({ left: "-100%" });
        jQuery('.hamenu .menu-links .main-menu .dmenu, .hamenu .menu-links .main-menu .sub-dmenu').removeClass("dopen");
        jQuery('.hamenu .menu-links .main-menu .sub-menu, .hamenu .menu-links .main-menu .sub-menu2').slideUp();

    });

    jQuery('.hamenu .menu-links .main-menu > li').on('mouseenter', function () {
        jQuery(this).removeClass('hoverd').siblings().addClass('hoverd');
    });

    jQuery('.hamenu .menu-links .main-menu > li').on('mouseleave', function () {
        jQuery(this).removeClass('hoverd').siblings().removeClass('hoverd');
    });


    jQuery('.main-menu > li .dmenu').on('click', function () {
        jQuery(this).parent().parent().find(".sub-menu").toggleClass("sub-open").slideToggle();
        jQuery(this).toggleClass("dopen");
    });

    jQuery('.sub-menu > ul > li .sub-dmenu').on('click', function () {
        jQuery(this).parent().parent().find(".sub-menu2").toggleClass("sub-open").slideToggle();
        jQuery(this).toggleClass("dopen");
    });

    /* =============================================================================
    ------------------------------  Parallax Swiper   ------------------------------
    ============================================================================= */


    var parallaxSlider;
    var parallaxSliderOptions = {
        speed: 1500,
        autoplay: {
            delay: 5000,
        },
        parallax: true,
        loop: true,

        on: {
            init: function () {
                var swiper = this;
                for (var i = 0; i < swiper.slides.length; i++) {
                    jQuery(swiper.slides[i])
                        .find('.bg-img')
                        .attr({
                            'data-swiper-parallax': 0.75 * swiper.width
                        });
                }
            },
            resize: function () {
                this.update();
            }
        },

        pagination: {
            el: '.slider-prlx .swiper-pagination',
            type: 'fraction',
            clickable: true
        },

        navigation: {
            nextEl: '.slider-prlx .swiper-button-next',
            prevEl: '.slider-prlx .swiper-button-prev'
        }
    };
    parallaxSlider = new Swiper('.slider-prlx .parallax-slider', parallaxSliderOptions);

    var parallaxShowCase;
    var parallaxShowCaseOptions = {
        speed: 1500,
        autoplay: {
            delay: 5000,
        },
        parallax: true,
        mousewheel: true,
        loop: true,

        on: {
            init: function () {
                var swiper = this;
                for (var i = 0; i < swiper.slides.length; i++) {
                    jQuery(swiper.slides[i])
                        .find('.bg-img')
                        .attr({
                            'data-swiper-parallax': 0.75 * swiper.width
                        });
                }
            },
            resize: function () {
                this.update();
            }
        },

        pagination: {
            el: '.full-showcase .parallax-slider .swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '">' + '<svg class="fp-arc-loader" width="16" height="16" viewBox="0 0 16 16">' +
                    '<circle class="path" cx="8" cy="8" r="5.5" fill="none" transform="rotate(-90 8 8)" stroke="#FFF"' +
                    'stroke-opacity="1" stroke-width="1px"></circle>' +
                    '<circle cx="8" cy="8" r="3" fill="#FFF"></circle>' +
                    '</svg></span>';
            },

        },

        navigation: {
            nextEl: '.full-showcase .parallax-slider .swiper-button-next',
            prevEl: '.full-showcase .parallax-slider .swiper-button-prev'
        }
    };
    parallaxShowCase = new Swiper('.full-showcase .parallax-slider', parallaxShowCaseOptions);


    /* ===============================  Carousel slider  =============================== */

    var galleryText = new Swiper('.carousel-slider .gallery-text .swiper-container', {
        spaceBetween: 30,
        slidesPerView: 1,
        direction: 'vertical',
        loop: true,
        loopedSlides: 4,
        touchRatio: 0.2,
        slideToClickedSlide: true,
        mousewheel: true,
        speed: 1500,
    });

    var galleryImg = new Swiper('.carousel-slider .gallery-img .swiper-container', {
        spaceBetween: 80,
        slidesPerView: 2,
        centeredSlides: true,
        loop: true,
        loopedSlides: 4,
        mousewheel: true,
        speed: 1500,
        navigation: {
            nextEl: '.carousel-slider .swiper-controls .swiper-button-next',
            prevEl: '.carousel-slider .swiper-controls .swiper-button-prev',
        },
        pagination: {
            el: '.carousel-slider .swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '">' + '<svg class="fp-arc-loader" width="16" height="16" viewBox="0 0 16 16">' +
                    '<circle class="path" cx="8" cy="8" r="5.5" fill="none" transform="rotate(-90 8 8)" stroke="#FFF"' +
                    'stroke-opacity="1" stroke-width="1px"></circle>' +
                    '<circle cx="8" cy="8" r="3" fill="#FFF"></circle>' +
                    '</svg></span>';
            },

        },
        keyboard: {
            enabled: true,
        },

        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 30,
            },
            640: {
                slidesPerView: 1,
                spaceBetween: 30,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 40,
            },
            1024: {
                slidesPerView: 2,
            },
        }
    });

    galleryImg.on("slideChangeTransitionStart", function () {
        galleryText.slideTo(galleryImg.activeIndex);
    });
    galleryText.on("transitionStart", function () {
        galleryImg.slideTo(galleryText.activeIndex);
    });


    /* ===============================  half slider  =============================== */

    var halfText = new Swiper('.half-slider .gallery-text .swiper-container', {
        spaceBetween: 100,
        centeredSlides: true,
        slidesPerView: 2,
        touchRatio: 0.2,
        slideToClickedSlide: true,
        loopedSlides: 4,
        mousewheel: true,
        speed: 1500,
        breakpoints: {
            0: {
                spaceBetween: 10,
                slidesPerView: 1,
                centeredSlides: false,
            },
            640: {
                spaceBetween: 30,
                slidesPerView: 1,
                centeredSlides: false,
            },
            768: {
                spaceBetween: 50,
                slidesPerView: 1,
                centeredSlides: false,
            },
            1024: {
                spaceBetween: 100,
                slidesPerView: 2,
                centeredSlides: true,
            },
        }
    });

    var halfImg = new Swiper('.half-slider .gallery-img .swiper-container', {
        spaceBetween: 0,
        centeredSlides: true,
        loopedSlides: 4,
        mousewheel: true,
        speed: 1500,
        navigation: {
            nextEl: '.half-slider .swiper-controls .swiper-button-next',
            prevEl: '.half-slider .swiper-controls .swiper-button-prev',
        },
        pagination: {
            el: '.half-slider .swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '">' + '<svg class="fp-arc-loader" width="16" height="16" viewBox="0 0 16 16">' +
                    '<circle class="path" cx="8" cy="8" r="5.5" fill="none" transform="rotate(-90 8 8)" stroke="#FFF"' +
                    'stroke-opacity="1" stroke-width="1px"></circle>' +
                    '<circle cx="8" cy="8" r="3" fill="#FFF"></circle>' +
                    '</svg></span>';
            },

        },
        keyboard: {
            enabled: true,
        },
        thumbs: {
            swiper: halfText
        },
    });

    halfImg.on("slideChangeTransitionStart", function () {
        halfText.slideTo(halfImg.activeIndex);
    });
    halfText.on("transitionStart", function () {
        halfImg.slideTo(halfText.activeIndex);
    });


    /* ===============================  crev slider  =============================== */

    var galleryTextCrev = new Swiper('.crev-slider .gallery-text .swiper-container', {
        spaceBetween: 30,
        slidesPerView: 1,
        loop: true,
        speed: 1500,
        navigation: {
            nextEl: '.crev-slider .swiper-controls .swiper-button-next',
            prevEl: '.crev-slider .swiper-controls .swiper-button-prev',
        },
        pagination: {
            el: ".crev-slider .swiper-pagination",
            type: "fraction",
        },
    });

    var galleryImgCrev = new Swiper('.crev-slider .gallery-img .swiper-container', {
        spaceBetween: 30,
        slidesPerView: 1,
        effect: 'fade',
        loop: true,
        speed: 1500,
    });

    galleryImgCrev.on("slideChangeTransitionStart", function () {
        galleryTextCrev.slideTo(galleryImgCrev.activeIndex);
    });
    galleryTextCrev.on("transitionStart", function () {
        galleryImgCrev.slideTo(galleryTextCrev.activeIndex);
    });


    /* =============================================================================
    ------------------------------  Interactive work   -----------------------------
    ============================================================================= */

    jQuery('.inter-links-center .links-text li').on('mouseenter', function () {
        var tab_id = jQuery(this).attr('data-tab');
        jQuery('.links-text li').removeClass('current');
        jQuery(this).addClass('current');

        jQuery('.links-img .img').removeClass('current');
        jQuery("#" + tab_id).addClass('current');

        if (jQuery(this).hasClass('current')) {
            return false;
        }
    });

    jQuery('.inter-links-center .links-text li').on('mouseleave', function () {
        jQuery('.links-text li').removeClass('current');
        jQuery('.links-img .img').removeClass('current');
    });


    jQuery('.inter-links-center .links-text li').on('mouseenter', function () {
        jQuery(this).removeClass('no-active').siblings().addClass('no-active');
    });

    jQuery('.inter-links-center .links-text li').on('mouseleave', function () {
        jQuery('.inter-links-center .links-text li').removeClass('no-active');
    });


    /* =============================================================================
    ------------------------------  Data Background   ------------------------------
    ============================================================================= */

    var pageSection = jQuery(".bg-img, section");
    pageSection.each(function (indx) {

        if (jQuery(this).attr("data-background")) {
            jQuery(this).css("background-image", "url(" + jQuery(this).data("background") + ")");
        }
    });

    var pageSectionColor = jQuery(".bg-solid-color, section");
    pageSectionColor.each(function (indx) {

        var color = jQuery(this).attr("data-solid-color");

        if (jQuery(this).attr("data-solid-color")) {
            jQuery(this).css("background-color", color);
        }
    });


    /* =============================================================================
    ------------------------------  Interactive work   -----------------------------
    ============================================================================= */

    jQuery('.inter-fixed-text .links-img .img').on('mouseenter', function () {
        var tab_id = jQuery(this).attr('data-tab');
        jQuery('.links-img .img').removeClass('current');
        jQuery(this).addClass('current');

        jQuery('.links-text li').removeClass('current');
        jQuery("#" + tab_id).addClass('current');

        if (jQuery(this).hasClass('current')) {
            return false;
        }
    });

    jQuery('.inter-fixed-text .links-img .img').on('mouseleave', function () {
        jQuery('.links-text li').removeClass('current');
        jQuery('.links-img .img').removeClass('current');
    });


    /* =============================================================================
    -----------------------------------  Tabs  -------------------------------------
    ============================================================================= */

    jQuery('#tabs .tab-links').on('click', '.item-link', function () {

        var tab_id = jQuery(this).attr('data-tab');

        jQuery('#tabs .tab-links .item-link').removeClass('current');
        jQuery(this).addClass('current');

        jQuery('.tab-content').hide();
        jQuery("#" + tab_id).show();

    });

    jQuery('#tabs-fade .tab-links').on('click', '.item-link', function () {

        var tab2_id = jQuery(this).attr('data-tab');

        jQuery('#tabs-fade .tab-links .item-link').removeClass('current');
        jQuery(this).addClass('current');

        jQuery('.tab-content').fadeOut();
        jQuery("#" + tab2_id).fadeIn();

    });


    /* ===============================  Work Tabs  =============================== */

    jQuery('.portfolio-tab .cluom').on('mouseenter', function () {
        var tab_id = jQuery(this).attr('data-tab');
        jQuery('.portfolio-tab .cluom').removeClass('current');
        jQuery(this).addClass('current');

        jQuery('.portfolio-tab .glry-img .tab-img ').removeClass('current');
        jQuery("#" + tab_id).addClass('current');

        if (jQuery(this).hasClass('current')) {
            return false;
        }
    });


    /* ===============================  Team Tabs  =============================== */

    jQuery('.team-tab .cluom').on('mouseenter', function () {
        var tab_id = jQuery(this).attr('data-tab');
        jQuery('.team-tab .cluom').removeClass('current');
        jQuery(this).addClass('current');

        jQuery('.team-tab .glry-img .tab-img ').removeClass('current');
        jQuery("#" + tab_id).addClass('current');

        if (jQuery(this).hasClass('current')) {
            return false;
        }
    });


    /* =============================================================================
    --------------------------------  Accordion  -----------------------------------
    ============================================================================= */

    jQuery(".accordion").on("click", ".title", function () {

        jQuery(this).next().slideDown();

        jQuery(".accordion-info").not(jQuery(this).next()).slideUp();

    });

    jQuery(".accordion").on("click", ".item", function () {

        jQuery(this).addClass("active").siblings().removeClass("active");

    });


    /* =============================================================================
    ---------------------------------  Tolltip  ------------------------------------
    ============================================================================= */

    jQuery('[data-tooltip-tit]').hover(function () {
        jQuery('<div class="div-tooltip-tit"></div>').text(jQuery(this).attr('data-tooltip-tit')).appendTo('body').fadeIn();
    }, function () {
        jQuery('.div-tooltip-tit').remove();
    }).mousemove(function (e) {
        jQuery('.div-tooltip-tit').css({ top: e.pageY + 10, left: e.pageX + 20 })
    });

    jQuery('[data-tooltip-sub]').hover(function () {
        jQuery('<div class="div-tooltip-sub"></div>').text(jQuery(this).attr('data-tooltip-sub')).appendTo('body').fadeIn();
    }, function () {
        jQuery('.div-tooltip-sub').remove();
    }).mousemove(function (e) {
        jQuery('.div-tooltip-sub').css({ top: e.pageY + (-20), left: e.pageX + 30 })
    });


    /* =============================================================================
    -------------------------------  Progress Bar  ---------------------------------
    ============================================================================= */

    wind.on('scroll', function () {
        jQuery(".skill-progress .progres").each(function () {
            var bottom_of_object =
                jQuery(this).offset().top + jQuery(this).outerHeight();
            var bottom_of_window =
                jQuery(window).scrollTop() + jQuery(window).height();
            var myVal = jQuery(this).attr('data-value');
            if (bottom_of_window > bottom_of_object) {
                jQuery(this).css({
                    width: myVal
                });
            }
        });
    });


    /* =============================================================================
    ------------------------------  Parallax Items   -----------------------------
    ============================================================================= */

    // Get the target elements
    const parallaxTargets = document.querySelectorAll('.parallax');

    // Get the mouse position
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', function (event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    // Update the target elements' position on each animation frame
    let rafId = null;
    function updateParallax() {
        // Loop through each target element
        parallaxTargets.forEach(target => {
            // Get the target's speed
            let speed = target.dataset.speed;

            // Calculate the new position based on the mouse position and speed
            let x = (window.innerWidth / 2 - mouseX) * speed;
            let y = (window.innerHeight / 2 - mouseY) * speed;
            target.style.transform = `translate3d(${x / 10}rem, ${y / 10}rem, 0)`;
        });

        // Schedule the next animation frame
        rafId = requestAnimationFrame(updateParallax);
    }

    // Start the parallax animation
    updateParallax();


    /* =============================================================================
    -----------------------------  Trigger Plugins  --------------------------------
    ============================================================================= */


    /* ========== Sticky ========== */

    jQuery(".sticky-item").stick_in_parent();


    /* ========== YouTubePopUp ========== */

    jQuery("a.vid").YouTubePopUp();


    /* ========== parallaxie ========== */

    jQuery('.parallaxie').parallaxie({
        speed: 0.8,
        size: "cover"
    });


    /* ========== paroller ========== */

    jQuery('.my-paroller').paroller();


    /* ========== magnificPopup ========== */

    jQuery('.popup-img , .gallery').magnificPopup({
        delegate: '.popimg',
        type: 'image',
        gallery: {
            enabled: true
        }
    });


    /* =========== justifiedGallery =========== */

    jQuery('.justified-gallery').justifiedGallery({
        rowHeight: 400,
        lastRow: 'nojustify',
        margins: 15
    });


    /* =========== hover3d =========== */

    jQuery(".hover3d").hover3d({
        selector: ".hover3d-child",
        invert: true
    });


    /* ===========  Splitting  =========== */

    Splitting();

});


/* =============================================================================
-----------------------------  cursor Animation  -----------------------------
============================================================================= */

(function () {
    const link = document.querySelectorAll('.hover-this');
    const cursor = document.querySelector('.cursor');
    const animateit = function (e) {
        const hoverAnim = this.querySelector('.hover-anim');
        const { offsetX: x, offsetY: y } = e,
            { offsetWidth: width, offsetHeight: height } = this,
            move = 25,
            xMove = x / width * (move * 2) - move,
            yMove = y / height * (move * 2) - move;
        hoverAnim.style.transform = `translate(${xMove}px, ${yMove}px)`;
        if (e.type === 'mouseleave') hoverAnim.style.transform = '';
    };
    const editCursor = e => {
        const { clientX: x, clientY: y } = e;
        cursor.style.left = x + 'px';
        cursor.style.top = y + 'px';
    };
    link.forEach(b => b.addEventListener('mousemove', animateit));
    link.forEach(b => b.addEventListener('mouseleave', animateit));
    window.addEventListener('mousemove', editCursor);

    jQuery("a, .cursor-pointer").hover(
        function () {
            jQuery(".cursor").addClass("cursor-active");
        }, function () {
            jQuery(".cursor").removeClass("cursor-active");
        }
    );


    /* =============================================================================
    -----------------------------  Text Animation  -----------------------------
    ============================================================================= */


    let elements = document.querySelectorAll(".rolling-text");

    elements.forEach((element) => {
        let innerText = element.innerText;
        element.innerHTML = "";

        let textContainer = document.createElement("div");
        textContainer.classList.add("block");

        for (let letter of innerText) {
            let span = document.createElement("span");
            span.innerText = letter.trim() === "" ? "\xa0" : letter;
            span.classList.add("letter");
            textContainer.appendChild(span);
        }

        element.appendChild(textContainer);
        element.appendChild(textContainer.cloneNode(true));
    });

    elements.forEach((element) => {
        element.addEventListener("mouseover", () => {
            element.classList.remove("play");
        });
    });
})();


/* =============================================================================
////////////////////////////////////////////////////////////////////////////////
============================================================================= */

jQuery(window).on("load", function () {


    /* =============================================================================
    ---------------------------------  Preloader  ----------------------------------
    ============================================================================= */

    var body = jQuery('body');
    body.addClass('loaded');
    setTimeout(function () {
        body.removeClass('loaded');
    }, 1500);


    /* =============================================================================
    ------------------------------  Parallax image  --------------------------------
    ============================================================================= */

    var imageUp = document.getElementsByClassName('thumparallax');
    new simpleParallax(imageUp, {
        delay: 1,
        scale: 1.2
    });

    var imageDown = document.getElementsByClassName('thumparallax-down');
    new simpleParallax(imageDown, {
        orientation: 'down',
        delay: 1,
        scale: 1.2
    });


    /* =============================================================================
    -----------------------------  isotope Masonery   ------------------------------
    ============================================================================= */

    jQuery('.gallery').isotope({
        itemSelector: '.items'
    });

    // isotope
    jQuery('.gallery2').isotope({
        // options
        itemSelector: '.items',
        masonry: {
            // use element for option
            columnWidth: '.width2'
        }
    });

    var $gallery = jQuery('.gallery , .gallery2').isotope();

    jQuery('.filtering').on('click', 'span', function () {
        var filterValue = jQuery(this).attr('data-filter');
        $gallery.isotope({ filter: filterValue });
    });

    jQuery('.filtering').on('click', 'span', function () {
        jQuery(this).addClass('active').siblings().removeClass('active');
    });


    /* =============================================================================
    -----------------------------  Contact Valdition   -----------------------------
    ============================================================================= */

    jQuery('#contact-form').validator();

    jQuery('#contact-form').on('submit', function (e) {
        if (!e.isDefaultPrevented()) {
            var url = "contact.php";

            $.ajax({
                type: "POST",
                url: url,
                data: jQuery(this).serialize(),
                success: function (data) {
                    var messageAlert = 'alert-' + data.type;
                    var messageText = data.message;

                    var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';
                    if (messageAlert && messageText) {
                        jQuery('#contact-form').find('.messages').html(alertBox);
                        jQuery('#contact-form')[0].reset();
                    }
                }
            });
            return false;
        }
    });

});


/* =============================================================================
-----------------------------  Button scroll up   ------------------------------
============================================================================= */

jQuery(document).ready(function () {

    "use strict";

    var progressPath = document.querySelector('.progress-wrap path');
    var pathLength = progressPath.getTotalLength();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
    progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
    var updateProgress = function () {
        var scroll = jQuery(window).scrollTop();
        var height = jQuery(document).height() - jQuery(window).height();
        var progress = pathLength - (scroll * pathLength / height);
        progressPath.style.strokeDashoffset = progress;
    }
    updateProgress();
    jQuery(window).scroll(updateProgress);
    var offset = 150;
    var duration = 550;
    jQuery(window).on('scroll', function () {
        if (jQuery(this).scrollTop() > offset) {
            jQuery('.progress-wrap').addClass('active-progress');
        } else {
            jQuery('.progress-wrap').removeClass('active-progress');
        }
    });
    jQuery('.progress-wrap').on('click', function (event) {
        event.preventDefault();
        jQuery('html, body').animate({ scrollTop: 0 }, duration);
        return false;
    })

});


/* =============================================================================
--------------------------------  Fade Header   --------------------------------
============================================================================= */

jQuery(window).scroll(function () {

    var scrolled = jQuery(this).scrollTop();
    jQuery('.fixed-slider .caption').css({
        'transform': 'translate3d(0, ' + -(scrolled * 0.20) + 'px, 0)',
        'opacity': 1 - scrolled / 600
    });

});



/* =============================================================================
-------------------------------  Wow Animation   -------------------------------
============================================================================= */

wow = new WOW({
    animateClass: 'animated',
    offset: 100
});
wow.init();


/* =============================================================================
////////////////////////////////////////////////////////////////////////////////
============================================================================= */

jQuery(function () {


    "use strict";


    /* ===============================  fixed-slider  =============================== */

    var slidHeight = jQuery(".fixed-slider").outerHeight();

    jQuery(".main-content").css({
        marginTop: slidHeight
    });



    /* =============================================================================
    ----------------------------  Swiper Data Controls   ---------------------------
    ============================================================================= */

    jQuery('[data-carousel="swiper"]').each(function () {

        var containe = jQuery(this).find('[data-swiper="container"]').attr('id');
        var pagination = jQuery(this).find('[data-swiper="pagination"]').attr('id');
        var prev = jQuery(this).find('[data-swiper="prev"]').attr('id');
        var next = jQuery(this).find('[data-swiper="next"]').attr('id');
        var items = jQuery(this).data('items');
        var autoplay = jQuery(this).data('autoplay');
        var iSlide = jQuery(this).data('initial');
        var loop = jQuery(this).data('loop');
        var parallax = jQuery(this).data('parallax');
        var space = jQuery(this).data('space');
        var speed = jQuery(this).data('swiper-speed');
        var center = jQuery(this).data('center');
        var effect = jQuery(this).data('effect');
        var direction = jQuery(this).data('direction');
        var mousewheel = jQuery(this).data('mousewheel');

        // Configuration
        var conf = {

        };

        // Responsive
        if (jQuery(this).hasClass('swiper5')) {
            var conf = {

                breakpoints: {
                    0: {
                        slidesPerView: 2,
                    },
                    640: {
                        slidesPerView: 3,
                    },
                    768: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 5,
                    },
                }
            };
        };

        if (jQuery(this).hasClass('swiper4')) {
            var conf = {

                breakpoints: {
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                    },
                    768: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 4,
                    },
                }
            };
        };

        if (jQuery(this).hasClass('serv-swiper')) {
            var conf = {

                breakpoints: {
                    0: {
                        slidesPerView: 1,
                    },
                    640: {
                        slidesPerView: 1,
                    },
                    768: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                },

                navigation: {
                    nextEl: '.services .swiper-button-next',
                    prevEl: '.services .swiper-button-prev'
                }
            };
        };

        if (jQuery(this).hasClass('work-swiper-auto')) {
            var conf = {

                breakpoints: {
                    0: {
                        slidesPerView: 1,
                    },
                    640: {
                        slidesPerView: 1,
                    },
                    768: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: "auto",
                    },
                },

                navigation: {
                    nextEl: '.portfolio-carsouel .swiper-button-next',
                    prevEl: '.portfolio-carsouel .swiper-button-prev'
                }
            };
        };

        if (jQuery(this).hasClass('work-swiper-center')) {
            var conf = {

                breakpoints: {
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 30,
                    },
                    640: {
                        slidesPerView: 1,
                        spaceBetween: 30,
                    },
                    768: {
                        slidesPerView: 1,
                        spaceBetween: 50,
                    },
                    1024: {
                        slidesPerView: 2,
                    },
                },

                pagination: {
                    el: '.portfolio-carsouel .swiper-pagination',
                    clickable: true,
                },

                navigation: {
                    nextEl: '.portfolio-carsouel .swiper-button-next',
                    prevEl: '.portfolio-carsouel .swiper-button-prev'
                },
            };
        };

        if (jQuery(this).hasClass('work-crus5')) {
            var conf = {

                breakpoints: {
                    0: {
                        slidesPerView: 1,
                    },
                    640: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 5,
                    },
                },

                navigation: {
                    nextEl: '.work-carsouel .swiper-button-next',
                    prevEl: '.work-carsouel .swiper-button-prev'
                }
            };
        };

        if (jQuery(this).hasClass('testim-swiper')) {
            var conf = {

                pagination: {
                    el: '.testimonials .swiper-pagination',
                    clickable: true,
                },

                navigation: {
                    nextEl: '.testimonials .swiper-button-next',
                    prevEl: '.testimonials .swiper-button-prev'
                },
            };
        };

        if (jQuery(this).hasClass('testim1')) {
            var conf = {

                pagination: {
                    el: '.testimonials-crev .swiper-pagination',
                    clickable: true,
                },

                navigation: {
                    nextEl: '.testimonials-crev .swiper-button-next',
                    prevEl: '.testimonials-crev .swiper-button-prev'
                },
            };
        };

        if (jQuery(this).hasClass('testim-swiper2')) {
            var conf = {

                breakpoints: {
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 0,
                    },
                    640: {
                        slidesPerView: 1,
                        spaceBetween: 0,
                    },
                    768: {
                        slidesPerView: 1,
                        spaceBetween: 0,
                    },
                    1024: {
                        slidesPerView: 2,
                    },
                },

                pagination: {
                    el: '.testim-swiper2 .swiper-pagination',
                    clickable: true,
                },

                navigation: {
                    nextEl: '.testim-controls .swiper-button-next',
                    prevEl: '.testim-controls .swiper-button-prev'
                },
            };
        };

        if (jQuery(this).hasClass('testim2')) {
            var conf = {

                breakpoints: {
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 0,
                    },
                    640: {
                        slidesPerView: 1,
                        spaceBetween: 0,
                    },
                    768: {
                        slidesPerView: 1,
                        spaceBetween: 0,
                    },
                    1024: {
                        slidesPerView: 2,
                    },
                },

                pagination: {
                    el: '.testim-crev .swiper-pagination',
                    clickable: true,
                },

                navigation: {
                    nextEl: '.testim-crev .swiper-button-next',
                    prevEl: '.testim-crev .swiper-button-prev'
                },
            };
        };

        if (items) {
            conf.slidesPerView = items
        };
        if (autoplay) {
            conf.autoplay = autoplay
        };
        if (iSlide) {
            conf.initialSlide = iSlide
        };
        if (center) {
            conf.centeredSlides = center
        };
        if (loop) {
            conf.loop = loop
        };
        if (parallax) {
            conf.parallax = parallax
        };
        if (space) {
            conf.spaceBetween = space
        };
        if (speed) {
            conf.speed = speed
        };
        if (mousewheel) {
            conf.mousewheel = mousewheel
        };
        if (effect) {
            conf.effect = effect
        };
        if (direction) {
            conf.direction = direction
        };
        if (prev) {
            conf.prevButton = '#' + prev
        };
        if (next) {
            conf.nextButton = '#' + next
        };
        if (pagination) {
            conf.pagination = '#' + pagination,
                conf.paginationClickable = true
        };

        // Initialization
        if (containe) {
            var initID = '#' + containe;
            var init = new Swiper(initID, conf);
        };
    });


    /* =============================================================================
    -------------------------------  Preloader svg   -------------------------------
    ============================================================================= */

    const svg = document.getElementById("svg");
    const tl = gsap.timeline();
    const curve = "M0 502S175 272 500 272s500 230 500 230V0H0Z";
    const flat = "M0 2S175 1 500 1s500 1 500 1V0H0Z";

    tl.to(".loader-wrap-heading .load-text , .loader-wrap-heading .cont", {
        delay: 1.5,
        y: -100,
        opacity: 0,
    });
    tl.to(svg, {
        duration: 0.5,
        attr: { d: curve },
        ease: "power2.easeIn",
    }).to(svg, {
        duration: 0.5,
        attr: { d: flat },
        ease: "power2.easeOut",
    });
    tl.to(".loader-wrap", {
        y: -1500,
    });
    tl.to(".loader-wrap", {
        zIndex: -1,
        display: "none",
    });
    tl.from(
        "header",
        {
            y: 200,
        },
        "-=1.5"
    );
    tl.from(
        "header .container",
        {
            y: 40,
            opacity: 0,
            delay: 0.3,
        },
        "-=1.5"
    );

});



jQuery(function () {
    var width = jQuery(window).width();
    if (width > 991) {

        "use strict";

        var wind = jQuery(window);

        /* =============================================================================
        -------------------------------  Smooth Footer   -------------------------------
        ============================================================================= */

        gsap.set('.footer-container', { yPercent: -50 })
        const uncover = gsap.timeline({ paused: true })
        uncover
            .to('.footer-container', { yPercent: 0, ease: 'none' })
            ;

        ScrollTrigger.create({
            trigger: 'main',
            start: 'bottom bottom',
            end: '+=50%',
            animation: uncover,
            scrub: true,
        });


        /* =============================================================================
        -----------------------------  Portfolio Fixed  --------------------------------
        ============================================================================= */

        wind.on('scroll', function () {
            jQuery(".portfolio-fixed .sub-bg .cont").each(function () {
                var bottom_of_object =
                    jQuery(this).offset().top + jQuery(this).outerHeight();
                var bottom_of_window =
                    jQuery(window).scrollTop() + jQuery(window).height();
                var tab_id = jQuery(this).attr('data-tab');
                if (bottom_of_window > bottom_of_object) {
                    jQuery("#" + tab_id).addClass('current');
                    jQuery(this).addClass('current');
                } else {
                    jQuery("#" + tab_id).removeClass('current');
                    jQuery(this).removeClass('current');
                }
            });
        });
    }
});


jQuery(function () {
    var width = jQuery(window).width();
    if (width < 991) {

        "use strict";

        jQuery(".navbar .navbar-nav").on("click", ".nav-link", function () {

            jQuery(".navbar .navbar-nav .dropdown .dropdown-menu").removeClass("show");

            jQuery(this).parent().find(".dropdown-menu").addClass("show");
        });
    }
});
