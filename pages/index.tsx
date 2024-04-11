import MainLayout from '@/components/layout';
import FeaturedPost from '@/components/sections/featuredPost';
import { Amplify } from 'aws-amplify';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getParameter } from 'service';

export async function getServerSideProps() {
  const res = await getParameter();

  return {
    props: { res: res.data }, // 필요한 프롭스 반환
  };
}

const Home = ({ res }: InferGetServerSidePropsType<GetServerSideProps>) => {
  Amplify.configure(
    {
      Auth: {
        Cognito: {
          userPoolClientId: res.userPoolClientId,
          userPoolId: res.userPoolId,
          loginWith: {
            // Optional

            oauth: {
              domain: res.cognitoDomain,
              scopes: ['openid email '],
              redirectSignIn: [
                'http://localhost:3000/',
                'https://admin.qwerblog.com/',
              ],
              redirectSignOut: [
                'http://localhost:3000/',
                'https://admin.qwerblog.com/',
              ],
              responseType: 'code',
            },
          },
        },
      },
    },
    { ssr: true }
  );
  return (
    <MainLayout>
      {/*  */}
      <FeaturedPost params={res} />
    </MainLayout>
  );
};
export default Home;
