document.querySelector('#coffeeOrder').onsubmit = function(event) {
    event.preventDefault();
    let username = document.querySelector('#username').value.trim();
    let surname = document.querySelector('#surname').value.trim();
    let phone = document.querySelector('#phone').value.trim();
    let email = document.querySelector('#email').value.trim();
    let address = document.querySelector('#address').value.trim();
    let town = document.querySelector('#town').value.trim();

    if (username == '' || surname == '' ||  email == ''|| town == ''|| address == ''|| phone == '') {
        console.log('Не заполнены поля');

    }

    fetch('/finish-order', {
        method: "POST",
        body: JSON.stringify({
            'username':username,
            'surname':surname,
            'email':email,
            'town':town,
            'address':address,
            'phone':phone,
            key: JSON.parse(localStorage.getItem('cart'))
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(function(response) {
        return response.text()
    })
    .then(function(body) {
        if(body == '1') {
          //console.log(body);
        } else {
          console.log("Body not equally");
        }
    })
    localStorage.clear();
}