document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('contact-form');
    const successBlock = document.getElementById('form-success');

    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        //собираем данные формы
        const formData = new FormData(form);
        const params = new URLSearchParams();
        formData.forEach(function (value, key) {
            params.append(key, value);
        });

        //имитация отправки
        const newUrl = window.location.pathname + '?' + params.toString();
        window.history.pushState(null, '', newUrl);

        //скрываем форму, показываем успех
        form.style.opacity = '0';
        form.style.transition = 'opacity 0.4s ease';

        setTimeout(function () {
            form.style.display = 'none';
            successBlock.style.display = 'block';
        }, 400);
    });

});