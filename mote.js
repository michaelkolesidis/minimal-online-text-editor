const textarea = document.getElementById('text-area');
const wordCounter = document.getElementById('word-counter');
const downloadButton = document.getElementById('download-btn');
const fullscreenButton = document.getElementById('fullscreen-btn');

let timeout;
let saveInterval = 10;
let targetScrollY = window.scrollY;
let isScrolling = false;

window.onload = () => {
  const savedText = localStorage.getItem('autosaveText');
  if (savedText) {
    textarea.value = savedText;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    updateWordCounter();
  }
  setTimeout(centerCurrentLine, 100);
};

const countWords = (text) => {
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  return words.length;
};

const updateWordCounter = () => {
  const wordCount = countWords(textarea.value);
  if (wordCount > 0) {
    wordCounter.style.visibility = 'visible';
    wordCounter.textContent = `${wordCount}`;
  } else {
    wordCounter.style.visibility = 'hidden';
  }
};

function lerpScroll() {
  const currentY = window.scrollY;
  const diff = targetScrollY - currentY;

  if (Math.abs(diff) > 1) {
    window.scrollTo(0, currentY + diff * 0.15);
    requestAnimationFrame(lerpScroll);
  } else {
    window.scrollTo(0, targetScrollY);
    isScrolling = false;
  }
}

const getCaretYPosition = () => {
  let clone = document.getElementById('mote-textarea-clone');

  if (!clone) {
    clone = document.createElement('div');
    clone.id = 'mote-textarea-clone';
    document.body.appendChild(clone);

    const computed = window.getComputedStyle(textarea);
    const stylesToCopy = [
      'fontFamily',
      'fontSize',
      'fontWeight',
      'fontStyle',
      'letterSpacing',
      'lineHeight',
      'paddingTop',
      'paddingBottom',
      'paddingLeft',
      'paddingRight',
      'boxSizing',
    ];
    stylesToCopy.forEach((style) => (clone.style[style] = computed[style]));

    clone.style.position = 'absolute';
    clone.style.visibility = 'hidden';
    clone.style.whiteSpace = 'pre-wrap';
    clone.style.wordWrap = 'break-word';
    clone.style.top = '0';
    clone.style.left = '0';
  }

  clone.style.width = window.getComputedStyle(textarea).width;
  const textUpToCaret = textarea.value.substring(0, textarea.selectionStart);
  clone.textContent = textUpToCaret;

  if (textUpToCaret.endsWith('\n')) {
    clone.textContent += ' ';
  }

  const marker = document.createElement('span');
  marker.textContent = '|';
  clone.appendChild(marker);

  return marker.offsetTop;
};

const centerCurrentLine = () => {
  const caretY = getCaretYPosition();
  const textareaRect = textarea.getBoundingClientRect();
  const absoluteCaretTop = textareaRect.top + window.scrollY + caretY;

  targetScrollY = absoluteCaretTop - window.innerHeight / 2;

  if (!isScrolling) {
    isScrolling = true;
    requestAnimationFrame(lerpScroll);
  }
};

textarea.addEventListener('input', () => {
  const currentScroll = textarea.scrollTop;
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
  textarea.scrollTop = currentScroll;
  updateWordCounter();
  centerCurrentLine();

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    localStorage.setItem('autosaveText', textarea.value);
  }, saveInterval);
});

textarea.addEventListener('keyup', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    centerCurrentLine();
  }
});

textarea.addEventListener('click', centerCurrentLine);
window.addEventListener('resize', centerCurrentLine);

function downloadTextAsFile() {
  const text = textarea.value;
  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'mote-text.txt';
  link.click();
}

downloadButton.addEventListener('click', downloadTextAsFile);

fullscreenButton.addEventListener('click', function () {
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
