const loginFormHandler = async (event) => {
  event.preventDefault();

  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value.trim();

  if (email && password) {
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        document.location.replace('/');
      } else {
        const errorText = await response.text();
        alert(`Failed to log in: ${errorText}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
};

document.querySelector('.login-container').addEventListener('submit', loginFormHandler);
