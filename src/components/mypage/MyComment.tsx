import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { getMyComment, getMyPage } from "../../APIs/myPageApi";
import { allMyCommentAtom } from "../../atoms";
import { IMyPage } from "../../types/myPageType";
import { CommentType } from "../../types/postType";
import PostCard from "../category/PostCard";
import CommentCard from "./CommentCard";

const MyComment = () => {
  const [onClickAll, setOnClickAll] = useRecoilState(allMyCommentAtom);

  let pageParam = 1;
  const { isLoading, isError, data, refetch } = useQuery(["myComment"], () =>
    getMyComment(pageParam)
  );

  console.log(data);
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({ ...data }), []);

  const numList = [];
  for (let i = 1; i <= data?.totalPages; i++) {
    numList.push(
      <div
        onClick={() => {
          pageParam = i;
          console.log(pageParam);
          refetch();
          forceUpdate();
        }}
      >
        {i}
      </div>
    );
  }
  // console.log(numList);

  return (
    <>
      {data?.content.map((comment: CommentType) => {
        return <CommentCard key={comment.commentId} comment={comment} />;
      })}
      {/* <CommentCard commentList={data?.content} /> */}
      {/* <CommentCard>
        {onClick || onClickAll ? (
          <img
            src="/image/iconFullCheck.png"
            onClick={() => {
              setOnClick(false);
            }}
          />
        ) : (
          <img
            src="/image/iconEmptyCheck.png"
            onClick={() => {
              setOnClick(true);
            }}
          />
        )}

        <CommentText>
          <div className="first">
            제 일도 아닌데 너무 억울하네요.제 일도 아닌데 너무 억울하네요.제
            일도 아닌데 너무 억울하네요.
          </div>

          <CommentInfo>
            <div>01-20 16:43</div>
            <img src="/image/iconRedHeart.png" />
            <div>1</div>
          </CommentInfo>

          <div>다들 그래...?</div>
        </CommentText>
      </CommentCard> */}
      {numList?.length === 1 ? null : <PageNum>{numList}</PageNum>}
      <CommentDelete>
        <div>
          {onClickAll ? (
            <img
              src="/image/iconFullCheck.png"
              onClick={() => {
                setOnClickAll(false);
              }}
            />
          ) : (
            <img
              src="/image/iconEmptyCheck.png"
              onClick={() => {
                setOnClickAll(true);
              }}
            />
          )}
          <div>전체 선택</div>
        </div>
        <button>
          <span>삭제</span>
          <img src="/image/iconDelete.png" />
        </button>
      </CommentDelete>
    </>
  );
};

// const CommentCard = styled.div`
//   width: 100%;
//   height: 94px;
//   border-bottom: 1px solid #d9d9d9;
//   display: flex;
//   padding: 0px 15px 15px 15px;
//   margin-bottom: 15px;

//   img {
//     width: 15px;
//     height: 15px;
//     margin-right: 15px;
//   }
// `;

const CommentText = styled.div`
  width: 315px;
  font-size: 13px;
  font-weight: 400px;

  .first {
    height: 39px;
    line-height: 150%;
    margin-top: -3px;
  }
  div:nth-child(2) {
    margin: 5px 0px 5px 0px;
  }
  div:last-child {
    color: #aeaeae;
  }
`;

const CommentInfo = styled.div`
  display: flex;
  align-items: center;
  color: #aeaeae;

  div {
    margin-right: 10px;
  }
  img {
    width: 13px;
    height: 13px;
    margin-right: 3px;
  }
`;

const CommentDelete = styled.div`
  width: 100%;
  height: 76px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
  background-color: white;
  padding: 20px;
  font-size: 13px;
  position: fixed;
  left: 0px;
  bottom: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  div {
    display: flex;
    align-items: center;
  }
  img {
    width: 15px;
    height: 15px;
    margin-right: 10px;
  }
  button {
    width: 70px;
    height: 36px;
    border: none;
    font-size: 13px;
    border-radius: 5px;
    background-color: #d9d9d9;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 13px;
      height: 13px;
      margin: 0 0 3px 3px;
    }
  }
`;

const PageNum = styled.div`
  display: flex;
  margin-bottom: 100px;

  div {
    margin: 0px 10px 0px 10px;
  }
`;

export default MyComment;