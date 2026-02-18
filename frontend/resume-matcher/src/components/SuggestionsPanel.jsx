import React from 'react'

const SuggestionsPanel = ({ suggestions }) => {
  return (
    <div className='upload-card' style={styles.card}>
      <h3>Suggestions</h3>
      <ol>
        {suggestions.map((suggestion, index) => (
          <li key={index}>{suggestion}</li>
        ))}
      </ol>
    </div>
  );
};

const styles = {
  card: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px"
  }
};

export default SuggestionsPanel;
