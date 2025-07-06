const score = 2.8;

const starsContainer = document.querySelector('.stars');

for (let i = 0; i < 5; i++) {
    let fillPercentage = 0;

    if (score >= i)
        fillPercentage = 100;
    else if (score > i - 1)
        fillPercentage = (score - (i - 1)) * 100;
}