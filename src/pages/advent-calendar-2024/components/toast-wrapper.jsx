import { useState, useEffect } from "react";
import Toast from "./toast"; // Assuming your Toast component is already implemented
import { Stack } from "@telefonica/mistica";

const ToastWrapper = ({ toasts, removeToast }) => {
  const totalToasts = toasts.length;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "16px",
        right: "16px",
      }}
    >
      <Stack space={8}>
        {toasts.map((toast, index) => {
          const scaleValue = 1 - index * 0.2;
          console.log(`scale(${scaleValue})`); // Log the scale value

          return (
            <Toast
              id={toast.id}
              key={toast.id}
              title={toast.name}
              description={toast.message}
              icon={toast.icon}
              onClose={() => removeToast(toast.id)} // Dismiss the toast by `id`
              style={{
                right: "16px",
                zIndex: 1000 + index,
              }}
              delay={(totalToasts - index - 1) * 1000} // Last toast will have the longest delay
            />
          );
        })}
      </Stack>
    </div>
  );
};

export default ToastWrapper;
