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
const blockText = document.querySelector(".cart-body__counter");
const btnsContainer = document.querySelector(".buttons");
const itemsContainer = document.querySelector(".cart-content");

function updateCounter() {
    let text = null;

    text = cartCounter === 1 ? "товар" : cartCounter > 1 && cartCounter < 5 ? "товара" : "товаров";

    blockText.innerHTML = `В корзине ${cartCounter} ${text}`;
}

function handleCart(e) {
    const textZero = document.querySelector(".cart-body__text-sm");
    const block = document.querySelector(".cart-block");

    const target = e.target;

    if (!cartCounter) {
        blockText.innerHTML = `В корзине ${cartCounter} товаров`;
    }
    
    if (target && (target.classList.contains("fa-shopping-cart") || 
    target.classList.contains("page-header__cart-btn"))) {
        block.classList.toggle("-active");
    }
    
    if (target && target.classList.contains("item-actions__cart")){
        if (cartCounter === 0) {
            textZero.style.display = "block";
            btnsContainer.style.display = "none";
            itemsContainer.style.display = "none";
        } else {
            textZero.style.display = "none";
            btnsContainer.style.display = "flex";
            itemsContainer.style.display = "block";

            addGoodIntoArr(target);

            //убирать кнорки и ставить начальный текст
        }
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
    console.log(Goods);
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
    close.setAttribute("data-to-close", cartCounter - 1);
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

function addGoodsInCart() {
    if (cartCounter > 1) {
        const arr = document.querySelectorAll(".cart-content__item");

        for (let i = 0; i < arr.length; i++) {
            arr[i].remove();
        }
    }

    for (let i = 0; i < Goods.length; i++) {
        const obj = createLayOut();

        obj.img.setAttribute("src", Goods[i].img);
        obj.name.innerHTML = Goods[i].name;
        obj.desc.innerHTML = `- ${Goods[i].count} шт. цена: ${Goods[i].price} сума: ${Goods[i].totalPrice}$`;
    }
}

function handleClose(e) {
    const target = e.target;

    if (target && target.classList.contains("cart-content__close")) {
        const arr = document.querySelectorAll(".cart-content__item");

        arr[target.dataset.toClose].remove();
        cartCounter -= Goods[target.dataset.toClose].count;
        Goods.splice(target.dataset.toClose, 1);

        if (cartCounter === 0) {
            cartCounter = 0;
            cartCounterLabel.style.display = "none";
        }
        if (cartCounter > 0) {
            cartCounterLabel.innerHTML = cartCounter;
        }
        
        //баг, когда много айтемов не работает удаление
    }
}

contentContainer.addEventListener("click", btnClickHandler);
document.body.addEventListener("click", handleCart);
