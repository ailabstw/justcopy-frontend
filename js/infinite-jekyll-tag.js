$(function() {
  var SITE_URL = window.location.protocol + '//' + window.location.host,
      path = window.location.pathname;
  var loadedPage = 0, postPerPage = 20;
  var numOfPost = $('.list_content section').length;
  var pagesToLoad = 20;
  var isFetchingPosts = false,
      shouldFetchPosts = true,
      loadNewPostsThreshold = 20;
      el = document.createElement('a'),
      el.href = window.location.pathname;  
  // If there's no spinner, it's not a page where posts should be fetched
  if ($(".infinite-spinner").length < 1 || numOfPost > 0 && numOfPost < postPerPage){
    console.log('no infinite');
    shouldFetchPosts = false;
    disableFetching();
  }
    else {
        console.log('has inifinite');
    }
    
  if(shouldFetchPosts && !isFetchingPosts){
     fetchPosts(); 
  }
  // Are we close to the end of the page? If we are, load more posts
  $(window).scroll(function(e){
    if (!shouldFetchPosts || isFetchingPosts) return;
    // console.log('bb');
    var windowHeight = $(window).height(),
        windowScrollPosition = $(window).scrollTop(),
        bottomScrollPosition = windowHeight + windowScrollPosition,
        documentHeight = $(document).height();
    
    // If we've scrolled past the loadNewPostsThreshold, fetch posts
    if ((documentHeight - loadNewPostsThreshold) < bottomScrollPosition) {
        console.log('cc');
        fetchPosts();
    }
  });
  
  // Fetch a chunk of posts
  function fetchPosts() {
    isFetchingPosts = true;
    
    // Load as many posts as there were present on the page when it loaded
    // After successfully loading a post, load the next one
    var callback = function(ok) {
        isFetchingPosts = false;
          if (loadedPage > pagesToLoad || !ok) {
            console.log('no more page to load');
            disableFetching();
            return;
          }
    };
    fetchPageWithIndex(++loadedPage, callback);
  }
    
  function fetchPageWithIndex(index, callback) {
    console.log('fetchPageWithIndex.. page ' + index);
    var pageURL;
    if(index == 1){ 
        pageURL = path + 'json/index.html';   
    }
    else{
        pageURL =  path + 'json/page' + index + '/index.html';
    }
    $.get(pageURL)
    .done(function(res) {
        console.log('got res ' + res);
        data = JSON.parse(res);
        var template = document.getElementById("template-post-item");
        var templateHtml = template.innerHTML;
        var items = '';
        for(var i = 0; i < data.posts.length; i++){
            var post = data.posts[i];
            items += templateHtml.replace(/%POST_URL%/g, post.url)
                          .replace(/%POST_TITLE%/g, post.title)
                          .replace(/%POST_IMAGE%/g, post.image)
                          .replace(/%POST_PUSH%/g, post.push)
                          .replace(/%POST_BOO%/g, post.boo)
                          .replace(/%POST_DATE%/g, post.date)
                          .replace(/%SITE_URL%/g, SITE_URL)
                          .replace(/%POST_COMMENTS%/g, parseInt(post.push) + parseInt(post.boo) + parseInt(post.neutral))
                          .replace(/%POST_BOARD_NAME%/g, post.boardName)
                          .replace(/%POST_BOARD_LINK%/g, post.boardLink)
        }
        console.log('appending..' + items);
        $('.list_content').append(items);
        timeConvert('post-feed-time');
        if(data.posts.length < postPerPage){
            callback(false);
        }
        else{
            callback(true);
        }
    })
    .fail(function(){
        // console.log('no such page');
        callback(false);
    });
  }
  
  function disableFetching() {
    shouldFetchPosts = false;
    isFetchingPosts = false;
    $(".infinite-spinner").fadeOut();
  }
    
});
