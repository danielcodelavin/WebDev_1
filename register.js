function registerPage() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h2>Register</h2>
        <form id="registerForm">
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" required>
            </div>
            <button type="submit" class="btn btn-primary">Register</button>
        </form>
    `;

    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Registration form submitted. Actual registration will be implemented in the next task.');
    });
}
