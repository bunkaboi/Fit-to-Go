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

let menuName = ['HighProtein Pizza', 'ChickenBurger in ProteinBun', 'Cesar Salad mit Protein-Dressing', 'Platzhalter 1', 'Platzhalter 2', 'Platzhalter 3'];
let menuImg = ['./img/pizza.jpg', '','','','',''];
let singlePrice = [11.70, 10.80, 9.50, 11, 12, 13];
let cartName = [];
let cartPrice = [];
let cartAmount = [];

//Summenbildung mit mindestbestellwert lieferung/abholung...paar Gerichte, Optik, fertig
//lieferung button muss bleiben wenn man reduziert oder added
function render() {
    includeHTML();
    generateMenuList();
    generateCartMenu();
    
}

function generateMenuList() {
    let menuList = document.getElementById('menuList');
    menuList.innerHTML = ``;
    for (let i = 0; i < menuName.length; i++) {
        const name = menuName[i];
        const price = singlePrice[i];
        const image = menuImg[i];
        menuList.innerHTML += /*HTML*/ generateMenuListHTML(name, price, image, i);
    }
}

function generateMenuListHTML(name, price, image, i) {
    return `
    <div id="menuCard${i}" class="menuCard">
        <div class="menuDetails">
            <img src="${image}" alt="">
            <div class="menuDescription">
                <h3>${name}</h3>
                <h4>${price.toFixed(2)} EUR</h4>
            </div>
        </div>
        <div class="putInCart">
            <div class="addMenuBtn" onclick="addMenu('${name}', ${price})">+</div>
        </div>
    </div> 
    `;
}

function generateCartMenu() {
    let shoppingCartContainer = document.getElementById('shoppingCartContainerJS');
    shoppingCartContainer.innerHTML = ``;
    if (cartName.length <= 0) {
        shoppingCartContainer.innerHTML = generateEmptyCartHTML ();
        document.getElementById('deliveryOption').style.display="none";
    } else {
        for (let j = 0; j < cartName.length; j++) {
            const CName = cartName[j];
            const CPrice = cartPrice[j];
            const CAmount = cartAmount[j];
            const posNr= +[j]+1;
            shoppingCartContainer.innerHTML += /*HTML*/ generateCartMenuHTML(CName, CPrice, CAmount, posNr, j);
        }
        deliveryOption();
    }
}

function deliveryOption() {
    let deliveryOption = document.getElementById('deliveryOption');
    deliveryOption.style.display="flex";
    deliveryOption.innerHTML = /*HTML*/`
        <div class="deliveryOptionBtn">
            <div id="deliveryBtn" class="deliveryBtn" onclick="activateDelivery()">Lieferung</div>
            <div id="pickupBtn" class="pickupBtn" onclick="activatePickup()">Abholung</div>
        </div>
    `;
}

function activateDelivery() {
    document.getElementById('deliveryBtn').classList.add('active')
    document.getElementById('pickupBtn').classList.remove('active')
}

function activatePickup() {
    document.getElementById('pickupBtn').classList.add('active')
    document.getElementById('deliveryBtn').classList.remove('active')
}

function generateEmptyCartHTML () {
    return `
    <div>deine Bestellung bitte</div>`;
}

function generateCartMenuHTML(CName, CPrice, CAmount, posNr, j) {
    return `
    <div class="cartMenuContainer">
        <div id="cartMenu${j}" class="cartMenu">
            <div class="posMenu">
                <div>${posNr}</div>.&nbsp;&nbsp;
                <div><b>${CName}</b></div>
            </div>
            <div>${CPrice.toFixed(2)} EUR</div>
        </div>
        <div class="addCount">
            <div class="reduce" onclick="cartCountReduce(${j})">-</div>
            <div class="number">${CAmount}</div>
            <div class="add" onclick="cartCountAdd(${j})">+</div>
        </div>
    </div>
    `;
}

function addMenu(name, price) {
    let index = cartName.indexOf(name);
    if (index == -1) {
    cartName.push(name);
    cartPrice.push(price);
    cartAmount.push(1);
    } else {
        cartCountAdd(index);
    }
    render();
}

function cartCountAdd(j) {
    let index = menuName.indexOf(cartName[j])
    let Amount = cartAmount[j];
    let newAmount = Amount +1;
    let Price = singlePrice[index];
    
    let newPrice = newAmount * Price;
    cartPrice.splice(j, 1, newPrice);
    cartAmount.splice(j, 1, newAmount);
    
    render();
}

function cartCountReduce(j) {
    let index = menuName.indexOf(cartName[j])
    let Amount = cartAmount[j];
    let newAmount = Amount -1;
    let Price = singlePrice[index];

    let newPrice = newAmount * Price;

    if (newAmount >= 1) {
        cartPrice.splice(j, 1, newPrice);
        cartAmount.splice(j, 1, newAmount);
        render();
        } else {
            deleteCartMenu(j);
        }
}

function deleteCartMenu(j) {
    cartName.splice(j, 1);
    cartPrice.splice(j, 1);
    cartAmount.splice(j, 1);
    render();
}