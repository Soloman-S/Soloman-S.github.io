window.addEventListener('DOMContentLoaded', () => {

  // DATA ----------------------------------------------------------
    imagesArray = [
    new Image("images/img1.JPG", ["Wildlife", "Outdoors"], ["50mm", 4.0, 1/500, 3200]),
    new Image("images/img2.jpg", ["Outdoors"]),
    new Image("images/img3.jpg", ["Wildlife", "Outdoors"]),
    new Image("images/img4.jpg", ["Outdoors"]),
    new Image("images/img5.jpg", ["People", "Outdoors"]),
    new Image("images/img6.jpg", ["Wildlife", "Outdoors"]),
    new Image("images/img7.jpg", ["Wildlife", "Outdoors"]), 
    new Image("images/img8.jpg", ["Outdoors"]), 
    new Image("images/img9.jpg", ["Outdoors"]),
    new Image("images/img10.jpg", ["Outdoors"]), 
    new Image("images/img11.jpg", ["Wildlife", "Outdoors"]),
    new Image("images/img12.jpg", ["Outdoors"])

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
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { // do nothing if not intersecting
        loaded = loadPics(imagesArray, loaded, limit, listEl, filterList);
        //return;
      } else {
        return;
      }
    });
  });
  io.observe(document.getElementById("targetElem"));  
});


// SET UP FUNCTIONS - dynamic page generation ----------------------
function Image(imagePath, classes, camSettings) {
  this.imagePath = imagePath;
  this.classes = classes;
  this.camSettings = camSettings;
}

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
  try { // convert JSON of tags to array
    var classes = JSON.parse(jsonTags);
  } catch (ex) {
    console.error(ex);
  }
  for (el of filterList) { //compare filter set elements to tag array
    if (classes.includes(el)) {
      overlap = true;
    }
  }
  return overlap;
}


// INFINITE SCROLL FUNCTIONS -----------------------------------------------------------------
/*
function hasMorePics(loaded, total) { // returns true if there are remaining images to display
  return (loaded < total);
}*/

function loadPics(imagesArray, loaded, limit, listEl, filterList) { // loads images until 'limit' visible photos loaded. Returns index for next to be loaded
  var i = loaded;
  var j = 0; // number of loaded VISIBLE photos this round
  while (j < limit && i < imagesArray.length) {
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
// --- Add other camera details (model, lens, ?focal length)
// --- Add multiple filters (with and/or combinations)
// --- Add sidebar UI for filters
// --- ?Add WebP images with picture tag
// --- ?Disable filter changes while loading
// --- ?Change hover to include active/focus for mobile (vs ?click to expand)
// --- Add loading animation
// --- Fix hoverbox css to scale/fit
// --- Autopopulate imagesArray when image uploaded
