document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.querySelector('.carousel-container');
    const carouselTrack = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const productCards = document.querySelectorAll('.product-card');

    if (productCards.length > 0) {
        const cardGap = parseFloat(window.getComputedStyle(carouselTrack).gap);
        const cardWidth = productCards[0].offsetWidth;

        nextButton.addEventListener('click', () => {
            const currentScroll = carouselContainer.scrollLeft;
            let targetScroll = 0;

            for(const card of productCards) {
                if(card.offsetLeft > currentScroll + (cardWidth / 2)) {
                    targetScroll = card.offsetLeft;
                    console.log("Gidilen konum", targetScroll);
                    break;
                }
            }

            carouselContainer.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        })

        prevButton.addEventListener('click', () => {
            const currentScroll = carouselContainer.scrollLeft;
            let targetScroll = 0;
            
        for (let i = productCards.length - 1; i >= 0; i--) {
            const card = productCards[i];

            if (card.offsetLeft < currentScroll - (cardWidth / 2)) {
                targetScroll = card.offsetLeft;
                console.log("Gidilen konum", targetScroll);
                break;
            }
        }
            carouselContainer.scrollTo({
                left: targetScroll,
                behavior: 'smooth',
            })
        })
    }
});