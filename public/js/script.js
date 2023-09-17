let cartArray = []
let headerIconsDiv =document.getElementById('headerIconsDiv')
let projectSection = document.querySelectorAll('.projectSection')
let result=null
let addcartBtn
let items =[]


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
      console.error(`Error fetching ${productType} products: ${error}`);
    }
  }
  
  // Call the generic function for different product types
  fetchAndDisplayProducts('Boob Tapes', 'tapeSection');
  fetchAndDisplayProducts('Rabbit', 'rabbitSection');
  fetchAndDisplayProducts('Sex Toys', 'sexSection');

getTopProducts()
getItems()
adminBtn()
async function getItems(){
    let response = await fetch('/allProducts')
    let result = await response.json()
    result=result.result
    result.forEach(item=>items.push(item.name))
}


let list =document.getElementById('list')
let results=document.getElementById('results')
let input = document.getElementById('filter')


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
        list.innerHTML+=`<a href='/product/${item}'><li class="items">${item}</li></a>`
    })
}
document.addEventListener('click', (event) => {
    if (!results.contains(event.target) && !input.contains(event.target)) {
        // Clicked outside the list container, hide the list
        results.style.display = 'none';
    }
});


// Check if the session cookie exists
function isAdmin() {
    var cookies = document.cookie.split('; ');
    alert(cookies)
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].split('=');
        if (cookie[0] === 'braless') {
            return true; // Found the "braless" session cookie
        }
    }
    return false; // "braless" session cookie not found
}


async function adminBtn(){
    if(isAdmin) headerIconsDiv.innerHTML+=`<a href='/admin/dashboard'><button>Admin</button></a>`
}



function productDisplay(result,section = 'content'){
    let contentDiv = document.getElementById(section)
    result.forEach((item, index)=>{
        let {_id,name,type,description,price,image} = item
        let productDiv = document.createElement('div')
        productDiv.classList.add('productDiv')
        productDiv.innerHTML=`
            <a class='imageHyperlink' href='/product/${_id}'>
                <img class='productImage' src='${image}'>
            </a>
            <div class='nameDiv'>
                <h3 class='productName'>${type}</h3>
            </div>
            <div class='nameDiv'>
                <h3 class='productName'>${name}</h3>
                <h4 class='productPrice'>${price}</h4>
            </div>
            <div class='descDiv'>
                <p class='description'>${description}</p>
            </div>
            <button class='cartButton' index='${index}'>Order Now</button>    
        `
        contentDiv.appendChild(productDiv)
    })
    addCartFunc()
}

function addCartFunc(){
    addcartBtn = document.querySelectorAll('.cartButton')
    addcartBtn.forEach((cartBtns)=>{
        cartBtns.addEventListener('click',()=>{
            let index = cartBtns.getAttribute('index')
            cartArray.push(result[ Number(index)])
            localStorage.setItem('cartItems',JSON.stringify(cartArray))
        })
    })
}

