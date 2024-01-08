let contentDiv = document.getElementById('content')
let totalPrice =document.getElementById('totalPrice')
let phoneNo = document.querySelector('#phoneNo')
let checkoutBtn = document.querySelector('#checkoutBtn')
let formInputs = document.querySelectorAll('.billingInput')
let cartItems = null

function isFormValid(){
    let price = totalPrice.textContent
    if(parseFloat(price)<=0){
        alert('Cart is empty, continue shopping!')
        return false
    }
    if(phoneNo.value.length < 10){
        alert('Incomplete phone number')
        return false
    }
    for(let i=0;i<formInputs.length;i++){
        if(formInputs[i].value.trim()===''){
            alert(`${formInputs[i].placeholder} input is empty!`)
            return false
        }
    }
    return true;
}

function paymentApi(){
    IntaSend({
        publicAPIKey: "ISPubKey_test_87bb04e5-be8e-49d2-a4e2-a749b532a0f3",
        live: false //set to true when going live
      })
        .on("COMPLETE", (results) => {
          // Handle successful payment
          alert("Payment successful!");
          // Submit the form after successful payment
          form.submit();
        })
        .on("FAILED", (results) => {
          // Handle failed payment
          alert("Payment failed!");
        })
        .on("IN-PROGRESS", (results) => {
          // Handle payment in progress status
          alert("Payment in progress...");
        });
}


checkoutBtn.addEventListener('click',(event)=>{
    let deliveryOption = document.querySelector('#deliveryOptions').value
    if(deliveryOption===''){
        alert('Select delivery option')
        return
    }
    let checkoutModalBackground = document.createElement('div')
    let checkoutModal = document.createElement('div')
    checkoutModalBackground.setAttribute('id','checkoutModalBackground')
    checkoutModal.setAttribute('id','checkoutModal')
    checkoutModal.innerHTML=`
        <h1 style='padding-top: 32px;justify-content:center;align-items:center;' class='title'>Checkout</h1>
        <h2 style='margin-bottom:8px;width:100%;font-family:'Roboto, sans-serif' class='title'>Shipping Info</h2>
        <form id="billingForm"  action='/checkout' method='Post'>
            <input class="billingInput" placeholder="Full Names" type="text" id="fullname" name="fullname" required>
            <input class="billingInput" placeholder="Street" type="text" name="street" id="street" required>
            <input style='margin-bottom:16px;' class="billingInput" placeholder="Zip Code/Address/Location" type="text" name="email" id="email" required>
            <div id='formAdditionSection'></div>
            <input class="billingInput" placeholder="Phone Number" type="text" name="phoneNo" id="phoneNo" required>
            <input class="billingInput" placeholder="Email Address" type="text" name="email" id="email" required>
            <div style='width:100%' id="totalCheckout">
                <div id='totalDiv'>
                    <h4 class="totalElem">Sub total</h4>
                    <h4 class="totalElem" id="subTotal">0</h4>
                </div>
                <div id='totalDiv'>
                    <h4 class="totalElem">Shipping</h4>
                    <h4 class="totalElem" id="shippingPrice">0</h4>
                </div>
                <div id='totalDiv'>
                    <h4 class="totalElem">Total</h4>
                    <h4 class="totalElem" id="totalPriceCheckout">0</h4>
                </div>
            </div>
            <input type="hidden" name="totalPrice" id="total">
            <button type='submit' id='payBtn'>Proceed to Payment</button>
        <form/>
    `
    checkoutModalBackground.appendChild(checkoutModal)
    document.body.appendChild(checkoutModalBackground)
    let addSection = checkoutModalBackground.querySelector('#formAdditionSection')
    if(deliveryOption==='pickUp'){
        addSection.innerHTML=`
        <h1>Works!</h1>
        `
    }
    if(deliveryOption==='cbd'){
        addSection.innerHTML=``
    }
    if(deliveryOption==='parcel'){
        addSection.innerHTML=`
        <input class="billingInput" placeholder="Sacco" type="text" name="sacco" id="sacco" required>
        <input class="billingInput" placeholder="Town" type="text" name="town" id="town" required>
        `
    }
    if(deliveryOption==='mtaani'){
        addSection.innerHTML=`
        <h1>Works!</h1>
        `
    }

    /*event.preventDefault();
    if(!isFormValid()) return
    checkoutBtn.setAttribute('data-amount',10)
  // Trigger IntaSend popup
   paymentApi()
  //calling it twice due to error with intasend
    checkoutBtn.click()*/
})

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
        total+= Number(parseInt(item.price)*item.unit) 
    })
    totalPrice.innerText=total
    document.getElementById('total').value=total
}



function displayCartItems(){
    cartItems.forEach((item,index)=>{
        let {type,catalogue,price,image,unit,colors} = item
        let bigDiv = document.createElement('div')
        bigDiv.classList.add('cartProductDiv')
        bigDiv.innerHTML=`
            <img class='cartProductImage' src='/images/${image}'>
            <div class='productDesc'>
                <h2 class='cartName'>${type}</h2>
                <div class='secondRow'>
                    <h3 class='productCatalogue'>${catalogue}</h3>
                    <h3 class='cartPrice'>${price}</h3>
                </div>
                <div style='display:flex;align-items:center;margin-bottom:8px;margin-top:8px;'>
                    <i class="bi bi-dash-lg" index='${index}'></i>
                    <div class='digitDisplay ' id='div${index}' >${unit}</div>
                    <i class="bi bi-plus-lg " index='${index}'></i>
                </div>
                <div class='colorDiv'>
                </div>
                <div class='thirdRow'>
                    <i index='${index}' class="bi bi-trash3-fill removeBtn"></i>
            
                 </div>
            `
            contentDiv.appendChild(bigDiv)
            addFunc(bigDiv,item)
            subFunc(bigDiv,item)
            removeFunc(bigDiv,item)
        })
        //calcTotal()
}

function selectColor(div){
    let colorDiv=div.querySelector('.colorDiv')
    colorDiv.innerHTML+=`
        
    `
}


function addFunc(div,item){
    let addBtn = div.querySelector('.bi-plus-lg')
    addBtn.addEventListener('click',async()=>{
        let {unit} = item
        unit+=1
        let itemIndex = cartItems.indexOf(item)
        cartItems[itemIndex].unit = unit
        div.querySelector('.digitDisplay').innerText=unit
        calcTotal()
        await updFunc()
    })
}

function subFunc(div,item){
    let subBtn = div.querySelector('.bi-dash-lg')
    subBtn.addEventListener('click',async()=>{
        let {unit} = item
        if(unit!==1){
            unit-=1
            let itemIndex = cartItems.indexOf(item)
            cartItems[itemIndex].unit = unit
            div.querySelector('.digitDisplay').innerText=unit
            calcTotal()
            await updFunc()
        }
    })
}


function removeFunc(div,item){
    let removeBtn =div.querySelector('.removeBtn')
    removeBtn.addEventListener('click',async()=>{
        let index = cartItems.indexOf(item)
        cartItems.splice(index,1)
        calcTotal()
        await updFunc()
        location.reload()
    })
}


async function updFunc(){
    await fetch('/updCart',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({cartItems:cartItems}),
    })
}
document.addEventListener("DOMContentLoaded", function() {
    let form = document.getElementById("checkoutForm");

    form.addEventListener("submit", function(event) {
        let totalPrice = parseFloat(document.getElementById("totalPrice").textContent);
        // Check the condition (totalPrice is 0)
        if (totalPrice === 0) {
            // Prevent the form from submitting
            event.preventDefault();
            // Display an error message or take other actions
            alert("Cart is Empty, continue shopping.");
        }
    });
});
