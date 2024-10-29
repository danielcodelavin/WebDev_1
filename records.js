async function recordsPage() {
    const content = document.getElementById('content');
    content.innerHTML = '<h2>Loading Records...</h2>';

    try {
        const response = await fetch('http://wd.etsisi.upm.es:10000/records');
        const records = await response.json();

        let recordsList = '<ul>';
        records.forEach((record, index) => {
            recordsList += `<li>${index + 1}. ${record.username}: ${record.score}</li>`;
        });
        recordsList += '</ul>';

        content.innerHTML = `
            <h2>Top 10 Records</h2>
            ${recordsList}
        `;
    } catch (error) {
        content.innerHTML = `<h2>Error loading records</h2><p>${error}</p>`;
    }
}
