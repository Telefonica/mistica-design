import { Text3, Inline, useScreenSize, Text, Stack } from "@telefonica/mistica";
import styles from "./data-box.module.css";

const DataBox = ({ title, content, align }) => {
  const { isMobile } = useScreenSize();

  const Flower = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
    >
      <path
        d="M12.302 19.88C11.914 22.747 10.83 24.1801 9.04803 24.1801C8.01903 24.1801 7.24899 23.715 6.73999 22.785L6.49103 22.32C6.14803 21.689 5.58903 21.274 4.81403 21.075L4.28302 20.942C2.72202 20.566 1.94202 19.6971 1.94202 18.3361C1.94202 16.8531 3.05399 15.647 5.27899 14.717C4.43799 14.85 3.76203 14.916 3.25403 14.916C2.32403 14.916 1.54899 14.656 0.929993 14.136C0.309993 13.616 0 12.9691 0 12.1941C0 11.5741 0.260029 10.9771 0.780029 10.4011L1.17804 9.95303C1.64304 9.44403 1.875 8.96303 1.875 8.50903C1.875 8.40903 1.85801 8.17204 1.82501 7.79504L1.77502 7.36304V7.04803C1.77502 5.22203 2.67099 4.30905 4.46399 4.30905C5.58199 4.30905 6.77699 5.02904 8.04999 6.46704C7.34199 5.27204 6.987 4.19806 6.987 3.24606C6.987 2.50506 7.22798 1.88205 7.70898 1.37805C8.18998 0.875052 8.78502 0.623047 9.49402 0.623047C9.89202 0.623047 10.268 0.701042 10.623 0.855042L11.038 1.05405C11.613 1.30905 12.045 1.43604 12.333 1.43604C12.565 1.43604 12.908 1.34804 13.362 1.17004L13.843 0.971039C14.385 0.750039 14.833 0.639038 15.188 0.639038C15.918 0.639038 16.543 0.921053 17.064 1.48605C17.584 2.05005 17.844 2.72605 17.844 3.51105C17.844 4.39705 17.462 5.39305 16.698 6.49905C17.982 5.03805 19.182 4.30804 20.301 4.30804C21.042 4.30804 21.651 4.56305 22.127 5.07205C22.603 5.58105 22.841 6.24003 22.841 7.04803C22.841 7.21403 22.83 7.36306 22.808 7.49606L22.742 7.89404C22.72 8.06004 22.709 8.23206 22.709 8.40906C22.709 8.98506 22.952 9.54406 23.439 10.0861L23.754 10.451C24.307 11.071 24.584 11.685 24.584 12.294C24.584 13.102 24.293 13.7771 23.712 14.3191C23.131 14.8611 22.409 15.132 21.545 15.132C20.991 15.132 20.261 15.0441 19.354 14.8661C21.545 15.7961 22.641 16.9861 22.641 18.4351C22.641 19.7301 21.954 20.5431 20.582 20.8751L20.101 21.0081C19.171 21.2301 18.518 21.661 18.142 22.303L17.926 22.6851C17.328 23.6811 16.526 24.179 15.519 24.179C13.585 24.18 12.512 22.746 12.302 19.88ZM12.302 15.4311L12.651 16.294L13.415 16.1451L13.432 15.182L14.544 16.4271L15.225 15.929L14.295 14.501L15.175 14.833L15.557 14.119L14.843 13.5551L15.739 13.522L15.839 12.709L14.943 12.4431L16.47 11.7621L16.254 10.998L14.577 11.3961L15.158 10.666L14.627 10.1021L13.88 10.617L14.129 9.72104L13.382 9.37204L12.818 10.152L12.685 8.47504H11.855L11.706 10.152L11.241 9.37204L10.494 9.72104L10.726 10.601L9.979 10.0861L9.43103 10.6501L9.979 11.4471L8.33502 11.0651L8.06903 11.829L9.646 12.493L8.75 12.742L8.83301 13.506L9.74603 13.5391L9.03198 14.1371L9.414 14.851L10.31 14.536L9.48004 16.014L10.111 16.4951L11.223 15.217L11.19 16.147L11.937 16.313L12.302 15.4311ZM12.302 15.1981C11.605 15.1981 11.021 14.96 10.551 14.484C10.08 14.008 9.84503 13.4271 9.84503 12.7411C9.84503 12.0551 10.083 11.474 10.559 10.998C11.035 10.522 11.616 10.2841 12.302 10.2841C12.988 10.2841 13.569 10.522 14.045 10.998C14.521 11.474 14.759 12.0551 14.759 12.7411C14.759 13.4281 14.521 14.009 14.045 14.484C13.569 14.96 12.988 15.1981 12.302 15.1981ZM12.268 13.7701C12.6 13.7701 12.849 13.6851 13.015 13.5131C13.181 13.3421 13.264 13.0841 13.264 12.7411C13.264 12.3981 13.181 12.1431 13.015 11.9771C12.849 11.8111 12.6 11.7281 12.268 11.7281C11.936 11.7281 11.687 11.8111 11.521 11.9771C11.355 12.1431 11.272 12.3981 11.272 12.7411C11.272 13.0841 11.355 13.3421 11.521 13.5131C11.687 13.6851 11.936 13.7701 12.268 13.7701Z"
        fill="black"
      />
    </svg>
  );

  const Minimize = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
    >
      <path
        d="M0.169922 12.285C0.169922 8.88797 1.36792 5.99099 3.76392 3.59399C6.15992 1.19799 9.05693 0 12.4549 0C15.8519 0 18.7489 1.19799 21.1459 3.59399C23.5419 5.98999 24.7399 8.88697 24.7399 12.285C24.7399 15.683 23.5419 18.58 21.1459 20.976C18.7499 23.372 15.8529 24.57 12.4549 24.57C9.05693 24.57 6.15992 23.372 3.76392 20.976C1.36792 18.58 0.169922 15.683 0.169922 12.285ZM2.62692 12.285C2.62692 14.992 3.58693 17.304 5.50693 19.221C7.42693 21.138 9.74293 22.096 12.4549 22.096C15.1659 22.096 17.4819 21.138 19.4029 19.221C21.3229 17.304 22.2829 14.992 22.2829 12.285C22.2829 9.57797 21.3229 7.266 19.4029 5.349C17.4829 3.432 15.1669 2.474 12.4549 2.474C9.74293 2.474 7.42693 3.432 5.50693 5.349C3.58693 7.266 2.62692 9.57797 2.62692 12.285ZM8.35392 12.285C8.35392 11.156 8.75193 10.191 9.54893 9.388C10.3459 8.586 11.3139 8.18399 12.4539 8.18399C13.5829 8.18399 14.5479 8.585 15.3509 9.388C16.1529 10.191 16.5549 11.156 16.5549 12.285C16.5549 13.414 16.1539 14.38 15.3509 15.182C14.5479 15.985 13.5829 16.386 12.4539 16.386C11.3249 16.386 10.3589 15.985 9.55692 15.182C8.75492 14.38 8.35392 13.414 8.35392 12.285Z"
        fill="black"
      />
    </svg>
  );

  const GithubLogo = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="31"
      viewBox="0 0 32 31"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16.0132 0C7.15833 0 0 7.10414 0 15.8929C0 22.9183 4.58659 28.8651 10.9494 30.9698C11.7449 31.1281 12.0363 30.6279 12.0363 30.2071C12.0363 29.8387 12.0101 28.5757 12.0101 27.2599C7.5556 28.2073 6.62799 25.3653 6.62799 25.3653C5.91212 23.5234 4.85143 23.05 4.85143 23.05C3.39348 22.0764 4.95763 22.0764 4.95763 22.0764C6.57489 22.1817 7.4235 23.7078 7.4235 23.7078C8.85491 26.1284 11.1615 25.4444 12.0894 25.0234C12.2218 23.9971 12.6463 23.2867 13.097 22.8921C9.54422 22.5237 5.80625 21.1555 5.80625 15.0508C5.80625 13.3141 6.44214 11.8933 7.44973 10.7883C7.29075 10.3937 6.73386 8.76198 7.60903 6.57811C7.60903 6.57811 8.96111 6.15703 12.0098 8.20948C13.315 7.86159 14.6611 7.68461 16.0132 7.68312C17.3653 7.68312 18.7436 7.86751 20.0164 8.20948C23.0654 6.15703 24.4175 6.57811 24.4175 6.57811C25.2926 8.76198 24.7354 10.3937 24.5764 10.7883C25.6106 11.8933 26.2202 13.3141 26.2202 15.0508C26.2202 21.1555 22.4823 22.4972 18.9029 22.8921C19.4864 23.392 19.9898 24.3391 19.9898 25.839C19.9898 27.9703 19.9636 29.6808 19.9636 30.2068C19.9636 30.6279 20.2553 31.1281 21.0505 30.9702C27.4133 28.8648 31.9999 22.9183 31.9999 15.8929C32.0261 7.10414 24.8416 0 16.0132 0Z"
        fill="black"
      />
    </svg>
  );

  return (
    <div
      className={styles.container}
      style={{ width: isMobile ? "100%" : "inherit", alignSelf: align }}
    >
      <div className={styles.header}>
        <Inline fullWidth space="between" alignItems="center">
          <Inline fullWidth space={16}>
            {Flower}
            {Minimize}
          </Inline>
          {GithubLogo}
        </Inline>
      </div>
      <div className={styles.body}>
        <div className={styles.content}>
          <Stack space={16}>
            <Text
              size={isMobile ? 18 : 24}
              transform="uppercase"
              weight="medium"
            >
              {title}
            </Text>
            <ul>
              {content.map((item) => (
                <li>
                  <Inline alignItems="baseline" space={8} wrap>
                    <Text size={isMobile ? 56 : 140} weight="bold">
                      {item.title}
                    </Text>
                    <Text size={isMobile ? 18 : 24}>{item.description}</Text>
                  </Inline>
                </li>
              ))}
            </ul>
          </Stack>
        </div>
      </div>
    </div>
  );
};
export default DataBox;