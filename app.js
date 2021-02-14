const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const searchTitle = document.getElementById("id1");
const searchArea =  document.getElementById("id2");
const createAnotherArea = document.getElementById("id3");
const createAnotherInput = document.getElementById("id4");
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    let str = `${image.tags}`;
    str =  str.replaceAll(' ','#');
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}","${str}","${image.id}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })

}

const getImages = (query) => {
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => console.log(err))
}

let slideIndex = 0;
const selectItem = (event, img , tags, id) => {
  let element = event.target;
  element.classList.add('added');
  let obj = {
    img:img,
    tags: tags,
    Id:id
  }
  let item = -1,cnt = 0;
  sliders.forEach(i => {
     if(id === i.Id) {
       item = cnt;
     }
     cnt++;
  });
  if (item === -1) {
    sliders.push(obj);
  } else {
    sliders.splice(item, 1);
    element.classList.remove('added');
    //alert('Hey, Already added !')
  }
}
var timer
const createSlider = () => {
  const duration = document.getElementById('duration').value || 1000;
  if(duration<0) {
    alert("Please input positive slide Change duration");
    return;
  }
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  searchTitle.style.display = 'none';
  searchArea.style.display = 'none';
  searchArea.classList.remove("d-flex");

  createAnotherArea.style.display = 'block';
  createAnotherArea.classList.add("d-flex");
  let cnt=0;
  
  sliders.forEach(slide => {
    let str = slide.tags.replaceAll('#',' ');
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<div class="tags-txt">${str}</div><img class="w-100"
    src="${slide.img}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

function createNewSlider(){
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  createAnotherArea.classList.remove("d-flex");
  createAnotherArea.style.display='none';
  searchArea.classList.add("d-flex");
  searchArea.style.display = 'block';
  searchTitle.style.display = 'block';

}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
})

document.getElementById('search').addEventListener('keypress', function(event) {
  if (event.keyCode == 13) {
    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    const search = document.getElementById('search');
    getImages(search.value)
    sliders.length = 0;
  }
});

createAnotherArea.style.display = 'none';
createAnotherArea.classList.remove("d-flex");

sliderBtn.addEventListener('click', function () {
  createSlider()
})
