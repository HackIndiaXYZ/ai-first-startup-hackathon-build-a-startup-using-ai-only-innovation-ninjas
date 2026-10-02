const chatArea = document.getElementById("chatArea");

const userInput = document.getElementById("userInput");

const sendButton = document.getElementById("sendButton");

const voiceButton = document.getElementById("voiceButton");


// ========================================
// SEND MESSAGE
// ========================================

async function sendMessage() {

    const question = userInput.value.trim();

    // Don't send empty message
    if (question === "") {
        return;
    }


    // Show user's question
    addUserMessage(question);


    // Clear input box
    userInput.value = "";


    // Show temporary thinking message
    addAIMessage("Thinking...");


    try {

        // Send question to backend
        const data = await sendToBackend(question);


        // Remove "Thinking..." message
        removeThinkingMessage();


        // Show backend response
        addAIMessage(data.answer);

    }

    catch (error) {

        console.error("Backend Error:", error);


        // Remove thinking message
        removeThinkingMessage();


        // Show error
        addAIMessage(
            "❌ I couldn't connect to the Government AI server. Please make sure the backend is running."
        );

    }

}


// ========================================
// SEND QUESTION TO FASTAPI
// ========================================

async function sendToBackend(question) {

    const response = await fetch(
        "http://127.0.0.1:8000/ask",
        {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: question
            })

        }
    );


    // Check server response

    if (!response.ok) {

        throw new Error(
            "Server returned an error"
        );

    }


    // Convert response to JSON

    const data = await response.json();


    return data;

}


// ========================================
// ADD USER MESSAGE
// ========================================

function addUserMessage(message) {

    const messageDiv = document.createElement("div");

    messageDiv.className = "message user-message";


    messageDiv.innerHTML = `

        <div class="message-content">

            <p>${message}</p>

        </div>

        <div class="avatar">
            👤
        </div>

    `;


    chatArea.appendChild(messageDiv);


    scrollToBottom();

}


// ========================================
// ADD AI MESSAGE
// ========================================

function addAIMessage(message) {

    const messageDiv = document.createElement("div");

    messageDiv.className = "message ai-message";


    messageDiv.innerHTML = `

        <div class="avatar">
            🤖
        </div>

        <div class="message-content">

            <p>${message}</p>

        </div>

    `;


    chatArea.appendChild(messageDiv);


    scrollToBottom();

}


// ========================================
// REMOVE THINKING MESSAGE
// ========================================

function removeThinkingMessage() {

    const messages =
        chatArea.querySelectorAll(".ai-message");

    messages.forEach(function(message) {

        const text =
            message.querySelector(".message-content p");

        if (
            text &&
            text.textContent === "Thinking..."
        ) {

            message.remove();

        }

    });

}


// ========================================
// SCROLL CHAT TO BOTTOM
// ========================================

function scrollToBottom() {

    chatArea.scrollTop =
        chatArea.scrollHeight;

}


// ========================================
// SEND BUTTON
// ========================================

sendButton.addEventListener(
    "click",
    sendMessage
);


// ========================================
// ENTER KEY
// ========================================

userInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            sendMessage();

        }

    }
);


// ========================================
// VOICE BUTTON
// ========================================

voiceButton.addEventListener(
    "click",
    function() {

        alert(
            "🎤 Voice input will be added in a later step."
        );

    }
);