const textarea = document.getElementById('text-area');
const wordCounter = document.getElementById('word-counter');
const downloadButton = document.getElementById('download-btn');
const fullscreenButton = document.getElementById('fullscreen-btn');

// Load saved content from localStorage when the page loads
window.onload = () => {
  const savedText = localStorage.getItem('autosaveText');
  if (savedText) {
    textarea.value = savedText;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    updateWordCounter();
  }
};

// Function to count words
const countWords = (text) => {
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  return words.length;
};

// Update word counter and visibility
const updateWordCounter = () => {
  const wordCount = countWords(textarea.value);
  if (wordCount > 0) {
    wordCounter.style.visibility = 'visible';
    wordCounter.textContent = `${wordCount}`;
  } else {
    wordCounter.style.visibility = 'hidden';
  }
};

// Automatically adjust the height of the textarea as the text grows
textarea.addEventListener('input', () => {
  const currentScroll = textarea.scrollTop;
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
  textarea.scrollTop = currentScroll;
  updateWordCounter();
});

// Autosave the content to localStorage every second after the last input
let timeout;
let saveInterval = 10; // Save 0.01 seconds after the last keystroke
textarea.addEventListener('input', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    localStorage.setItem('autosaveText', textarea.value);
    console.log('Text saved!');
  }, saveInterval);
});

// Function to download the text as a .txt file
function downloadTextAsFile() {
  const text = document.getElementById('text-area').value;
  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'mote-text.txt';
  link.click(); // Programmatically click the download link
}

// Add event listener to the download button
downloadButton.addEventListener('click', downloadTextAsFile);

// Fullscreen
fullscreenButton.addEventListener('click', function () {
  // Check if the document can go fullscreen
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  } else if (document.documentElement.webkitRequestFullscreen) {
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) {
    document.documentElement.msRequestFullscreen();
  }
});
