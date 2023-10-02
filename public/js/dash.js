let lists = document.querySelectorAll('.CRUD')
let productList=document.getElementById('productList')
let orderTrack=document.getElementById('orderTrack')
let items = []
let itemsName = []
let orderItems = []
async function getItems(){
    let response = await fetch('/allProducts')
    let result = await response.json()
    result=result.result
    result.forEach((item)=>{
        items.push(item)
        itemsName.push(`${item.catalogue}:${item.type}`)
        productList.innerHTML+=`<a href='/product/${item._id}'><li>${item.catalogue}:${item.type}</li></a>`
    })
}
getItems()
getOrderdItems()

function renderSearchList(items){
    results.innerHTML=``    
    items.forEach((item)=>{
        results.innerHTML+=`<li class="items">${item}</li>`
    })
}

function searchFunc(div){
    const input = div.querySelector('#productSearch');
            const results = div.querySelector('#results')
            input.addEventListener('focus', () => {
                results.style.display = 'flex';
                renderSearchList(itemsName);
                let prodList = div.querySelectorAll('.items')
                prodList.forEach((item)=>{
                    item.addEventListener('click',()=>{
                        div.querySelector('#productSearch').value=item.innerHTML
                        const [prodCatalogue,prodType] = item.innerHTML.split(':')
                        const product = items.find((item)=>item.catalogue==prodCatalogue&&item.type==prodType)
                        const {price,description,catalogue,type,top} = product
                        div.querySelector('#price').value=price
                        div.querySelector('#description').value=description
                        div.querySelector('#type').value=type
                        div.querySelector('#topProduct').checked=top
                        div.querySelector('#catalogue').value=catalogue
                        
                    })
                })
            });
        
            input.addEventListener('keyup', () => {
                const filteredItems = itemsName.filter(item => item.toLowerCase().includes(input.value));
                renderSearchList(filteredItems);
                let prodList = div.querySelectorAll('.items')
                prodList.forEach((item)=>{
                    item.addEventListener('click',()=>{
                        div.querySelector('#productSearch').value=item.innerHTML
                    })
                })
            });
}

lists.forEach((list)=>{
    list.addEventListener('click',()=>{
        let modalBackground = document.createElement('div')
        modalBackground.classList.add('modalBackground')
        if(list.getAttribute('id')=='create') modalBackground.innerHTML=createForm()
        if(list.getAttribute('id')=='update'){
            modalBackground.innerHTML=updateForm()
            searchFunc(modalBackground)
        }
        
        modalBackground.querySelector('.closeBtn').addEventListener('click', () => {
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
        const {_id,name,phoneNo,email,cart,} = item
        let list = document.createElement('div')
        list.classList.add('orderRecord')
        list.innerHTML=orderList(index,name,email,phoneNo)
        orderTrack.appendChild(list)

        let productItems = list.querySelector('.productItems')
        cart.forEach((item)=>{
            productItems.innerHTML+=`
            <div>
                <h4>${item.catalogue}:${item.type}</h4>
                <h4>Unit:${item.unit}</h4>
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

function orderList(index,name,email,phoneNo){
    return `
    <div><h1>${index}</h1></div>
    <div class="credentials">
        <h4 id="name">${name}</h4>
        <h4>${email}</h4>
        <h4>${phoneNo}</h4>
    </div>
    <div class="productItems">

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
        <button class='closeBtn'>X</button>
        <form action="/admin/create" method="post">
            <div style="position: relative;border: solid;">
                <input type="text" name="product" id="productSearch" placeholder="Product">
                <div id="results"></div>
            </div>
            <input id='price' type="text" placeholder="price">
            <input id='mainImage' type="text" placeholder="mainImage">
            <input id='description' type="text" placeholder="description">
            <div>
                <label for="catalogue">Catalogue</label>
                <select  name="catalogue" id="catalogue">
                    <option value="Boob Tapes">Boob Tapes</option>
                    <option value="Rabbit Bra">Rabbit Bra</option>
                    <option value="Floral">Floral</option>
                    <option value="">Sex Toys</option>
                </select>
            </div>
            <input id='otherImages' type="text" placeholder="Other Images">
            <input id='type' type="text" placeholder="Type eg 1m x 10cm or small">
            <div>
                <input type="checkbox" name="topProduct" id="topProduct">
                <label for="topProduct">To Appear in Top Products Section</label>
            </div>
            <button type ='submit'>Update<button>
        </form>
    </div>
    `
}
function createForm(){
    return `
    <div class='modal'>
        <button class='closeBtn'>X</button>
        <form action="/admin/create" method="post">
            <input type="text" placeholder="price">
            <input type="text" placeholder="mainImage">
            <input type="text" placeholder="description">
            <div>
                <label for="catalogue">Catalogue</label>
                <select name="catalogue" id="catalogue">
                    <option value="Boob Tapes">Boob Tapes</option>
                    <option value="Rabbit Bra">Rabbit Bra</option>
                    <option value="Floral">Floral</option>
                    <option value="">Sex Toys</option>
                </select>
            </div>
            <input type="text" placeholder="Other Images">
            <input type="text" placeholder="Type eg 1m x 10cm or small">
            <div>
                <input type="checkbox" name="topProduct" id="topProduct">
                <label for="topProduct">To Appear in Top Products Section</label>
            </div>
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

