const axios = require("axios");
const cheerio = require("cheerio");
const { getAIAnalysis } = require("./groq");

async function analyzeURL(url) {
  let score = 0;
  let suggestions = [];

  try {
    const start = Date.now();

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept-Language": "en-US,en;q=0.9"
      },
      timeout: 7000
    });

    const loadTime = Date.now() - start;

    // ✅ IMPORTANT: Initialize Cheerio FIRST
    const $ = cheerio.load(response.data);

    const text = $("body").text().replace(/\s+/g, " ").trim();

    // 🔐 HTTPS Check
    const isHTTPS = url.startsWith("https");
    if (isHTTPS) score += 30;
    else suggestions.push("Use HTTPS for better security");

    // 📄 Meta Description
    const metaDesc = $("meta[name='description']").attr("content");
    if (metaDesc) score += 15;
    else suggestions.push("Add meta description");

    // 🔗 Links
    const links = $("a").length;
    if (links > 5) score += 15;
    else suggestions.push("Add more useful links");

    // 🖼 Images
    const images = $("img").length;
    if (images > 0) score += 10;
    else suggestions.push("Add images");

    // 📞 About / Contact
    const hasAbout = $("a:contains('About')").length > 0;
    const hasContact = $("a:contains('Contact')").length > 0;

    if (hasAbout || hasContact) score += 10;
    else suggestions.push("Add About/Contact page");

    // ⚡ Performance
    if (loadTime < 1000) score += 20;
    else if (loadTime < 3000) score += 10;
    else suggestions.push("Improve site speed");

    // =========================
    // 🆕 DATA COLLECTION ANALYSIS
    // =========================

    const inputs = $("input");

    let collects = {
      email: false,
      password: false,
      phone: false,
      text: false
    };

    inputs.each((i, el) => {
      const type = $(el).attr("type");

      if (type === "email") collects.email = true;
      if (type === "password") collects.password = true;
      if (type === "tel") collects.phone = true;
      if (type === "text") collects.text = true;
    });

    // 🍪 Tracking detection
    const html = response.data;

    const tracking = {
      googleAnalytics:
        html.includes("google-analytics") || html.includes("gtag"),
      facebookPixel: html.includes("facebook.com/tr"),
      cookies: response.headers["set-cookie"] ? true : false
    };

    // 🔐 Risk Level
    let riskLevel = "Low";

    if (collects.password) riskLevel = "High";
    else if (collects.email || collects.phone) riskLevel = "Medium";

    // =========================

    const aiAnalysis = await getAIAnalysis(text, url);

    return {
  url,
  loadTime,
  score,
  riskLevel,

  seo: {
    metaDescription: !!metaDesc,
    links,
    images,
    hasAbout,
    hasContact
  },

  dataCollection: collects,
  tracking,
  suggestions,

  aiAnalysis // ⭐ NEW
};

  } catch (error) {
    return {
      error:
        "Unable to analyze this website. It may block bots or require JavaScript.",
      details: error.message
    };
  }
}

module.exports = analyzeURL;