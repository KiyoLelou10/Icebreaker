from flask import Flask, request, jsonify
from transformers import GPT2LMHeadModel, GPT2Tokenizer

# Load the model and tokenizer
model = GPT2LMHeadModel.from_pretrained("C:\\Users\\asums\\Downloads\\fine_tuned_combined_gpt2_medium1")
tokenizer = GPT2Tokenizer.from_pretrained("C:\\Users\\asums\\Downloads\\fine_tuned_combined_gpt2_medium1")

app = Flask(__name__)

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    if "input" not in data:
        return jsonify({"error": "Input text is required"}), 400

    input_text = data["input"]

    # Process input through the model
    input_ids = tokenizer.encode(input_text, return_tensors="pt")
    output_ids = model.generate(
        input_ids,
        max_length=80,
        num_return_sequences=1,
        no_repeat_ngram_size=2,
        top_p=0.92,
        temperature=0.7
    )
    output_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)

    # Return the output
    return jsonify({"input": input_text, "output": output_text})

if __name__ == "__main__":
    app.run(debug=True)
