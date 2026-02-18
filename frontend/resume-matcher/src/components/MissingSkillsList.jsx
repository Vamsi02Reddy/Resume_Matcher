import React from 'react'

const MissingSkillsList = ({missingSkills}) => {
  return (
    <div className='upload-card' style={styles.card}>
      <h3>Missing Skills</h3>

      {missingSkills.length === 0 ? (
        <p>No missing skills 🎉</p>
      ) : (
        <ul>
          {missingSkills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  card: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "20px"
  }
};

export default MissingSkillsList;