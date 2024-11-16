from transformers import GPT2Tokenizer, GPT2LMHeadModel, Trainer, TrainingArguments
from datasets import load_dataset


#dataset = load_dataset("json", data_files={"train": "train.json", "validation": "val.json"})

tokenizer = GPT2Tokenizer.from_pretrained("gpt2")

tokenizer.pad_token = tokenizer.eos_token

def tokenize_function(examples):
    # Combines input and output into a single training sequence
    combined_text = [
        f"{item['input']} <|endoftext|> {item['output']} <|endoftext|>"
        for item in examples
    ]
    return tokenizer(combined_text, padding="max_length", truncation=True, max_length=512)

tokenized_dataset = dataset.map(tokenize_function, batched=True, remove_columns=dataset["train"].column_names)

model = GPT2LMHeadModel.from_pretrained("gpt2")

model.resize_token_embeddings(len(tokenizer))

training_args = TrainingArguments(
    output_dir="./gpt2_icebreaker",  
    evaluation_strategy="epoch",    
    learning_rate=5e-5,             
    weight_decay=0.01,              
    num_train_epochs=3,            
    per_device_train_batch_size=4, 
    save_strategy="epoch",         
    save_total_limit=2,            
    logging_dir="./logs",           
    logging_steps=10,            
    report_to="none",             
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset["train"],
    eval_dataset=tokenized_dataset["validation"],
)

trainer.train()

trainer.save_model("./gpt2_icebreaker_finetuned")
tokenizer.save_pretrained("./gpt2_icebreaker_finetuned")

print("Fine-tuning complete. Model saved at './gpt2_icebreaker_finetuned'")
