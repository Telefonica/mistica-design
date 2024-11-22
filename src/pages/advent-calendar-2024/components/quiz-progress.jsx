import { ProgressBarStepped, useScreenSize } from "@telefonica/mistica";

const QuizProgress = ({ current, total }) => {
  const { isMobile } = useScreenSize();

  return (
    <div
      style={{
        position: isMobile ? "relative" : "absolute",
        left: 0,
        top: isMobile ? 0 : 120,
        width: "100%",
        padding: isMobile ? 0 : "0 56px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: isMobile ? 24 : 0,
      }}
    >
      <div style={{ maxWidth: 600, width: "100%" }}>
        <ProgressBarStepped currentStep={current} steps={total} />
      </div>
    </div>
  );
};

export default QuizProgress;
