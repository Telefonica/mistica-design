import Toast from "./toast"; // Assuming your Toast component is already implemented
import { Stack, useScreenSize } from "@telefonica/mistica";

const ToastWrapper = ({ toasts, removeToast }) => {
  const totalToasts = toasts.length;
  const { isMobile } = useScreenSize();

  return (
    <div
      style={{
        position: "fixed",
        bottom: "16px",
        right: isMobile ? "0" : "16px",
        padding: isMobile ? "0 16px" : "0",
      }}
    >
      <Stack space={8}>
        {toasts.map((toast, index) => {
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
