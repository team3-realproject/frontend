import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getPost, putPost } from "../../APIs/detailPostApi";

function PostEditForm() {
  const navigate = useNavigate();
  const [editPost, setEditPost] = useState({
    title: "",
    category: "",
    content: "",
  });
  const [file, setFile] = useState<string | Blob>();
  const { id } = useParams();
  const [imgFile, setImgFile] = useState<any>("");
  const getImage = (e: any) => {
    const image = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = () => {
      setImgFile(reader.result);
      setFile(image);
    };
  };

  const { data, isError, isLoading, isSuccess } = useQuery(["post", id], () =>
    getPost(id)
  );
  console.log(data);
  useEffect(() => {
    if (isSuccess) {
      setEditPost({
        title: data.title,
        category: data.category,
        content: data.content,
      });
      setImgFile(data.imgUrl);
    }
  }, [isSuccess]);
  const queryClient = useQueryClient();

  const submitHandler = (e: any) => {
    e.preventDefault();
    //onst formData = new FormData();
    if (editPost.title === "") {
      alert("제목을 입력해주세요!");
      return;
    }
    if (editPost.category === "") {
      alert("카테고리를 선택해주세요");
      return;
    }
    if (editPost.content === "") {
      alert("내용을 입력해 주세요");
      return;
    }
    // if (file) {
    //   const formData = new FormData();
    //   formData.append(
    //     "data",
    //     new Blob([JSON.stringify(editPost)], { type: "application/json" })
    //   );
    //   formData.append("file, file");
    // }
    const payload = [id, editPost];
    mutatePost.mutate(payload);
    //window.location.href = `/post/${id}`;
  };

  const mutatePost = useMutation(putPost, {
    onSuccess: () => {
      queryClient.invalidateQueries(["post", id]);
    },
  });

  if (isError) return <div>Error!!!!!!</div>;
  if (isLoading) return <div>Loading~~~</div>;
  return (
    <>
      <STHeader>
        <img src="/image/x.png" alt="x" onClick={() => navigate("/board")} />
        <div className="wrap">
          <span>게시판 ·</span>
          <select
            value={editPost.category}
            onChange={(e) => {
              const { value } = e.target;
              setEditPost({ ...editPost, category: value });
            }}
          >
            <option defaultValue="">카테고리</option>
            <option value="free">자유</option>
            <option value="partTime">알바고민</option>
            <option value="cover">대타</option>
          </select>
        </div>
        <button onClick={submitHandler}>등록</button>
      </STHeader>
      <SContianer>
        <div className="titleForm">
          <input
            type="text"
            value={editPost.title}
            placeholder="제목"
            onChange={(e) => {
              const { value } = e.target;
              setEditPost({ ...editPost, title: value });
            }}
          />
        </div>
        <div className="content">
          <textarea
            placeholder="내용을 작성해주세요"
            value={editPost.content}
            onChange={(e) => {
              const { value } = e.target;
              setEditPost({ ...editPost, content: value });
            }}
          />
        </div>
        <div className="preview">
          <img
            src={imgFile ? imgFile : `/images/pencil.png`}
            alt="임시기본이미지"
          />
        </div>
        <Line />
        <div className="imageUpload">
          <label className="signup-profileImg-label" htmlFor="profileImg">
            <img src="/image/camera-mono.png" alt="카메라" />
          </label>
          <input
            className="signup-profileImg-input"
            type="file"
            accept="image/*"
            id="profileImg"
            onChange={getImage}
            multiple
          />
        </div>
      </SContianer>
    </>
  );
}
const STHeader = styled.div`
  display: flex;
  margin: 12px 0px 19.36px 0px;
  height: 35px;
  img {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
  .wrap {
    margin-left: 85px;
    font-size: 17px;
    font-weight: 500;
    select {
      border: none;
      width: 83px;
      height: 25px;
      font-size: 17px;
      font-weight: 500;
    }
  }
  button {
    font-weight: 400;
    font-size: 17px;
    line-height: 25px;
    border: none;
    background-color: transparent;
    color: #5fce80;
    margin-left: 44px;
  }
`;
const SContianer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  .titleForm {
    border-bottom: 0.5px solid rgba(197, 197, 197, 0.7);
    margin-bottom: 10px;
    input {
      width: 100%;
      height: 45px;
      font-weight: 400;
      font-size: 24px;
      line-height: 35px;
      border: none;
      margin-bottom: 10px;
    }
  }
  .content {
    textarea {
      border: none;
      width: 100%;
      height: 250px;
      font-weight: 400;
      font-size: 15px;
      resize: none;
      :focus {
        outline: none;
        //display: none;
      }
    }
  }
  .preview {
    img {
      width: 345px;
      height: 258px;
      min-width: 345px;
      min-height: 258px;
      border: 0.5px solid rgba(197, 197, 197, 0.7);
      margin-bottom: 43px;
      object-fit: cover;
    }
  }
  .imageUpload {
    input {
      display: none;
      .img {
        width: 24px;
        height: 24px;
      }
    }
  }
`;

const Line = styled.div`
  width: 100%;
  height: 0px;
  border: 0.5px solid rgba(197, 197, 197, 0.7);
  margin-bottom: 10px;
`;

export default PostEditForm;
