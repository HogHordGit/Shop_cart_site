const contentContainer = document.querySelector("#content-container");
const cartCounterLabel = document.querySelector("#cart-counter-label");
const cartCounterPrise = document.querySelector(".count-prise");

const block = document.querySelector("#navbarSupportedContent");

let Goods = [];
let cartCounter = 0;
let cartPrise = 0;
let countClose = 0;

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

const getPrice = (t, price) => {
    return Math.round((price + getMockData(t)) * 100) / 100;
};


const btnClickHandler = function(e) {
    const target = e.target;
    const interval = 2000;
    let restoreHTML = null;

    if (typeof(target) !== "object") return;

    if (target && target.classList.contains("item-actions__cart")) {
        cartCounter = incrementCounter(cartCounterLabel, cartCounter);
        cartPrise = getPrice(target, cartPrise);

        cartCounterPrise.innerHTML = `Сумарная цена товаров: ${cartPrise}$`;

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
const cartBlock = document.querySelector(".cart-block");
const blockText = document.querySelector(".cart-body__counter");

//Переписать это в первый хендлер и исправить баг с нажатиями на кнопки

function updateCounter() {
    let text = null;

    text = cartCounter === 1 ? "товар" : cartCounter > 1 && cartCounter < 5 ? "товара" : "товаров";

    blockText.innerHTML = `В корзине ${cartCounter} ${text}`;
}

function handleCart(e) {
    const target = e.target;

    if (!cartCounter) {
        blockText.innerHTML = `В корзине ${cartCounter} товаров`;
    }
    
    if (target && (target.classList.contains("fa-shopping-cart") || 
    target.classList.contains("page-header__cart-btn"))) {
        cartBlock.classList.toggle("-active");
    }
    
    if (target && target.classList.contains("item-actions__cart")){

        showBlock();

        addGoodIntoArr(target);
    }
}

function handleClose(e) {
    const target = e.target;

    if (target && target.classList.contains("cart-content__close")) {
        const arr = document.querySelectorAll(".cart-content__item");

        arr[target.dataset.toClose].remove();

        cartPrise -= Goods[target.dataset.toClose].totalPrice;
        cartCounter -= Goods[target.dataset.toClose].count;
        Goods.splice(target.dataset.toClose, 1);

        showBlock();

        console.log(cartCounter);
        if (cartCounter > 0) {
            addGoodsInCart();
        }

        cartCounterLabel.innerHTML = cartCounter;
        blockText.innerHTML = `В корзине ${cartCounter} товаров`;
        cartCounterPrise.innerHTML = `Сумарная цена товаров: ${cartPrise}$`;
    }
}

function clearCartHandler(e) {
    const target = e.target;

    if(target && target.classList.contains("clear-cart")) {
        clearCart();

        showBlock();

        Goods = [];
        cartPrise = 0;
        cartCounter = 0;
    }
}

function findName(arr, check) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].name === check) {
            arr[i].count += 1;
            arr[i].totalPrice = Math.round((arr[i].totalPrice + arr[i].price) * 100) / 100;
            return true;
        }
    }
    return false;
}

function addGoodIntoArr(t) {
    if(cartCounter > 1) {
        if (findName(Goods, getNameGood(t))) {
            addGoodsInCart();
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
    addGoodsInCart();
}

function createLayOut() {
    const container = document.querySelector(".cart-content");

    const item = document.createElement("div");
    item.classList.add("cart-content__item");

    const left = document.createElement("div");
    left.classList.add("cart-content__left");
    const img = document.createElement("img");
    img.classList.add("cart-content__img");

    const right = document.createElement("div");
    right.classList.add("cart-content__right");

    const close = document.createElement("div");
    close.classList.add("cart-content__close");
    close.setAttribute("data-to-close", countClose);
    countClose++;
    close.innerHTML = "X";
    close.addEventListener("click", handleClose);

    const name = document.createElement("div");
    name.classList.add("cart-content__name");
    const desc = document.createElement("div");
    desc.classList.add("cart-content__desc");

    container.append(item);
    item.append(left);
    item.append(right);
    left.append(img);
    right.append(close);
    right.append(name);
    right.append(desc);

    return {img, name, desc};
}

function clearCart() {
    const arr = document.querySelectorAll(".cart-content__item");

    for (let i = 0; i < arr.length; i++) {
        arr[i].remove();
    }
    countClose = 0;
}

function addGoodsInCart() {
    if (cartCounter >= 1) {
        clearCart();
    }

    for (let i = 0; i < Goods.length; i++) {
        const obj = createLayOut();

        obj.img.setAttribute("src", Goods[i].img);
        obj.name.innerHTML = Goods[i].name;
        obj.desc.innerHTML = `- ${Goods[i].count} шт. цена: ${Goods[i].price} сума: ${Goods[i].totalPrice}$`;
    }
}

function showBlock() {
    const btnsContainer = document.querySelector(".buttons");
    const itemsContainer = document.querySelector(".cart-content");
    const textZero = document.querySelector(".cart-body__text-sm");

    textZero.style.display = cartCounter ? "none" : "block";
    btnsContainer.style.display = cartCounter ? "flex" : "none";
    itemsContainer.style.display = cartCounter ? "block" : "none";
    cartCounterPrise.style.display = cartCounter ? "flex" : "none";
    cartCounterLabel.style.display = cartCounter ? "block" : "none";
}

contentContainer.addEventListener("click", btnClickHandler);

document.body.addEventListener("click", handleCart);

cartBlock.addEventListener("click", clearCartHandler);


