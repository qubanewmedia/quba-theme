'use strict';

var el = document.querySelector('.Tree-toggle');

el.onclick = function() {
  this.nextElementSibling.classList.toggle('is-closed');
  this.classList.toggle('is-active');
}


var notes = null;

for (var i = 0; i < el.childNodes.length; i++) {
    if (el.childNodes[i].className == "is-current") {
        notes = el.childNodes[i];
        notes.parentNode.classList.toggle('is-closed');
        break;
    }        
}