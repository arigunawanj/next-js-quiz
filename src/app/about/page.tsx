import Layout from "../../layout/page";

interface MainProps {
  children: React.ReactNode;
}

export default function About({ children }: MainProps) {
  return (
    <>
      <div>
        <Layout metaTitle="About" metaDescription="About Page">
          <p>About</p>
        </Layout>
      </div>
    </>
  );
}
