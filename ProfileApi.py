from flask import Flask, request, jsonify
import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer

# Path where your fine-tuned model and tokenizer are saved
model_path = "C:\\Users\\asums\\Downloads\\gpt2_medium_interestsToProfiles"

# Load the tokenizer and model
tokenizer = GPT2Tokenizer.from_pretrained(model_path)
model = GPT2LMHeadModel.from_pretrained(model_path)
model.eval()

app = Flask(__name__)

@app.route("/generateProfiles", methods=["POST"])
def generate():
    data = request.get_json(force=True)
    if "input" not in data:
        return jsonify({"error": "Input text is required"}), 400

    input_text = data["input"]

    # Tokenize the input text
    inputs = tokenizer(input_text, return_tensors="pt").input_ids

    # Generate output using the same settings as your evaluation code
    outputs = model.generate(
        inputs,
        max_length=256,
        do_sample=True,
        top_k=50,
        top_p=0.95,
        num_return_sequences=1
    )

    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return jsonify({"input": input_text, "output": generated_text})

if __name__ == "__main__":
    app.run(debug=True)
