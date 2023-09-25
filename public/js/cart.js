let contentDiv = document.getElementById('content')
let totalPrice =document.getElementById('totalPrice')
let cartItems = null
async function getCartItems(){
    let response = await fetch('/addCart')
    cartItems = await response.json()
    displayCartItems()
    calcTotal()
}
getCartItems()





function calcTotal(){
    let total = 0
    cartItems.forEach((item)=>{
        total+= Number(item.price*item.unit) 
    })
    totalPrice.innerText=total
}



function displayCartItems(){
    cartItems.forEach((item,index)=>{
        let {type,catalogue,price,image,unit} = item
        let bigDiv = document.createElement('div')
        bigDiv.classList.add('cartProductDiv')
        bigDiv.innerHTML=`
            <img class='cartProductImage' src='${image}'>
            <div class='productDesc'>
                <h2 class='cartName'>${type}</h2>
                <h3>${catalogue}<h3>
                <h3 class='cartPrice'>${price}</h3>
                <div style='display:flex;align-items:center;margin-bottom:8px;'>
                    <i class="bi bi-dash-lg" index='${index}'></i>
                    <div class='digitDisplay ' id='div${index}' >${unit}</div>
                    <i class="bi bi-plus-lg " index='${index}'></i>
                </div>
                <button class='removeBtn index='${index}' >Remove</button>
            </div>
            `
            contentDiv.appendChild(bigDiv)
            addFunc(bigDiv,item)
            subFunc(bigDiv,item)
            removeFunc(bigDiv,item)
        })
        //calcTotal()
}


function addFunc(div,item){
    let addBtn = div.querySelector('.bi-plus-lg')
    addBtn.addEventListener('click',()=>{
        let {unit} = item
        unit+=1
        let itemIndex = cartItems.indexOf(item)
        cartItems[itemIndex].unit = unit
        div.querySelector('.digitDisplay').innerText=unit
        localStorage.setItem('cartItems',JSON.stringify(cartItems))
        calcTotal()
    })
}

function subFunc(div,item){
    let subBtn = div.querySelector('.bi-dash-lg')
    subBtn.addEventListener('click',()=>{
        let {unit} = item
        if(unit!==1){
            unit-=1
            let itemIndex = cartItems.indexOf(item)
            cartItems[itemIndex].unit = unit
            div.querySelector('.digitDisplay').innerText=unit
            localStorage.setItem('cartItems',JSON.stringify(cartItems))
            calcTotal()
        }
    })
}


function removeFunc(div,item){
    let removeBtn =div.querySelector('.removeBtn')
    removeBtn.addEventListener('click',()=>{
        alert('hello')
        let index = cartItems.indexOf(item)
        cartItems.splice(index,1)
        div.remove()
        localStorage.setItem('cartItems',JSON.stringify(cartItems))
        calcTotal()
        
    })
}
