(function ($) {
  "use strict";
  // ready? .. set, go!

  var transitionend = "webkitTransitionEnd transitionend";
  var slots = [
    [0, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    [0, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    [0, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    [0, 9, 8, 7, 6, 5, 4, 3, 2, 1]
  ];
  var credits = 5;
  var points = 0;
  var spin = [0, 0, 0, 0];
  var result = [];
  var rotateTimer;
  var count = 0;
  var allowPlay = true;

  var addPoints = function (el, incrementPoints) {
    var currentPoints = points;
    points += incrementPoints;
    el.animate({
      points: incrementPoints
    }, {
      duration: 400 + incrementPoints,
      step: function (now) {
        $(this).html(parseInt(currentPoints + now, 10));
      },
      complete: function () {
        $(this).html(points);
      }
    });
  };

  var endSpin = function (el, match, pointCount, creditCount) {
    var ended = 0;
    var matches = 1;
    allowPlay = false;
    credits--;
    if(match[0] === match[1]) {
      matches++;
      if(match[0] === match[2]) {
        matches++;
        if(match[0] === match[3]) {
          matches++;
        }
      }
    }
    creditCount.html(credits);
    el.on(transitionend, function () {
      allowPlay = true;
      ended++;
      if(ended === 4) {
        var winPoints = matches * 100;
        points += winPoints;
        if(winPoints > 0) {
          addPoints(pointCount, winPoints);
        }
      }
    });
  };

  $(function () {
    var frame = $('#page');
    var winBox = $('#win');
    var creditBox = $('#credits');
    var play = $('#play');
    var wheels = $('.wheel');
    creditBox.html(credits);

    var rotation = $('#rotation');
    var perspective = $('#perspective');
    frame.addClass('turn-360');
    setTimeout(function () {
      frame.removeClass('turn-360');
    }, 3600);
    rotation.on('change', function () {
      var degree = $(this).val();
      var view = perspective.val();
      frame.css({
        MozTransform: 'perspective(' + view + ') rotateY(' + degree + 'deg) translate3d(0,0,0)',
        WebkitTransform: 'perspective(' + view + ') rotateY(' + degree + 'deg) translate3d(0,0,0)'
      });
    });
    perspective.on('change', function () {
      var degree = rotation.val();
      var view = $(this).val();
      frame.css({
        MozTransform: 'perspective(' + view + ') rotateY(' + degree + 'deg) translate3d(0,0,0)',
        WebkitTransform: 'perspective(' + view + ') rotateY(' + degree + 'deg) translate3d(0,0,0)'
      });
    });

    wheels.each(function () {
      var $this = $(this);
      var zero = 0;
      var index = $this.index();
      var spinPlus = 0;

      play.on('click', function () {
        if(credits > 0 && allowPlay) {
          var type = parseInt((Math.random() * 9), 10);
          var duration = parseInt((Math.random() * 10000), 10);
          if(duration < 1000) {
            duration *= 10;
          }
          if(duration < 5000) {
            duration += 5000;
          }
          spinPlus += 3600;
          var rotateWheel = (type + 1) * 36 + spinPlus;
          console.log((10-type) % 10);
          if(zero < 1) {
            duration = 0;
            zero += 1;
          }
          else {
            result.push(slots[index][type]);
            count++;
            if(count === 4) {
              endSpin(wheels, result, winBox, creditBox);
              count = 0;
              result = [];
            }
          }
          $this.css({
            MozTransitionDuration: duration + 'ms',
            WebkitTransitionDuration: duration + 'ms',
            MozTransform: 'rotateX(-' + rotateWheel + 'deg)',
            WebkitTransform: 'rotateX(-' + rotateWheel + 'deg)'
          });
        }
      });
    });

    play.trigger('click');
    setInterval(function () {
      if(creditBox.css("visibility") === "visible") {
        creditBox.css('visibility', 'hidden');
      }
      else {
        creditBox.css('visibility', 'visible');
      }
    }, 500);
  });
}(jQuery));
