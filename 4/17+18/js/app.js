function validateForm() {
  const form = document.getElementById('registration-form');
  const inputs = form.querySelectorAll('input[required]');

  for (const input of inputs) {
    if (!input.value.trim()) {
      alert(`Поле "${input.previousElementSibling.textContent}" не заполнено.`);
      return false;
    }
  }

  const emailInput = document.getElementById('email');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailInput.value)) {
    alert('Введите корректный адрес электронной почты.');
    return false;
  }

  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  if (password !== confirmPassword) {
    alert('Пароли не совпадают.');
    return false;
  }

  return true;
}

function submitForm() {
  if (!validateForm()) return;

  const formData = {};
  const form = document.getElementById('registration-form');
  const inputs = form.querySelectorAll('input');

  inputs.forEach(input => {
    formData[input.name] = input.value;
    document.cookie = `${input.name}=${input.value}; path=/`;
  });

  const outputDiv = document.getElementById('form-output');
  const outputData = document.getElementById('output-data');

  outputDiv.style.display = 'block';
  outputData.textContent = JSON.stringify(formData, null, 2);

  console.log('Form Data:', formData);
  alert('Данные формы сохранены.');
}

function clearCookies() {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const name = cookie.split('=')[0].trim();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }
  alert('Cookies очищены.');
}
