import { IconQuestionRegular, skinVars } from "@telefonica/mistica";
import DecorationPatty from "../assets/decorations/decoration-patty.jsx";

export const Achievement = ({ icon: Icon, isCompleted, isSecret }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <DecorationPatty
        size={72}
        stroke={1}
        color={isCompleted ? skinVars.colors.error : undefined}
        background={isCompleted ? undefined : skinVars.colors.neutralLow}
        check={isCompleted}
      >
        {isSecret && !isCompleted ? (
          <IconQuestionRegular
            color={
              isCompleted
                ? skinVars.colors.brand
                : skinVars.colors.neutralMedium
            }
          ></IconQuestionRegular>
        ) : (
          <Icon
            color={
              isCompleted
                ? skinVars.colors.brand
                : skinVars.colors.neutralMedium
            }
          />
        )}
      </DecorationPatty>
    </div>
  );
};

export default Achievement;
