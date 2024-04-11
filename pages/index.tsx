import MainLayout from '@/components/layout';
import FeaturedPost from '@/components/sections/featuredPost';
import { Amplify } from 'aws-amplify';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { getParameter } from 'service';

export const getStaticProps: GetStaticProps = async () => {
  try {
    // 예시 API 호출: 실제 환경에 맞게 API 엔드포인트와 요청 구조를 수정해야 합니다.
    const { data } = await getParameter();

    // API로부터 받은 데이터를 props로 반환합니다.
    return {
      props: { res: data },
    };
  } catch (error) {
    console.error('환경 설정 데이터를 불러오는 중 오류 발생:', error);
    // 오류 발생 시, 기본값 또는 오류 페이지로 리다이렉트 등의 처리를 할 수 있습니다.
    return {
      props: { res: {} }, // 오류 처리: 빈 객체 또는 기본값을 반환
    };
  }
};

// export async function getServerSideProps() {
//   const res = await getParameter();

//   return {
//     props: { res: res.data }, // 필요한 프롭스 반환
//   };
// }

const Home = ({ res }: InferGetStaticPropsType<typeof getStaticProps>) => {
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
      <FeaturedPost params={res} />
    </MainLayout>
  );
};
export default Home;
