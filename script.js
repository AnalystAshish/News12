// NewsAPI configuration
const API_KEY = "c31d9de0a65941a595728c1a67ca5719";
// Using top-headlines endpoint which is more reliable
const url = "https://newsapi.org/v2/top-headlines?country=us&q=";

window.addEventListener("load", () => {
    console.log("Page loaded, fetching news...");
    console.log("API Key:", API_KEY);
    setStatus("Page loaded. Fetching news...");
    fetchNews("Technology");
});

function setStatus(msg) {
    console.log(msg);
    const el = document.getElementById('status');
    if (el) el.innerText = msg;
}

async function fetchNews(query) {
    try {
        console.log("Fetching news for:", query);
        
        // Build fetch URL - map query to NewsAPI category
        let fetchUrl;
        const queryLower = query.toLowerCase();
        
        // Valid NewsAPI categories
        const validCategories = ["business", "entertainment", "general", "health", "science", "sports", "technology"];
        const isValidCategory = validCategories.includes(queryLower);
        
        if (isValidCategory) {
            // Use top-headlines for valid categories
            fetchUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${queryLower}&apiKey=${API_KEY}`;
        } else {
            // For custom queries, use everything endpoint
            fetchUrl = `https://newsapi.org/v2/everything?q=${query}&sortBy=popularity&pageSize=30&apiKey=${API_KEY}`;
        }
        
        console.log("Fetch URL:", fetchUrl);
        
        const res = await fetch(fetchUrl);
        console.log("Response status:", res.status);
        
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log("API Response:", data);
        
        if (data.status === "error") {
            throw new Error(data.message || "API Error");
        }
        
        if (!data.articles || data.articles.length === 0) {
            console.warn("No articles found for query:", query);
            const cardsContainer = document.getElementById("cardscontainer");
            cardsContainer.innerHTML = "<p style='color: red; font-size: 18px; padding: 20px;'>❌ No articles found. Try another search.</p>";
            return;
        }
        
        console.log("Articles found:", data.articles.length);
        setStatus('Articles found: ' + data.articles.length);
        bindData(data.articles);
    } catch (error) {
        console.error("Fetch error:", error);
        alert(`❌ Error: ${error.message}`);
        
        // Show error in UI
        const cardsContainer = document.getElementById("cardscontainer");
        cardsContainer.innerHTML = `<p style='color: red; font-size: 18px; padding: 20px;'>❌ Error: ${error.message}</p>`;
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cardscontainer");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    if (!articles || articles.length === 0) {
        cardsContainer.innerHTML = "<p style='color: red; font-size: 18px; padding: 20px;'>❌ No articles found. Check API key or try a different search.</p>";
        return;
    }

    articles.forEach((article) => {
        if (!article.urlToImage) return;

        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    })
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = `${article.title.slice(0, 60)}...`;
    newsDesc.innerHTML = `${article.description.slice(0, 150)}...`;

    const date = new Date(article.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Jakarta" })

    newsSource.innerHTML = `NewsWale · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    })
}

let curSelectedNav = null;
function onNavItemClick(id) {
    // Map nav items to NewsAPI categories
    const categoryMap = {
        "cricket": "sports",
        "india": "general", 
        "technology": "technology",
        "politics": "general"
    };
    
    const category = categoryMap[id] || "general";
    fetchNews(category);
    
    const navItem = document.getElementById(id);
    if (curSelectedNav) {
        curSelectedNav.classList.remove("active");
    }
    curSelectedNav = navItem;
    if (curSelectedNav) {
        curSelectedNav.classList.add("active");
    }
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    if (curSelectedNav) {
        curSelectedNav.classList.remove("active");
    }
    curSelectedNav = null;
})