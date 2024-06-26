import { getCartItems,storeCartItems } from "./addCartFunc.js"

let contentDiv = document.getElementById('content')
let totalPrice =document.getElementById('totalPrice')
let phoneNo = document.querySelector('#phoneNo')
let checkoutModalBtn = document.querySelector('#checkoutModalBtn')
let formInputs = document.querySelectorAll('.billingInput')
let deliveryOptions = document.getElementById('deliveryOptions')
let pickupMtaaniDiv = document.getElementById('pickupMtaani')
let cartItems = null

/*deliveryOptions.addEventListener('change',(event)=>{
    let pickupMtaaniDiv = document.getElementById('pickupMtaani')
    if(event.target.value=='mtaani'){
        renderAgents(pickupMtaaniDiv)
    }else{
        pickupMtaaniDiv.innerHTML=''
    }
})*/

window.pickUpMtaaniOption(deliveryOptions,pickupMtaaniDiv);

/*let agents=null
async function getAgents(){
    let response = await fetch('/agents')
    return await response.json()
}

async function renderAgents(div){
    div.innerHTML=``
    let agents = await getAgents()
    agents.forEach((item)=>{
        let agentDiv = document.createElement('div')
        let label = document.createElement('label')
        let selectElem = document.createElement('select')
        selectElem.classList.add('pickupSelect')
        label.classList.add('pickupLabel')
        label.textContent=`${item.location}: `
        item.agents.forEach((item)=>{
            selectElem.innerHTML+=`<option class='pickupOption' style='width:100%;' value='${item}'>${item}</option>`
        })
        selectElem.addEventListener('change',()=>{
            checkoutModalBtn.setAttribute('location',selectElem.value)
        })
        agentDiv.append(label,selectElem)
        div.append(agentDiv)
    })
}
*/
function isDeliveryOptionsFormValid(deliveryOption){
    if (calcTotal() <= 0) {
        alert('Cart is empty!!')
        return false
    }
    if(deliveryOption===''){
        alert('Select delivery option')
        return false
    }
    return true
}

function isCheckoutFormValid(div){
    let phoneNo = div.querySelector('#phoneNo')
    let formInputs =div.querySelectorAll('.billingInput')
    if(phoneNo.value.length < 10){
        alert('Incomplete phone number')
        return true
    }
    for(let i=0;i<formInputs.length;i++){
        if(formInputs[i].value.trim()===''){
            alert(`${formInputs[i].placeholder} input is empty!`)
            return true
        }
    }
    return false;
}

function paymentApi(form){
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
          alert("Payment failed! "+results );
        })
        .on("IN-PROGRESS", (results) => {
          // Handle payment in progress status
          alert("Payment in progress...");
        });
}


checkoutModalBtn.addEventListener('click',async(event)=>{
    let deliveryOption = document.querySelector('#deliveryOptions').value
    if(!isDeliveryOptionsFormValid(deliveryOption)){
        return
    }
    document.getElementById('billingDiv').style.display='none'
    let deliveryLocation = event.target.getAttribute('location')
    let checkoutModalBackground = document.createElement('div')
    let checkoutModal = document.createElement('div')
    checkoutModalBackground.setAttribute('id','checkoutModalBackground')
    checkoutModal.setAttribute('id','checkoutModal')
    checkoutModal.innerHTML= await checkoutModalHtml(deliveryLocation,deliveryOption)
    checkoutModalBackground.appendChild(checkoutModal)
    document.body.appendChild(checkoutModalBackground)
    intlPhoneNoRender(checkoutModal)
    let closeBtn = checkoutModal.querySelector('.bi-x-circle')
    closeBtn.addEventListener('click',(event)=>{
        document.getElementById('billingDiv').style.display='flex'
        checkoutModalBackground.remove()
    })
    let checkoutBtn = checkoutModal.querySelector('#checkoutBtn')
    checkoutBtn.addEventListener('click',(event)=>{
        event.preventDefault();
        displayPopup()
         // Handle continuation after modal form submission
        const modalForm = document.getElementById('mpesaInstructionModal'); // Get the modal form
        modalForm.addEventListener('submit', (modalEvent) => {
            modalEvent.preventDefault(); // Prevent default modal form submission
            checkoutModal.querySelector('#checkoutMpesaCode').value=modalForm.querySelector('#mpesaCode').value
            // Process modal form data (as shown in displayPopup())

            // Now resume checkout form submission
            const checkoutForm = event.target.form; // Get the checkout form element
            checkoutForm.submit(); // Submit the checkout form
        });
    })
    let addSection = checkoutModalBackground.querySelector('#formAdditionSection')
    if(deliveryOption==='parcel'){
        addSection.innerHTML=`
        <input style='width:97%;' class="billingInput" placeholder="Sacco" type="text" name="sacco" id="sacco" required>
        <input style='width:97%;' class="billingInput" placeholder="Town" type="text" name="town" id="town" required>
        `
    }
    if(deliveryOption==='parcelEast'){
        addSection.innerHTML=`
        <input style='width:97%;' class="billingInput" placeholder="Country" type="text" name="country" id="country" required>
        <input style='width:97%;' class="billingInput" placeholder="Town" type="text" name="town" id="town" required>
        `
    }
})


async function init(){
    cartItems = await getCartItems()
    displayCartItems()
    totalPrice.innerText= calcTotal()
}
init()

function intlPhoneNoRender(div){
    const phoneInput = div.querySelector("#phoneNo");
        window.intlTelInput(phoneInput, {
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
            autoInsertDialCode: true,
            nationalMode:false,
            initialCountry: "auto",
            geoIpLookup: function(callback) {
                fetch("https://ipapi.co/json")
                .then(function(res) { return res.json(); })
                .then(function(data) { callback(data.country_code); })
                .catch(function() { callback("us"); });
            }
        });
}

async function checkoutModalHtml(deliveryLocation,deliveryOption){
    async function getShippingCost() {
        if(deliveryOption=='parcel') return 350;
        if(deliveryOption=='parcelEast') return 800;
        if(deliveryOption=='cbdDelivery') return 100;
        if(deliveryOption=='pickupMtaani') {
            return await window.getPickupMtaaniCost();
        }
        return 0;
    }
    let deliveryPrice = await getShippingCost()
    return `
    <i class="bi bi-x-circle"></i>
    <input style='display:none;' name='location' value='${deliveryLocation}'>
    <h1 style='padding-top: 0px;margin-bottom:16px;justify-content:center;align-items:center;' class='title'>Checkout</h1>
    <form id="billingForm"  action='/checkout' method='Post'>
        <div style='width:90%' id='pickupMtaaniOptions'></div>
        <input class="billingInput" placeholder="Full Names" type="text" id="fullname" name="fullname" required>
        <input class="billingInput" placeholder="Street" type="text" name="street" id="street" required>
        <input style='margin-bottom:16px;' class="billingInput" placeholder="Zip Code/Address/Location" type="text" name="address" id="email" required>
        <div id='formAdditionSection'></div>
        <input class="billingInput"  type="text" name="pickupMtaani" value='${window.selectedPickupMtaaniAgent}' hidden>
        <input class="billingInput" placeholder="Phone Number" type="text" name="phoneNo" id="phoneNo" required>
        <input class="billingInput" placeholder="Email Address" type="text" name="email" id="email" required>
        <input type='hidden' name='items' value='${JSON.stringify(cartItems)}'>
        <input type='hidden' id='checkoutMpesaCode' name='mpesaCode' value=''>
        <div style='width:100%' id="totalCheckout">
            <div id='totalDiv'>
                <h4 class="totalElem">Sub total</h4>
                <h4 class="totalElem" id="subTotal">${calcTotal()}</h4>
            </div>
            <div id='totalDiv'>
                <h4 class="totalElem">Shipping</h4>
                <h4 class="totalElem" id="shippingPrice">${deliveryPrice}</h4>
            </div>
            <div id='totalDiv'>
                <h4 class="totalElem">Total</h4>
                <h4 class="totalElem" id="totalPriceCheckout">${calcTotal() + deliveryPrice}</h4>
            </div>
        </div>
        <input type="hidden" name="totalPrice" id="total" value='${calcTotal() + deliveryPrice}'>
        <button type="submit" class="intaSendPayButton" id="checkoutBtn"  data-amount="10" data-currency="KES" >Proceed to payment</button>
    <form/>
  `
}



function calcTotal(){
    let total = 0
    cartItems.forEach((item)=>{
        total+= Number(parseInt(item.price)*item.unit) 
    })
    return total;
}

async function getSelectedColors(){
    let response = await fetch('/colorSelect')
    return response.json()
}

async function displayCartItems(){
    let selectedColors = await getSelectedColors()
    cartItems.forEach((item,index)=>{
        let {_id,type,catalogue,price,image,unit,colors} = item
        let selectedColor =selectedColors.find((colorItem)=>colorItem.productId===_id)
        let backgroundColor = null 
        if(selectedColor){
            backgroundColor = selectedColor.color
        }else{
            backgroundColor ='white'
        }
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
                <div class='colorDiv' style='background-color:${backgroundColor};margin-top:8px;'>
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
    totalPrice.innerText= calcTotal()
    await storeCartItems(cartItems)
}

async function displayPopup(){
    const background =document.createElement('div')
    background.classList.add('popupBackground')
    background.innerHTML=mpesaCodeModal()
    document.body.appendChild(background)
    /*let mpesaCodeSubmit = background.querySelector('#mpesaCodeSubmit')
    mpesaCodeSubmit.addEventListener('click',async()=>{
        alert('working')
        form.submit()
        localStorage.removeItem('modalShown')
    })
    localStorage.setItem('modalShown', true);*/
}
function mpesaCodeModal(){
    return `
    <div class='mpesaCodeModal'>
        <h1 style='width:100%'>Instructions</h1>
        <label>To pay via mpesa:</label>
        <ul>
            <li>Go to sim tool kit</li>
            <li>Click on Mpesa</li>
            <li>Click on Lipa na Mpesa</li>
            <li>Click on Buy Goods and Services</li>
            <li>Enter till number:</li>
            <li>Once you get the confirmation message, copy the code and paste it below</li>
        </ul>
        <form id='mpesaInstructionModal' style='width:100%;display:flex; justify-content:center;align-items:center;flex-direction:column;'>
            <input id='mpesaCode' style='margin-bottom:16px; width:90%' placeholder='Enter mpesa code'/>
            <button id='mpesaCodeSubmit' style='height:24px;border-radius:4px;width:50%;'>Complete Payment</button>
        </form>
    </div>`
}