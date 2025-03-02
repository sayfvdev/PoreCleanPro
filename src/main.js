import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Language translations
const translations = {
  en: {
    'buy-now': 'Buy Now',
    'hero-title': 'Smooth, Clear Skin in 5 Minutes!',
    'hero-description': 'Professional pore cleaner with vacuum technology for flawless skin',
    'features-title': 'Features',
    'feature1-title': 'Quick Results',
    'feature1-description': 'Visible effect after first use',
    'feature2-title': 'Safe',
    'feature2-description': 'Gentle on your skin',
    'feature3-title': 'Long-lasting',
    'feature3-description': 'Up to 2 hours of battery life',
    'how-to-use-title': 'How to Use',
    'step1-title': 'Clean Face',
    'step1-description': 'Wash with warm water',
    'step2-title': 'Steam Skin',
    'step2-description': 'Use a hot towel',
    'step3-title': 'Treat Areas',
    'step3-description': 'Move device slowly',
    'step4-title': 'Finish Care',
    'step4-description': 'Apply moisturizer',
    'reviews-title': 'Customer Reviews',
    'review1-text': '"Amazing results! Been using it for a month, skin is noticeably clearer."',
    'review1-author': 'Anna K.',
    'review2-text': '"Very convenient device. Easy to use and effective."',
    'review2-author': 'Michael D.',
    'review3-text': '"Highly recommend! Great alternative to salon procedures."',
    'review3-author': 'Elena V.',
    'shipping-title': 'Shipping & Payment',
    'shipping-methods': 'Shipping Methods',
    'shipping-courier': 'Courier Delivery',
    'shipping-post': 'Russian Post',
    'shipping-pickup': 'Pickup Points',
    'payment-methods': 'Payment Methods',
    'payment-card': 'Credit Card',
    'payment-cash': 'Cash on Delivery',
    'payment-electronic': 'Electronic Wallets',
    'footer-contacts': 'Contacts',
    'footer-phone': 'Phone: 8 800 123-45-67',
    'footer-policy': 'Policy',
    'footer-returns': 'Returns',
    'footer-privacy': 'Privacy Policy',
    'footer-social': 'Social Media'
  }
};




// Theme toggling
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-bs-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  
  html.setAttribute('data-bs-theme', newTheme);
  themeIcon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
  
  localStorage.setItem('theme', newTheme);
}

// Language toggling
const langToggle = document.getElementById('langToggle');
let currentLang = 'ru';

function toggleLanguage() {
  currentLang = currentLang === 'ru' ? 'en' : 'ru';
  langToggle.textContent = currentLang.toUpperCase();
  
  if (currentLang === 'en') {
    document.querySelectorAll('[data-translate]').forEach(element => {
      const key = element.getAttribute('data-translate');
      if (translations.en[key]) {
        element.textContent = translations.en[key];
      }
    });
  } else {
    location.reload(); // Reload to restore Russian text from HTML
  }
  
  localStorage.setItem('lang', currentLang);
}

// Event listeners
themeToggle.addEventListener('click', toggleTheme);
langToggle.addEventListener('click', toggleLanguage);

// Initialize theme and language from localStorage
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  const savedLang = localStorage.getItem('lang');
  
  if (savedTheme) {
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    themeIcon.className = savedTheme === 'dark' ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
  }
  
  if (savedLang === 'en') {
    currentLang = 'en';
    langToggle.textContent = 'EN';
    toggleLanguage();
  }
});