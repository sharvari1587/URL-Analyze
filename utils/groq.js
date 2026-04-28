const axios = require("axios");

async function getAIAnalysis(text, url) {
    try {
// console.log("GROQ KEY:", process.env.GROQ_API_KEY);

        const response = await axios.post(
  "https://api.groq.com/openai/v1/chat/completions",
  {
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content: "You are a website security analyst. Be concise and practical."
      },
      {
        role: "user",
        content: `
Analyze this website:

URL: ${url}

Content:
${text.slice(0, 2000)}

Tell:
1. What the site does
2. If it's safe or suspicious
3. Any risks
4. Simple user advice
        `
      }
    ],
    temperature: 0.3
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    }
  }
);


        return response.data.choices[0].message.content;
    } catch (err) {
    console.log("🔥 GROQ ERROR FULL DETAILS:");
    console.log("Status:", err.response?.status);
    console.log("Data:", JSON.stringify(err.response?.data, null, 2));
    console.log("Message:", err.message);

    return "AI failed: check server logs";
}
}

module.exports = { getAIAnalysis };


