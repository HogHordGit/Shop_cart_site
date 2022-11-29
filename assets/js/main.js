const contentContainer = document.querySelector("#content-container");
const cartCounterLabel = document.querySelector("#cart-counter-label");

const block = document.querySelector("#navbarSupportedContent");

let Goods = [];
let cartCounter = 0;
let cartPrise = 0;

const incrementCounter = (label, ctr) => {
    const counter = ++ctr;
    label.innerHTML = counter;

    if (counter !== 0) {
        label.style.display = "block";
    }

    return counter;
};

const disableControls = (t, func) => {
    t.disabled = true;
    contentContainer.removeEventListener("click", func);
};

const enableControls = (t, func) => {
    t.disabled = false;
    contentContainer.addEventListener("click", func);
};

const getImgGood = (t) => t.parentElement.
                        parentElement.
                        parentElement.
                        firstElementChild.
                        firstElementChild.
                        src.
                        replace(/\D+\d+\/(assets\/img\/\D+\d+.(png|jpg|jepg)$)/g, "$1");

const getNameGood = (t) => t.parentElement.
                        parentElement.
                        firstElementChild.
                        innerHTML;


const getMockData = (t) => +t.
            parentElement.
            previousElementSibling.
            innerHTML.
            replace(/(?:\W|\D+)(\d+)\W\D+(\d+)\W\D+/, "$1.$2");

const getPrice = (t, price) => Math.round(price + getMockData(t) * 100) / 100;

const btnClickHandler = function(e) {
    const target = e.target;
    const interval = 2000;
    let restoreHTML = null;

    if (typeof(target) !== "object") return;

    if (target && target.classList.contains("item-actions__cart")) {
        cartCounter = incrementCounter(cartCounterLabel, cartCounter);
        cartPrise += getPrice(target, cartPrise);
        updateCounter();

        disableControls(target, btnClickHandler);

        restoreHTML = target.innerHTML;
        target.innerHTML = `Total ${cartPrise.toFixed(2)}$`;

        setTimeout(() => {
            enableControls(target, btnClickHandler);

            target.innerHTML = restoreHTML;
        }, interval);
    }
};

//Cart_btn------------------------------------------------------------
const blockText = document.createElement("div");

function updateCounter() {
    let text = null;

    text = cartCounter === 1 ? "товар" : cartCounter > 1 && cartCounter < 5 ? "товара" : "товаров";

    blockText.innerHTML = `В корзине ${cartCounter} ${text}`;
}

function makeLayout() {
    const blockContainer = document.createElement("div");
    const blockBody = document.createElement("div");
    const blockSpan = document.createElement("span");

    blockContainer.classList.add("navbar-collapse__block", "cart-block");
    blockBody.classList.add("cart-block__body", "cart-body");
    blockSpan.classList.add("cart-body__text-sm");

    blockText.classList.add("cart-body__text");
    blockText.innerHTML = `В корзине ${cartCounter} товаров`;
    blockSpan.innerHTML = "Выберите товар и он появится здесь";

    block.append(blockContainer);
    blockContainer.append(blockBody);
    blockBody.append(blockText);
    blockBody.append(blockSpan);
}

function handleCart(e) {
    const textZero = document.querySelector(".cart-body__text-sm");
    const block = document.querySelector(".cart-block");

    const target = e.target;
    
    if (target && (target.classList.contains("fa-shopping-cart") || 
    target.classList.contains("page-header__cart-btn"))) {
        block.classList.toggle("-active");
    }
    
    if (target && target.classList.contains("item-actions__cart")){
        if (cartCounter === 0) {
            textZero.style.display = "block";
        } else {
            textZero.style.display = "none";
            addGoodIntoArr(target);
        }
    }
}

function findName(arr, check) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].name === check) {
            arr[i].count += 1;
            arr[i].totalPrice *= 2;
            return true;
        }
    }
    return false;
}

function addGoodIntoArr(t) {
    if(cartCounter > 1) {
        if (findName(Goods, getNameGood(t))) {
            return;
        }
    }
    
    Goods.push(
        {
            name: getNameGood(t),
            price: getMockData(t),
            totalPrice: getMockData(t),
            img: getImgGood(t),
            count: 1
        }
    );
}

function readAndCreateFromArr() {
    
}

makeLayout();

contentContainer.addEventListener("click", btnClickHandler);
document.body.addEventListener("click", handleCart);