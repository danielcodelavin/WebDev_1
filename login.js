function loginPage() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="container mt-5">
            <div class="col-md-6 mx-auto">
                <h2>Login</h2>
                <div id="loginError" class="alert alert-danger d-none"></div>
                <form id="loginForm">
                    <div class="mb-3">
                        <label for="username" class="form-label">Username</label>
                        <input type="text" class="form-control" id="username" required>
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Login</button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');

        try {
            // Sending username and password as query parameters
            const response = await fetch(`http://wd.etsisi.upm.es:10000/users/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
                method: 'GET'
            });

            if (response.ok) {
                // Extract the token from the Authorization header
                const token = response.headers.get('Authorization');
                if (token) {
                    localStorage.setItem('token', token); // Save token for later use
                    errorDiv.textContent = 'Login successful!';
                    errorDiv.classList.remove('alert-danger');
                    errorDiv.classList.add('alert-success');
                    errorDiv.classList.remove('d-none');
                } else {
                    throw new Error('Token not found in response headers');
                }
            } else {
                const errorMessage = await response.text();
                errorDiv.textContent = `Login failed: ${errorMessage}`;
                errorDiv.classList.add('alert-danger');
                errorDiv.classList.remove('d-none');
            }
        } catch (error) {
            errorDiv.textContent = 'Login error: ' + error.message;
            errorDiv.classList.add('alert-danger');
            errorDiv.classList.remove('d-none');
            console.error('Login error:', error);
        }
    });
}
