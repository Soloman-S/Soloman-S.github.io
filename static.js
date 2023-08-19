window.addEventListener('DOMContentLoaded', () => {

  const listEl = document.querySelector('.listContainer');
  var btnContainer = document.getElementById("myBtnContainer");


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

  for (b of buttonArray) {
    const butEl = document.createElement('button');
    butEl.classList.add('btn');
    //butEl.onclick = function(){filterSelection(b.className)}
    butEl.addEventListener('click', filterSelection.bind(null, b.className), false);
    butEl.innerHTML = b.label;
    btnContainer.appendChild(butEl);
  }
  
  
  for (i of imagesArray) {
    const imgEl = document.createElement('img');
    imgEl.classList.add('imageContainer');
    imgEl.setAttribute("src", i.imagePath);
    addClass(imgEl, i.classes);
    listEl.appendChild(imgEl);
  }

  
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

function Image(imagePath, classes) {
  this.imagePath = imagePath;
  this.classes = classes;
}

function Button(className, label) {
  this.className = className;
  this.label = label;
}

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


