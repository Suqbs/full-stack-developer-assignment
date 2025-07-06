import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(cors());

const frontendPath = '../frontend';
app.use(express.static(frontendPath));


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

        const productsData = fs.readFileSync('products.json', { encoding: "utf8" });
        const products = JSON.parse(productsData);

        const productsWithFormattedData = products.map(product => {
            const price = (product.popularityScore + 1) * product.weight * goldPrice;
            const rating = (product.popularityScore * 5).toFixed(1);

            const colors = Object.keys(product.images).map(key => {
                return {
                    key: key,                        
                    imageUrl: product.images[key]  
                };
            });

            const { images, ...restOfProduct } = product;

            return {
                ...restOfProduct,
                price: parseFloat(price.toFixed(2)),
                colors: colors,
                rating: rating,
            };
        });

        res.json(productsWithFormattedData);
    }
    catch (error) {
        console.log("Error fetching products");
    }
});

app.listen(PORT, () => {
    console.log(`If you are on local, go here, but change the fetch URL in frontend: http://localhost:${PORT}`);
});