import Score from "./score";
import { useScreenSize } from "@telefonica/mistica";

const GameBar = ({ score, time, timeRunning, movements }) => {
  const { isMobile } = useScreenSize();
  return (
    <div
      style={{
        display: isMobile ? "flex" : "inline-flex",
        width: isMobile ? "100%" : "auto",
        alignSelf: "flex-start",
        flexDirection: "column",
        gap: 16,
        position: isMobile ? "inherit" : "absolute",
        left: isMobile ? 0 : 56,
        top: isMobile ? 0 : 56,
        marginBottom: isMobile ? 24 : 0,
        zIndex: 2,
      }}
    >
      <Score
        score={score}
        time={time}
        timeRunning={timeRunning}
        movements={movements}
      />
    </div>
  );
};

export default GameBar;
