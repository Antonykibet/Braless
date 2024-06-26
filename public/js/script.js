import { getCartItems,storeCartItems } from "./addCartFunc.js"
let headerIconsDiv =document.getElementById('headerIconsDiv')
let projectSection = document.querySelectorAll('.projectSection')
let result=null
let addcartBtn 

skeleton()
function skeleton(){
    const cardTemplate = document.getElementById('card-template')
    let contentContainer = document.querySelectorAll('.productSection')
    contentContainer.forEach((container)=>{
        for (let i = 0; i < 4; i++) {
            container.append(cardTemplate.content.cloneNode(true))
          }
    })
}



// Carousel on mobile
let currentIndex = 0;
const carousel = document.querySelector('.carousel');
const carouselScreen =document.getElementById('carouselScreen')
const prevBtn = document.querySelector('.bi-arrow-left-circle');
const nextBtn = document.querySelector('.bi-arrow-right-circle');

prevBtn.addEventListener('click',()=>{
    showPrev()
})
nextBtn.addEventListener('click',()=>{
    showNext()
})


function updateCarousel() {
    const offset = -currentIndex * carousel.offsetWidth;
    carousel.style.transform = `translateX(${offset}px)`;
}

function showPrev() {
    if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }
}

function showNext() {
    if (currentIndex < carousel.children.length - 1) {
        currentIndex++;
        updateCarousel();
    }
}





async function getTopProducts(){
    let response = await fetch('/topProducts')
    let result = await response.json()
    productDisplay(result,'topProducts')
}
// Generic function to fetch and display products
async function fetchAndDisplayProducts(productType, sectionId) {
    try {
      let response = await fetch(`/products/${productType}`);
      let result = await response.json();
      productDisplay(result, sectionId);
    } catch (error) {
      alert(`Error fetching ${productType} products: ${error}`);
    }
  }
  
  // Call the generic function for different product types
  fetchAndDisplayProducts('Boob Tapes', 'tapeSection');
  fetchAndDisplayProducts('Bunny Ear', 'bunnySection');
  fetchAndDisplayProducts('Sex Toys', 'sexSection');
  fetchAndDisplayProducts('Nipple cover', 'nippleCover');

getTopProducts()


function productDisplay(result,section = 'content'){
    let contentDiv = document.getElementById(section)
    contentDiv.innerHTML=''
    result.forEach((item, index)=>{
        let {_id,catalogue,type,description,price,image} = item
        let productDiv = document.createElement('div')
        productDiv.classList.add('productDiv')
        productDiv.innerHTML=`
            <a class='imageHyperlink' href='/product/${_id}'>
                <img class='productImage' src='images/${image}'>
            </a>
            <div id='type' class='nameDiv'>
                <h3  class='productName'>${catalogue}</h3>
            </div>
            <div id='type' class='nameDiv'>
                <h4 class='productName'>${type}</h4>
                <h4 class='productPrice'>${price}</h4>
            </div>
            <div class='descDiv'>
                <p class='description'>${description}</p>
            </div>
            <button class='cartButton' index='${_id}'>Add to Cart</button>    
        `
        contentDiv.appendChild(productDiv)
        addCartFunc(productDiv,item)
        
    })
    
}

function addCartFunc(elem,item){
    addcartBtn = elem.querySelector('.cartButton')
    addcartBtn.addEventListener('click', async()=>{
       try {
            let cartItems = await getCartItems()
            if(cartItems.some(cartItem=>cartItem._id===item._id)) return
            cartItems.push(item)
            await storeCartItems(cartItems)
            alert('Item Added to cart')
       } catch (error) {
            alert('Could not add Item to cart, try Again !!')
       }
    })
}
