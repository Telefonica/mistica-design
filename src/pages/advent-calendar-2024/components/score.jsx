import {
  IconAlarmClockFilled,
  Inline,
  skinVars,
  Tag,
  Text4,
  Text5,
} from "@telefonica/mistica";
import DecorationPatty from "../assets/decorations/decoration-patty";

const Score = ({ score, time, timeRunning, movements, isFinal }) => {
  return (
    <>
      {isFinal ? (
        <div
          style={{ display: "inline-flex", flexDirection: "column", gap: 8 }}
        >
          <Text5>Your final score is</Text5>
          <DecorationPatty size={128} text={score} stroke="0.75" color={skinVars.colors.brand} />
        </div>
      ) : (
        <div style={{ display: "flex", gap: 24 }}>
          {score && (
            <div style={{ display: "inline-flex", gap: 16 }}>
              <Text4>Score</Text4>
              <Tag type="active">{score}</Tag>
            </div>
          )}
          {time && (
            <div style={{ display: "inline-flex", gap: 16 }}>
              <Text4>Time</Text4>
              <Tag
                type={timeRunning ? "error" : "inactive"}
                Icon={IconAlarmClockFilled}
              >
                {time}
              </Tag>
            </div>
          )}
          {movements && (
            <div style={{ display: "inline-flex", gap: 16 }}>
              <Text4>Movements</Text4>
              <Tag type="promo">{movements}</Tag>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Score;
