const STORAGE_KEY = 'reliquary_user';

//логин
const stepPhone = document.getElementById('step-phone');
const stepCode = document.getElementById('step-code');

if (stepPhone && stepCode) {

    //проверка входа
    if (localStorage.getItem(STORAGE_KEY)) {
        window.location.href = 'profile.html';
    }

    const phoneInput = document.getElementById('phone-input');
    const phoneDisplay = document.getElementById('phone-display');
    const btnSend = document.getElementById('btn-send-code');
    const btnConfirm = document.getElementById('btn-confirm');
    const btnBack = document.getElementById('btn-back');
    const codeError = document.getElementById('code-error');
    const digits = document.querySelectorAll('.code-digit');

    phoneInput.addEventListener('input', function () {
        let val = phoneInput.value.replace(/\D/g, '');
        if (val.startsWith('7') || val.startsWith('8')) val = val.slice(1);
        val = val.slice(0, 10);
        let out = '+7';
        if (val.length > 0) out += ' (' + val.slice(0, 3);
        if (val.length >= 3) out += ') ' + val.slice(3, 6);
        if (val.length >= 6) out += '-' + val.slice(6, 8);
        if (val.length >= 8) out += '-' + val.slice(8, 10);
        phoneInput.value = out;
    });

    //1-2
    btnSend.addEventListener('click', function () {
        const raw = phoneInput.value.replace(/\D/g, '');
        if (raw.length < 11) {
            phoneInput.style.borderColor = 'rgb(200,0,0)';
            phoneInput.focus();
            return;
        }
        phoneInput.style.borderColor = '';
        phoneDisplay.textContent = phoneInput.value;
        stepPhone.style.display = 'none';
        stepCode.style.display = 'flex';
        digits[0].focus();
    });

    //переход на ячейку после ввола
    digits.forEach(function (digit, i) {
        digit.addEventListener('input', function () {
            digit.value = digit.value.replace(/\D/g, '').slice(-1);
            if (digit.value && i < digits.length - 1) digits[i + 1].focus();
            codeError.style.display = 'none';
        });
        digit.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && !digit.value && i > 0) {
                digits[i - 1].focus();
                digits[i - 1].value = '';
            }
        });
    });

    //войти
    btnConfirm.addEventListener('click', function () {
        const entered = Array.from(digits).map(d => d.value).join('');
        if (entered.length < 4) {
            codeError.style.display = 'block';
            return;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ phone: phoneInput.value }));
        window.location.href = 'profile.html';
    });

    //назад
    btnBack.addEventListener('click', function () {
        stepCode.style.display = 'none';
        stepPhone.style.display = 'flex';
        digits.forEach(d => d.value = '');
        codeError.style.display = 'none';
    });
}

//профиль
const btnLogout = document.getElementById('btn-logout');
if (btnLogout) {

    // Если не залогинен — на вход
    const userData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!userData) {
        window.location.href = 'login.html';
    } else {
        const phoneEl = document.getElementById('profile-phone-display');
        if (phoneEl) phoneEl.textContent = userData.phone || '';
    }

    btnLogout.addEventListener('click', function () {
        localStorage.removeItem(STORAGE_KEY);
        window.location.href = 'login.html';
    });
}