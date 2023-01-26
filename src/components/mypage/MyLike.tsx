import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getMyLike } from "../../APIs/myPageApi";
import { IAllPosts } from "../../types/postType";
import PostCard from "../category/PostCard";

interface IMyLike {
  category: string;
  commentCount: number;
  content: string;
  createAt: string;
  imgUrl: string;
  likePost: boolean;
  modifiedAt: string;
  nickname: string;
  postId: number;
  postLikeNum: number;
  profileImage: string;
  title: string;
  userId: string;
}

const MyLike = () => {
  let pageParam = 1;
  const { isLoading, isError, data, refetch } = useQuery(["myLike"], () =>
    getMyLike(pageParam)
  );
  console.log(data);

  const numList = [];
  for (let i = 1; i <= data?.totalPages; i++) {
    numList.push(
      <div
        onClick={() => {
          pageParam = i;
          console.log(pageParam);
          refetch();
        }}
      >
        {i}
      </div>
    );
  }
  console.log(numList);

  return (
    <>
      <div>
        {data?.content.map((data: IAllPosts) => {
          return (
            <PostCard key={data.postId} post={data} padding="0 15px 0 15px" />
          );
        })}
      </div>
      {numList?.length === 1 ? null : <PageNum>{numList}</PageNum>}
    </>
  );
};

const PageNum = styled.div`
  display: flex;
  margin: 0 auto;
  margin-bottom: 20px;

  div {
    margin: 0px 10px 0px 10px;
  }
`;

export default MyLike;
