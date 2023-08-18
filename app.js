

const listEl = document.querySelector('.listContainer');

for each file in images
  const imgEl = document.createElement('img');
  imgEl.classList.add('imageContainer');
  imgEl.src = imagePath;
  listEl.appendChild(imgEl);
