import Layout from "../layout/page";

interface MainProps {
  children: React.ReactNode;
}

export default function Main({ children }: MainProps) {
  return (
    <>
      <div>
        <Layout metaTitle="Home" metaDescription="Welcome to the homepage">
          <p>Home</p>
        </Layout>
      </div>
    </>
  );
}
