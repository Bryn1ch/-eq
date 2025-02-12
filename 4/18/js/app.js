function getFormData() {
  const form = document.getElementById('userForm');

  // Get text input
  const name = form.name.value;

  // Get checkbox values
  const interests = Array.from(form.querySelectorAll('input[name="interest"]:checked'))
    .map(checkbox => checkbox.value);

  // Get radio button value
  const gender = form.querySelector('input[name="gender"]:checked')?.value || 'Not selected';

  // Get dropdown value
  const city = form.city.value;

  // Display data
  alert(`Name: ${name}\nInterests: ${interests.join(', ')}\nGender: ${gender}\nCity: ${city}`);
}
