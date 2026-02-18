require("dotenv").config();
const express = require("express");
const path = require("path");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const cors = require("cors");
const GeminiModel = require("./services/geminiClient");

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI API KEY is missing");
}

app.use(cors());
app.use(express.json());
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const safeDate = new Date().toISOString().replace(/[:]/g, "-");
    cb(null, `${safeDate}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const fileType = ["text/plain", "application/pdf"];
    if (fileType.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported files"));
    }
  },
});

const cleanText = (text) => text.replace(/\s+/g, " ").trim();

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "fileupload.html"));
});

app.post("/", upload.single("uploadedFile"), async (req, res, cb) => {
  try {
    if (!req.file) {
      return res.status(400).json({ err: "No file uploaded" });
    }
    let text = "";
    if (req.file.mimetype == "text/plain") {
      text = cleanText(fs.readFileSync(req.file.path, "utf8"));
    }

    if (req.file.mimetype == "application/pdf") {
      const buffer = fs.readFileSync(req.file.path);
      const data = await pdfParse(buffer);
      text = cleanText(data.text);
    }

    if (!text) {
      return res.status(400).json({ err: "file contain no readable content" });
    }

    res.status(200).json({ "My text": text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Fails to parse the uploaded file" });
  }
});

const { matchSkills } = require("./utilities/skillMatcher");
app.post("/analyze-skills", upload.single("myFile"), async (req, res) => {
  // const {jdText,resumeText} = req.body;
  const myJd = req.body.myJd;
  const resumeText = req.body.extractedText;
  const jobTitle = req.body.jobTitle;

  console.log(jobTitle);

  // console.log(myJd);
  // console.log(resumeText);
  try {
    if (!myJd || !resumeText) {
      return res
        .status(400)
        .json({ err: "Missing JD or extracted resume data" });
    }

    let prompt = process.env.RESUME_PROMPT;
    prompt = prompt
      .replace("{{resumeText}}", resumeText)
      .replace("{{myJd}}", myJd)
      .replace("{{jobTitle}}", jobTitle);

    // console.log(prompt);
    const result = await GeminiModel.generateContent(prompt);
    const rawText = await result.response.text();

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      return res.status(422).json({
        error: "Invalid JSON from AI",
        raw: rawText,
      });
    }

    const isValid =
      Array.isArray(parsed.resumeSkills) &&
      Array.isArray(parsed.jdRequiredSkills) &&
      Array.isArray(parsed.jdOptionalSkills) &&
      typeof parsed.resumeMatchPercentage === "number";

    if (!isValid) {
      return res.status(422).json({
        error: "Invalid JSON structure",
        raw: parsed,
      });
    }

    const matchedRequired = matchSkills(
      parsed.resumeSkills,
      parsed.jdRequiredSkills,
    );

    const missingRequired = parsed.jdRequiredSkills.filter(
      (skill) => !matchedRequired.includes(skill),
    );

    res.json({
      resumeSkills: parsed.resumeSkills,
      jdRequiredSkills: parsed.jdRequiredSkills,
      jdOptionalSkills: parsed.jdOptionalSkills,

      matchedRequired,
      missingRequired,

      resumeMatchPercentage: parsed.resumeMatchPercentage,

      stats: {
        resumeSkillCount: parsed.resumeSkills.length,
        requiredSkillCount: parsed.jdRequiredSkills.length,
        matchedRequiredCount: matchedRequired.length,
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Gemini analysis and skills extraction failed" });
  }
});

app.get("/api/result", (req, res) => {
  const mockResults = {
    matchScore: 70,
    matchedSkills: ["JavaScript", "React", "HTML", "CSS"],
    missingSkills: ["TypeScript", "Node.js", "System Design"],
    suggestions: [
      "Learn TypeScript to improve type safety",
      "Build a Node.js REST API project",
      "Practice low-level system design questions",
    ],
  };
  res.send(mockResults);
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).send(err.message);
  } else if (err) {
    return res.status(400).send(err.message);
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Port is running in ${PORT}`);
});
