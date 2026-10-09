import { useScreenSize, Align } from "@telefonica/mistica";

const ContentWrapper = ({ children, textAlign, maxWidth = 600 }) => {
  const { isMobile } = useScreenSize();
  return (
    <Align
      y="center"
      x="center"
      height={isMobile ? "auto" : "calc(100vh - (56px * 2))"}
    >
      <div
        style={{
          maxWidth: isMobile ? undefined : maxWidth,
          width: "100%",
          textAlign: textAlign,
        }}
      >
        {children}
      </div>
    </Align>
  );
};

export default ContentWrapper;
