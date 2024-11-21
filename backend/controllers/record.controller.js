const { createClient } = require("@deepgram/sdk");
const OpenAI = require("openai");
const db = require("../models");
const Breakdown = db.breakdown;
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.summarize = async (req, res) => {
  try {
    const { originalText = "", type = "breakdown" } = req.body;
    const file = req.file;

    let transcription = await getTranscription(file.buffer);
    let data = {
      transcription,
    };
    if (type == "breakdown") {
      let response = await getSummary(originalText + "\n\n" + transcription);
      data.content = response.content;
      data.title = response.title;
    }
    res.status(200).json({ data });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const { originalText = "", id } = req.body;
    const file = req.file;

    let transcription = await getTranscription(file.buffer);
    let data = {
      transcription,
    };
    let response = await getSummary(originalText + "\n\n" + transcription);
    data.content = response.content;
    data.title = response.title;

    await Breakdown.update(data, { where: { id } });
    const row = await Breakdown.findOne({ where: { id } });

    res.status(200).json({ data: row });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSummary = async (txt) => {
  try {
    let msgs = [
      {
        role: "system",
        content: process.env.SYSTEM_PROMPT,
      },
      { role: "user", content: txt },
    ];

    const completion = await openai.chat.completions.create({
      messages: msgs,
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
    });
    return JSON.parse(completion.choices[0].message.content);
  } catch (err) {
    console.log(err);
  }
};

const getTranscription = async (fileBuffer) => {
  try {
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
    let transcription = "";

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      fileBuffer,
      {
        model: "nova-2",
        smart_format: true,
      }
    );
    if (error) {
      console.log("error----", error);
    }
    if (result) {
      transcription =
        result.results.channels[0].alternatives[0].transcript + " ";
    }

    return transcription;
  } catch (err) {
    console.log(err);
  }
};
