from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
import json

app = Flask(__name__)
CORS(app)

# Load sample data
with open("data/sample_feedback.json", "r") as f:
    feedbacks = json.load(f)

openai.api_key = os.getenv("OPENAI_API_KEY")

def analyze_sentiment(text):
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=f"Analyze the sentiment of this feedback: '{text}'. Is it Positive, Negative or Neutral?",
        max_tokens=10
    )
    return response.choices[0].text.strip()

@app.route("/feedback", methods=["GET"])
def get_feedback():
    for f in feedbacks:
        f["sentiment"] = analyze_sentiment(f["feedback"])
    return jsonify(feedbacks)

@app.route("/submit", methods=["POST"])
def submit_feedback():
    data = request.json
    data["sentiment"] = analyze_sentiment(data["feedback"])
    feedbacks.append(data)
    return jsonify({"message": "Feedback submitted", "data": data})

if __name__ == "__main__":
    app.run(debug=True)
