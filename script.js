let cart = [];
let totalPrice = 0;


fetch('products.json')
  .then(response => response.json())
  .then(products => {
   
    displayProducts(products);
  })
  .catch(error => {
    console.error('Error fetching products:', error);
  });

function displayProducts(products) {
  let productsContainer = document.getElementById('products');

  products.forEach(product => {
    let productElement = document.createElement('div');
    productElement.classList.add('product');
    productElement.dataset.id = product.id;
    productElement.dataset.name = product.name;
    productElement.dataset.price = product.price;

    let img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    productElement.appendChild(img);

    let nameParagraph = document.createElement('p');
    nameParagraph.textContent = product.name;
    productElement.appendChild(nameParagraph);

    let priceParagraph = document.createElement('p');
    priceParagraph.textContent = `Price: $${product.price.toFixed(2)}`;
    productElement.appendChild(priceParagraph);

    let addButton = document.createElement('button');
    addButton.textContent = 'Add to Cart';
    addButton.addEventListener('click', () => addProductToCart(product.id));
    productElement.appendChild(addButton);

    let plusButton = document.createElement('button');
    plusButton.textContent = '+';
    plusButton.classList.add('plus-btn');
    plusButton.addEventListener('click', () => increasePrice(product.id));
    productElement.appendChild(plusButton);

    productsContainer.appendChild(productElement);
  });
}

function addProductToCart(productId) {
    let product = document.querySelector(`[data-id="${productId}"]`);
    let productName = product.dataset.name;
    let productPrice = parseFloat(product.dataset.price);

    
    let existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity += 1; 
        existingProduct.price += productPrice; 
    } else {
        cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
    }
    
    totalPrice += productPrice;

    updateCart();
}

function updateCart() {
    let cartItemsElement = document.getElementById('cart-items');
    let totalElement = document.getElementById('total-price');
    let averageElement = document.getElementById('average-price');

    cartItemsElement.innerHTML = ''; 

    cart.forEach(item => {
        let cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');

        let itemDetails = document.createElement('p');
        itemDetails.textContent = `${item.name} (x${item.quantity}) - $${item.price.toFixed(2)}`;
        cartItemElement.appendChild(itemDetails);

        let removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-btn');
        removeButton.addEventListener('click', () => removeProductFromCart(item.id));
        cartItemElement.appendChild(removeButton);

        cartItemsElement.appendChild(cartItemElement);
    });

    totalElement.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
    if (cart.length > 0) {
        averageElement.textContent = `Average Price: $${(totalPrice / cart.length).toFixed(2)}`;
    } else {
        averageElement.textContent = `Average Price: $0.00`;
    }
}

function clearCart() {
    cart = [];
    totalPrice = 0;
    updateCart();
}

function toggleCart() {
    let cartElement = document.getElementById('cart');
    cartElement.classList.toggle('hidden');
}

function increasePrice(productId) {
    let productInCart = cart.find(item => item.id === productId);
    if (productInCart) {
        productInCart.price += productInCart.price / productInCart.quantity; 
        totalPrice += productInCart.price / productInCart.quantity; 
        productInCart.quantity += 1; 
        updateCart();
    }
}

function removeProductFromCart(productId) {
    let productInCart = cart.find(item => item.id === productId);
    if (productInCart) {
        totalPrice -= productInCart.price; 
        cart = cart.filter(item => item.id !== productId); 
        updateCart();
    }
}
