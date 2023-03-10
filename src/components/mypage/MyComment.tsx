import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { deleteMyComment, getMyComment, getMyPage } from "../../APIs/myPageApi";
import { allMyCommentAtom, myCommentDeleteAtom } from "../../atoms";
import { IMyPage } from "../../types/myPageType";
import { CommentType } from "../../types/postType";
import PostCard from "../category/PostCard";
import LayOut from "../layout/LayOut";
import CommentCard from "./CommentCard";

const MyComment = () => {
  const queryClient = useQueryClient();
  const [onClickAll, setOnClickAll] = useRecoilState(allMyCommentAtom);
  const [deleteList, setDeleteList] = useRecoilState(myCommentDeleteAtom);

  let pageParam = 1;
  const { isLoading, isError, data, refetch } = useQuery(["myComment"], () =>
    getMyComment(pageParam)
  );
  const { mutateAsync } = useMutation(deleteMyComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(["myComment"]);
    },
  });

  const allCommentList: number[] = [];

  useEffect(() => {
    if (!isLoading) {
      for (const comment of data?.content) {
        allCommentList.push(comment.commentId);
      }
    }
  }, [data, onClickAll]);

  useEffect(() => {}, [deleteList]);

  const numList = [];
  for (let i = 1; i <= data?.totalPages; i++) {
    numList.push(
      <div
        style={{ cursor: "pointer" }}
        onClick={() => {
          pageParam = i;
          refetch();
          let copy: number[] = [];
          setDeleteList(copy);
          setOnClickAll(false);
        }}
      >
        {i}
      </div>
    );
  }

  return (
    <>
      <CommentDelete>
        <div>
          {onClickAll ? (
            <img
              src="/image/iconFullCheck.svg"
              alt=""
              onClick={() => {
                let copy: number[] = [];
                setDeleteList(copy);
                setOnClickAll(false);
              }}
            />
          ) : (
            <img
              src="/image/iconEmptyCheck.svg"
              alt=""
              onClick={() => {
                console.log("?????? ??? ????????? ?????? ?????? ?????????", allCommentList);
                let copy = [...allCommentList];
                console.log(copy);
                setDeleteList(copy);

                setOnClickAll(true);
              }}
            />
          )}
          <div>?????? ??????</div>
        </div>
        <button
          onClick={() => {
            mutateAsync(deleteList).then((res) => refetch());
            let copy: number[] = [];
            setDeleteList(copy);
            setOnClickAll(false);
          }}
        >
          <span>??????</span>
          <img src="/image/iconCommentBin.svg" alt="" />
        </button>
      </CommentDelete>

      <Container margin={numList?.length === 1}>
        {data?.content.map((comment: CommentType) => {
          return <CommentCard key={comment.commentId} comment={comment} />;
        })}
      </Container>

      {numList?.length === 1 ? null : <PageNum>{numList}</PageNum>}
    </>
  );
};

const CommentDelete = styled.div`
  width: 375px;
  min-height: 50px;
  //box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
  background-color: rgba(0, 0, 0, 0.03);
  padding: 0px 15px 0px 15px;

  font-size: 13px;
  font-weight: 400;
  margin-top: -15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #d9d9d9;
  /* position: fixed;
  bottom: 0px; */
  display: flex;
  justify-content: space-between;
  align-items: center;

  div {
    display: flex;
    align-items: center;
    font-family: "Noto Sans KR";
    font-weight: 500;
  }
  img {
    width: 15px;
    height: 15px;
    margin-right: 10px;
  }
  button {
    width: 60px;
    height: 28px;
    border: none;
    font-size: 12px;
    border-radius: 5px;
    background-color: #d9d9d9c0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "Noto Sans KR";
    font-weight: 500;

    img {
      width: 13px;
      height: 13px;
      margin: 3px 0 3px 3px;
    }
  }
`;

const Container = styled.div<{ margin: boolean }>`
  margin-bottom: ${(props) => (props.margin ? "40px" : "0px")};
`;

const PageNum = styled.div`
  display: flex;
  margin: 0 auto;
  margin-bottom: 70px;

  div {
    margin: 0px 10px 0px 10px;
  }
`;

export default MyComment;
