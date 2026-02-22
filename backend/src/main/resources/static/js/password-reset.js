// Şifre doğrulama durumları
let passwordValid = false;
let passwordsMatch = false;

// Şifre gereksinimlerini kontrol et
function checkPassword() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const submitButton = document.getElementById('submitButton');
    const matchError = document.getElementById('matchError');

    // Şifre gereksinimleri
    const requirements = {
        length: {
            met: password.length >= 8,
            element: document.getElementById('length')
        },
        uppercase: {
            met: /[A-Z]/.test(password),
            element: document.getElementById('uppercase')
        },
        lowercase: {
            met: /[a-z]/.test(password),
            element: document.getElementById('lowercase')
        },
        number: {
            met: /[0-9]/.test(password),
            element: document.getElementById('number')
        }
    };

    // Her gereksinim için UI'ı güncelle
    Object.keys(requirements).forEach(req => {
        const requirement = requirements[req];
        if (requirement.met) {
            requirement.element.classList.add('valid');
        } else {
            requirement.element.classList.remove('valid');
        }
    });

    // Tüm gereksinimlerin karşılanıp karşılanmadığını kontrol et
    passwordValid = Object.values(requirements).every(req => req.met);

    // Şifrelerin eşleşip eşleşmediğini kontrol et
    passwordsMatch = password === confirmPassword;

    // Şifre eşleşme hata mesajını göster/gizle
    if (confirmPassword) {
        matchError.style.display = passwordsMatch ? 'none' : 'block';
    }

    // Submit butonunu aktif/pasif yap
    submitButton.disabled = !(passwordValid && passwordsMatch);
}

// Form gönderim işlemi
async function handleSubmit(event) {
    event.preventDefault();

    const password = document.getElementById('password').value;
    const token = document.getElementById('resetToken').value;
    const submitButton = document.getElementById('submitButton');

    try {
        submitButton.disabled = true;
        submitButton.textContent = 'İşleniyor...';

        const response = await fetch(`/api/v1/users/password/reset/${token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                newPassword: password
            })
        });

        console.log(response)
        if (response.ok) {
            window.location.href = '/api/v1/users/reset-password/success';
        } else {
            window.location.href = '/api/v1/users/reset-password/fail';
        }
    } catch (error) {
        console.error('Şifre sıfırlama hatası:', error);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Şifreyi Güncelle';
    }
}

// Sayfa yüklendiğinde input'ları dinlemeye başla
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Input değişikliklerini dinle
    passwordInput.addEventListener('input', checkPassword);
    confirmPasswordInput.addEventListener('input', checkPassword);

    // Form submit olayını dinle
    const form = document.getElementById('resetForm');
    form.addEventListener('submit', handleSubmit);
});