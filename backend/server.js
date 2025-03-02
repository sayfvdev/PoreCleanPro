import dotenv from "dotenv";
import express from "express";
import axios from "axios";
import cors from "cors";
import cron from "node-cron";
import fs from "fs";

// Загружаем переменные окружения
dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const CJ_API_KEY = process.env.CJ_API_KEY;
const DB_PATH = "product.json"; // Локальная база данных

if (!CJ_API_KEY) {
    console.error("❌ Ошибка: CJ_API_KEY не задан в переменных окружения!");
    process.exit(1);
}

console.log("✅ CJ_API_KEY загружен:", CJ_API_KEY.substring(0, 5) + "...");

// Функция запроса к API CJ Dropshipping
const fetchCJData = async (url, params) => {
    try {
        const response = await axios.get(url, {
            params,
            headers: { "CJ-Access-Token": CJ_API_KEY }
        });
        return response.data;
    } catch (error) {
        console.error("❌ Ошибка при запросе к API CJ Dropshipping:", error.response?.data || error.message);
        return null;
    }
};

// Функция обновления данных о товарах
const updateProducts = async () => {
    console.log("🔄 Обновление данных о товарах...");

    try {
        // Читаем текущие товары
        let db = fs.existsSync(DB_PATH) ? JSON.parse(fs.readFileSync(DB_PATH, "utf8")) : { products: [] };

        for (const product of db.products) {
            const updatedData = await fetchCJData("https://developers.cjdropshipping.com/api2.0/v1/product/query", { pid: product.id });

            if (updatedData) {
                console.log(`✅ Товар ${product.id} обновлён`);
                product.price = updatedData.price || product.price;
                product.images = updatedData.images || product.images;
                product.description = updatedData.description || product.description;
            }
        }

        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
        console.log("✅ Данные успешно обновлены!");

    } catch (error) {
        console.error("❌ Ошибка при обновлении товаров:", error);
    }
};

// Запускаем CRON-задачу каждые 10 минут
cron.schedule("*/10 * * * *", updateProducts);

// Получение данных о товаре
app.get("/api/product", async (req, res) => {
    const { pid } = req.query;
    if (!pid) return res.status(400).json({ error: "Не указан pid товара" });

    const data = await fetchCJData("https://developers.cjdropshipping.com/api2.0/v1/product/query", { pid });
    if (!data) return res.status(500).json({ error: "Ошибка при получении данных о товаре" });

    res.json(data);
});

// Получение вариантов товара
app.get("/api/variants", async (req, res) => {
    const { pid } = req.query;
    if (!pid) return res.status(400).json({ error: "Не указан pid товара" });

    const data = await fetchCJData("https://developers.cjdropshipping.com/api2.0/v1/product/variant/query", { pid });
    if (!data) return res.status(500).json({ error: "Ошибка при получении данных о вариантах товара" });

    res.json(data);
});

// Ручное обновление товаров
app.get("/api/update-products", async (req, res) => {
    await updateProducts();
    res.json({ message: "Обновление запущено" });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});
