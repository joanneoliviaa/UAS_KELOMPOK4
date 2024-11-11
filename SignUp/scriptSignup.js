document.getElementById('signupForm').addEventListener('submit', function(event) {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorMessage = document.getElementById('error-message');

    if (password !== confirmPassword) {
        event.preventDefault();
        errorMessage.style.display = 'block';
    } else {
        errorMessage.style.display = 'none';
    }
});
