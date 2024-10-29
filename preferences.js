function preferencesPage() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h2>Preferences</h2>
        <form id="preferencesForm">
            <div class="mb-3">
                <label for="numUfos" class="form-label">Number of UFOs</label>
                <select class="form-select" id="numUfos">
                    <option value="1" selected>1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="playTime" class="form-label">Play Time (seconds)</label>
                <select class="form-select" id="playTime">
                    <option value="60" selected>60</option>
                    <option value="120">120</option>
                    <option value="180">180</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Accept</button>
        </form>
    `;

    const form = document.getElementById('preferencesForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const numUfos = document.getElementById('numUfos').value;
        const playTime = document.getElementById('playTime').value;
        localStorage.setItem('numUfos', numUfos);
        localStorage.setItem('playTime', playTime);
        alert('Preferences saved!');
    });
}
