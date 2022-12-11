class ShopCart {
    constructor() {
        this.contentContainer = document.querySelector("#content-container");
        this.cartCounterLabel = document.querySelector("#cart-counter-label");
        this.cartCounterPrise = document.querySelector(".count-prise");
        this.cartBlock = document.querySelector(".cart-block");
        this.blockText = document.querySelector(".cart-body__counter");

        this.Goods = [];
        this.cartCounter = 0;
        this.cartPrise = 0;
        this.countClose = 0;
    }

    btnClickHandler(e) {
        const target = e.target;
        const interval = 1500;
        let restoreHTML = null;
    
        if (typeof(target) !== "object") return;
    
        if (target && target.classList.contains("item-actions__cart")) {
            this.cartCounter = this.incrementCounter(this.cartCounterLabel, this.cartCounter);
            this.cartPrise = this.getPrice(target, this.cartPrise);
    
            this.cartCounterPrise.innerHTML = `Сумарная цена товаров: ${this.cartPrise}$`;
    
            this.updateCounter();

            this.showBlock();
    
            this.addGoodIntoArr(target);
    
            this.disableControls(target, this.btnClickHandler);

            restoreHTML = target.innerHTML;
            target.innerHTML = `Total ${this.cartPrise.toFixed(2)}$`;
    
            setTimeout(() => {
                this.enableControls(target, this.btnClickHandler);
    
                target.innerHTML = restoreHTML;
            }, interval);
        }
    }
    cartHandler(e) {
        const target = e.target;
    
        if (!this.cartCounter) {
            this.blockText.innerHTML = `В корзине ${this.cartCounter} товаров`;
        }
        
        if (target && (target.classList.contains("fa-shopping-cart") || 
        target.classList.contains("page-header__cart-btn"))) {
            this.cartBlock.classList.toggle("-active");
        }
    }
    closeHandler(e) {
        const target = e.target;
    
        if (target && target.classList.contains("cart-content__close")) {
            const arr = document.querySelectorAll(".cart-content__item");
    
            arr[target.dataset.toClose].remove();
    
            this.cartPrise = Math.round((this.cartPrise - this.Goods[target.dataset.toClose].totalPrice) * 100) / 100;
            this.cartCounter -= this.Goods[target.dataset.toClose].count;
            this.Goods.splice(target.dataset.toClose, 1);
    
            this.showBlock();
    
            if (this.cartCounter > 0) {
                this.addGoodsInCart();
            }
    
            this.cartCounterLabel.innerHTML = this.cartCounter;
            this.blockText.innerHTML = `В корзине ${this.cartCounter} товаров`;
            this.cartCounterPrise.innerHTML = `Сумарная цена товаров: ${this.cartPrise}$`;
        }
    }
    clearCartHandler(e) {
        const target = e.target;
    
        if(target && target.classList.contains("clear-cart")) {
            this.clearCart();
    
            this.Goods = [];
            this.cartPrise = 0;
            this.cartCounter = 0;
    
            this.showBlock();
        }
    }
    incrementCounter(label, ctr) {
        const counter = ++ctr;
        label.innerHTML = counter;
    
        if (counter !== 0) {
            label.style.display = "block";
        }
    
        return counter;
    }
    disableControls(t, func) {
        const items = document.querySelectorAll(".item-actions__cart");
        
        this.iterationControlsFor(true, items);
        
        this.contentContainer.removeEventListener("click", func);
    }
    enableControls(t, func) {
        const items = document.querySelectorAll(".item-actions__cart");

        this.iterationControlsFor(false, items);

        this.contentContainer.addEventListener("click", func);
    }
    iterationControlsFor(flag, arr) {
        for (let i = 0; i < arr.length; i++) {
            arr[i].disabled = flag;
        }
    }
    getImgGood(t) {
        return t.parentElement.
                parentElement.
                parentElement.
                firstElementChild.
                firstElementChild.
                src.
                replace(/\D+\d+\/(assets\/img\/\D+\d+.(png|jpg|jepg)$)/g, "$1");
    } 
    getNameGood(t) {
        return t.parentElement.
            parentElement.
            firstElementChild.
            innerHTML;
    } 
    getMockData(t) {
        return +t.
            parentElement.
            previousElementSibling.
            innerHTML.
            replace(/(?:\W|\D+)(\d+)\W\D+(\d+)\W\D+/, "$1.$2");
    } 
    getPrice(t, price) {
        return Math.round((price + this.getMockData(t)) * 100) / 100;
    }
    updateCounter() {
        let text = null;
    
        text = this.cartCounter === 1 ? "товар" : this.cartCounter > 1 && this.cartCounter < 5 ? "товара" : "товаров";
    
        this.blockText.innerHTML = `В корзине ${this.cartCounter} ${text}`;
    }
    findName(arr, check) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].name === check) {
                arr[i].count += 1;
                arr[i].totalPrice = Math.round((arr[i].totalPrice + arr[i].price) * 100) / 100;
                return true;
            }
        }
        return false;
    }
    addGoodIntoArr(t) {
        if(this.cartCounter > 1) {
            if (this.findName(this.Goods, this.getNameGood(t))) {
                this.addGoodsInCart();
                return;
            }
        }
        
        this.Goods.push(
            {
                name: this.getNameGood(t),
                price: this.getMockData(t),
                totalPrice: this.getMockData(t),
                img: this.getImgGood(t),
                count: 1
            }
        );
        this.addGoodsInCart();
    }
    createLayOut() {
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
        close.setAttribute("data-to-close", this.countClose);
        this.countClose++;
        close.innerHTML = "X";
        close.addEventListener("click", this.closeHandler.bind(this));
    
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
    clearCart() {
        const arr = document.querySelectorAll(".cart-content__item");
    
        for (let i = 0; i < arr.length; i++) {
            arr[i].remove();
        }
        this.countClose = 0;
    }
    addGoodsInCart() {
        if (this.cartCounter >= 1) {
            this.clearCart();
        }
    
        for (let i = 0; i < this.Goods.length; i++) {
            const obj = this.createLayOut();
    
            obj.img.setAttribute("src", this.Goods[i].img);
            obj.name.innerHTML = this.Goods[i].name;
            obj.desc.innerHTML = `- ${this.Goods[i].count} шт. цена: ${this.Goods[i].price} сума: ${this.Goods[i].totalPrice}$`;
        }
    }
    showBlock() {
        const btnsContainer = document.querySelector(".buttons");
        const itemsContainer = document.querySelector(".cart-content");
        const textZero = document.querySelector(".cart-body__text-sm");
    
        textZero.style.display = this.cartCounter ? "none" : "block";
        btnsContainer.style.display = this.cartCounter ? "flex" : "none";
        itemsContainer.style.display = this.cartCounter ? "block" : "none";
        this.cartCounterPrise.style.display = this.cartCounter ? "flex" : "none";
        this.cartCounterLabel.style.display = this.cartCounter ? "block" : "none";
    }
    init() {
        this.contentContainer.addEventListener("click", this.btnClickHandler.bind(this));
        document.body.addEventListener("click", this.cartHandler.bind(this));
        this.cartBlock.addEventListener("click", this.clearCartHandler.bind(this));
    }
}

export default ShopCart;