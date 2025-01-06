const textarea = document.getElementById('text-area');
const wordCounter = document.getElementById('word-counter');

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
  // Save the current scroll position before modifying the textarea height
  const currentScroll = textarea.scrollTop;

  // Reset height to auto to calculate the new height
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px'; // Adjust height to match content height

  // After the height is adjusted, restore the scroll position
  textarea.scrollTop = currentScroll;

  updateWordCounter(); // Update word counter on input
});

// Load saved content from localStorage when the page loads
window.onload = () => {
  const savedText = localStorage.getItem('autosaveText');
  if (savedText) {
    textarea.value = savedText;
    textarea.style.height = 'auto'; // Adjust the height on load
    textarea.style.height = textarea.scrollHeight + 'px'; // Set the height to match the content height
    updateWordCounter(); // Update the word counter on input
  }
};

// Autosave the content to localStorage every second after the last input
let timeout;
let saveInterval = 1000; // Save 1 second after the last keystroke
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
  link.download = 'textfile.txt'; // Default filename
  link.click(); // Programmatically click the download link
}

// Add event listener to the download button
document
  .getElementById('download-btn')
  .addEventListener('click', downloadTextAsFile);
