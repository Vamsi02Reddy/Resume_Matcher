import React, { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { Upload, FileText, Briefcase, Eye } from "react-bootstrap-icons";
import "./pages.css";
import axios from "axios";
import FullPageLoader from "../components/FullPageLoader";
import LeftTooltip from "../components/LeftTooltip";
import ModalTip from "../components/ModalTip"; // Import your modal
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import { useNavigate } from "react-router-dom";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const UploadResume = () => {
  const [jdtext, setjdText] = useState("");
  const [jobtitle, setJobtitle] = useState("");
  const [file, setFile] = useState(null);
  const [fileText, setFileText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();

  const isValid =
    file && jdtext.trim().length >= 10 && jobtitle.trim().length > 0;

  const handleFileChange = async (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);

    if (selectedFile.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const cleaned = e.target.result
          .split("\n")
          .map((line) => line.replace(/\s+/g, " ").trim())
          .filter(Boolean)
          .join("\n");
        setFileText(cleaned);
      };
      reader.readAsText(selectedFile);
      return;
    }

    if (selectedFile.type === "application/pdf") {
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let extractedText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          extractedText +=
            content.items.map((item) => item.str).join(" ") + "\n";
        }
        setFileText(extractedText.trim());
      } catch (err) {
        console.error(err);
        setFileText("Failed to extract text from PDF.");
      }
      return;
    }

    setFileText("Unsupported file type.");
  };

  const saveHistory = (resultData, JobTitle) => {
    const existing = JSON.parse(localStorage.getItem("saveHistory") || "[]");
    const newEntry = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      JobTitle,
      data: resultData,
    };
    localStorage.setItem(
      "saveHistory",
      JSON.stringify([newEntry, ...existing]),
    );
    return newEntry;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("myFile", file);
    formData.append("myJd", jdtext);
    formData.append("extractedText", fileText);
    formData.append("jobTitle", jobtitle);

    try {
      const res = await axios.post(
        "http://localhost:3000/analyze-skills",
        formData,
      );
      const savedEntry = saveHistory(res.data, jobtitle);
      navigate(`/result/${savedEntry.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <FullPageLoader text="Analyzing resume & matching skills..." />
      )}

      <Container fluid="sm" className="py-4 upload-wrapper">
        <div className="d-flex justify-content-center">
          <Card className="upload-card glass-card px-3 px-md-4 py-3 w-100">
            <Card.Header className="upload-header">
              <h3>Upload Your Resume</h3>
              <small>Let’s get you noticed 🚀</small>
            </Card.Header>

            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {/* Job Title */}
                <Form.Group className="mb-4">
                  <Form.Label className="form-label-custom">
                    <Briefcase className="me-2" /> Job Title
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter job title"
                    value={jobtitle}
                    onChange={(e) => setJobtitle(e.target.value)}
                  />
                </Form.Group>

                {/* File Upload */}
                <Form.Group className="mb-4">
                  <Form.Label className="form-label-custom d-flex justify-content-between align-items-center">
                    <div>
                      <FileText className="me-2" /> Resume File
                    </div>

                    {/* Show preview button only if a file is uploaded */}
                    {file && (
                      <ModalTip
                        content={fileText}
                        triggerLabel={
                          <>
                            <Eye className="me-1" /> Preview
                          </>
                        }
                      />
                    )}
                  </Form.Label>

                  {/* Drag & Drop Area */}
                  <div
                    className={`file-drop-area ${dragOver ? "drag-over" : ""}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      handleFileChange(e.dataTransfer.files[0]);
                    }}
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    <p>
                      {file
                        ? file.name
                        : "Drag & Drop your file or click to upload (.pdf/.txt)"}
                    </p>
                  </div>

                  {/* Hidden File Input */}
                  <Form.Control
                    id="fileInput"
                    type="file"
                    accept=".txt,.pdf"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e.target.files[0])}
                  />
                </Form.Group>

                {/* Job Description */}
                <Form.Group className="mb-4">
                  <div className="d-flex justify-content-between flex-wrap align-items-center mb-1">
                    <Form.Label className="form-label-custom">
                      Job Description
                    </Form.Label>
                    <LeftTooltip />
                  </div>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Tell us anything important about your experience..."
                    value={jdtext}
                    onChange={(e) => setjdText(e.target.value)}
                    minLength={10}
                  />
                  <p className="mt-1">
                    JD character count: {jdtext.trim().length}{" "}
                    <span
                      style={{
                        background: "yellow",
                        padding: "3px 10px",
                        borderRadius: "5px",
                      }}
                    >
                      min 10 chars
                    </span>
                  </p>
                </Form.Group>

                <div className="d-grid mt-3">
                  <Button
                    type="submit"
                    className="submit-btn"
                    disabled={!isValid}
                  >
                    <Upload className="me-2" />
                    Submit Resume
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  );
};

export default UploadResume;
