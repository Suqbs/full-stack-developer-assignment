import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

app.use(cors());

console.log('Sunucu başladı');

function GetGoldPrice() {
    return fetch("https://kapalicarsi.apiluna.org/aa")
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
        console.log('Altın fiyatı (USD):', GOLDUSD);
    })
    .catch(error => {
        console.error(error);
    });
}

GetGoldPrice();

app.listen(PORT, () => {
  console.log(`API sunucusunun adresi: http://localhost:${PORT}`);
});