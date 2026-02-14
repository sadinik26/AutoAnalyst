MarketIQ: AI-Powered Market Analysis
MarketIQ is a full-stack application that provides real-time market insights using Hugging Face’s serverless inference architecture.

Core Components
AI Engine: Powered by the Qwen2.5-7B-Instruct model, it generates structured Markdown reports focusing on market developments and impact analysis.

Backend (FastAPI): A Python-based API that manages asynchronous communication between the UI and the InferenceClient. It uses python-dotenv to securely handle the HF_TOKEN from a .env file.

Frontend (React): A glassmorphism-style interface featuring a custom upward-expanding results container and automated Markdown parsing to isolate insights into clean, distinct cards.

Setup & Security
Dependencies: Install via pip install fastapi uvicorn huggingface_hub python-dotenv.

Environment: Store your Hugging Face API key as HF_TOKEN in a .env file to prevent sensitive data leaks.

Execution: Start the backend with uvicorn main:app --reload to enable the /analyze endpoint for the React frontend.
