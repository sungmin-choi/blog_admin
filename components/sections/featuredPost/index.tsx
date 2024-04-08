// import { postBlog } from 'lib/mdx';
import axios from 'axios';
import matter from 'gray-matter';
import { useRef, useState } from 'react';
import { getS3SignedUrl, postBlog } from 'service';
import { v4 as uuidv4 } from 'uuid';
import LoginForm from '../Auth/LoginForm';

const S3ObjUrl = 'https://p1-mdx.s3.ap-northeast-2.amazonaws.com';
const S3ImageObjUrl = 'https://p1-image.s3.ap-northeast-2.amazonaws.com';

const FeaturedPost = () => {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<any>(null);

  const fileInputImgRef = useRef<HTMLInputElement>(null);
  const [isUploadedImg, setIsUploadedImg] = useState<boolean>(false);
  const [isUploadingImg, setIsUploadingImg] = useState<boolean>(false);
  const [uploadedImgUrl, setUploadedImgUrl] = useState<string>('');

  const fileInputMDXRef = useRef<HTMLInputElement>(null);

  const [selectedMDXdFile, setSelectedMDXFile] = useState<any>(null);
  const [previewMDX, setPreviewMDX] = useState<any>(null);
  const [isUploadedMDX, setIsUploadedMDX] = useState<boolean>(false);
  const [isUploadingMDX, setIsUploadingMDX] = useState<boolean>(false);

  const [metaData, setMetaData] = useState<any>(null);

  const getMDfileMetaData = (source: string) => {
    const { content, data } = matter(source);

    const payload = {
      excerpt: data.excerpt ?? '',
      title: data.title,
      tags: (data.tags ?? []).sort(),
      date: (data.date ?? new Date()).toString(),
      image: data.image ?? '',
    };

    setMetaData(payload);
  };

  const cancelUpload = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputImgRef.current) {
      fileInputImgRef.current.value = '';
    }
    setMetaData(null);
    setUploadedImgUrl('');
    setIsUploadedImg(false);
  };

  const cancelUploadMDX = () => {
    setPreviewMDX(null);
    setSelectedMDXFile(null);
    if (fileInputMDXRef.current) {
      fileInputMDXRef.current.value = '';
    }
    setIsUploadedMDX(false);
    setMetaData(null);
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);

      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  const handleUploadImage = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('Content-Type', selectedFile.type);
      try {
        setIsUploadingImg(true);

        const uuid = uuidv4();

        const id = uuid.substring(0, 5);

        const res = await getS3SignedUrl(
          id + selectedFile.name,
          'p1-image',
          selectedFile.type
        );

        await axios.put(res.data.url, selectedFile, {
          headers: { 'Content-Type': 'image/png' },
        });
        const objUrl = `${S3ImageObjUrl}/${id + selectedFile.name}`;
        setIsUploadedImg(true);
        setUploadedImgUrl(objUrl);
      } catch (err: any) {
        console.log(err);
      } finally {
        setIsUploadingImg(false);
      }
    }
  };

  const handleMDXChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedMDXFile(file);
      setPreviewMDX(file.name);
      const reader = new FileReader();
      reader.onload = function (e: ProgressEvent<FileReader>) {
        const fileContent = e.target?.result;
        if (typeof fileContent === 'string') {
          getMDfileMetaData(fileContent);
        }
      };

      reader.readAsText(file);
    }
  };

  const handleUploadMDX = async () => {
    if (selectedMDXdFile) {
      const formData = new FormData();
      formData.append('file', selectedMDXdFile);
      try {
        setIsUploadingMDX(true);
        const uuid = uuidv4();

        const id = uuid.substring(0, 5);

        // 서명된 S3 url 받아오기
        const res = await getS3SignedUrl(
          id + previewMDX,
          'p1-mdx',
          'text/markdown'
        );
        const objUrl = `${S3ObjUrl}/${id + previewMDX}`;
        // md file S3에 저장
        await axios.put(res.data.url, selectedMDXdFile);

        const payload = {
          ...metaData,
          post_id: uuid,
          md_url: objUrl,
        };

        await postBlog(payload);
        setIsUploadedMDX(true);
      } catch (err: any) {
        console.log(err);
      } finally {
        setIsUploadingMDX(false);
      }
    }
  };

  return (
    <section className="w-[100%] flex flex-col items-center mt-[100px]">
      <LoginForm />
      <div className="w-[50%] pb-6">
        <input
          ref={fileInputImgRef}
          type="file"
          id="image-upload"
          className="image-upload"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
        <h2 className="text-2xl font-bold">
          {isUploadedImg
            ? '이미지 업로드 성공'
            : isUploadingImg
            ? '이미지 업로드중...'
            : '이미지 업로드해 주세요'}
        </h2>
        {!previewUrl && (
          <label
            htmlFor="image-upload"
            className="rounded-lg py-2 px-4 text-white bg-pink-700 "
          >
            이미지 업로드!!
          </label>
        )}

        {previewUrl && (
          <div>
            {isUploadedImg ? (
              <button className="rounded-lg py-2 px-4 text-white bg-pink-700 ">
                업로드 성공
              </button>
            ) : (
              <button
                onClick={() => handleUploadImage()}
                className="rounded-lg py-2 px-4 text-white bg-pink-700 "
              >
                {isUploadingImg ? 'S3로 업로드 중...' : 'S3로 업로드'}
              </button>
            )}
            <button
              onClick={() => cancelUpload()}
              className="rounded-lg py-2 px-4 ml-3 text-white bg-red-600 "
            >
              삭제하기
            </button>
          </div>
        )}
        {uploadedImgUrl && (
          <div>
            <h2 className="text-2xl font-bold">업로드 된 이미지 URL:</h2>
            {uploadedImgUrl}
          </div>
        )}
        {previewUrl && (
          <div>
            <h2 className="text-2xl font-bold">이미지 썸네일:</h2>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: '300px' }}
            />
          </div>
        )}
      </div>

      <div className="w-[50%] pb-6 ">
        <input
          ref={fileInputMDXRef}
          type="file"
          id="mdx-upload"
          className="mdx-upload"
          accept=".md"
          style={{ display: 'none' }}
          onChange={handleMDXChange}
        />
        <h2 className="text-2xl font-bold">
          {' '}
          {isUploadedMDX
            ? 'MD 파일 업로드 성공'
            : isUploadingMDX
            ? 'MD 파일 업로드중...'
            : 'MD 파일 업로드해 주세요'}
        </h2>
        {!previewMDX && (
          <label
            htmlFor="mdx-upload"
            className="rounded-lg py-2 px-4 text-white bg-pink-700 "
          >
            MD 파일 업로드
          </label>
        )}

        {previewMDX && (
          <div>
            {isUploadedMDX ? (
              <button className="rounded-lg py-2 px-4 text-white bg-pink-700 ">
                업로드 성공
              </button>
            ) : (
              <button
                onClick={() => handleUploadMDX()}
                className="rounded-lg py-2 px-4 text-white bg-pink-700 "
              >
                {isUploadingMDX ? 'S3에 업로드중...' : 'S3로 업로드'}
              </button>
            )}

            <button
              onClick={() => cancelUploadMDX()}
              className="rounded-lg py-2 px-4 ml-3 text-white bg-red-600 "
            >
              삭제하기
            </button>
          </div>
        )}
        {previewMDX && (
          <div>
            <h4 className="text-2xl font-bold">{previewMDX}</h4>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedPost;
