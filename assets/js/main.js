const contentContainer = document.querySelector("#content-container");
const cartCounterLabel = document.querySelector("#cart-counter-label");

const headerContainer = document.querySelector(".navbar-collapse");

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

const getPhotoGood = (t) => {
    let link = t.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.src;

    console.log(link);
    // return replace(//);
};

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

        disableControls(target, btnClickHandler);

        restoreHTML = target.innerHTML;
        target.innerHTML = `Total ${cartPrise.toFixed(2)}$`;

        setTimeout(() => {
            enableControls(target, btnClickHandler);

            target.innerHTML = restoreHTML;
        }, interval);
    }
};

//Cart_btn------------------------------------------------------

function handleCart(e) {
    const block = document.querySelector(".cart-block");
    const textZero = document.querySelector(".cart-zero");

    const target = e.target;
    
    if (target && (target.classList.contains("fa-shopping-cart") || 
    target.classList.contains("page-header__cart-btn"))) {
        block.classList.toggle("-active");
    }
    
    if (cartCounter === 0) {
        textZero.style.display = "block";
    } else {
        textZero.style.display = "none";
        addGoodIntoArr(target);
    }
}

function addGoodIntoArr(t) {
    let prise = getMockData(t);
    let name = getNameGood(t);
    getPhotoGood(t);

}

contentContainer.addEventListener("click", btnClickHandler);
document.body.addEventListener("click", handleCart);