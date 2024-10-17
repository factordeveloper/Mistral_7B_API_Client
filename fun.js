document.getElementById('send-btn').addEventListener('click', sendMessage);

function sendMessage() {
    const userInput = document.getElementById('user-input').value;

    if (userInput.trim() === '') {
        return; // No hacer nada si la entrada está vacía
    }

    appendMessage('user', userInput);

    // Limpiar el campo de entrada
    document.getElementById('user-input').value = '';

    // Preparar la solicitud
    const url = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3/v1/chat/completions';
    const apiKey = 'Bearer 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';  // Reemplaza con tu clave de API

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "mistralai/Mistral-7B-Instruct-v0.3",
            messages: [{"role": "user", "content": userInput}],
            max_tokens: 500,
            stream: false
        })
    })
    .then(response => {
        // Verificar si la respuesta es válida
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        return response.json();
    })
    .then(data => {
        // Validar si la respuesta contiene el objeto choices
        if (data && data.choices && data.choices.length > 0) {
            const aiResponse = data.choices[0].message.content;
            appendMessage('bot', aiResponse);
        } else {
            appendMessage('bot', 'Error: Respuesta inesperada de la API.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        appendMessage('bot', 'Error: No se pudo obtener una respuesta.');
    });
}

function appendMessage(role, text) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', role);

    const messageText = document.createElement('div');
    messageText.classList.add('text');
    messageText.textContent = text;

    messageDiv.appendChild(messageText);
    chatBox.appendChild(messageDiv);

    // Hacer scroll hacia el final después de agregar un nuevo mensaje
    chatBox.scrollTop = chatBox.scrollHeight;
}
