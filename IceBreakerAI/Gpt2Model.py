from transformers import GPT2Tokenizer, GPT2LMHeadModel, Trainer, TrainingArguments, DataCollatorForLanguageModeling
from datasets import Dataset
import json
from evaluate import load
import torch


def load_custom_dataset(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
    train_data = data["train"]
    val_data = data["validation"]

    def preprocess(data):
        return [{"input": item["input"], "output": item["output"]} for item in data]

    return preprocess(train_data), preprocess(val_data)

#change this to ur path
train_data, val_data = load_custom_dataset("C:\\Users\\asums\\Downloads\\icebreaker_dataset_full.json")

# Convert the data into Hugging Face Dataset format
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
tokenizer.pad_token = tokenizer.eos_token  # Ensures compatibility

# Prepare dataset for training
train_dataset = Dataset.from_dict(
    {"text": [entry["input"] + tokenizer.eos_token + entry["output"] for entry in train_data]})
val_dataset = Dataset.from_dict(
    {"text": [entry["input"] + tokenizer.eos_token + entry["output"] for entry in val_data]})

# Tokenize the datasets and add labels (labels are the same as input_ids for causal language modeling)
def add_labels(examples):
    examples["labels"] = examples["input_ids"]  # For causal LM, labels = input_ids
    return examples

# Tokenize the datasets and add labels explicitly
tokenized_train = train_dataset.map(
    lambda examples: tokenizer(examples["text"], padding="max_length", truncation=True, return_tensors="pt"),
    batched=True
)

tokenized_train = tokenized_train.map(
    add_labels,
    batched=True
)

tokenized_val = val_dataset.map(
    lambda examples: tokenizer(examples["text"], padding="max_length", truncation=True, return_tensors="pt"),
    batched=True
)

tokenized_val = tokenized_val.map(
    add_labels,
    batched=True
)

# Load the pre-trained GPT-2 model
model = GPT2LMHeadModel.from_pretrained("gpt2")

# Define training arguments
training_args = TrainingArguments(
    output_dir="./results",  # Output directory for model checkpoints
    eval_strategy="epoch",  # Evaluation during training
    learning_rate=5e-5,  # Learning rate
    per_device_train_batch_size=2,  # Reduce this from 8 to 4 or even 2
    per_device_eval_batch_size=2,  # Batch size for evaluation
    num_train_epochs=3,  # Total number of training epochs
    save_strategy="epoch",  # Save model checkpoints
    logging_dir="./logs",  # Directory for logs
    logging_steps=200,
    save_total_limit=2,  # Save last 2 checkpoints
    weight_decay=0.01,  # Weight decay for regularization
    push_to_hub=False,  # Disable pushing to Hugging Face hub
    load_best_model_at_end=True,  # Load best model after training
)

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    shift_logits = torch.tensor(logits[..., :-1, :])  # Shift for causal language modeling
    shift_labels = torch.tensor(labels[..., 1:])     # Shift labels to match predictions

    loss_fct = torch.nn.CrossEntropyLoss()
    loss = loss_fct(shift_logits.view(-1, shift_logits.size(-1)), shift_labels.view(-1))
    perplexity = torch.exp(loss)

    return {"perplexity": perplexity.item()}


# Initialize DataCollatorForLanguageModeling
data_collator = DataCollatorForLanguageModeling(
    tokenizer=tokenizer,
    mlm=False,  # set to False for causal LM like GPT-2
)

# Initialize Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_train,
    eval_dataset=tokenized_val,
    data_collator=data_collator,  # Use data collator instead of tokenizer directly
    compute_metrics=compute_metrics,
)

# Train the model
trainer.train()

# Evaluate the model
eval_results = trainer.evaluate()
print(eval_results)

# Save the fine-tuned model
model.save_pretrained("./fine_tuned_gpt2")
tokenizer.save_pretrained("./fine_tuned_gpt2")
