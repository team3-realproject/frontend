import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getPost, putPost } from "../../APIs/detailPostApi";
import sweetAlert from "../../util/sweetAlert";

function PostEditForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState({ title: "" });
  const [category, setCategory] = useState({ category: "" });
  const [content, setContent] = useState({ content: "" });
  const [isDelete, setIsDelete] = useState({ isDelete: "false" });
  const [boardModal, setBoardModal] = useState(false);
  const [boardType, setBoardType] = useState("");
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

  const mutatePost = useMutation(putPost, {
    onSuccess: () => {
      queryClient.invalidateQueries(["post", id]);
    },
  });

  useEffect(() => {
    if (data) {
      setTitle({ title: data.title });
      setCategory({ category: data.category });
      setContent({ content: data.content });
      setImgFile(data.imgUrl);

      if (data.category === "free") setBoardType("자유 게시판");
      if (data.category === "partTime") setBoardType("알바 고민");
      if (data.category === "cover") setBoardType("대타 구해요");
    }
  }, [data]);

  const queryClient = useQueryClient();

  const submitHandler = (e: any) => {
    e.preventDefault();
    if (title.title === "") {
      sweetAlert(1000, "error", "제목을 입력해주세요!");
      return;
    }
    if (category.category === "") {
      sweetAlert(1000, "error", "카테고리를 선택해주세요");
      return;
    }
    if (content.content === "") {
      sweetAlert(1000, "error", "내용을 입력해 주세요");
      return;
    }
    if (file) {
      const formData = new FormData();
      formData.append("title", title.title);
      formData.append("content", content.content);
      formData.append("category", category.category);
      formData.append("isDelete", isDelete.isDelete);
      formData.append("file", file);
      const payload = [id, formData];

      mutatePost
        .mutateAsync(payload)
        .then((res) => {
          sweetAlert(1000, "success", "수정되었습니다!");
          navigate(`/post/${data.postId}/0`);
        })
        .catch((error) => sweetAlert(1000, "error", error.response.data.msg));
    } else {
      const formData = new FormData();
      formData.append("title", title.title);
      formData.append("content", content.content);
      formData.append("category", category.category);
      formData.append("isDelete", isDelete.isDelete);
      const payload = [id, formData];

      mutatePost
        .mutateAsync(payload)
        .then((res) => {
          sweetAlert(1000, "success", "수정되었습니다!");
          navigate(`/post/${data.postId}/0`);
        })
        .catch((error) => sweetAlert(1000, "error", error.response.data.msg));
    }
  };

  if (isError) return <div>Error!!!!!!</div>;
  if (isLoading) return <div>Loading~~~</div>;

  return (
    <>
      <STHeader>
        <img
          src="/image/iconX.svg"
          alt="x"
          onClick={() => window.history.back()}
        />
        <div className="wrap">
          <div>게시글 수정</div>
        </div>
        <button onClick={submitHandler}>
          <div>등록</div>
        </button>
      </STHeader>

      <SContianer>
        <div style={{ position: "relative" }}>
          <Selector
            onClick={() => {
              setBoardModal(!boardModal);
            }}
          >
            {boardType}
            <img src="/image/iconCategory.svg" />
          </Selector>
          {boardModal ? (
            <List>
              <div
                onClick={(e) => {
                  setBoardType("자유 게시판");
                  setBoardModal(false);
                  setCategory({ category: "free" });
                }}
              >
                자유 게시판
              </div>
              <div
                onClick={(e) => {
                  setBoardType("알바 고민");
                  setBoardModal(false);
                  setCategory({ category: "partTime" });
                }}
              >
                알바 고민
              </div>
              <div
                onClick={(e) => {
                  setBoardType("대타 구해요");
                  setBoardModal(false);
                  setCategory({ category: "cover" });
                }}
              >
                대타 구해요
              </div>
            </List>
          ) : null}

          {/* <select
          value={category.category}
          onChange={(e) => {
            const { value } = e.target;
            setCategory({ category: value });
          }}
        >
          <option defaultValue="">카테고리</option>
          <option value="free">자유</option>
          <option value="partTime">알바고민</option>
          <option value="cover">대타</option>
        </select> */}
          <div className="titleForm">
            <input
              type="text"
              maxLength={50}
              value={title.title}
              placeholder="제목"
              onChange={(e) => {
                const { value } = e.target;
                setTitle({ title: value });
              }}
            />
          </div>
          <div className="content">
            <textarea
              maxLength={500}
              placeholder="내용을 작성해주세요 (500자 이내)"
              value={content.content}
              onChange={(e) => {
                const { value } = e.target;
                setContent({ content: value });
              }}
            />
          </div>
        </div>

        <STImageUpLoad>
          <div className="preview" id="previewer">
            {imgFile ? (
              <>
                <img
                  onClick={() => {
                    setIsDelete({ isDelete: "true" });
                    setFile(undefined);
                    setImgFile("");
                  }}
                  src="/image/iconPostX.svg"
                  alt=""
                />
                <img src={imgFile} />
              </>
            ) : null}
          </div>
          <div className="line" />
          <label className="signup-profileImg-label" htmlFor="profileImg">
            <img src="/image/iconCamera.svg" alt="카메라" />
          </label>
          <input
            className="signup-profileImg-input"
            type="file"
            accept=".gif, .jpg, .png, .jpeg, .svg"
            id="profileImg"
            onChange={getImage}
            multiple
          />
        </STImageUpLoad>
      </SContianer>
    </>
  );
}
const STHeader = styled.div`
  margin: 12px 0px 19.36px 0px;
  height: 35px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
  .wrap {
    // margin-left: 85px;
    font-size: 17px;
    font-weight: 500;
    div {
      height: 19px;
    }
  }
  button {
    font-weight: 400;
    font-size: 17px;
    line-height: 25px;
    border: none;
    background-color: transparent;
    color: #5fce80;
    // margin-left: 44px;
    div {
      font-size: 17px;
      height: 19px;
    }
  }
`;
const SContianer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  select {
    border: none;
    width: 83px;
    height: 25px;
    font-size: 17px;
    font-weight: 500;
  }
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
      font-family: "Noto Sans KR";
      outline: none;
    }
  }
  .content {
    textarea {
      font-family: "Noto Sans KR";
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
`;

const Selector = styled.div`
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 5px;

  img {
    width: 24px;
    height: 24px;
    margin: 2px 0px 0px 5px;
  }
`;

const List = styled.div`
  width: 90px;
  background-color: white;
  position: absolute;
  top: 35px;
  left: -3px;
  border-radius: 10px;
  animation: modal-bg-show 0.6s;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  div {
    font-size: 15px;
    font-weight: 400;
    padding: 6px 8px 6px 8px;
  }
`;

const STImageUpLoad = styled.div`
  position: absolute;
  bottom: 10px;
  width: 375px;

  @media screen and (max-height: 600px) {
    display: none;
  }

  .preview {
    position: absolute;
    bottom: 50px;
    // border: 1px solid black;
    width: 341px;
    height: 220px;

    img:first-child {
      // border: 1px solid black;
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: -7px;
      left: -7px;
    }
    img:last-child {
      width: 341px;
      height: 220px;
      object-fit: cover;
      border-radius: 10px;
    }
  }
  .line {
    width: 341px;
    height: 0px;
    border: 0.5px solid rgba(197, 197, 197, 0.7);
    margin-bottom: 10px;
    position: absolute;
    bottom: 30px;
  }
  input {
    display: none;
    .img {
      position: absolute;
      bottom: 5px;
      width: 24px;
      height: 24px;
    }
  }
`;

export default PostEditForm;
