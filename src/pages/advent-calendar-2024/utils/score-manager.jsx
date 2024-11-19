export function initScore() {
    if (!localStorage.getItem("totalScore")) {
        localStorage.setItem("totalScore", "0");
    }
    if (!localStorage.getItem("pendingScore")) {
        localStorage.setItem("pendingScore", "0");
    }
    if (!localStorage.getItem("lastUpdate")) {
        localStorage.setItem("lastUpdate", new Date().toISOString());
    }
}

export function saveScore(points) {
    let pendingPoints = parseInt(localStorage.getItem("pendingScore"), 10);
    pendingPoints += points;
    localStorage.setItem("pendingScore", pendingPoints.toString());
}

export function updatePoints() {
    const totalScore = parseInt(localStorage.getItem("totalScore"), 10);
    const pendingScore = parseInt(localStorage.getItem("pendingScore"), 10);
    const newTotalScore = totalScore + pendingScore;
    
    localStorage.setItem("totalScore", newTotalScore.toString());
    localStorage.setItem("pendingScore", "0");
    localStorage.setItem("lastUpdate", new Date().toISOString());
}

export function allPoints() {
    return localStorage.getItem("totalScore") || "0";
}

