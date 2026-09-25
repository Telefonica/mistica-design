import { skinVars } from "@telefonica/mistica";

const IconInvader = ({ size = 24, color = skinVars.colors.neutralHigh }) => (
  <div style={{ height: size }}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M14.8125 10.125V12H16.6875V10.125H14.8125ZM7.3125 10.125V12H9.1875V10.125H7.3125ZM7.3125 17.625H11.0625V19.5H7.3125V17.625ZM16.6875 17.625V19.5H12.9375V17.625H16.6875ZM16.6875 6.375V4.5H18.5625V6.375H16.6875ZM7.3125 6.375H9.1875V8.25H14.8125V6.375H16.6875V8.25H18.5625V10.125H20.4375V12H22.3125V17.625H20.4375V13.875H18.5625V17.625H16.6875V15.75H7.3125V17.625H5.4375V13.875H3.5625V17.625H1.6875V12H3.5625V10.125H5.4375V8.25H7.3125V6.375ZM5.4375 4.5H7.3125V6.375H5.4375V4.5Z"
        fill={color}
      />
    </svg>
  </div>
);
export default IconInvader;
