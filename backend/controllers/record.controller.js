const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);
const access = promisify(fs.access);
const { exec } = require("child_process");
const { createClient } = require("@deepgram/sdk");
const { convert } = require("html-to-text");
const path = require("path");
const OpenAI = require("openai");
const db = require("../models");
const Summary = db.summary;
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

exports.summarize = async (req, res) => {
  try {
    const file = req.file;
    const filePath = path.join(__dirname, "..", "uploads", file.filename);

    let transcription = await getTranscription(filePath);

    let summarized_text = await getSummary(transcription);
    summarized_text = removePrefixFromHTML(summarized_text);

    let textContent = convert(summarized_text, { wordwrap: 130 });
    let title = textContent.substring(0, 10);

    await Summary.create({
      title: title,
      content: summarized_text,
      userId: req.user.id,
      shareId: generateRandomString(),
      transcription: transcription,
    });

    const rows = await Summary.findAll({
      where: { userId: req.user.id.toString() },
      order: [["updatedAt", "DESC"]],
    });

    await unlinkAsync(filePath);
    res.status(200).json({ data: rows });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateSummarize = async (req, res) => {
  try {
    const { id } = req.body;
    const file = req.file;
    const filePath = path.join(__dirname, "..", "uploads", file.filename);

    let transcription = await getTranscription(filePath);

    let row = await Summary.findOne({ where: { id } });

    let summarized_text = await getSummary(
      transcription + "\n" + row.transcription
    );
    summarized_text = removePrefixFromHTML(summarized_text);

    await Summary.update(
      {
        content: summarized_text,
        transcription: transcription + "\n" + row.transcription,
      },
      { where: { id } }
    );

    const rows = await Summary.findAll({
      where: { userId: req.user.id.toString() },
      order: [["updatedAt", "DESC"]],
    });

    await unlinkAsync(filePath);
    res.status(200).json({ data: rows });
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
    });
    return completion.choices[0].message.content;
  } catch (err) {
    console.log(err);
  }
};

const getTranscription = async (filePath) => {
  try {
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
    let transcription = "";

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      fs.readFileSync(filePath),
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

const generateRandomString = (length = 16) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

const removePrefixFromHTML = (htmlString) => {
  let text = htmlString;
  if (text.startsWith("```html") && text.endsWith("```")) {
    text = text.slice(7);
    text = text.slice(0, -3);
  }
  return text;
};
