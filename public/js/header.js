let items =[]
async function getItems(){
    let response = await fetch('/allProducts')
    let result = await response.json()
    result=result.result
    result.forEach(item=>items.push(item.name))
}
getItems()

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
        list.innerHTML+=`<a href='/product/${item}'><li class="items">${item}</li></a>`
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

