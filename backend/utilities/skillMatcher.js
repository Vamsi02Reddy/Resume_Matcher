function normalize(skill = "") {
  return skill
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\./g, "")
    .trim();
}

function skillMatches(skillA, skillB) {
  const a = normalize(skillA);
  const b = normalize(skillB);

  return a === b || a.includes(b) || b.includes(a);
}

function matchSkills(resumeSkills = [], jdSkills = []) {
  return jdSkills.filter(jdSkill =>
    resumeSkills.some(resumeSkill =>
      skillMatches(resumeSkill, jdSkill)
    )
  );
}

module.exports = { normalize, skillMatches, matchSkills };
