import Layout from "../../layout/page";
import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPaths } from "next";

interface Repo {
    name: string;
    [key: string]: any; // Add other properties as needed
}

interface UsersByNameProps {
    repo: Repo;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const res = await fetch('https://api.github.com/repos/vercel/next.js');
    const repo: Repo = await res.json();
    return { props: { repo } };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = [
        { params: { id: '70107786' } },
    ];
    
    return { paths, fallback: false };
};

const UsersByName = ({ repo }: UsersByNameProps) => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <Layout metaTitle="Home" metaDescription="Welcome to the homepage">
            <p>Users by ID {id}</p>
            <p>Repo Name: {repo.name}</p>
        </Layout>
    );
};

export default UsersByName;
