import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

# Get Gemini API key
api_key = os.getenv("GEMINI_API_KEY")

# Create Gemini client
client = genai.Client(api_key=api_key)

app = FastAPI(title="Government AI Assistant")

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Question(BaseModel):
    question: str


# Home route
@app.get("/")
def home():
    return {
        "message": "Government AI Assistant Backend is running"
    }


# Check available Gemini models
@app.get("/models")
def list_models():
    try:
        models = client.models.list()

        result = []

        for model in models:
            result.append({
                "name": model.name,
                "supported_actions": getattr(
                    model,
                    "supported_actions",
                    None
                )
            })

        return {
            "models": result
        }

    except Exception as e:
        return {
            "error": str(e)
        }


# Ask question
@app.post("/ask")
def ask_question(data: Question):

    question = data.question

    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=f"""
You are a helpful AI assistant for a Tamil Nadu Government
information application.

Answer the user's question clearly and simply.

The application is designed to help citizens understand:

- Government services
- Government schemes
- Government jobs
- Certificates and documents
- Land and revenue

Important:
Do not claim that information is officially verified unless
the application provides an official government source.

For now, answer the question clearly.

User question:
{question}
"""
        )

        answer = response.text

        return {
            "question": question,
            "answer": answer
        }

    except Exception as e:

        print("GEMINI ERROR:", repr(e))

        return {
            "question": question,
            "answer": "Sorry, I could not process your question.",
            "error": str(e)
        }