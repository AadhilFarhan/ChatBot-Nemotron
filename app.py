from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app)  

@app.route("/")
def index():
    return render_template("index.html")

# Initialize NVIDIA Llama API client
client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key="AUTH_KEY"  # Replace with your actual API key
)

chat_memory = []

@app.route('/chat', methods=['POST'])
def chat():
    global chat_memory
    user_message = request.json.get('message')

    # Add user's message to memory
    chat_memory.append({"role": "user", "content": user_message})

    # Call NVIDIA API with memory
    response = client.chat.completions.create(
        model="nvidia/llama-3.1-nemotron-70b-instruct",
        messages=chat_memory,
        temperature=0.5,
        top_p=1,
        max_tokens=512
    )

    # Extract assistant's response properly
    assistant_message = ""

    for chunk in response:
        # print(chunk)
        if isinstance(chunk, tuple) and chunk[0] == 'choices':
            choices = chunk[1]  
            if choices and isinstance(choices, list):
                content = choices[0].message.content 
                if content:
                    assistant_message += content

    chat_memory.append({"role": "assistant", "content": assistant_message})

    return jsonify({"message": assistant_message})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
