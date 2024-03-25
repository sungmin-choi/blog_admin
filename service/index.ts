import axios from 'axios';

export const client = axios.create({
  baseURL: 'https://fczqbx2rci.execute-api.ap-northeast-2.amazonaws.com',
  headers: {
    'Content-Type': `application/json;charset=UTF-8`,
    Accept: 'application/json',
    'Access-Control-Allow-Origin': `*`,
    'Access-Control-Allow-Credentials': 'true',
  },
});

export const getS3SignedUrl = async (fileName: string) => {
  try {
    const res = await client.get(`/s3Url?fileName=${fileName}`);

    return res;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const postBlog = async (payload: any) => {
  try {
    const res = await client.post(`/blog`, payload);

    return res;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
