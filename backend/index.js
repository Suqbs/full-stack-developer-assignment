import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(cors());

console.log('Sunucu başladı');

function GetGoldPrice() {
    return fetch("https://kapalicarsi.apiluna.org/")
        .then(response => {
            if (!response.ok) {
                throw new Error('There is a problem with the fetch: ' + response.statusText);
            }

            return response.json();
        })
        .then(data => {
            const GOLDTRY = data.find(item => item.code === 'ALTIN').satis;
            const USDTRY = data.find(item => item.code === 'USDTRY').satis;

            const GOLDUSD = GOLDTRY / USDTRY;
            return GOLDUSD;
        })
        .catch(error => {
            console.error(error);
        });
}

app.get('/api/products', async (req, res) => {
    try {
        const goldPrice = await GetGoldPrice();

        // This line doesnt work
        const productsData = fs.readFileSync('products.json', {encoding: "utf8"});
        const products = JSON.parse(productsData);

        const productsWithPrice = products.map(product => {
            const price = (product.popularityScore + 1) * product.weight * goldPrice;

            return {
                ...product,
                price: parseFloat(price.toFixed(2))
            }
        })

        console.log("--- PRODUCT DATA ---");
        console.log(productsWithPrice);
        console.log("--------------------");

        res.json(productsWithPrice);
    }
    catch (error) {
        console.log("Error fetching products");
    }
});

app.listen(PORT, () => {
    console.log(`API sunucusunun adresi: http://localhost:${PORT}`);
});