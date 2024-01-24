function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    /* Remove the attribute, and call this function once more: */
                    elmnt.removeAttribute("w3-include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }
}

let menuName = ['High-Protein Pizza', 'ChickenBurger in ProteinBun', 'Cesar Salad mit Protein-Dressing', 'Platzhalter 1', 'Platzhalter 2', 'Platzhalter 3'];
let menuImg = ['./img/pizza.jpg', '','','','',''];
let menuPrice = [11.70, 10.80, 9.50, 11, 12, 13];
let menuAmount = [1, 2, 1, 3, 2, 1];
let cartName = [];
let cartPrice = [];
let cartAmount = [];

function render() {
    includeHTML();

    let menuList = document.getElementById('menuList');

    menuList.innerHTML = ``;

    for (let i = 0; i < menuName.length; i++) {
        const name = menuName[i];
        const price = menuPrice[i];
        const image = menuImg[i];
        const amount = menuAmount[i];

        menuList.innerHTML += /*HTML*/ generateMenuListHTML(name, price, image, amount, i);
    }

    let shoppingCart = document.getElementById('shoppingCart');


}

function generateMenuListHTML(name, price, image, amount, i) {
    return `
    <div id="menuCard${i}" class="menuCard">
        <div class="menuDetails">
            <img src="${image}" alt="">
            <div class="menuDescription">
                <h3>${name}</h3>
                <h4>${price}</h4>
            </div>
        </div>
        <div class="putInCart">
            <div class="numberInput">
                <div class="numberAdd" onclick="menuCountAdd(${i})">+</div>
                <div id="currentCount" class="currentNumber">${amount}</div>
                <div class="numberReduce" onclick="menuCountReduce(${i})">-</div>
            </div>
            <div class="submitBtn"></div>
        </div>
    </div> 
`;
}

function generateShoppingCartHTML (name, price, image, amount, i) {

}

function addMenu(name, price, image, amount, i) {
    
}

function menuCountAdd(i) {
    let Amount = menuAmount[i];
    let newAmount = Amount +1;

    menuAmount.splice(i, 1, newAmount);
    render();
}

function menuCountReduce(i) {
    let Amount = menuAmount[i];
    let newAmount = Amount -1;

    if (newAmount >= 1) {
        menuAmount.splice(i, 1, newAmount);
        render();
        } else {
            return;
        }
}