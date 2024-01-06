let headerIconsDiv =document.getElementById('headerIconsDiv')
let projectSection = document.querySelectorAll('.projectSection')
let result=null
let addcartBtn
let items 

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

 async function getCartItems(){
    let response = await fetch('/addCart')
    let result = await response.json()
    return result
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

getTopProducts()
getItems()

async function getItems(){
    let response = await fetch('/allProducts')
    items = await response.json()
}


let list =document.getElementById('list')
let results=document.getElementById('results')
let accountDropdown=document.getElementById('accountDropdown')
let accountIcon=document.querySelector('.bi-person-circle')
let input = document.getElementById('filter')
adminBtn()

accountIcon.addEventListener(`click`,()=>{
    if(accountDropdown.style.display==`none`){
        accountDropdown.style.display='flex'
    }else{
        accountDropdown.style.display=`none`
    }
})
input.addEventListener('focus',()=>{
    results.style.display='flex'
    renderList(items)
})
input.addEventListener('keyup',()=>{
    let filteredItems = items.filter(item=>item.toLowerCase().includes(input.value))
    renderList(filteredItems)
})
function renderList(items){
    list.innerHTML=``    
    items.forEach((item)=>{
        list.innerHTML+=`<a href='/product/${item._id}'><li class="items">${item.catalogue}:${item.type}</li></a>`
    })
}
function hideOnClickOutside(container, element, property) {
    document.addEventListener('click', (event) => {
        if (!container.contains(event.target) && !element.contains(event.target)) {
            // Clicked outside the list container, hide the list
            container.style[property] = 'none';
        }
    });
}

// Usage
hideOnClickOutside(accountDropdown, accountIcon, 'display');
hideOnClickOutside(results, input, 'display');


// Check if the session cookie exists
async function isAdmin() {
    let response = await fetch('/role')
    let {role} = await response.json()
    return role === 'Admin' ? true : false
}


async function adminBtn(){
    if(await isAdmin()) accountDropdown.innerHTML+=`<a href='/admin/dashboard'><p>Admin Dashboard</p></a>`
}



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
        let cartItems = await getCartItems()
        if(cartItems.some(cartItem=>cartItem._id===item._id)) return
        cartItems.push(item)
        try {
            await fetch('/addCart',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                
                body:JSON.stringify({cartItems:cartItems}),
            })
        } catch (error) {
            alert(`Did not add to cart succesfully:${error}`)
        }
    })
}

