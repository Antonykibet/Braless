let lists = document.querySelectorAll('.CRUD')
let productList=document.getElementById('productList')
let orderTrack=document.getElementById('orderTrack')
let items = []
let itemsName = []
let orderItems = []
let colorArray=[]
async function getItems(){
    let response = await fetch('/allProducts')
    let result = await response.json()
    result.forEach((item)=>{
        items.push(item)
        itemsName.push(`${item.catalogue}:${item.type}`)
        productList.innerHTML+=`<a href='/product/${item._id}'><li>${item.catalogue}:${item.type}</li></a>`
    })
}
getItems()
getOrderdItems()


function productDropdownFunc(div){
    const productsDropdown = div.querySelector('#productsDropdown')
    itemsName.forEach((item)=>{
        productsDropdown.innerHTML+=`<option  class='productItems' value="${item}" >${item}</option>`
    })
    
}

function updateSelectFunc(div){
    const productsDropdown = div.querySelector('#productsDropdown')
    productsDropdown.addEventListener('change',()=>{  
        const [prodCatalogue,prodType] = productsDropdown.value.split(':')
        const product = items.find((item)=>item.catalogue==prodCatalogue&&item.type==prodType)
        const {catalogue,top,_id,price,description,mainImage,otherImages,type} = product 
        div.querySelector('#identifier').value=_id
        div.querySelector('#topProduct').checked=top
        div.querySelector('#description').value=description
        div.querySelector('#catalogue').value=catalogue
        div.querySelector('#type').value=type
        div.querySelector('#price').value=price
        div.querySelector('#mainImage').value=mainImage
        div.querySelector('#otherImages').value=otherImages
    })
}


function addColor(div){
    let colorName = div.querySelector('#colorName')
    let colorInput =div.querySelector('#colorInput')
    let colorDisplay = div.querySelector('#colorDisplay')
    div.querySelector('#addColorBtn').addEventListener('click',()=>{
        colorArray.push({colorName:colorName.value,colorCode:colorInput.value})
        colorName.value=''
        div.querySelector('#colorData').value=JSON.stringify(colorArray)
        colorDisplay.innerHTML=''
        colorArray.forEach((colorItem)=>{
            colorDisplay.innerHTML+=`
                <div style='height:26px;width:26px;border-radius:13px;background-color:${colorItem.colorCode};margin-left:8px;'></div>
                <p style='margin-left:6px;'>${colorItem.colorName}</p>
            `
        })
    })
}

lists.forEach((list)=>{
    list.addEventListener('click',()=>{
        let modalBackground = document.createElement('div')
        modalBackground.classList.add('modalBackground')
        if(list.getAttribute('id')=='create'){
            modalBackground.innerHTML=createForm()
            addColor(modalBackground)
        } 
        if(list.getAttribute('id')=='update'){
            modalBackground.innerHTML=updateForm()
            productDropdownFunc(modalBackground)
            updateSelectFunc(modalBackground)
        }
        if(list.getAttribute('id')=='delete'){
            modalBackground.innerHTML=deleteForm()
            productDropdownFunc(modalBackground)
        }
        
        
        modalBackground.querySelector('.bi-x-circle').addEventListener('click', () => {
            // Close the modal or perform any desired action here
            modalBackground.remove();
        });
        document.body.appendChild(modalBackground)
    })
})

async function getOrderdItems(){
    let response=await fetch('/admin/orderdItems')
    orderItems=await response.json()
    orderItems.forEach((item,index)=>{
        const {fullname,phoneNo,email,mpesaCode,town,street,sacco,totalPrice} = item
        let cart =item.cart||[]
        let list = document.createElement('div')
        list.classList.add('orderRecord')
        list.innerHTML=orderList(index,fullname,email,phoneNo,mpesaCode,town,street,sacco,totalPrice)
        orderTrack.appendChild(list)

        let productItems = list.querySelector('.productItems')
        cart.forEach((item)=>{
            productItems.innerHTML+=`
            <div>
                <p>${item.catalogue}:${item.type}</p>
                <p>Unit:${item.unit}</p>
            </div>
            `
        })
        let status =list.querySelector('#statusElem')
        status.value=item.status
        status.addEventListener('change',async()=>{
            try {
                const data = {name,status:status.value}
                await fetch('/admin/statusUpdate',{
                    method:'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(data)
                })    
                alert('Success')
            } catch (error) {
                alert('Error: Status not updated')
            }
        })
    })
}

function orderList(index,name,email,phoneNo,mpesaCode,town,street,sacco,totalPrice){
    return `
    <div class='index'><h1></h1></div>
    <div class="credentials">
        <p id="name">${name}</p>
        <p>${email}</p>
        <p>${phoneNo}</p>
    </div>
    <div class="productItems">

    </div>
    <div>
        <p>${mpesaCode}</p>
    </div>
    <div>
        <p>${town}</p>
    </div>
    <div>
        <p>${street}</p>
    </div>
    <div>
        <p>${sacco}</p>
    </div>
    <div>
        <p>${totalPrice}</p>
    </div>
    <div class="status">
        <select name="" id="statusElem">
            <option value="processing">Processing</option>
            <option value="complete">Complete</option>
            <option value="shipping">Shipping</option>
            <option value="delivered">Delivered</option>
        </select>
    </div>

    `
}


function updateForm(){
    return  `
    <div class='modal'>
    <i class="bi bi-x-circle"></i>
    <h1 style='padding-top:24px;'>Update Product</h1>
        <form action="/admin/update" method="post" enctype='multipart/form-data'>
            <label for='productsDropdown'>Product name</label>
            <select class='input' id="productsDropdown" name='prodName'>
                <option  class='productItems'  >Select product Item</option>
            </select>
            <div>
                <label for="catalogue">Catalogue</label>
                <select class='input'  name="catalogue" id="catalogue">
                    <option value="Boob Tapes">Boob Tapes</option>
                    <option value="Bunny Ear">Bunny Ear</option>
                    <option value="Nipple cover">Nipple cover</option>
                    <option value="Sex Toys">Sex Toys</option>
                </select>
            </div>
            <input type='text' id='identifier' name='_id' style='display:none;'>
            <input class='input' id='type' name='type' type="text" placeholder="Type eg 1m x 10cm or small" >
            <input class='input' id='price' name='price' type="text" placeholder="Price(in numerics you can add symbols(/=,$,Ksh) at the end)">
            <input class='input' id='description' name='description' type="text" placeholder="description">
            <h2 id='chooseTitle'>Thumbnail</h2>
            <input class='input' id='mainImage' type="file" name='mainImage' accept='.jpeg, .jpg, .png' placeholder="MainImage" required>
            <h2 id='chooseTitle'>Other images</h2>
            <input class='input' id='otherImages' type="file" name='otherImages' multiple accept='.jpeg, .jpg, .png'  placeholder="Other Images" required>
            
            <div>
                <input class='input' type="checkbox" name="topProduct" id="topProduct">
                <label for="topProduct">To Appear in Top Products Section</label>
            </div>
            <button type ='submit' class='submitBtn'>Update<button>
        </form>
    </div>
    `
}
function createForm(){
    return `
    <div class='modal'>
        <i class="bi bi-x-circle"></i>
        <h1 style='padding-top:24px;'>Create Product</h1>
        <form action="/admin/create" method="post" enctype="multipart/form-data">
            <div>
                <label for="catalogue">Catalogue :</label> 
                <select class='input' name="catalogue" id="catalogue">
                    <option value="Boob Tapes">Boob Tapes</option>
                    <option value="Bunny Ear">Bunny Ear</option>
                    <option value="Nipple cover">Nipple cover</option>
                    <option value="Sex Toys">Sex Toys</option>
                </select>
            </div>
            <input class='input' type="text" name='type' placeholder="Type eg 1m x 10cm or small" required>
            <input class='input' type="text" name='price' placeholder="Price(in numerics you can add symbols(/=,$,Ksh) at the end)"  required>
            <input class='input' type="text" name='description' placeholder="Description" required>
            <input style='display:none;' id='colorData' type='text' name=colorData >

            <h2 id='chooseTitle'>Choose color</h2>
            <div id='colorDiv'>
                <div id='colorDisplay' style='display:flex;align-items:center;'></div>
                    <input class='input'  id='colorName' type='text' placeholder='Color name'>
                    <input id='colorInput' type='color'>
                <div class='submitBtn' id='addColorBtn'>Add</div>
            </div>
            <h2 id='chooseTitle'>Thumbnail</h2>
            <input class='input' type="file" name='mainImage' accept='.jpeg, .jpg, .png' placeholder="MainImage" required>
            <h2 id='chooseTitle'>Other images</h2>
            <input class='input' type="file" name='otherImages' multiple accept='.jpeg, .jpg, .png'  placeholder="Other Images" required>
            <div>
                <input type="checkbox" name="topProduct" id="topProduct">
                <label for="topProduct">To Appear in Top Products Section</label>
            </div>
            <button type='submit' class='submitBtn'>Create</button>
        </form>
    </div>
    `
}

function deleteForm(){
    return `
    <div id='deleteModal' class='modal'>
        <i class="bi bi-x-circle"></i>
        <h1 >Delete Product</h1>
        <form action="/admin/delete" method="post" >
            <label for='productsDropdown'>Product name</label>
            <select class='input' id="productsDropdown" name='prodName'></select>
            <button type='submit'>Delete</button>
        </form>
    </div>
    `
}


//Dropdown menu




//document.addEventListener('click', (event) => {
//    if (!results.contains(event.target) && !input.contains(event.target)) {
        // Clicked outside the list container, hide the list
//        results.style.display = 'none';
//    }
//});

