import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./pages.css";

const SkillAnalystResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resultData, setResultData] = useState(null);

useEffect(() => {
  const loadResult = () => {
    const history = JSON.parse(localStorage.getItem("saveHistory") || "[]");
    const selected = history.find((item) => item.id === id);
    if (selected) setResultData(selected);
  };

  setTimeout(loadResult, 0); // async setState to avoid warning
}, [id]);

  if (!resultData)
    return <p className="text-center mt-5 text-light">No result found.</p>;

  const { data } = resultData;
  const percentage = data?.resumeMatchPercentage || 0;

  const getColor = () => {
    if (percentage > 85) return "#22c55e";
    if (percentage > 70) return "#facc15";
    return "#ef4444";
  };

  return (
    <div className="premium-bg">
      <Container className="py-4">

        {/* Glass Card */}
        <div className="glass-card p-4">

          <Row className="align-items-start">

            {/* LEFT - Small Score Section */}
            <Col md={3} className="text-center mb-4">
              <div className="circle-wrapper mx-auto mb-3">
                <CircularProgressbar
                  value={percentage}
                  text={`${percentage}%`}
                  styles={buildStyles({
                    pathColor: getColor(),
                    textColor: "#fff",
                    trailColor: "rgba(255,255,255,0.15)",
                    textSize: "16px"
                  })}
                />
              </div>
              <h6 style={{ color: getColor(), marginBottom: "15px" }}>Overall Match</h6>

              <div className="stats-box vertical-stats">
                <p>Resume Skills: {data.stats?.resumeSkillCount}</p>
                <p>Required Skills: {data.stats?.requiredSkillCount}</p>
                <p>Matched: {data.stats?.matchedRequiredCount}</p>
              </div>
            </Col>

            {/* RIGHT - Skills Sections */}
            <Col md={9}>

              {/* Matched Skills */}
              <div className="skills-panel mb-3">
                <h5>✅ Matched Required Skills</h5>
                <div className="skill-tags">
                  {data.matchedRequired?.length > 0
                    ? data.matchedRequired.map((skill, idx) => (
                        <span key={idx} className="tag matched">{skill}</span>
                      ))
                    : <p className="empty-text">No matched skills</p>
                  }
                </div>
              </div>

              {/* Missing Skills */}
              <div className="skills-panel mb-3">
                <h5>❌ Missing Required Skills</h5>
                <div className="skill-tags">
                  {data.missingRequired?.length > 0
                    ? data.missingRequired.map((skill, idx) => (
                        <span key={idx} className="tag missing">{skill}</span>
                      ))
                    : <p className="empty-text">No missing skills 🎉</p>
                  }
                </div>
              </div>

              {/* Resume Skills */}
              <div className="skills-panel mb-3">
                <h5>💼 Resume Skills</h5>
                <div className="skill-tags">
                  {data.resumeSkills?.map((skill, idx) => (
                    <span key={idx} className="tag neutral">{skill}</span>
                  ))}
                </div>
              </div>

            </Col>
          </Row>

          {/* Action Buttons */}
          <div className="mt-4 text-center d-flex gap-2 flex-wrap justify-content-center">
            <button
              className="btn-primary-premium"
              onClick={() => navigate("/")}
            >
              🔄 Analyze Another Resume
            </button>
            <button
              className="btn-outline-premium"
              onClick={() => navigate("/history")}
            >
              📜 Go to History
            </button>
          </div>

        </div>
      </Container>
    </div>
  );
};

export default SkillAnalystResult;