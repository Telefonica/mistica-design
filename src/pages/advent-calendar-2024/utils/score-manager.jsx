export const saveGameData = (gameName, score, completed) => {
  const gameScores = JSON.parse(localStorage.getItem("gameScores")) || {};
  gameScores[gameName] = { score, completed }; // Verify the data before saving

  localStorage.setItem("gameScores", JSON.stringify(gameScores));
};
