function loginPage() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h2>Login</h2>
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
    `;

    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Login form submitted. Actual login logic will be implemented in the next task.');
    });
}
