import { Inline, Tag, Text4 } from "@telefonica/mistica";

const Score = ({ score }) => {
  return (
    <div style={{ display: "flex", gap: 16 }}>
      <Text4>Score</Text4>
      <Tag type="active">{score}</Tag>
    </div>
  );
};

export default Score;
