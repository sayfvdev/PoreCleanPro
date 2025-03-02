export async function getProductData() {
    try {
        const response = await fetch("/backend/product.json"); // Загружаем JSON-файл
        if (!response.ok) throw new Error("Ошибка загрузки данных из product.json");

        const data = await response.json();
        return data.data; // Возвращаем только вложенные данные о товаре
    } catch (error) {
        console.error("Ошибка загрузки данных о товаре:", error);
        return null;
    }
}
