import { useState } from "react";
import styles from "./label-rotate.module.css";

const RotatingSVG = ({ fill }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`${styles.logoContainer}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="96"
        height="96"
        viewBox="0 0 96 96"
        fill={fill ?? "#000"}
      >
        <g className={`${styles.rotation} ${isHovered ? styles.slowMo : ""}`}>
          <path d="M41.0475 16.327L41.048 16.33H41.028L41.0475 16.327Z" />
          <path d="M41.0475 16.327L39.718 7.81L41.548 7.52L41.828 8.23H41.908C42.098 7.77 42.528 7.36 43.318 7.24L44.878 7L45.188 9L43.758 9.22C42.678 9.39 42.218 10.03 42.388 11.14L43.148 16L41.0475 16.327Z" />
          <path d="M28.3281 22.0197L30.7979 20.6198L29.2879 15.1198L29.5779 14.9498L33.5379 19.0498L36.0079 17.6498L33.6979 9.0498L31.7679 10.1498L33.3079 15.7698L33.0179 15.9398L28.9579 11.7598L26.8879 12.9398L28.4079 18.5698L28.1079 18.7398L24.0579 14.5498L22.1279 15.6498L28.3281 22.0197Z" />
          <path d="M14.1181 31.7402C13.0581 33.8702 13.5981 35.4102 15.0781 36.1502H15.0681C16.4081 36.8202 17.9681 36.2702 18.8281 34.5502C19.3881 33.4302 19.2681 32.3802 19.0281 31.9002L19.0681 31.8202L19.8881 32.0402L20.7181 30.3802L15.8081 27.9302C14.0981 27.0802 12.2281 27.7202 11.2081 29.7602C10.1881 31.8002 10.8681 33.5202 12.0381 34.2602L12.9681 32.3902C12.5981 32.0702 12.3681 31.4002 12.7881 30.5502C13.2081 29.7202 14.0381 29.4502 14.8481 29.8502L15.0181 29.9302L14.1181 31.7402ZM16.3881 30.6202L16.6181 30.7302C17.6981 31.2702 18.0481 32.2902 17.4681 33.4502C17.0781 34.2302 16.4681 34.4502 15.8781 34.1602C15.2981 33.8702 15.0881 33.2302 15.5881 32.2302L16.3881 30.6202Z" />
          <path d="M11.1381 48.12C8.55813 47.82 6.88813 45.73 7.17813 43.25C7.45813 40.85 9.24813 39.67 10.9581 39.54L10.7081 41.68C9.98813 41.82 9.27813 42.35 9.14813 43.47C9.00813 44.69 9.86813 45.81 11.3781 45.98C12.8681 46.15 13.9781 45.25 14.1181 44.03C14.2481 42.91 13.6781 42.23 12.9381 41.93L13.1881 39.79C14.8781 40.31 16.3581 41.86 16.0781 44.26C15.7881 46.74 13.6981 48.4 11.1381 48.11V48.12Z" />
          <path d="M4.01808 55.2498C4.12808 55.9598 4.69808 56.3998 5.38808 56.2898C6.05808 56.1798 6.47808 55.5798 6.36808 54.8798C6.25808 54.1698 5.66808 53.7098 4.99808 53.8198C4.30808 53.9298 3.90808 54.5398 4.01808 55.2498Z" />
          <path d="M7.74808 55.7498L16.2581 54.3998V54.3898L15.9281 52.2798L7.41808 53.6298L7.74808 55.7498Z" />
          <path d="M17.8581 59.9599C18.3981 61.2699 17.9681 62.2899 16.7881 62.7699L12.5881 64.4899L13.1081 65.7499L11.2381 66.5199L10.7181 65.2599L8.32807 66.2399L7.51807 64.2599L9.90807 63.2799L9.16807 61.4699L11.0381 60.6999L11.7781 62.5099L15.5681 60.9499C15.9281 60.7999 16.0281 60.5799 15.8781 60.2199L15.3481 58.9299L17.1381 58.1899L17.8581 59.9499V59.9599Z" />
          <path d="M21.8182 71.4998L23.1282 73.1298H23.1382C23.9882 72.4498 24.6882 70.5998 22.9682 68.4498C21.4082 66.4998 19.7182 66.3098 18.5982 67.1998C17.4482 68.1098 17.3282 69.3698 18.2682 71.0098L18.9582 72.2198C19.3382 72.9198 19.3382 73.3498 19.0082 73.6198C18.6582 73.9098 17.9882 73.8298 17.3582 73.0499C16.7182 72.2598 16.7682 71.4998 17.1882 71.1599L15.8782 69.5298C14.9082 70.3098 14.5082 72.2398 16.0182 74.1198C17.4982 75.9798 19.2282 76.1598 20.3482 75.2698C21.4182 74.4098 21.4782 73.1398 20.5682 71.5198L19.8982 70.3298C19.4782 69.5798 19.5382 69.1698 19.9182 68.8598C20.2982 68.5598 20.9382 68.6598 21.6282 69.5198C22.3382 70.4098 22.2282 71.1698 21.8182 71.4998Z" />
          <path d="M23.6181 82.75L23.609 82.7532L22.1581 81.67L19.0581 82.41L20.8481 83.74L23.609 82.7532L23.6181 82.76V82.75Z" />
          <path d="M29.6781 74.99L24.5281 81.9L22.8081 80.62L27.9581 73.71L29.6781 74.99Z" />
          <path d="M44.7481 81.2101L42.2381 89.4601L40.4681 88.9201L40.5481 88.0701L40.4681 88.0501C40.0481 88.3801 39.0981 88.6801 38.1581 88.4001C36.9381 88.0301 36.3581 87.0701 36.2381 86.4801L36.1581 86.4501C35.6281 86.8901 34.4981 87.2801 33.2381 86.8901C31.5181 86.3701 30.6281 84.5901 31.2181 82.6701L32.7681 77.5601L34.7981 78.1801L33.3181 83.0401C33.0081 84.0501 33.3981 84.8101 34.2481 85.0601C35.0781 85.3101 35.9681 84.8501 36.2481 83.9301L37.7281 79.0701L39.7781 79.6901L38.2981 84.5501C37.9881 85.5601 38.3781 86.3201 39.2081 86.5701C40.0681 86.8301 40.9381 86.3701 41.2181 85.4401L42.6981 80.5801L44.7481 81.2001V81.2101Z" />
          <path d="M49.2381 12.9002C49.4681 11.2702 50.7581 10.2602 53.1181 10.6002L55.1181 10.8802L55.1481 10.7002C55.2681 9.81023 54.7581 9.10023 53.8281 8.97023C52.8881 8.84023 52.3281 9.27023 52.1381 9.73023L50.0681 9.44023C50.3981 8.10023 51.8181 6.90023 54.0681 7.22023C56.3181 7.54023 57.5281 9.11023 57.2581 11.0002L56.4981 16.4402L54.6681 16.1802L54.6181 15.3302H54.5381C54.1581 15.6902 53.2081 16.1402 51.9581 15.9702C50.0581 15.7002 49.0381 14.3902 49.2481 12.9102L49.2381 12.9002ZM54.8681 12.6402L54.9081 12.3902L53.1281 12.1402C52.0181 11.9802 51.4781 12.3902 51.3881 13.0302C51.2981 13.6902 51.7081 14.1902 52.5681 14.3102C53.8481 14.4902 54.7081 13.8402 54.8781 12.6402H54.8681Z" />
          <path d="M58.5723 20.5425L58.5681 20.5502V20.5402L58.5723 20.5425Z" />
          <path d="M58.5723 20.5425L64.2981 9.99023L65.9281 10.8702L65.6181 11.8002L65.6881 11.8402C66.4281 11.5102 67.4281 11.4902 68.4681 12.0502C70.4081 13.1002 71.1081 15.5502 69.8381 17.9002C68.5681 20.2402 66.1381 20.9802 64.1981 19.9202C63.1681 19.3602 62.6681 18.5302 62.5581 17.8502L62.4781 17.8102L60.4481 21.5602L58.5723 20.5425ZM67.2381 13.6602C66.1781 13.0902 64.8581 13.4502 64.1181 14.8102C63.3881 16.1502 63.7981 17.4802 64.8581 18.0502C65.9181 18.6202 67.2281 18.2402 67.9581 16.8902C68.6981 15.5302 68.2981 14.2302 67.2381 13.6602Z" />
          <path d="M67.8581 26.1501L77.0081 18.3501L78.2081 19.7601L77.5781 20.5201L77.6281 20.5801C78.4381 20.5401 79.3782 20.8801 80.1481 21.7801C81.5781 23.4601 81.3581 26.0001 79.3281 27.7301C77.2981 29.4601 74.7682 29.2701 73.3281 27.5901C72.5681 26.7001 72.3981 25.7401 72.5381 25.0701L72.4881 25.0101L69.2381 27.7801L67.8481 26.1501H67.8581ZM77.9481 26.1101C79.1281 25.1101 79.2181 23.7501 78.4381 22.8301C77.6581 21.9101 76.2881 21.7801 75.1081 22.7801C73.9481 23.7701 73.8481 25.1501 74.6281 26.0701C75.4081 26.9901 76.7781 27.1001 77.9381 26.1001L77.9481 26.1101Z" />
          <path d="M87.2981 34.3598C86.4581 32.0098 84.0481 30.8698 81.5981 31.7398V31.7498C79.1581 32.6198 78.0181 35.0298 78.8581 37.3798C79.6481 39.5898 81.4881 40.2898 82.7381 40.2598L82.0081 38.2098C81.5181 38.0898 80.8581 37.6398 80.5481 36.7798C80.1481 35.6598 80.6181 34.4998 81.6581 33.9798L83.8181 40.0298C83.9581 40.0098 84.2981 39.9498 84.6781 39.8098C86.9981 38.9798 88.1081 36.6298 87.2981 34.3598ZM85.6281 34.9498C86.0181 36.0598 85.4881 37.1298 84.4681 37.6198L82.9981 33.4898C84.1081 33.2698 85.2081 33.7698 85.6281 34.9498Z" />
          <path d="M85.2681 44.3502C87.9381 44.4002 89.7181 46.2102 89.6781 48.4202C89.6581 49.5902 89.1081 50.4302 88.5581 50.8502V50.9302L92.7381 51.0102L92.6981 53.1502L80.7981 52.9202L80.8381 51.0802L81.8081 50.9302V50.8502C81.1781 50.3302 80.6981 49.4702 80.7181 48.2402C80.7581 46.0302 82.5981 44.3002 85.2681 44.3502ZM85.1381 50.8602C86.6881 50.8902 87.6581 49.9402 87.6781 48.7302C87.6981 47.5202 86.7681 46.5202 85.2181 46.4902C83.6881 46.4602 82.6981 47.4302 82.6781 48.6302C82.6581 49.8402 83.6081 50.8302 85.1381 50.8602Z" />
          <path d="M87.4479 69.3498L84.5279 66.5898L83.3879 68.6398L86.6179 70.8498L87.4479 69.3498Z" />
          <path d="M74.298 68.24L75.7079 69.62L75.6279 76.33C75.6279 76.97 75.688 77.48 76.228 78.02C76.8979 78.68 77.908 78.69 78.618 77.96C79.3179 77.24 79.2879 76.11 78.478 75.32L80.0779 73.69C81.8179 75.39 81.8579 77.77 80.1779 79.48C78.4879 81.2 76.228 81.22 74.6479 79.67C73.6079 78.65 73.5379 77.48 73.5579 76.1V72.16L73.5079 72.1L70.1779 75.48L68.6479 73.98L74.298 68.23V68.24Z" />
          <path d="M65.678 79.9898L67.718 79.0198C66.818 77.1198 64.638 76.3498 62.278 77.4698C60.008 78.5498 59.228 80.7098 60.038 82.4098C60.688 83.7798 62.018 84.1598 62.838 84.0698L62.878 84.1498C62.348 84.6998 61.868 85.8698 62.458 87.1098C63.268 88.8298 65.348 89.5498 67.498 88.5298C69.748 87.4697 70.518 85.2998 69.678 83.5298L67.638 84.4998C67.978 85.2198 67.618 86.1098 66.648 86.5698C65.648 87.0498 64.788 86.7398 64.478 86.0798C64.128 85.3498 64.378 84.4498 65.438 83.9498L66.148 83.6098L65.328 81.8898L64.618 82.2198C63.508 82.7498 62.558 82.4498 62.148 81.5898C61.788 80.8197 62.118 79.9098 63.198 79.3998C64.318 78.8698 65.308 79.2098 65.678 79.9898Z" />
        </g>
        <g
          className={`${styles.rotationInverse} ${
            isHovered ? styles.slowMo : ""
          }`}
          width={34}
          height={34}
        >
          <path d="M49.5107 41.6203L47.269 47.6913C47.269 47.6913 47.885 47.5439 48.6628 47.6697C49.4191 47.792 50.3284 48.1724 50.9732 49.1976C51.0995 49.3984 51.2157 49.6239 51.3186 49.8771L53.463 55.6388C53.4962 55.7281 53.5318 55.8163 53.5697 55.9032C53.5697 55.9034 53.5696 55.9031 53.5697 55.9032C53.7091 56.2235 53.8798 56.5282 54.0779 56.8125C54.094 56.8357 54.1103 56.8587 54.1268 56.8815C54.3262 57.1583 54.552 57.4155 54.8011 57.6499C55.2283 58.0519 55.724 58.3866 56.2716 58.6363C57.5772 59.2316 59.0712 59.2954 60.4248 58.8135C63.2435 57.8099 64.6968 54.7619 63.6711 52.0051L59.7595 41.4969C58.7336 38.7401 55.6168 37.3185 52.7977 38.3216C51.2453 38.8739 50.0351 40.0884 49.5107 41.6203ZM62.4527 52.4585C62.4526 52.4585 62.4527 52.4586 62.4527 52.4585C63.218 54.5156 62.1445 56.8212 59.9888 57.5888C58.9529 57.9576 57.8087 57.9085 56.8109 57.4535C55.814 56.9988 55.0514 56.1798 54.6813 55.1854L52.5302 49.4056L52.5229 49.3878C51.752 47.4904 50.347 46.6981 49.1301 46.4353C49.1265 46.4346 49.123 46.4338 49.1194 46.433L50.7356 42.0561L50.7407 42.0414C51.1341 40.892 52.0468 39.9685 53.2335 39.5464C55.4024 38.7746 57.7702 39.8788 58.5412 41.9504L62.4527 52.4585ZM53.3578 57.3602C53.1135 57.0062 52.9095 56.6317 52.7489 56.2422L52.628 55.9496L50.5036 50.8058C50.4217 50.6265 50.3284 50.4653 50.2234 50.3221C50.2162 50.3123 50.2089 50.3025 50.2016 50.2929C50.1217 50.1875 50.0353 50.0922 49.9422 50.0069C49.5774 49.6725 49.1098 49.4912 48.5326 49.4573C48.0398 49.4393 47.5462 49.4462 47.0542 49.478L45.8522 52.3861C45.3343 53.6391 45.4028 55.022 46.0426 56.2305C46.6823 57.439 47.841 58.3742 49.2635 58.8302C50.4742 59.219 51.7835 59.2309 52.9821 58.8865C53.2857 58.7993 53.5822 58.6893 53.8682 58.5567C54.0163 58.4881 54.1615 58.4134 54.3035 58.3327C54.2544 58.2969 53.9492 58.0621 53.3865 57.4014C53.3769 57.3877 53.3673 57.374 53.3578 57.3602ZM51.547 56.7378C51.693 57.0918 51.8677 57.4344 52.0691 57.7627C51.2769 57.8961 50.4428 57.8436 49.6604 57.5923C48.5283 57.2294 47.657 56.5016 47.1915 55.6223C46.731 54.7525 46.6851 53.7744 47.0536 52.8826C47.0536 52.8827 47.0536 52.8826 47.0536 52.8826L47.9361 50.7477C48.1139 50.7469 48.2916 50.7496 48.4693 50.7559C48.7382 50.7734 48.8921 50.8395 48.989 50.9058C49.0848 50.9712 49.2004 51.0885 49.3123 51.3269M37.384 42.2578L33.5434 52.7163C32.7873 54.7754 33.8542 57.0644 35.9521 57.8212C38.0554 58.58 40.3689 57.501 41.1271 55.4363L44.9676 44.9778C45.7237 42.9188 44.6569 40.6297 42.5589 39.8729C40.4556 39.1142 38.1422 40.1932 37.384 42.2578ZM32.3231 52.2682L36.1637 41.8097C37.1712 39.0661 40.2319 37.6514 43.0001 38.65C45.7682 39.6487 47.1954 42.6823 46.1879 45.426L42.3474 55.8844C41.3399 58.6281 38.2791 60.0427 35.511 59.0441C32.7429 58.0455 31.3156 55.0118 32.3231 52.2682Z" />
        </g>
      </svg>
    </div>
  );
};

export default RotatingSVG;
