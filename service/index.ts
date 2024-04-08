import axios from 'axios';

export const client = axios.create({
  baseURL: 'https://api.qwerblog.com',
  headers: {
    'Content-Type': `application/json;charset=UTF-8`,
    Accept: 'application/json',

    'Access-Control-Allow-Credentials': 'true',
  },
});

export const getS3SignedUrl = async (
  fileName: string,
  bucketName: string,
  contentType: string
) => {
  try {
    const res = await client.get(
      `/s3Url?fileName=${fileName}&bucketName=${bucketName}&contentType=${contentType}`
    );

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
