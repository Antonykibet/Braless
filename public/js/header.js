let items 
async function getItems(){
    let response = await fetch('/allProducts')
    items = await response.json()
}
getItems()
adminBtn()
let list =document.getElementById('list')
let results=document.getElementById('results')
let accountDropdown=document.getElementById('accountDropdown')
let accountIcon=document.querySelector('.bi-person-circle')
let input = document.getElementById('filter')


accountIcon.addEventListener(`click`,()=>{
    if(accountDropdown.style.display==`none`){
        accountDropdown.style.display='flex'
    }else{
        accountDropdown.style.display=`none`
    }
})
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
        list.innerHTML+=`<a href='/product/${item._id}'><li class="items">${item.catalogue}:${item.type}</li></a>`
    })
}
function hideOnClickOutside(container, element, property) {
    document.addEventListener('click', (event) => {
        if (!container.contains(event.target) && !element.contains(event.target)) {
            // Clicked outside the list container, hide the list
            container.style[property] = 'none';
        }
    });
}

// Usage
hideOnClickOutside(accountDropdown, accountIcon, 'display');
hideOnClickOutside(results, input, 'display');

async function isAdmin() {
    let response = await fetch('/role')
    let {role} = await response.json()
    return role === 'admin' ? true : false
}
async function adminBtn(){
    if(await isAdmin()) accountDropdown.innerHTML+=`<a href='/admin/dashboard'><p>Admin Dashboard</p></a>`
}
