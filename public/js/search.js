let searchBtn = document.querySelector('#searchBtn');
let input = document.querySelector('input');

searchBtn.addEventListener('click', showValue);

function showValue() {
        let val = input.value.trim().toLowerCase();
        document.querySelector('#searchInput').setAttribute('href',`/search?Название=${val}`);
        document.querySelector('.searchVal').innerHTML = val;
}