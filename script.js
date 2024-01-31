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

let menuName = ['HighProtein Pizza', 'ChickenBurger in ProteinBun', 'Cesar Salad', 'Hähnchenfilet mit Couscous', 'Hähnchen Curry Gyros', 'Buffalo Chicken Salad'];
let menuImg = ['./img/pizza.jpg', './img/chickenburger.jpg','./img/cesarsalad.webp','./img/hahncouscous.avif','./img/hahncurry.jpg','./img/buffalochicken.jpg'];
let singlePrice = [11.70, 10.80, 9.50, 11.20, 10.60, 9.70];
let cartName = [];
let cartPrice = [];
let cartAmount = [];

//paar Gerichte, Optik, fertig
//responsive Design

function render() {
    includeHTML();
    generateMenuList();
    generateCartContainer(); 
}

function generateMenuList() {
    let menuList = document.getElementById('menuList');
    menuList.innerHTML = ``;
    for (let i = 0; i < menuName.length; i++) {
        const name = menuName[i];
        const price = singlePrice[i];
        const image = menuImg[i];
        menuList.innerHTML += /*HTML*/ 
        generateMenuListHTML(name, price, image, i);
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

function generateCartContainer() {
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
                shoppingCartContainer.innerHTML += /*HTML*/ 
                generateCartContainerHTML(CName, CPrice, CAmount, posNr, j);
            }
            deliveryOption();
            ifToLessToBring();
        }
}

function generateConfirmation() {
    let shoppingCartContainer = document.getElementById('shoppingCartContainerJS');
    shoppingCartContainer.innerHTML = ``;
    shoppingCartContainer.innerHTML += /*HTML*/ 
        generateConfirmationHTML();
    document.getElementById('deliveryOption').style.display="none";
    document.getElementById('checkoutContainer').innerHTML = ``;
}

function generateConfirmationHTML() {
    return `
    <div class="emptyCart">
            <h2>Vielen Dank für deine Bestellung</h2>
            <div class="orderNowBtn active" onclick="deleteEntireCartMenu()">OK!</div>
        </div>`;
}

function generateEmptyCartHTML() {
    return `
    <div class="emptyCart">
            <h2>Fülle deinen Warenkorb</h2>
            <div>Füge einige leckere Gerichte aus der Speisenkarte hinzu und bestelle dein Essen.</div>
        </div>`;
}

function generateCartContainerHTML(CName, CPrice, CAmount, posNr, j) {
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

function subTotal() {
    let sum = 0;
    for (let i = 0; i < cartPrice.length; i++) {
        sum += cartPrice[i];        
    }
    return sum;
}

function ifToLessToBring() {
    let sum = subTotal();
    if (sum < 15) {
        activatePickup();
    } 
}

function deliveryOption() {
    let deliveryOption = document.getElementById('deliveryOption');
    deliveryOption.style.display="flex";
    deliveryOption.innerHTML = /*HTML*/`
        <div class="delCont">
            <div class="deliveryOptionBtn">
                <div id="deliveryBtn" class="deliveryBtn" onclick=${allowDelivery()}>Lieferung</div>
                <div id="pickupBtn" class="pickupBtn" onclick="activatePickup()">Abholung</div>
            </div>
            <div id="disclaimer" class="disclaimer displayNone">Bitte wähle eine Lieferoption!</div>
        </div>
        <div id="sumContainer" class="sumContainer"></div>
    `;
    totalSum();
}

function totalSum() {
    let deliverySum = document.getElementById('sumContainer');
    let delCosts = deliveryCosts();
    let total = subTotal() + delCosts
    deliverySum.innerHTML = /*HTML*/`
        <div id="deliveryCosts">Lieferkosten: ${delCosts.toFixed(2)} EUR</div>
        <div id="totalCosts"><b>Endsumme: ${total.toFixed(2)} EUR</b></div>
    `;
    orderNowBtnActive();
}

function orderNowBtnActive() {
    if (document.getElementById('pickupBtn').classList.contains('active') == true || document.getElementById('deliveryBtn').classList.contains('active') == true) {
        document.getElementById('checkoutContainer').innerHTML = `
        <div id="orderNowBtn" class="orderNowBtn" onclick="generateConfirmation()">jetzt bestellen!</div>
        <div id="closeCartBtn" class="closeCartBtn" onclick="closeCart()">mehr aussuchen</div>`; 
        document.getElementById('disclaimer').classList.add('displayNone');
        document.getElementById('orderNowBtn').classList.add('active');           
    } 
    if (document.getElementById('pickupBtn').classList.contains('active') == false && document.getElementById('deliveryBtn').classList.contains('active') == false) {
        document.getElementById('checkoutContainer').innerHTML = `
        <div id="orderNowBtn" class="orderNowBtn">jetzt bestellen!</div>
        <div id="closeCartBtn" class="closeCartBtn" onclick="closeCart()">mehr aussuchen</div>`;
        document.getElementById('disclaimer').classList.remove('displayNone');
        document.getElementById('orderNowBtn').classList.remove('active');
    } 
}

function closeCart(){
    document.getElementById('shoppingCartContainer').style.display = 'none';
}

function openCart(){
    document.getElementById('shoppingCartContainer').style.display = 'flex';
}

function allowDelivery() {
    if (subTotal() > 14.99) {
        return "activateDelivery()";
    } 
}

function deliveryCosts() {
    let delCosts = 0;
    if (subTotal() < 29.99 && subTotal() > 14.99) {
        delCosts = 4
    } if (document.getElementById('pickupBtn').classList.contains('active') == true) {
        delCosts = 0
    } 
    return delCosts;
}

function activateDelivery() {
    document.getElementById('deliveryBtn').classList.add('active');
    document.getElementById('pickupBtn').classList.remove('active');
    totalSum();
}

function activatePickup() {
    document.getElementById('pickupBtn').classList.add('active');
    document.getElementById('deliveryBtn').classList.remove('active');
    totalSum();
}

function addMenu(name, price) {
    document.getElementById('shoppingCartContainer').style.display = 'flex';
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

function deleteEntireCartMenu() {
    let length = cartName.length;
    cartName.splice(0, length);
    cartPrice.splice(0, length);
    cartAmount.splice(0, length);
    render();
}