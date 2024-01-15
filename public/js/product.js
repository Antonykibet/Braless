let continueBtn = document.getElementById('continueBtn')
let productImageMain = document.getElementsByClassName('productImageMain').item(0)
let imgCollection = document.getElementById('imgCollection')
let otherImgDiv = document.getElementById('otherImgDiv')
let images = JSON.parse(document.getElementById('images').innerText)
let colors = JSON.parse(document.getElementById('colorsData').innerText)
let addCartBtn = document.querySelector('#cartBtn')
const item = JSON.parse(document.querySelector('#items').innerText)
let selectedBtn = null; // to keep track of the selected button 
async function getCartItems(){
    let response = await fetch('/addCart')
    return await response.json()
}

continueBtn.addEventListener('click',()=>{
    window.location.href='/'
})
addCartBtn.addEventListener('click', async()=>{
    try {
        let cartItems = await getCartItems()
        if(cartItems.some(cartItem=>cartItem._id===item._id)) return
        cartItems.push(item)
        await fetch('/addCart',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({cartItems:cartItems}),
        })
    } catch (error) {
        alert('Cannot add item to cart')
    }
})
images.forEach((image)=>{
    imgCollection.innerHTML+=`
    <img class="otherImg" src="/images/${image}" alt="">
    `
})
colors.forEach((color)=>{
    let colorDiv = document.createElement('div')
    colorDiv.classList.add('colorDiv')
    colorDiv.innerHTML+=`
        <div class='colorBtn' color='${color.colorCode}' style='background-color:${color.colorCode}'>..</div>
        <h3 class='colorName'>${color.colorName}</h3>
    `
    document.getElementById('colorSection').appendChild(colorDiv)
})
function colorBtnToggler(event){
    if(selectedBtn){
        selectedBtn.style.border='none'
    }
    event.target.style.border='solid rgb(235, 72, 113)'
    selectedBtn = event.target
}
let colorBtns = document.querySelectorAll('.colorBtn')
    colorBtns.forEach((btn)=>{
        btn.addEventListener('click',async(event)=>{
            colorBtnToggler(event)
            await fetch('/colorSelect',{
                method:'POST',
                headers:{
                    'content-type':'application/json',
                },
                body:JSON.stringify({
                    productId:item._id,
                    color:event.target.getAttribute('color')
                })
            })
        })
    })
let otherImg = document.querySelectorAll('.otherImg')
otherImg.forEach((image)=>{
    image.addEventListener('click',()=>{
        let src =image.getAttribute('src')
        productImageMain.setAttribute('src',src)
        otherImg.forEach((otherImage) => {
        otherImage.style.borderColor = 'transparent';
        });
        image.style.borderColor = '#eb4871'
    })
})