document.addEventListener('DOMContentLoaded', function () {

    const mainImg = document.getElementById('main-img');
    const thumbs = document.querySelectorAll('.thumb');

    thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            mainImg.src = thumb.src;
            thumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });

});