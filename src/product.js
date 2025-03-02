import { getProductData } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
    const productData = await getProductData();

    if (!productData) {
        console.error("Ошибка: данные о товаре не загружены.");
        return;
    }

    updateProductPage(productData);
});

function updateProductPage(product) {
    const productTitle = document.querySelector(".product-title");
    if (productTitle) productTitle.textContent = product.productNameRu || product.productNameEn;

    const currentPrice = document.querySelector(".current-price");
    if (currentPrice) currentPrice.textContent = `${product.sellPrice || "N/A"} ₽`;

    const oldPrice = document.querySelector(".old-price");
    if (oldPrice) oldPrice.textContent = `${product.originalPrice || "N/A"} ₽`;

    const productImage = document.getElementById("mainImage");
    if (productImage) {
        productImage.src = product.productImageSet[0] || "https://placehold.co/600x600";
        productImage.alt = product.productNameEn;
    }

    // Обновление миниатюр
    const thumbnailsContainer = document.querySelector(".thumbnails");
    if (thumbnailsContainer) {
        thumbnailsContainer.innerHTML = ""; // Очищаем перед добавлением новых изображений
        product.productImageSet.forEach((imageSrc, index) => {
            const thumb = document.createElement("img");
            thumb.src = imageSrc;
            thumb.alt = `Thumbnail ${index + 1}`;
            thumb.classList.add("thumbnail");
            if (index === 0) thumb.classList.add("active");

            thumb.onclick = () => changeImage(imageSrc);

            thumbnailsContainer.appendChild(thumb);
        });
    }

    // Обновление характеристик
    updateSpecification(".spec-material-value", product.material);
    updateSpecification(".spec-power-value", product.power);
    updateSpecification(".spec-battery-value", product.battery);
    updateSpecification(".spec-size-value", product.size);

    // Обновление описания без картинок
    updateDescription(product.description);

    // Обновление отзывов
    updateReviews(product.reviews);
}

function updateSpecification(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.textContent = value || "Нет данных";
}

// Функция смены главного изображения
function changeImage(imageSrc) {
    const mainImage = document.getElementById("mainImage");
    if (mainImage) {
        mainImage.src = imageSrc;
    }

    // Убираем класс "active" у всех миниатюр
    document.querySelectorAll(".thumbnail").forEach((thumb) => {
        thumb.classList.remove("active");
    });

    // Добавляем "active" к нажатой миниатюре
    event.target.classList.add("active");
}

// Функция для обработки описания и удаления изображений
function updateDescription(descriptionHTML) {
    const description = document.querySelector(".lead[data-translate='description-text']");
    if (!description) return;

    description.innerHTML = removeImagesFromDescription(descriptionHTML);
}

// Удаление изображений из HTML-описания
function removeImagesFromDescription(descriptionHTML) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = descriptionHTML;

    // Удаляем все изображения из описания
    tempDiv.querySelectorAll("img").forEach(img => img.remove());

    return tempDiv.innerHTML;
}

// Обновление отзывов
function updateReviews(reviews) {
    const reviewsContainer = document.querySelector(".reviews-grid");
    if (!reviewsContainer) return;

    reviewsContainer.innerHTML = ""; // Очистка отзывов

    reviews.forEach((review) => {
        const reviewCard = document.createElement("div");
        reviewCard.classList.add("review-card");

        const stars = document.createElement("div");
        stars.classList.add("stars");
        stars.textContent = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

        const reviewText = document.createElement("p");
        reviewText.classList.add("review-text");
        reviewText.textContent = review.text;

        const reviewAuthor = document.createElement("div");
        reviewAuthor.classList.add("review-author");
        reviewAuthor.textContent = review.author;

        reviewCard.appendChild(stars);
        reviewCard.appendChild(reviewText);
        reviewCard.appendChild(reviewAuthor);
        reviewsContainer.appendChild(reviewCard);
    });
}
