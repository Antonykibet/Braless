let lists = document.querySelectorAll('.CRUD')

lists.forEach((list)=>{
    list.addEventListener('click',()=>{
        let modalBackground = document.createElement('div')
        modalBackground.classList.add('modalBackground')
        modalBackground.innerHTML=`
            <div class='modal'>
                <button class='closeBtn'>X</button>

            </div>
        `
        document.body.appendChild(modalBackground)
        modalBackground.querySelector('.closeBtn').addEventListener('click', () => {
            // Close the modal or perform any desired action here
            modalBackground.remove();
        });
    })
})
