let count = 0;

function timedCount() {
  count++;
  postMessage(count);
  setTimeout(timedCount, 1000);
}

timedCount();
