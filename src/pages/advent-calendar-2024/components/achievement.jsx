import { IconQuestionRegular, skinVars } from "@telefonica/mistica";

const Achievement = ({ icon: Icon, isCompleted, isSecret }) => {
  return (
    <div
      style={{
        background: isCompleted
          ? "linear-gradient(120deg, rgba(255,249,208,1) 0%, rgba(255,178,178,1) 24%, rgba(59,95,253,1) 66%, rgba(255,99,114,1) 100%)"
          : skinVars.colors.neutralLow,
        padding: "16px",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "8px",
        outline: `1px solid ${
          isCompleted ? skinVars.colors.inverse : skinVars.colors.neutralMedium
        }`,
        outlineOffset: "-4px",
      }}
    >
      {isSecret ? (
        <IconQuestionRegular></IconQuestionRegular>
      ) : (
        <Icon
          color={
            isCompleted ? skinVars.colors.inverse : skinVars.colors.neutralHigh
          }
        />
      )}
    </div>
  );
};

export default Achievement;
