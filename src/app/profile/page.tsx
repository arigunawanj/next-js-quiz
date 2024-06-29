import Layout from "../../layout/page";

interface MainProps {
  children: React.ReactNode;
}

export default function Profile({ children }: MainProps) {
  return (
    <>
      <div>
        <Layout metaTitle="Home" metaDescription="Welcome to the homepage">
          <p>Profile</p>
        </Layout>
      </div>
    </>
  );
}
