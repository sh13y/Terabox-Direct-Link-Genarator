// Wait for DOM content to load before executing script
document.addEventListener('DOMContentLoaded', () => {
    // Get all necessary DOM elements
    const form = document.getElementById('linkForm');
    const urlInput = document.getElementById('urlInput');
    const submitBtn = document.getElementById('submitBtn');
    const statusMessage = document.getElementById('statusMessage');
    const resultContainer = document.getElementById('resultContainer');
    const linkDisplay = document.getElementById('linkDisplay');
    const spinner = document.getElementById('spinner');

    // Function to show status messages
    function showMessage(text, type = 'info') {
        statusMessage.textContent = text;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'block';
    }

    // Function to toggle loading state
    function toggleLoading(isLoading) {
        submitBtn.disabled = isLoading;
        submitBtn.classList.toggle('loading', isLoading);
        spinner.classList.toggle('active', isLoading);
    }

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = urlInput.value.trim();

        if (!url) {
            showMessage('Please enter a valid URL', 'error');
            return;
        }

        try {
            toggleLoading(true);
            showMessage('Generating link...');

            // Send request to our API endpoint
            const response = await fetch('/api/generate-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to generate link');
            }

            // Display result if successful
            const { dlink } = await response.json();
            linkDisplay.value = dlink;
            resultContainer.style.display = 'block';
            showMessage('Link generated successfully!', 'success');
            urlInput.value = '';
            
        } catch (error) {
            console.error('Error:', error);
            showMessage(error.message || 'Something went wrong', 'error');
        } finally {
            toggleLoading(false);
        }
    });

    // Copy button functionality
    document.getElementById('copyButton').addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(linkDisplay.value);
            showMessage('Link copied to clipboard!', 'success');
        } catch (err) {
            showMessage('Failed to copy link', 'error');
        }
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        // Update icon visibility based on theme
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');
        
        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        }
    }

    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    // Initialize theme
    setTheme(currentTheme);
});
