import React, { useState } from "react";
import { Button, CircularProgress, Card, CardContent, Typography } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import { Configuration, OpenAIApi } from "openai";

// OpenAI API Setup
const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const VoiceAssistant = () => {
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  // Function to send user input to OpenAI and retrieve response
  const fetchGPTResponse = async (userInput) => {
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [{ role: "user", content: userInput }],
      });
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Error fetching response:", error);
      return "Sorry, I encountered an error. Please try again.";
    }
  };

  // Start listening to user input
  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    recognition.onstart = () => setListening(true);
    recognition.onresult = async (event) => {
      const userInput = event.results[0][0].transcript;
      setListening(false);
      setLoading(true);
      const aiResponse = await fetchGPTResponse(userInput);
      setResponse(aiResponse);
      setLoading(false);
      speak(aiResponse);
    };
  };

  // Function to speak out the AI response
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Card style={{ marginBottom: "20px", padding: "10px", textAlign: "center" }}>
      <CardContent>
        <Typography variant="h5">AI Voice Assistant</Typography>
        <Typography variant="body2" color="textSecondary">
          Tap the microphone to start speaking, and the assistant will respond.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<MicIcon />}
          onClick={startListening}
          disabled={listening || loading}
          style={{ marginTop: "20px" }}
        >
          {listening ? "Listening..." : "Ask the Assistant"}
        </Button>
        {loading && <CircularProgress style={{ marginTop: "10px" }} />}
        <Typography variant="body1" style={{ marginTop: "20px" }}>
          {response}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VoiceAssistant;