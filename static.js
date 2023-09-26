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

  //buttonSet = new Set();
  var buttons = {};
  for (image of imagesArray) {
    for (tag of image[1]) {
      console.log(tag);
      if (tag in buttons) {
        buttons[tag]++;
      } else {
        buttons[tag] = 1;
      }
    }
  }
  console.log(buttons);
  
  buttonArray = [
    new Button("emptyClass", "Empty Class"),
    new Button("outside", "Outside"),
    new Button("people", "People"),
    new Button("surprise photos", "Surprise Photos"),
    new Button("art", "Art")
  ]

  // CODE ----------------------------------------------------------
  const listEl = document.querySelector('.listContainer'); // container for image objects
  const btnContainer = document.getElementById("myBtnContainer"); // container for filter buttons
  const filterList = new Set(); // currently active filters. If empty then show all, otherwise show those which have any of these
  
  // Generate buttons
  for (b of buttonArray) {
    const butEl = document.createElement('button');
    butEl.classList.add('btn');
    butEl.addEventListener('click', function(b) { 
      updateFilter(b.className, filterList);
      this.classList.toggle("active"); // Add active class to the current control button (highlight it)
    }.bind(butEl, b));
    butEl.innerHTML = b.label;
    btnContainer.appendChild(butEl);
  }
  
  // Set up infinite scroll
  const limit = 4; //number of images loaded per scroll
  let total = imagesArray.length; //total number of images to load
  let loaded = 0; //number of images loaded
  loaded = loadPics(imagesArray, loaded, limit, listEl, filterList);

  window.addEventListener('scroll', () => {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;
  
    if (scrollTop + clientHeight >= scrollHeight - 5 &&
        hasMorePics(loaded, total)) {
        loaded = loadPics(imagesArray, loaded, limit, listEl, filterList);
    }
  }, {
    passive: true
  });
});


// SET UP FUNCTIONS - dynamic page generation ----------------------
function Image(imagePath, classes) {
  this.imagePath = imagePath;
  this.classes = classes;
}

function Button(className, label) {
  this.className = className;
  this.label = label;
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
  images = document.getElementsByClassName("imageContainer");
  if (filterList.has(newFilter)) {
    filterList.delete(newFilter)
  } else {
    filterList.add(newFilter)
  }
  if (filterList.size == 0) {
    for (image of images) {
      image.classList.add('show');
    }
  } else {
    for (image of images) {
      if (intersection(image.classList, image.dataset.tags, filterList)) {
        image.classList.add('show');
      } else {
        image.classList.remove('show');
      }
    }
  }
}

function intersection(classlist, jsonArray, filterList) {
  overlap = false;
  try {
    var classes = JSON.parse(jsonArray);
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
function hasMorePics(loaded, total) { // returns TRUE if there are remaining images to display
  return (loaded < total);
}

// load pictures of indices through a loop. Will load until 'limit' visible photos loaded
// returns index for next photo to be loaded
function loadPics(imagesArray, loaded, limit, listEl, filterList) { 
  var i = loaded;
  var j = 0; // number of loaded AND visible photos
  while (j < limit) {
    const contEl = document.createElement('div');
    const imgEl = document.createElement('img');
    imgEl.classList.add('image');
    contEl.classList.add('imageContainer');
    imgEl.setAttribute("src", imagesArray[i].imagePath);
    // eventually add WebP images https://web.dev/serve-images-webp/
    //contEl.classList.add(...imagesArray[i].classes);
    contEl.setAttribute("data-tags", JSON.stringify(imagesArray[i].classes));
    if (filterList.size == 0 || intersection(contEl.classList, contEl.dataset.tags, filterList)) {
      contEl.classList.add("show"); // concern is changing filter while loading. ?grey out buttons while loading?
      j++;
    }
    listEl.appendChild(contEl);
    const boxEl = document.createElement('div');
    const textEl = document.createElement('div');
    boxEl.classList.add('middle');
    textEl.classList.add('text');
    textEl.innerHTML = imagesArray[i].classes.toString();
    contEl.appendChild(imgEl);
    contEl.appendChild(boxEl);
    boxEl.appendChild(textEl);
    i++;
  }
  return i;
}


// TO DO
// --- Change scroll to intersection observer
// --- Fix show all button
// --- Autogenerate filter buttons
// --- Add camera setting filters
// --- Add multiple filters (with and/or combinations)
// --- Add sidebar UI for filters
// --- ?Add WebP images
// --- ?disable filter changes while loading
