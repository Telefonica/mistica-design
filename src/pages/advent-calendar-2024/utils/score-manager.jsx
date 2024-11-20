export const saveGameData = (gameName, score, completed) => {
  const gameScores = JSON.parse(localStorage.getItem("gameScores")) || {};
  gameScores[gameName] = { score, completed };
  console.log("Saving game data:", gameScores); // Verify the data before saving

  localStorage.setItem("gameScores", JSON.stringify(gameScores));
};
