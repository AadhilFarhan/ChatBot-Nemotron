function sendMessage() {
    const userMessage = document.getElementById("chat-input").value;
    if (!userMessage.trim()) return;

    appendMessage('You: ' + userMessage, 'user');

    addLoadingIndicator();

    // Send message to the backend
    fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userMessage })
    })
    .then(response => response.json())
    .then(data => {

        removeLoadingIndicator();

        appendMessage( data.message, 'assistant');
    })
    .catch(error => {
        console.error('Error:', error);

        removeLoadingIndicator();
        appendMessage("Assistant: Sorry, something went wrong!", 'assistant');
    });


    document.getElementById("chat-input").value = "";
}

// Function to append message to the chat box
function appendMessage(message, role) {
    const chatMessages = document.getElementById("chat-messages");
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${role}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to show the loading indicator
function addLoadingIndicator() {
    const chatMessages = document.getElementById("chat-messages");
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "message assistant chat-loading";
    loadingDiv.id = "loading-indicator";
    loadingDiv.textContent = "Chatbot is typing...";
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to remove the loading indicator
function removeLoadingIndicator() {
    const loadingDiv = document.getElementById("loading-indicator");
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Listen for the "Enter" key press to send the message
document.getElementById("chat-input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        e.preventDefault(); 
        sendMessage();
    }
});

document.getElementById("send-button").addEventListener("click", sendMessage);
