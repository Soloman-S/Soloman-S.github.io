window.addEventListener('DOMContentLoaded', () => {

  // DATA ----------------------------------------------------------
  imagesArray = [
    new Image("images/image1.png", "art"),
    new Image("images/image2.jpg", "people surprise"),
    new Image("images/image3.jpg", "people surprise"),
    new Image("images/image4.jpg", "people surprise"),
    new Image("images/image5.jpg", "outside"),
    new Image("images/image6.jpg", "outside people"),
    new Image("images/image7.jpg", ""), 
    new Image("images/image8.jpg", "art"), 
    new Image("images/image9.jpg", "outside")
  ]

  buttonArray = [
    new Button("class1", "Class 1"),
    new Button("outside", "Outside"),
    new Button("people", "People"),
    new Button("surprise", "Surprise Photos"),
    new Button("art", "Art")
  ]

  // CODE -------------------------------------------------------
  const listEl = document.querySelector('.listContainer');
  var btnContainer = document.getElementById("myBtnContainer");
  
  // Generate buttons
  for (b of buttonArray) {
    const butEl = document.createElement('button');
    butEl.classList.add('btn');
    butEl.addEventListener('click', filterSelection.bind(null, b.className), false);
    butEl.innerHTML = b.label;
    btnContainer.appendChild(butEl);
  }

  // Set up infinite scroll
  const limit = 14; //number of images loaded per scroll
  let currentPage = 1; //number of pages of images loaded
  let total = imagesArray.length; //total number of images to load
  let loaded = 0; //number of images loaded
  let indices = new Array(); //indices of next batch of images to load
  indices = getPics(loaded, limit, total);
  loadPics(imagesArray, indices, listEl);
  loaded += indices.length;
  console.log(loaded);
  console.log(hasMorePics(loaded, total));
  
  //for (i of imagesArray) {
  //  const imgEl = document.createElement('img');
  //  imgEl.classList.add('imageContainer');
  //  imgEl.setAttribute("src", i.imagePath);
  //  addClass(imgEl, i.classes);
  //  listEl.appendChild(imgEl);
  //}


  
  filterSelection("all")
  
  // Add active class to the current control button (highlight it)
  var btns = btnContainer.getElementsByClassName("btn");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
    });
  };
});

// SET UP FUNCTIONS - dynamic page generation ------------------------------------------------
function Image(imagePath, classes) {
  this.imagePath = imagePath;
  this.classes = classes;
}

function Button(className, label) {
  this.className = className;
  this.label = label;
}

// FILTER FUNCTIONS --------------------------------------------------------------------------
function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("imageContainer");
  if (c == "all") c = "";
  // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
  for (i = 0; i < x.length; i++) {
    removeClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) addClass(x[i], "show");
  }
}

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

// Hide elements that are not selected
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
function hasMorePics(loaded, total) { // returns TRUE if this is the first request or if there are remaining images to display
  return (loaded < total);
  //if number displayed < length of imagesArray, return true
}

function getPics(loaded, limit, total) { //returns an array of indicies of images to load from imagesArray
  indices = new Array()
  max = Math.min(loaded + limit - 1, total - 1)
  for (var i = loaded; i <= max; i++) {
    indices.push(i);
  }
  return indices;
  //return loaded -> (loaded + limit - 1) or (total - 1), whichever is less
}

function loadPics(imagesArray, indices, listEl) { //load pictures of indices through a loop
  for (var i = 0; i < indices.length; i++) {
    const imgEl = document.createElement('img');
    imgEl.classList.add('imageContainer');
    imgEl.setAttribute("src", imagesArray[i].imagePath);
    addClass(imgEl, imagesArray[i].classes);
    listEl.appendChild(imgEl);
  }
  //add return of number loaded
}
