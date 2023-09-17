//localStorage.removeItem('cartItems')
//alert( localStorage.getItem('cartItems'))
let cartItems = JSON.parse(localStorage.getItem('cartItems'))
let contentDiv = document.getElementById('content')
let totalPrice =document.getElementById('totalPrice')


function calcTotal(){
    let total = 0
    cartItems.forEach((item)=>{
        total+= Number(item.price*item.unit) 
    })
    totalPrice.innerText=total
}



//function displayCart(){}
if(cartItems!==null){
    //cartItems = cartItems
    cartItems.forEach((item,index)=>{
        let {name,price,image,unit} = item
        let bigDiv = document.createElement('div')
        bigDiv.classList.add('cartProductDiv')
        bigDiv.innerHTML=`
                <img class='cartProductImage' src='${image}'>
                <div class='productDesc'>
                    <h2 class='cartName'>${name}</h2>
                    <h3 class='cartPrice'>${price}</h3>
                    <div style='display:flex;align-items:center;margin-bottom:8px;'>
                        <i class="bi bi-dash-lg" index='${index}'></i>
                        <div class='digitDisplay' id='div${index}' >${unit}</div>
                        <i class="bi bi-plus-lg" index='${index}'></i>
                    </div>
                    <button class='removeBtn index='${index}' >Remove</button>
                </div>
        `
        contentDiv.appendChild(bigDiv)
        document.getElementById('itemDiv').innerText= ''
    })
    calcTotal()
}else{
    document.getElementById('itemDiv').innerText='No items'
}

let removeBtns = document.querySelectorAll('.removeBtn')
let addBtns = document.querySelectorAll('.addBtn')
let subsBtns = document.querySelectorAll('.subsBtn')
addBtns.forEach((btn)=>{
    btn.addEventListener('click',()=>{
        let index = btn.getAttribute('index')
        cartItems[index].unit+=1
        let {unit} =cartItems[index]
        document.getElementById(`div${index}`).innerText=unit
        localStorage.setItem('cartItems',JSON.stringify(cartItems))
        calcTotal()
    })
})
subsBtns.forEach((btn)=>{
    btn.addEventListener('click',()=>{
        let index = btn.getAttribute('index')
        let {unit} =cartItems[index]
        if(unit>1){
            unit-=1
            cartItems[index].unit=unit
            document.getElementById(`div${index}`).innerText=unit
            localStorage.setItem('cartItems',JSON.stringify(cartItems))
            calcTotal()
        }
    })
})

removeBtns.forEach((btn)=>{
    btn.addEventListener('click',()=>{
        let index = btn.getAttribute('index')
        cartItems.splice(index,1)
        localStorage.setItem('cartItems',JSON.stringify(cartItems))
        location.reload()
    })
})
