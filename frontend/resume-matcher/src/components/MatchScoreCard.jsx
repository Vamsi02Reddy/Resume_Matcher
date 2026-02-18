import React from 'react'

const MatchScoreCard = ({matchScore}) => {
  return (
    <div style={styles.card}>
        <h2>Match Score</h2>
        <div style={{...styles.score,color: scoreColor(matchScore)}}>{matchScore}</div>     
    </div>
  )
}

const styles = {
  card: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    textAlign: "center",
    marginBottom: "20px"
  },
  score: {
    fontSize: "48px",
    fontWeight: "bold",
  }
};
function scoreColor(score) {
  if (score >= 75) return "green";
  if (score >= 50) return "orange";
  return "red";
}
export default MatchScoreCard;


