import numpy as np
import pandas as pd
import speech_recognition as sr
import pyttsx3
from flask import Flask, request
from flask_socketio import SocketIO, emit
from datetime import datetime

# Load the dataset
file_path = '/Users/akhilthuremella/Downloads/officialHackRUFINAL.csv'
data = pd.read_csv(file_path)

# Initialize Flask app and SocketIO
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize text-to-speech engine
engine = pyttsx3.init()

# Helper function to normalize time
def normalize_time(time_str):
    hours, minutes, seconds = map(int, time_str.split(":"))
    if hours >= 24:
        hours = hours % 24
    return f"{hours:02}:{minutes:02}:{seconds:02}"

# Function definitions remain the same as in your original code (e.g., get_next_train_time, list_stops_on_route, etc.)

# Main question-processing function with added logic
def answer_question(question):
    if "next train" in question:
        stop_name = question.split(" at ")[-1].strip()
        return get_next_train_time(stop_name, "05:00:00")
    elif "stops on the" in question:
        route_name = question.split(" the ")[-1].strip()
        return list_stops_on_route(route_name)
    elif "how far has the train traveled" in question:
        stop_name = question.split("reaches ")[-1].strip()
        return distance_traveled_to_stop(stop_name)
    elif "how long does it take from" in question:
        stops = question.split(" from ")[-1].split(" to ")
        if len(stops) < 2:
            return "Please provide both the start and destination stops."
        start_stop = stops[0].strip()
        destination_stop = stops[1].strip()
        return travel_time_between_stops(start_stop, destination_stop)
    elif "can i go from" in question.lower():
        stops = question.split(" from ")[-1].split(" to ")
        if len(stops) < 2:
            return "Please provide both the start and destination stops."
        start_stop = stops[0].strip()
        destination_stop = stops[1].strip()
        return can_travel_between_stops(start_stop, destination_stop)
    else:
        return "I'm sorry, I can help with train schedules, stop counts, and route information. Could you rephrase your question?"

# SocketIO event to handle incoming questions from the client
@socketio.on('question')
def handle_question(data):
    question = data.get('question')
    print("Received question:", question)
    
    # Process the question and get the answer
    answer = answer_question(question)
    print("Answer:", answer)
    
    # Use pyttsx3 to speak the answer aloud on the server side
    engine.say(answer)
    engine.runAndWait()
    
    # Send the answer back to the client
    emit('answer', {'answer': answer})

# Flask route for testing the server
@app.route('/')
def index():
    return "Flask-SocketIO server is running."

# Run the server
if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
