document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('.signup-form');

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.querySelector('#username-signup').value.trim();
        const email = document.querySelector('#email-signup').value.trim();
        const password = document.querySelector('#password-signup').value.trim();
        const confirmPassword = document.querySelector('#confirm-password-signup').value.trim();

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (username && email && password) {
            const response = await fetch('/signup', {
                method: 'POST',
                body: JSON.stringify({ name: username, email, password }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                document.location.replace('/dashboard');
            } else {
                alert('Failed to sign up.');
            }
        } else {
            alert('Please fill out all fields.');
        }
    });
});
