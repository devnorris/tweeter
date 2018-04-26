$(document).ready(function() {
  $('textarea').on("keyup", function () {
    let remainder = 140 - $(this).val().length;
    let numCount =  $(this).siblings('.counter').text(remainder);
      if (remainder < 0) {
        $(this).siblings('.counter').css('color', 'red')
      } else {
      $(this).siblings('.counter').css('color', 'black');
      }
  });
});