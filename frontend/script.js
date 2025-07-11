document.addEventListener('DOMContentLoaded', () => {
    DisplayProduct();
});

function InitializeCarousel() {
    const carouselContainer = document.querySelector('.carousel-container');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const productCards = document.querySelectorAll('.product-card');

    if (productCards.length > 0) {
        const cardWidth = productCards[0].offsetWidth;

        nextButton.addEventListener('click', () => {
            const currentScroll = carouselContainer.scrollLeft;
            let targetScroll = 0;

            for (const card of productCards) {
                if (card.offsetLeft > currentScroll + (cardWidth / 2)) {
                    targetScroll = card.offsetLeft;
                    break;
                }
            }

            carouselContainer.scrollTo({
                left: targetScroll,
            });
        })

        prevButton.addEventListener('click', () => {
            const currentScroll = carouselContainer.scrollLeft;
            let targetScroll = 0;

            for (let i = productCards.length - 1; i >= 0; i--) {
                const card = productCards[i];

                if (card.offsetLeft < currentScroll - (cardWidth / 2)) {
                    targetScroll = card.offsetLeft;
                    break;
                }
            }
            carouselContainer.scrollTo({
                left: targetScroll,
            })
        })
    }
}

async function FetchProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        return products;

    } catch (error) {
        console.error('Fetch hatası:', error);
        return [];
    }
}

function DisplayProduct() {
    FetchProducts().then(products => {
        const productList = document.getElementById('product-list');

        products.forEach(productData => {

            const productCard = createProductCard(productData);

            productList.appendChild(productCard);

            InitializeCarousel();
        });
    });
}

function createProductCard(productData) {
    const card = document.createElement('div');
    card.className = 'product-card';

    const initialImageSrc = productData.colors[0]?.imageUrl || '';
    const imageAltText = productData.name;

    const productImage = createProductImage(initialImageSrc, imageAltText);

    card.appendChild(productImage);
    card.appendChild(createProductInfo(productData.name, productData.price));
    card.appendChild(createColorOptions(productData.colors, productImage));
    card.appendChild(createStarRating(productData.rating));

    return card;
}

function createProductImage(src, alt) {
    const image = document.createElement('img');
    image.className = 'product-image';
    image.src = src;
    image.alt = alt;
    return image;
}

function createProductInfo(title, price) {
    const infoContainer = document.createElement('div');
    infoContainer.className = 'product-info';

    const productTitle = document.createElement('h2');
    productTitle.textContent = title;

    const productPrice = document.createElement('p');
    productPrice.className = 'price';

    productPrice.textContent = `$${price} USD`;

    infoContainer.append(productTitle, productPrice);
    return infoContainer;
}

function mapColorInfo(key) {
    switch (key) {
        case 'yellow':
            return { name: 'Yellow Gold', className: 'color-yellow-gold' };
        case 'rose':
            return { name: 'Rose Gold', className: 'color-rose-gold' };
        case 'white':
            return { name: 'White Gold', className: 'color-white-gold' };
    }
}

function createColorOptions(colors, productImageElement) {
    const colorInfoContainer = document.createElement('div');
    colorInfoContainer.className = 'color-info';

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'color-options';

    const pickedColor = document.createElement('span');
    pickedColor.className = 'picked-color';
    pickedColor.textContent = mapColorInfo(colors[0].key).name;

    colors.forEach((color, index) => {
        const colorInfo = mapColorInfo(color.key);
        const colorCircle = document.createElement('span');
        colorCircle.className = `color-circle ${colorInfo.className}`;

        colorCircle.dataset.key = color.key;

        if (index === 0) {
            colorCircle.classList.add('active');
        }
        optionsContainer.appendChild(colorCircle);
    });

    optionsContainer.addEventListener('click', (event) => {
        const clickedElement = event.target;
        if (!clickedElement.classList.contains('color-circle')) {
            return;
        }

        const clickedKey = clickedElement.dataset.key;

        const clickedColorData = colors.find(c => c.key === clickedKey);
        if (!clickedColorData) return;

        const colorInfo = mapColorInfo(clickedColorData.key);

        productImageElement.src = clickedColorData.imageUrl;
        pickedColor.textContent = colorInfo.name;

        if (optionsContainer.querySelector('.active')) {
            optionsContainer.querySelector('.active').classList.remove('active');
        }
        clickedElement.classList.add('active');
    });

    colorInfoContainer.append(optionsContainer, pickedColor);
    return colorInfoContainer;
}

function createStarRating(rating) {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';

    for (let i = 1; i <= 5; i++) {
        const starSpan = document.createElement('span');
        starSpan.className = 'star';

        const emptyStarImg = document.createElement('img');
        emptyStarImg.src = './images/empty-star.svg';
        emptyStarImg.alt = 'star';

        starSpan.appendChild(emptyStarImg);

        const filledStarContainer = document.createElement('div');
        filledStarContainer.className = 'filled-star';

        const fillPercentage = Math.max(0, Math.min(1, rating - (i - 1))) * 100;
        filledStarContainer.style.width = `${fillPercentage}%`;

        const filledStarImg = document.createElement('img');
        filledStarImg.src = './images/filled-star.svg';
        filledStarImg.alt = 'star';

        filledStarContainer.appendChild(filledStarImg);
        starSpan.appendChild(filledStarContainer);
        starsContainer.appendChild(starSpan);
    }

    const ratingText = document.createElement('span');
    ratingText.className = 'rating';

    ratingText.textContent = `${rating}/5`;

    starsContainer.appendChild(ratingText);
    return starsContainer;
}
