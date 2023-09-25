window.addEventListener('DOMContentLoaded', () => {

  // DATA ----------------------------------------------------------
  /*
  imagesArray = [
    new Image("images/image1.png", ["show", "art"]),
    new Image("images/image2.jpg", ["show", "people", "surprise"]),
    new Image("images/image3.jpg", ["show", "people", "surprise"]),
    new Image("images/image4.jpg", ["show", "people", "surprise"]),
    new Image("images/image5.jpg", ["show", "outside"]),
    new Image("images/image6.jpg", ["show", "outside", "people"]),
    new Image("images/image7.jpg", ["show"]), 
    new Image("images/image8.jpg", ["show", "art"]), 
    new Image("images/image9.jpg", ["show", "outside"]),
    new Image("images/20230729153502_IMG_0124.JPG", ["show", "outside"]),
    new Image("images/DSC0318.JPG", ["show", "outside"]),
    new Image("images/DSC0431.JPG", ["show", "outside"])
  ]
  */

    imagesArray = [
    new Image("images/image1.png", ["art"]),
    new Image("images/image2.jpg", ["people", "surprise"]),
    new Image("images/image3.jpg", ["people", "surprise"]),
    new Image("images/image4.jpg", ["people", "surprise"]),
    new Image("images/image5.jpg", ["outside"]),
    new Image("images/image6.jpg", ["outside", "people"]),
    new Image("images/image7.jpg", ["showy"]), 
    new Image("images/image8.jpg", ["art"]), 
    new Image("images/image9.jpg", ["outside"]),
    new Image("images/20230729153502_IMG_0124.JPG", ["outside"]),
    new Image("images/DSC0318.JPG", ["outside"]),
    new Image("images/DSC0431.JPG", ["outside"])
  ]

  //apply filters here??? Reapply regularly???

  buttonArray = [
    new Button("class1", "Class 1"),
    new Button("outside", "Outside"),
    new Button("people", "People"),
    new Button("surprise", "Surprise Photos"),
    new Button("art", "Art")
  ]

  // CODE ----------------------------------------------------------
  const listEl = document.querySelector('.listContainer');
  var btnContainer = document.getElementById("myBtnContainer");
  
  const filterList = new Set(); // currently active filters. If empty then show all, otherwise show those which int
  
  // Generate buttons
  for (b of buttonArray) {
    const butEl = document.createElement('button');
    butEl.classList.add('btn');
    butEl.addEventListener('click', function(b) { 
      //filterSelection(b.className);
      updateFilter(b.className, filterList);
      //var current = document.getElementsByClassName('active');
      //current[0].classList.remove('active');
      this.classList.toggle("active"); // Add active class to the current control button (highlight it)
    }.bind(butEl, b));
    butEl.innerHTML = b.label;
    btnContainer.appendChild(butEl);
  }
  
  // Set up infinite scroll
  const limit = 4; //number of images loaded per scroll
  let currentPage = 1; //number of pages of images loaded. Does nothing
  let total = imagesArray.length; //total number of images to load
  let loaded = 0; //number of images loaded
  let indices = new Array(); //indices of next batch of images to load
  
  indices = getPics(loaded, limit, total);
  loadPics(imagesArray, indices, listEl);
  loaded += indices.length;

  window.addEventListener('scroll', () => {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;
  
    if (scrollTop + clientHeight >= scrollHeight - 5 &&
        hasMorePics(loaded, total)) {
        currentPage++;
        indices = getPics(loaded, limit, total);
        loadPics(imagesArray, indices, listEl);
        loaded += indices.length;
    }
  }, {
    passive: true
  });

  //filterSelection("all")
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


function filterSelection(c) {

  // NEW PLAN TO BE IMPLEMENTED
  // called when a filter button pressed
  // takes in filterList and the newly pressed filter
  // toggles the new filter, then loops through all loaded images and runs updateFilter


  var images, i;
  images = document.getElementsByClassName("imageContainer");
  if (c == "all") c = "";
  // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
  for (i = 0; i < images.length; i++) {
    //removeClass(images[i], "show");
    images[i].classList.remove('show');
    //if (images[i].className.indexOf(c) > -1) addClass(images[i], "show");
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
      if (intersection(image.classList, filterList)) {
        image.classList.add('show');
      } else {
        image.classList.remove('show');
      }
    }
  }
}


function intersection(classlist, filterList) {
  overlap = false;
  for (el of filterList) {
    if (classlist.contains(el)) {
      overlap = true;
    }
  }
  //?new Set(...image.classList) intersects with filterList
  return overlap;
}

/*
//?redundant
function addClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}

//?redundant
function removeClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}
*/

// INFINITE SCROLL FUNCTIONS -----------------------------------------------------------------
function hasMorePics(loaded, total) { // returns TRUE if there are remaining images to display
  return (loaded < total);
}

function getPics(loaded, limit, total) { //returns an array of indicies of images to load from imagesArray
  indices = new Array()
  max = Math.min(loaded + limit - 1, total - 1)
  for (var i = loaded; i <= max; i++) {
    indices.push(i);
  }
  return indices;
}

function loadPics(imagesArray, indices, listEl) { //load pictures of indices through a loop
  for (var i = indices[0]; i <= indices[indices.length - 1]; i++) {
    const imgEl = document.createElement('img');
    imgEl.classList.add('imageContainer');
    imgEl.setAttribute("src", imagesArray[i].imagePath);
    imgEl.classList.add(...imagesArray[i].classes);
    if (filterList.size == 0 || intersection(imgEl.classList, filterList)) {
      imgEl.classList.add("show");
    }
    
    // To be implemented: if should be active then add 'show' as well
    // concern is changing filter while loading
    listEl.appendChild(imgEl);
  }
  //consider adding return of number loaded
}
