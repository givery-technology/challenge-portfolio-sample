/*-----------------------------------------------------------------------------------
/*
/* Init JS
/*
-----------------------------------------------------------------------------------*/

 jQuery(document).ready(function($) {

/*----------------------------------------------------*/
/* FitText Settings
------------------------------------------------------ */

    setTimeout(function() {
     $('h1.responsive-headline').fitText(1, { minFontSize: '40px', maxFontSize: '90px' });
   }, 100);


/*----------------------------------------------------*/
/* Smooth Scrolling
------------------------------------------------------ */

   $('.smoothscroll').on('click',function (e) {
      e.preventDefault();

      var target = this.hash,
      $target = $(target);

      $('html, body').stop().animate({
          'scrollTop': $target.offset().top
      }, 800, 'swing', function () {
          window.location.hash = target;
      });
  });


/*----------------------------------------------------*/
/* Highlight the current section in the navigation bar
------------------------------------------------------*/

  var sections = $("section");
  var navigation_links = $("#nav-wrap a");

  sections.waypoint({

      handler: function(event, direction) {

       var active_section;

      active_section = $(this);
      if (direction === "up") active_section = active_section.prev();

      var active_link = $('#nav-wrap a[href="#' + active_section.attr("id") + '"]');

         navigation_links.parent().removeClass("current");
      active_link.parent().addClass("current");

    },
    offset: '35%'

  });


/*----------------------------------------------------*/
/*  Make sure that #header-background-image height is
/* equal to the browser height.
------------------------------------------------------ */

   $('header').css({ 'height': $(window).height() });
   $(window).on('resize', function() {

        $('header').css({ 'height': $(window).height() });
        $('body').css({ 'width': $(window).width() })
   });


/*----------------------------------------------------*/
/*  Fade In/Out Primary Navigation
------------------------------------------------------*/

   $(window).on('scroll', function() {

    var h = $('header').height();
    var y = $(window).scrollTop();
      var nav = $('#nav-wrap');

     if ( (y > h*.20) && (y < h) && ($(window).outerWidth() > 768 ) ) {
        nav.fadeOut('fast');
     }
      else {
         if (y < h*.20) {
            nav.removeClass('opaque').fadeIn('fast');
         }
         else {
            nav.addClass('opaque').fadeIn('fast');
         }
      }

  });

/*----------------------------------------------------*/
/*  Create Image Modal
------------------------------------------------------*/
  $.get("api/projects", function(data) {
    
    console.log(data);   
    var items = data.map(function (item) {
      
    console.log(item);
    var div1 = $("<div/>").addClass("columns portfolio-item"),
        div2 = $("<div/>").addClass("item-wrap"),
        div3 = $("<div/>").addClass("overlay"),
        div4 = $("<div/>").addClass("portfolio-item-meta"),
        div5 = $("<div/>").addClass("link-icon"),
        newi = $("<i>").addClass("icon-plus"),
        newa1 = $("<a href='#modal' title=''/>"); 

      var newimg  = $("<img>"),
        newh4     = $("<h4/>").text(item.title),
        newp      = $("<p/>").text(item.description);

      newimg.attr("src", item.imageUrl);

      var overlay = div3.append(div4.append(newh4, newp));

      var link    = div5.append(newi);

      var html = div1.append(div2.append(newa1.append(newimg, overlay, link)));

      var mdiv1   = $("<div id='modal'/>").addClass("popup-modal mfp-hide"),
          mimg    = $("<img>").addClass('scale-with-grid'),
          mdiv2   = $("<div/>").addClass("description-box"),
          mspan1  = $("<span/>").addClass("categories"),
          mi1     = $("<i/>").addClass("fa fa-tag"),
          mdiv3   = $("<div/>").addClass("link-box"),
          ma1     = $("<a/>").text("Details"),
          ma2     = $("<a/>").addClass("popup-modal-dismiss").text("Close"),
          mh5     = $("<h5/>").text(item.title),
          mp      = $("<p/>") .text(item.description);

      mimg.attr("src", item.imageUrl);
      mspan1.text("Branding, Webdesign");
      ma1.attr("href", item.url);

      var mhtml = mdiv1.append(mimg, mdiv2.append(mh5, mp, mspan1.append(mi1)), mdiv3.append(ma1, ma2));

      return mhtml.add(html);
    });

    $( "#project-list" ).append(items);
    /*----------------------------------------------------*/
    /*  Modal Popup
    ------------------------------------------------------*/

    $.each(items, function() {
      $('.item-wrap a').magnificPopup({

         type:'inline',
         fixedContentPos: false,
         removalDelay: 200,
         showCloseBtn: false,
         mainClass: 'mfp-fade'

      });

      $(document).on('click', '.popup-modal-dismiss', function (e) {
          e.preventDefault();
          $.magnificPopup.close();
      });
    });
  });

/*----------------------------------------------------*/
/*  Flexslider
/*----------------------------------------------------*/
   $('.flexslider').flexslider({
      namespace: "flex-",
      controlsContainer: ".flex-container",
      animation: 'slide',
      controlNav: true,
      directionNav: false,
      smoothHeight: true,
      slideshowSpeed: 7000,
      animationSpeed: 600,
      randomize: false,
   });

});
