  import React, { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import { Container, Table, Card, Button } from "react-bootstrap";
  import "./pages.css";

  const History = () => {
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
      // Load history asynchronously to avoid React 18 warnings
      const loadHistory = () => {
        const stored = JSON.parse(localStorage.getItem("saveHistory") || "[]");
        setHistory(stored);
      };
      setTimeout(loadHistory, 0);
    }, []);

    const getMatchBadge = (percentage) => {
      if (percentage > 85)
        return <span className="badge-strong-new">Strong</span>;
      if (percentage > 70)
        return <span className="badge-partial-new">Partial Fit</span>;
      return <span className="badge-poor-new">Poor Fit</span>;
    };

    const handleDelete = (id) => {
      const filtered = history.filter((item) => item.id !== id);
      localStorage.setItem("saveHistory", JSON.stringify(filtered));
      setHistory(filtered);
    };

    return (
      <div className="history-bg-new py-3">
        <Container>
          <Card className="history-card-new shadow-lg border-0">
            <Card.Body>
              <h2 className="history-title-new text-center mb-4">
                📊 Resume Scan History
              </h2>

              {history.length === 0 ? (
                <p className="history-empty-new text-center">
                  No scans yet. Upload your resume to get started 🚀
                </p>
              ) : (
                <Table
                  hover
                  responsive
                  className="history-table-new text-white align-middle"
                >
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Match %</th>
                      <th>Strength</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {history.map((item) => {
                      const percentage = item.data?.resumeMatchPercentage || 0;
                      return (
                        <tr key={item.id} className="history-row-new">
                          <td className="history-jobtitle-new">{item.JobTitle}</td>
                          <td className="history-percentage-new">{percentage}%</td>
                          <td>{getMatchBadge(percentage)}</td>
                          <td className="history-date-new">
                            {new Date(item.createdAt).toLocaleString()}
                          </td>
                          <td className="d-flex gap-2 justify-content-center">
                            <Button
                              className="btn-view-new"
                              size="sm"
                              onClick={() => navigate(`/result/${item.id}`)}
                            >
                              View
                            </Button>
                            <Button
                              className="btn-delete-new"
                              size="sm"
                              variant="danger"
                              onClick={() => handleDelete(item.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  };

  export default History;
