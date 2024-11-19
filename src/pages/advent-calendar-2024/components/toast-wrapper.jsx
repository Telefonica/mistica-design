import { useState, useEffect } from "react";
import Toast from "./toast"; // Assuming your Toast component is already implemented

const ToastWrapper = ({ toasts, removeToast }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "16px",
        right: "16px",
      }}
    >
      <div style={{ position: "relative" }}>
        {toasts.map((toast, index) => (
          <Toast
            id={toast.id}
            key={toast.id}
            title={toast.name}
            description={toast.message}
            icon={toast.icon}
            onClose={() => removeToast(toast.id)} // Dismiss the toast by `id`
          />
        ))}
      </div>
    </div>
  );
};

export default ToastWrapper;
