window.addEventListener('DOMContentLoaded', () => {

  const listEl = document.querySelector('.listContainer');


  imagesArray = [
    new Image("images/image1.png", "class1"),
    new Image("images/image2.jpg", "class2"),
    new Image("images/image3.jpg", "class1 class3"),
    new Image("images/image4.jpg", "class3"),
    new Image("images/image5.jpg", "class4"),
    new Image("images/image6.jpg", "class4 class5"),
    new Image("images/image7.jpg", "class1 class4"), 
    new Image("images/image8.jpg", "class2"), 
    new Image("images/image9.jpg", "class5")
  ]

  buttonArray = [
    new Button("class1", "Class 1"),
    new Button("class2", "Class 2"),
    new Button("class3", "Class 3"),
    new Button("class4", "Class 4"),
  ]

  for (b of buttonArray) {
    const butEl = document.createElement('button');
    butEl.classList.add('btn');
    butEl.addEventListener('click', function(){filterSelection(b.className)});
    bulEl.innerHTML = b.label;
    listEl.appendChild(butEl);
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
  var btnContainer = document.getElementById("myBtnContainer");
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


