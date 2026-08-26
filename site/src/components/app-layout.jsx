import AppHeader from "./header";
import AppFooter from "./footer";
import styles from "./app-layout.module.css";

const AppLayout = ({ children }) => (
  <div>
    <AppHeader />
    <main className={styles.main}>{children}</main>
    <AppFooter />
  </div>
);

export default AppLayout;
