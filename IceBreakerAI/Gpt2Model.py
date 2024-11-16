from transformers import GPT2Tokenizer, GPT2LMHeadModel, Trainer, TrainingArguments
from datasets import load_dataset

# Step 1: Load Dataset
# Assume `train.json` and `val.json` are formatted as:
# [{"input": "Profile + context", "output": "Icebreaker response"}]
dataset = load_dataset("json", data_files={"train": "train.json", "validation": "val.json"})

# Step 2: Tokenizer Setup
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")

# GPT-2 uses <|endoftext|> as a special token for separating examples.
tokenizer.pad_token = tokenizer.eos_token

# Tokenize the dataset
def tokenize_function(examples):
    # Combine input and output into a single training sequence
    combined_text = [
        f"{item['input']} <|endoftext|> {item['output']} <|endoftext|>"
        for item in examples
    ]
    return tokenizer(combined_text, padding="max_length", truncation=True, max_length=512)

tokenized_dataset = dataset.map(tokenize_function, batched=True, remove_columns=dataset["train"].column_names)

# Step 3: Load Pre-Trained GPT-2 Model
model = GPT2LMHeadModel.from_pretrained("gpt2")

# Update the model's padding token to match the tokenizer's
model.resize_token_embeddings(len(tokenizer))

# Step 4: Training Arguments
training_args = TrainingArguments(
    output_dir="./gpt2_icebreaker",  # Directory to save the model
    evaluation_strategy="epoch",    # Evaluate at the end of each epoch
    learning_rate=5e-5,             # Learning rate for fine-tuning
    weight_decay=0.01,              # Regularization
    num_train_epochs=3,             # Number of epochs
    per_device_train_batch_size=4,  # Batch size per device
    save_strategy="epoch",          # Save the model at each epoch
    save_total_limit=2,             # Keep only the last 2 checkpoints
    logging_dir="./logs",           # Directory for logs
    logging_steps=10,               # Log every 10 steps
    report_to="none",               # Avoid external logging integrations
)

# Step 5: Trainer for Fine-Tuning
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset["train"],
    eval_dataset=tokenized_dataset["validation"],
)

# Step 6: Train the Model
trainer.train()

# Step 7: Save the Fine-Tuned Model
trainer.save_model("./gpt2_icebreaker_finetuned")
tokenizer.save_pretrained("./gpt2_icebreaker_finetuned")

print("Fine-tuning complete. Model saved at './gpt2_icebreaker_finetuned'")
