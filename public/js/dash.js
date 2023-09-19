let lists = document.querySelectorAll('.CRUD')

lists.forEach((list)=>{
    list.addEventListener('click',()=>{
        let modalBackground = document.createElement('div')
        modalBackground.classList.add('modalBackground')
        if(list.getAttribute('id')=='Create') modalBackground.innerHTML=createForm()
        document.body.appendChild(modalBackground)
        modalBackground.querySelector('.closeBtn').addEventListener('click', () => {
            // Close the modal or perform any desired action here
            modalBackground.remove();
        });
    })
})

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