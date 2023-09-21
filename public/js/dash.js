let lists = document.querySelectorAll('.CRUD')

let items = []
async function getItems(){
    let response = await fetch('/allProducts')
    let result = await response.json()
    result=result.result
    result.forEach(item=>items.push(`${item.catalogue}:${item.type}` ))
}
function renderList(items){
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
                renderList(items);
            });
        
            input.addEventListener('keyup', () => {
                const filteredItems = items.filter(item => item.toLowerCase().includes(input.value));
                renderList(filteredItems);
            });
}
getItems()
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
function updateForm(){
    return  `
    <div class='modal'>
        <button class='closeBtn'>X</button>
        <form action="/admin/create" method="post">
            <div style="position: relative;border: solid;">
                <input type="text" name="product" id="productSearch" placeholder="Product">
                <div id="results"></div>
            </div>
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

