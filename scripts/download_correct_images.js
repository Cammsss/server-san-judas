import https from "https";
import fs from "fs";
import path from "path";

const ASSETS_DIR = "c:\\Users\\4to. Bach_A\\Desktop\\Bloque 2. Java\\client\\src\\assets\\breeds";

const imagesToDownload = [
    {
        filename: "pomeranian.jpg",
        url: "https://upload.wikimedia.org/wikipedia/commons/3/30/Pomeranian_Black_And_Tan.jpg",
        breed: "Pomerania"
    },
    {
        filename: "yorkie.jpg", 
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Yorkshire_Terrier_%28dog%29.jpg/800px-Yorkshire_Terrier_%28dog%29.jpg",
        breed: "Yorkshire Terrier"
    }
];

async function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(ASSETS_DIR, filename);
        
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
                    if (res2.statusCode === 200) {
                        res2.pipe(fs.createWriteStream(filePath, { flags: 'w' }))
                            .on("finish", resolve)
                            .on("error", reject);
                    } else {
                        reject(new Error(`HTTP ${res2.statusCode}`));
                    }
                });
            } else if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filePath, { flags: 'w' }))
                    .on("finish", resolve)
                    .on("error", reject);
            } else {
                reject(new Error(`HTTP ${res.statusCode}`));
            }
        }).on("error", reject);
    });
}

async function downloadAll() {
    console.log("🚀 Descargando imágenes correctas...");
    
    for (const img of imagesToDownload) {
        try {
            await downloadImage(img.url, img.filename);
            console.log(`✅ ${img.breed} (${img.filename}) descargado correctamente`);
        } catch (error) {
            console.log(`❌ Error descargando ${img.breed}: ${error.message}`);
        }
    }
    
    console.log("⭐ Proceso completado");
}

downloadAll();