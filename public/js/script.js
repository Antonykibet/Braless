let cartItems = []
let headerIconsDiv =document.getElementById('headerIconsDiv')
let projectSection = document.querySelectorAll('.projectSection')
let result=null
let addcartBtn
let items =[]

async function getCartItems(){
    let response = await fetch('/addCart')
    cartItems = await response.json()
}
getCartItems()
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
        let {_id,catalogue,type,description,price,image} = item
        let productDiv = document.createElement('div')
        productDiv.classList.add('productDiv')
        productDiv.innerHTML=`
            <a class='imageHyperlink' href='/product/${_id}'>
                <img class='productImage' src='${image}'>
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
        if(cartItems.some(cartItem=>cartItem._id===item._id)) return
        cartItems.push(item)
        await fetch('/addCart',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({cartItems:cartItems}),
        })
    })
}

