const awsConfig = {
  Auth: {
    region: '리전',
    userPoolId: '유저풀ID',
    userPoolWebClientId: '앱클라이언트ID',
    oauth: {
      domain: 'yourdomain.auth.리전.amazoncognito.com',
      scope: ['email', 'profile', 'openid'],
      redirectSignIn: 'http://localhost:3000/',
      redirectSignOut: 'http://localhost:3000/',
      responseType: 'code',
    },
  },
};

export default awsConfig;
