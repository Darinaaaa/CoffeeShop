function getStatus(){
    fetch('/get_all_statuses',
     {
        method: 'POST'
     }
    ).then(function (response){
        return response.text();
     }
    ).then(function(response){
        //console.log(JSON.parse(response));
        showStatus(JSON.parse(response));
    })
}
function showStatus(data){
    let out = '<div class="dropdown"><button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Change Status</button><div class="dropdown-menu" aria-labelledby="dropdownMenuButton">';
    for (let i = 0; i < data.length; i++ ) {
        out += `<a class="dropdown-item" href="/status?id=${data[i]['Id']}">${data[i]['Имя статуса']}</a>`;
    }
    out+='</div></div>';
    document.querySelector('.status').insertAdjacentHTML('beforeend', out);
}
getStatus();
