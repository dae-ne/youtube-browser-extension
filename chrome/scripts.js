const button = document.querySelector('button');

button.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const currentTab = tabs[0];
        const currentUrl = currentTab.url;
        
        if (!currentUrl.includes('youtube.com/shorts')) {
            return;
        }

        const videoUrl = currentUrl.replace('youtube.com/shorts', 'youtube.com/video');
        chrome.tabs.update(currentTab.id, { url: videoUrl });
    });
});
