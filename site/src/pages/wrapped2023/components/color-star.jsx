const ColorStar = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      maxWidth="240"
      height="240"
      viewBox="0 0 240 240"
      fill="none"
    >
      <rect x="113.115" width="13.7705" height="240" fill="var(--yellow)" />
      <rect
        x="240"
        y="113.115"
        width="13.7705"
        height="240"
        transform="rotate(90 240 113.115)"
        fill="#59C2C9"
      />
      <rect
        x="30.2786"
        y="40.0157"
        width="13.7705"
        height="240"
        transform="rotate(-45 30.2786 40.0157)"
        fill="#E66C64"
      />
      <rect
        x="40.0157"
        y="209.721"
        width="13.7705"
        height="240"
        transform="rotate(-135 40.0157 209.721)"
        fill="#C466EF"
      />
    </svg>
  );
};

export default ColorStar;
