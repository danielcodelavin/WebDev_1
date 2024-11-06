async function recordsPage() {
    const content = document.getElementById('content');
    content.innerHTML = '<h2>Loading Records...</h2>';

    try {
        const response = await fetch('http://wd.etsisi.upm.es:10000/records');
        const records = await response.json();

        console.log('Fetched records:', records); // Debugging line

        let recordsList = '<ul>';
        records.forEach((record, index) => {
            // Check for valid properties, fallback to 'Unknown' if missing
            const username = record.username || 'Unknown';
            const score = record.punctuation !== undefined ? record.punctuation : 'N/A';
            recordsList += `<li>${index + 1}. ${username}: ${score}</li>`;
        });
        recordsList += '</ul>';

        content.innerHTML = `
            <h2>Top 10 Records</h2>
            ${recordsList}
        `;
    } catch (error) {
        content.innerHTML = `<h2>Error loading records</h2><p>${error.message || error}</p>`;
        console.error('Error loading records:', error); // Debugging line
    }
}
