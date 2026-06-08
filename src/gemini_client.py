from google import genai

from config import GEMINI_API_KEY

MODEL_NAME = "gemini-2.5-flash"


def get_gemini_client():
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not set")
    return genai.Client(api_key=GEMINI_API_KEY)



