window.addEventListener('DOMContentLoaded', () => {

  const listEl = document.querySelector('.listContainer');
  
  const image1 = {
    imagePath = "images/image3.jpg",
    classes = "class1"
  }

  const image2 = {
    imagePath = "images/image4.jpg",
    classes = "class2"
  }

  imagesArray = [image1, image2]


  
  for (file of imagesArray) {
    const imgEl = document.createElement('img');
    imgEl.classList.add('imageContainer');
    imgEl.setAttribute("src", file.imagePath); //change to object with imagePath;
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


