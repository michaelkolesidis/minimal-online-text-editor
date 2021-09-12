// Auto-save

document.getElementById('text').innerHTML = localStorage['text'] || 'Text';

setInterval(function() {
     localStorage['text'] = document.getElementById('text').innerHTML;
}, 2 * 1000);