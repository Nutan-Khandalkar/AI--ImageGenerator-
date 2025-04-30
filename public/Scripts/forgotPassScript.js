document.getElementById('forgotForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
  
    const res = await fetch('http://localhost:9898/user/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
  
    if (res.ok) {
      alert('Check your email for the password!');
    } else {
      alert('Could not send password');
    }
});