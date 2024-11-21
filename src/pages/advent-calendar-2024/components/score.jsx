import { IconAlarmClockFilled, Inline, Tag, Text4 } from "@telefonica/mistica";

const Score = ({ score, time, timeRunning, movements }) => {
  return (
    <Inline space={24}>
      {score && (
        <div style={{ display: "flex", gap: 16 }}>
          <Text4>Score</Text4>
          <Tag type="active">{score}</Tag>
        </div>
      )}
      {time && (
        <div style={{ display: "flex", gap: 16 }}>
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
        <div style={{ display: "flex", gap: 16 }}>
          <Text4>Movements</Text4>
          <Tag type="promo">{movements}</Tag>
        </div>
      )}
    </Inline>
  );
};

export default Score;
