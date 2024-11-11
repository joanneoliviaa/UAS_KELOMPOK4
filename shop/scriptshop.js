// Add to Cart Button Functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        alert('Item added to cart!');
    });
});

document.getElementById('price-filter').addEventListener('change', function() {
    const productsContainer = document.querySelector('.products');
    const products = Array.from(productsContainer.querySelectorAll('.product'));

    let sortedProducts = [];

    // Sorting logic
    if (this.value === 'low-to-high') {
        sortedProducts = products.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('p').innerText.replace('$', ''));
            const priceB = parseFloat(b.querySelector('p').innerText.replace('$', ''));
            return priceA - priceB;
        });
    } else if (this.value === 'high-to-low') {
        sortedProducts = products.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('p').innerText.replace('$', ''));
            const priceB = parseFloat(b.querySelector('p').innerText.replace('$', ''));
            return priceB - priceA;
        });
    } else {
        // If "default" is selected, keep the original order
        sortedProducts = products;
    }

    // Remove all current products from the container
    productsContainer.innerHTML = '';

    // Re-add sorted products
    sortedProducts.forEach(product => {
        productsContainer.appendChild(product);
    });
});


