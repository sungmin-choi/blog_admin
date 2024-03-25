import MainLayout from '@/components/layout';
import FeaturedPost from '@/components/sections/featuredPost';
import SEO from '@/components/sections/seo';
import { getAllPosts } from 'lib/mdx';
import { IPostMeta } from 'types';
import { NextPageWithLayout } from './page';

interface IHome {
  postsMeta: IPostMeta[];
}

const Home: NextPageWithLayout<IHome> = ({ postsMeta }) => {
  return (
    <>
      <SEO />
      <FeaturedPost />
      {/* <LatestPosts postsMeta={postsMeta} /> */}
      {/* <CTA /> */}
    </>
  );
};
export default Home;

Home.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export async function getStaticProps() {
  const postsMeta = getAllPosts()
    .slice(0, 9)
    .map((post) => post.meta);

  return { props: { postsMeta } };
}
