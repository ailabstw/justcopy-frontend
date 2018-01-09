$(function(){
    var original_post_link = document.getElementById('original_post_link');
    var post = document.getElementById('main-container');
    post.style.display = 'none';
    original_post_link.onclick = function(e) {
       // console.log('clicked: ' + post.style.display);
       post.style.display = post.style.display == "none" ? "block" : "none";
    }
});
