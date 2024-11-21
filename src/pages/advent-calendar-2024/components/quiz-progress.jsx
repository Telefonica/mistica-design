import { ProgressBarStepped } from "@telefonica/mistica";

const QuizProgress = ({ current, total }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 120,
      width: "100%",
      padding: "0 56px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div style={{ maxWidth: 600, width: "100%" }}>
      <ProgressBarStepped
        currentStep={current}
        steps={total}
      />
    </div>
  </div>
);

export default QuizProgress;
