import os
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

# 1. Load your HF_TOKEN from the .env file
load_dotenv()

app = FastAPI()

# 2. Enable CORS for your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Initialize the Client
# Removing 'provider' and just passing the API key is the most stable method for the free tier
client = InferenceClient(api_key=os.getenv("HF_TOKEN"))

@app.get("/analyze")
async def analyze_market(topic: str = Query(..., description="The topic to research")):
    """
    Market analysis using Hugging Face's serverless Inference API.
    """
    prompt = f"Summarize 3 recent market developments for {topic}. Provide an impact analysis for each. Format as Markdown."
    
    try:
        # We use Qwen2.5-7B-Instruct because it has high availability on the free tier
        output = client.chat.completions.create(
            model="Qwen/Qwen2.5-7B-Instruct", 
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500
        )
        
        # Extract the text content from the response
        report_content = output.choices[0].message.content
        return {"report": report_content}
        
    except Exception as e:
        # Detailed error reporting for debugging
        return {"report": f"AI Error: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)