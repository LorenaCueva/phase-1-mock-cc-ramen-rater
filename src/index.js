init()

function init(){
    fetchRamens()
    document.getElementById("edit-ramen").style.display="none"
    document.getElementById("new-ramen").addEventListener('submit', e => addNewRamen(e))
    document.getElementById("edit-ramen").addEventListener('submit', e => editRamen(e))
    document.getElementById("edit_btn").addEventListener('click', e => toggleEditForm(e))
}

function toggleEditForm(e){
    const editForm = document.getElementById("edit-ramen")
    if(editForm.style.display === "none"){
        editForm.style.display = "block"
    }
    else{
        editForm.style.display = "none"
    }
}


function fetchRamens(id = ""){
    fetch(`http://localhost:3000/ramens/${id}`)
    .then(response => response.json())
    .then(ramens => {
        if(id === ""){
            ramens.forEach(ramen => displayMenu(ramen))
            displayRamen(ramens[0])
        }
        else{
            displayRamen(ramens)
        }
    }
        )
    .catch(error => window.alert(error.message))
}

function displayMenu(ramen){
        const menu = document.getElementById("ramen-menu")
        const ramenImage = document.createElement('img')
        ramenImage.src = ramen.image
        ramenImage.id = ramen.id
        ramenImage.addEventListener('click', e=> {
            fetchRamens(e.target.id)
        })
        menu.append(ramenImage)
}

function displayRamen(ramen){
    console.log("display:", ramen.id)
    const menuItemHolder = document.getElementById("ramen-detail")
    const itemDetails = menuItemHolder.children
    itemDetails[0].src = ramen.image
    itemDetails[0].id = ramen.id
    itemDetails[1].innerText = ramen.name
    itemDetails[2].innerText = ramen.restaurant

    document.getElementById("rating-display").innerText = ramen.rating
    document.getElementById("comment-display").innerText = ramen.comment
}

function addNewRamen(e){
    e.preventDefault()
    fetch('http://localhost:3000/ramens',{
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            "name": e.target.name.value,
            "restaurant": e.target.restaurant.value,
            "image": e.target.image.value,
            "rating": e.target.rating.value,
            "comment": e.target.new_comment.value
        })
    })
    .then(response => response.json())
    .then(ramen => {
        displayMenu(ramen)
        displayRamen(ramen)})
    .catch(error => window.alert(error.message))
}

function editRamen(e){
    e.preventDefault()
    const id = document.getElementById("ramen-detail").children[0].id
    let rating = e.target.rating.value
    let comment = e.target.new_comment.value
    if(rating === ""){
         rating = document.getElementById("rating-display").innerText
    }
    if( comment === ""){
        comment = document.getElementById("comment-display").innerText
    }
    fetch(`http://localhost:3000/ramens/${id}`,{
        method: "PATCH",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            "rating": rating,
            "comment": comment
        })
    })
    .then(response => response.json())
    .then(ramen => {
        document.getElementById('edit-ramen').reset()
        document.getElementById("edit-ramen").style.display="none"
        displayRamen(ramen)})
    .catch(error => window.alert(error.message))
}
