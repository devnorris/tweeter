
$(document).ready(function () {

  $('.error-message').hide();

    // Function to check if input text is "" or over 140
    function checkData(data) {
    data = data.replace("text=", "");
      if (!data) {
        $('.error-message')
        .text('Can not post an empty tweet.')
        .slideDown();
        return false;
      } else if (data.length > 140) {
        $('.error-message')
        .text('You have exceeded your character limit.')
        .slideDown();
        return false;
      } else {
        return true;
      }
    }


  // Slides error message up once click in text area
  $('.new-tweet textarea').on('focus', function() {
    $('.error-message')
    .slideUp();
  });


  // Slide Toggles the new tweet box when compose button is clicked
  $('.right-side').on('click', function() {
    $('.new-tweet').slideToggle()
    .find('textarea').focus();
  });


    // Creates new tweet and appends it to article
    const createTweetElement = tweet => {
      let $article = $("<article>").addClass('tweet');

      let $header = $('<header>').appendTo($article);

      let $divLeft = $('<div>').addClass('left').appendTo($header);
      $('<img>').addClass('avatar').attr('src', tweet.user.avatars.small).appendTo($divLeft)
      $('<p>').text(tweet.user.name).appendTo($divLeft)
      $('<div>').addClass('right').text(tweet.user.handle).appendTo($header)

      $('<div>').addClass('text').text(tweet.content.text).appendTo($article)

      let $footer = $('<footer>').appendTo($article);
      let $bottomLeft = $('<div>').addClass('bottom-left').appendTo($footer);
      let $bottomRight = $('<div>').addClass('bottom-right').appendTo($footer);


      $('<p>').text(moment.utc(tweet.created_at).fromNow()).appendTo($bottomLeft)
      $('<i>').addClass("fas fa-flag").appendTo($bottomRight)
      $('<i>').addClass("fas fa-retweet").appendTo($bottomRight)
      $('<i>').addClass("fas fa-heart").appendTo($bottomRight)

      return $article;
    };

    // appends tweets to feed
    const renderTweets = tweets => {
     $('.tweetsContainer').empty();
      for (let tweetIndex = tweets.length - 1 ; tweetIndex >= 0 ; tweetIndex--) {
       createTweetElement(tweets[tweetIndex]).appendTo('.tweetsContainer');
      }
    };

    let loadTweets = () => {
       $.ajax (
                {
                  url : '/tweets',
                  method: 'GET',
                  success: function(result) {
                    renderTweets(result);
                  }
                }
              );
            };


    // Loads tweets to feed
    loadTweets();


      $("form").on('submit', function(event) {
        const formData = $('form').serialize()
        event.preventDefault();
          if (checkData($('form').serialize())) {
          $.ajax(    // ajax request to post tweet
            {
              url : '/tweets',
              method: 'POST',
              data: formData,
              success: function(result) {
                $('.tweetsContainer').prepend(createTweetElement(result)) // adds new tweet to top upon success
                $('.new-tweet textarea').val(""); // clears text upon success
                $('.counter').text(140); // resets counter upon success
              },
              error: function(error) {
                console.error('There was a problem while posting to the server.')
              }
            }
          );
          $("form").trigger("reset");
        }
      });

});

