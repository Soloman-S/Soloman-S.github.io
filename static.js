window.addEventListener('DOMContentLoaded', () => {

  // DATA ----------------------------------------------------------

    imagesArray = [
    new Image("images/image1.png", ["art"]),
    new Image("images/image2.jpg", ["people", "surprise photos"]),
    new Image("images/image3.jpg", ["people", "surprise photos"]),
    new Image("images/image4.jpg", ["people", "surprise photos"]),
    new Image("images/image5.jpg", ["outside"]),
    new Image("images/image6.jpg", ["outside", "people"]),
    new Image("images/image7.jpg", []), 
    new Image("images/image8.jpg", ["art"]), 
    new Image("images/image9.jpg", ["outside"]),
    new Image("images/20230729153502_IMG_0124.JPG", ["outside"]),
    new Image("images/DSC0318.JPG", ["outside"]),
    new Image("images/DSC0431.JPG", ["outside"])
  ]

  var buttons = {};
  for (image of imagesArray) {
    for (tag of image.classes) {
      if (Object.keys(buttons).includes(tag)) {
        buttons[tag]++;
      } else {
        buttons[tag] = 1;
      }
    }
  }

  // CODE ----------------------------------------------------------
  const listEl = document.querySelector('.listContainer'); // container for image objects
  const btnContainer = document.getElementById("myBtnContainer"); // container for filter buttons
  const filterList = new Set(); // currently active filters. If empty then show all, otherwise show those which have any of these
  
  // Generate buttons
    for (b of Object.keys(buttons)) {
    const butEl = document.createElement('button');
    butEl.classList.add('btn');
    butEl.addEventListener('click', function(b) { 
      updateFilter(b, filterList);
      this.classList.toggle("active"); // Add active class to the current control button (highlight it)
    }.bind(butEl, b));
    butEl.innerHTML = b + " [" + buttons[b] + "]";
    btnContainer.appendChild(butEl);
  }
  
  // Set up infinite scroll
  const limit = 4; //number of images loaded per scroll
  let total = imagesArray.length; //total number of images to load
  let loaded = 0; //number of images loaded
  //loaded = loadPics(imagesArray, loaded, limit, listEl, filterList);

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) { // do nothing if not intersecting
        return;
      }
      if (hasMorePics(loaded, total)) { // load next batch of images
        loaded = loadPics(imagesArray, loaded, limit, listEl, filterList);
    }
    });
  });
  io.observe(document.getElementById("targetElem"));  
});


// SET UP FUNCTIONS - dynamic page generation ----------------------
function Image(imagePath, classes) {
  this.imagePath = imagePath;
  this.classes = classes;
}

/*
function Button(className, label) {
  this.className = className;
  this.label = label;
}
*/

// FILTER FUNCTIONS ------------------------------------------------

// currently only used by 'show all' button
function filterSelection(c) {
  var images, i;
  images = document.getElementsByClassName("imageContainer");
  if (c == "all") c = "";
  // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
  for (i = 0; i < images.length; i++) {
    images[i].classList.remove('show');
    if (images[i].className.indexOf(c) > -1) images[i].classList.add('show');
  }
}


// changes filterList and loops through all images to display ones that overlap with list
// If there are no filters then will show all images
// ?boolean logic
// eventually add second filtering for settings from sliding bars
function updateFilter(newFilter, filterList) {
  conts = document.getElementsByClassName("imageContainer");
  if (filterList.has(newFilter)) { // toggle selected filter
    filterList.delete(newFilter)
  } else {
    filterList.add(newFilter)
  }
  if (filterList.size == 0) { // if no filters selected then show all
    for (cont of conts) {
      cont.classList.add('show');
    }
  } else { // for each image, if it contains ANY filtered tags, then show
    for (cont of conts) {
      if (intersection(cont.dataset.tags, filterList)) {
        const imgEl = cont.querySelector('.image')
        if (imgEl.dataset.loaded == false) {
          imgEl.setAttribute("src", imgEl.dataset.src);
          imgEl.setAttribute("data-loaded", true);
        }
        cont.classList.add('show');
      } else {
        cont.classList.remove('show');
      }
    }
  }
}

function intersection(jsonTags, filterList) { // check for overlaps between JSON array of tags and filter set. Returns boolean
  overlap = false;
  try {
    var classes = JSON.parse(jsonTags);
  } catch (ex) {
    console.error(ex);
  }
  for (el of filterList) {
    if (classes.includes(el)) {
      overlap = true;
    }
  }
  return overlap;
}


// INFINITE SCROLL FUNCTIONS -----------------------------------------------------------------
function hasMorePics(loaded, total) { // returns true if there are remaining images to display
  return (loaded < total);
}

function loadPics(imagesArray, loaded, limit, listEl, filterList) { // loads images until 'limit' visible photos loaded. Returns index for next to be loaded
  var i = loaded;
  var j = 0; // number of loaded AND visible photos this round
  while (j < limit) {
    const contEl = generatePic(imagesArray[i]); // parent container holding image and floating textbox
    const imgEl = contEl.querySelector('.image')
    if (filterList.size == 0 || intersection(contEl.dataset.tags, filterList)) {
      imgEl.setAttribute("src", imgEl.dataset.src);
      imgEl.setAttribute("data-loaded", true);
      contEl.classList.add("show"); // concern is changing filter while loading. ?grey out buttons while loading?
      j++;
    }
    listEl.appendChild(contEl);
    i++;
  }
  return i;
}

function generatePic(image) { // creates and returns parent container holding image and floating textbox
  const contEl = document.createElement('div'); // parent container
  const imgEl = document.createElement('img'); // holds image
  const boxEl = document.createElement('div'); // holds hover box
  const textEl = document.createElement('div'); // holds text in hoverbox ?redundant
  
  contEl.classList.add('imageContainer');
  imgEl.classList.add('image');
  boxEl.classList.add('middle');
  textEl.classList.add('text');

  contEl.setAttribute("data-tags", JSON.stringify(image.classes));
  imgEl.setAttribute("src", "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
  imgEl.setAttribute("data-src", image.imagePath); // eventually add WebP images https://web.dev/serve-images-webp/
  imgEl.setAttribute("data-loaded", false);
  textEl.innerHTML = image.classes.toString();

  contEl.appendChild(imgEl);
  contEl.appendChild(boxEl);
  boxEl.appendChild(textEl);
  return contEl;
}


// TO DO
// --- Fix show all button
// --- Add camera setting filters
// --- Add multiple filters (with and/or combinations)
// --- Add sidebar UI for filters
// --- ?Add WebP images
// --- ?Disable filter changes while loading
// --- ?Change hover to include active/focus for mobile (vs ?click to expand)
// --- ?Only load picture once visible
