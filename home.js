function homePage() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h2>Welcome to the UFO Battle Game</h2>
        <p>Get ready to shoot down as many UFOs as possible and aim for the highest score!</p>
        <p>Use the navigation above to set your preferences, start playing, check records, or log in/register.</p>
        <div style="text-align: center; margin: 20px 0;">
                    <img src="backg2.jpeg" alt="UFO Battle Game" style="max-width: 600px; width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                </div>
        
    `;
}
