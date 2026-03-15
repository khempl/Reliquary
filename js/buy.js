document.addEventListener('DOMContentLoaded', function () {

    const paymentInput = document.getElementById('payment-input');
    const deliveryInput = document.getElementById('delivery-input');
    const cardGroup = document.getElementById('card-number-group');
    const cardNumber = document.getElementById('card-number');
    const qrBlock = document.getElementById('qr-block');
    const qrCanvas = document.getElementById('qr-canvas');
    const paySelected = document.getElementById('pay-selected-text');
    const form = document.getElementById('buy-form');
    const paySuccess = document.getElementById('pay-success');
    const formCard = document.getElementById('form-card');

    let currentPayMethod = '';


    document.querySelectorAll('.pay-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            //сброс активного
            document.querySelectorAll('.pay-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentPayMethod = btn.dataset.method;
            paymentInput.value = currentPayMethod;
            paySelected.textContent = currentPayMethod;

            const needCard = btn.dataset.needCard === 'true';
            const isQR = btn.dataset.qr === 'true';

            //поле карты
            cardGroup.style.display = needCard ? 'flex' : 'none';
            if (!needCard) cardNumber.value = '';

            //код
            if (isQR) {
                qrBlock.style.display = 'block';
                generateQR();
            } else {
                qrBlock.style.display = 'none';
                qrCanvas.innerHTML = '';
                qrInstance = null;
            }
        });
    });

    //способы доставки
    document.querySelectorAll('.delivery-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.delivery-btn').forEach(b => b.classList.remove('active-delivery'));
            btn.classList.add('active-delivery');
            deliveryInput.value = btn.dataset.delivery;
        });
    });

    //форматирование номера карты
    if (cardNumber) {
        cardNumber.addEventListener('input', function () {
            let val = cardNumber.value.replace(/\D/g, '').slice(0, 16);
            cardNumber.value = val.replace(/(.{4})/g, '$1 ').trim();
        });
    }

    //показ кода
    function generateQR() {
        document.getElementById('qr-image').addEventListener('click', showSuccess);
    }

    //отправка
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        //базовая валидация оплаты
        if (!currentPayMethod) {
            alert('Выберите способ оплаты');
            return;
        }

        if (currentPayMethod === 'Банковская карта') {
            const raw = cardNumber.value.replace(/\s/g, '');
            if (raw.length < 16) {
                alert('Введите корректный номер карты');
                cardNumber.focus();
                return;
            }
        }

        //небольшая задержка 
        const btn = form.querySelector('.btn-pay');
        btn.textContent = 'Обработка...';
        btn.disabled = true;

        setTimeout(function () {
            showSuccess();
            // очищаем корзину после оплаты
            localStorage.removeItem('reliquary_cart');
        }, 1200);
    });

    //успешно
    function showSuccess() {
        formCard.style.opacity = '0';
        formCard.style.transition = 'opacity 0.4s ease';
        setTimeout(function () {
            formCard.style.display = 'none';
            paySuccess.style.display = 'flex';
        }, 400);
    }

});