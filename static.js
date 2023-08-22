window.addEventListener('DOMContentLoaded', () => {

  // DATA ----------------------------------------------------------
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
  
  //filterList empty set // currently active filters
  
  // Generate buttons
  for (b of buttonArray) {
    const butEl = document.createElement('button');
    butEl.classList.add('btn');
    butEl.addEventListener('click', filterSelection.bind(null, b.className), false);
    //butEl.addEventListener('click', function() { // Add active class to the current control button (highlight it)
    //  filterSelection(b.className);
    //  var current = document.getElementsByClassName('active');
    //  current[0].className = current[0].className.replace(' active', "");
    //  this.className += " active";
    //});
    butEl.innerHTML = b.label;
    btnContainer.appendChild(butEl);
  }

  // Add active class to the current control button (highlight it)
  // Consider adding into previous loop
  /*
  var btns = btnContainer.getElementsByClassName("btn");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
    });
  };
  */
  
  // Set up infinite scroll
  const limit = 4; //number of images loaded per scroll
  let currentPage = 1; //number of pages of images loaded
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

  // called when a filter button pressed
  // takes in filterList and the newly pressed filter
  // toggles the new filter, then loops through all loaded images and runs updateFilter
  
  var images, i;
  images = document.getElementsByClassName("imageContainer");
  if (c == "all") c = "";
  // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
  for (i = 0; i < images.length; i++) {
    removeClass(images[i], "show");
    //images[i].classList.add('show');
    //if (images[i].className.indexOf(c) > -1) addClass(images[i], "show");
    if (images[i].className.indexOf(c) > -1) images[i].classList.add('show');
  }
}

// function updateFilter - if image classes intersects with filterSelect then remove show, otherwise add show
  // eventually add second filtering for settings from sliding bars


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
    //addClass(imgEl, imagesArray[i].classes);
    imgEl.classList.add(...imagesArray[i].classes);
    
    // To be implemented: if should be active then add 'show' as well
    // concern is changing filter while loading
    listEl.appendChild(imgEl);
  }
  //consider adding return of number loaded
}
