import React, { useState, useEffect } from "react";
import MatchScoreCard from "../components/MatchScoreCard";
import MissingSkillsList from "../components/MissingSkillsList";
import SuggestionsPanel from "../components/SuggestionsPanel";
import axios from "axios";
// import { useParams } from "react-router-dom";

const Results = () => {
  const [mockdata, setMockdata] = useState({
    matchScore: 0,
    matchedSkills: [],
    missingSkills: [],
    suggestions: [],
  });
  console.log(mockdata);
  useEffect(() => {
    axios
      .get("/api/result")
      .then((res) => {
        setMockdata(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // const { resultId } = useParams();
  return (
    <>
      {mockdata && (
        <>
          <MatchScoreCard matchScore={mockdata.matchScore} />
          <MissingSkillsList missingSkills={mockdata.missingSkills} />
          <SuggestionsPanel suggestions={mockdata.suggestions} />
        </>
      )}
    </>
  );
};

export default Results;
