const API_KEY = "AIzaSyA43cym7WXvcZ34ALHhEqxnWftrHHN6Gi4"; // Do NOT use real key in production

const MODEL_NAME = "gemini-2.5-flash"; // or "gemini-3-pro-preview" when supported
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

const chatBox = document.getElementById("chat");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function addMessage(text, className) {
  const div = document.createElement("div");
  div.className = `message ${className}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";

  addMessage("Thinking...", "bot");
  const loadingEl = chatBox.lastChild;

  try {
    const payload = {
      contents: [
        {
          parts: [{ text }]
        }
      ]
    };

    const res = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const data = await res.json();

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from model.";

    loadingEl.remove();
    addMessage(reply, "bot");
  } catch (err) {
    console.error(err);
    loadingEl.remove();
    addMessage("Error: " + err.message, "bot");
  }
}