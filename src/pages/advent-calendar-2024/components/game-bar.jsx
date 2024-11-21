import Score from "./score";

const GameBar = ({ score, timeRemaining, timerStarted }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        justifyContent: "space-between",
        flexDirection: "column",
        gap: 16,
        position: "absolute",
        left: 56,
        top: 56,
      }}
    >
      <Score score={score} />
    </div>
  );
};

export default GameBar;
