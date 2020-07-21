function getCategories(){
    fetch('/category',
     {
        method: 'POST'
     }
    ).then(function (response){
        return response.text();
     }
    ).then(function(response){
        //console.log(JSON.parse(response));
        showCategories(JSON.parse(response));
    })
}
function showCategories(data){
    let out = '<li class= "nav-item dropdown"><a href="/" class="nav-link dropdown-toggle" id ="navItem" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Категория</a><div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">';
    for (let i = 0; i < data.length; i++ ) {
        out += `<a class="dropdown-item" href="/cat?id=${data[i]['Id']}">${data[i]['Название']}</a>`;
    }
    out+='</div></li>';
    document.querySelector('#site_header').insertAdjacentHTML('beforeend', out);
}
getCategories();
