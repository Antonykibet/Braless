displayPopup()

async function displayPopup(){
    const background =document.createElement('div')
    background.classList.add('popupBackground')
    background.innerHTML=trackForm()
    document.body.appendChild(background)
    let input = background.querySelector('#input')
    let subBtn = background.querySelector('#submitBtn')
    subBtn.addEventListener('click',async()=>{
        let requestData = { phonenumber: input.value };
        let response = await fetch('/checkOrder',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(requestData)
        })
        let result = await response.json()
        if(result.length === 0){
            background.querySelector(`#trackForm`).innerHTML=`
                <h3 id='errorMsg'>No ordered Items</h3>
                <a href='/'><button id='continueBtn'>Continue Shopping</button></a>
                `
        }else{
            background.remove()
            let content = document.getElementById('content')
            result.forEach((item,index)=>{
                const {cart,status} = item
                let list = document.createElement('div')
                list.classList.add('orderRecord')
                list.innerHTML=orderList(index,status)
                content.appendChild(list)
                let statusBtn = list.querySelector('.status')
                alert(statusBtn.innerText)
                if(statusBtn.innerText=='processing'){
                    statusBtn.style.background='#4CAF50'
                }
                if(statusBtn.innerText=='shipping'){
                    statusBtn.style.background='#808080'
                }
                if(statusBtn.innerText=='delivered'){
                    statusBtn.style.background='#FFA500'
                }
                if(statusBtn.innerText=='complete'){
                    statusBtn.style.background='#008080'
                }
                let productItems = list.querySelector('.productItems')
                cart.forEach((item)=>{
                    productItems.innerHTML+=`
                    <div>
                        <h4>${item.catalogue}:${item.type}</h4>
                        <h4>Unit:${item.unit}</h4>
                    </div>
                    `
                })
            })
            
        }
    })


}
function trackForm(){
    return `
    <div id='trackForm'>
            <input id='input' type='text' name='phonenumber' placeholder='Enter Phone number used during Checkout'><br>
            <button type id='submitBtn' >Submit</button>
    </div>`
}
function orderList(index,status){
    return `
    <div><h1>${index}</h1></div>
    <div class="productItems">

    </div>

    <div class="status">${status}</div>
    `
}