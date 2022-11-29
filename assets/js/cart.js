const header = document.querySelector(".page-header__navbar");
const block = document.querySelector(".navbar-collapse__block");

function handleCart(e) {
    const target = e.target;
    
    if (target && (target.classList.contains("fa-shopping-cart") || 
    target.classList.contains("page-header__cart-btn"))) {
        block.classList.toggle("-active");
    }
}

header.addEventListener("click", handleCart);
