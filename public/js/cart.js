let cart={};
document.querySelectorAll('.addButton').forEach(function(elem){
    elem.addEventListener('click', addToCart);
});
if(localStorage.getItem('cart')){
    cart = JSON.parse(localStorage.getItem('cart'));
    getCoffeeInform();
}
function addToCart(){
    let coffeeId = this.dataset.coffee_id;
    if(cart[coffeeId]){
        cart[coffeeId]++;
    }else{
        cart[coffeeId]=1;
    }
    //console.log(cart);
    getCoffeeInform();
}

function getCoffeeInform(){
    updateLocalStorageCart();
    fetch('/get_coffee_inform',{
    method:'POST',
    body: JSON.stringify({key: Object.keys(cart)}),
    headers:{
        'Accept': 'application/json',
        'Content-Type' : 'application/json'
        }
    }).then(function(response){
        return response.text();
    }).then(function(body){
    //console.log(body);
    showCart(JSON.parse(body))
    })
};

function showCart(data) {
    let out = '<table class="tableCart"><tbody>';
    let total = 0;
    for(let key in cart){
        out += `<tr><td colspan="4"><a href="/coffee?id=${key}">${data[key]['Название']}</a></td>`;
        out += `<td><i class="fa fa-minus-square cart-minus" data-coffee_id="${key}"></i></td>`;
        out +=  `<td>${cart[key]}</td>`;
        out += `<td><i class="fa fa-plus-square cart-plus" data-coffee_id="${key}"></i></td>`;
        out += `<td>${data[key]['Цена']*cart[key]}грн</td>`;
        out += '</tr>'
        total += cart[key]*data[key]['Цена'];
    }
    out += `<tr><td colspan="3">Total:</td><td>${total}</td></tr>`;
    out +='</tbody></table>';
    document.querySelector('#cartView').innerHTML = out;
    document.querySelectorAll('.cart-minus').forEach(function (element) {
        element.onclick = cartMinus;
    })
    document.querySelectorAll('.cart-plus').forEach(function (element) {
        element.onclick = cartPlus;
    })
    function cartPlus() {
        let coffeeId = this.dataset.coffee_id;
        cart[coffeeId]++;
        getCoffeeInform();
    }
    function cartMinus() {
        let coffeeId = this.dataset.coffee_id;
        if (cart[coffeeId] - 1 > 0) {
            cart[coffeeId]--;
        } else {
            delete(cart[coffeeId]);
        }
        getCoffeeInform();
    }
}

function updateLocalStorageCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}
