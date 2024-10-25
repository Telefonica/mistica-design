import { ResponsiveLayout } from "@telefonica/mistica";

const ComingSoonPage = ({ targetDate }) => {
  return (
    <ResponsiveLayout>
      <h1>Coming Soon</h1>
      <p>{targetDate}</p>
    </ResponsiveLayout>
  );
};

export default ComingSoonPage;
