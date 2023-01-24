import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import styled from "styled-components";
import { getInfinitePostByCategory } from "../../APIs/communityBoardApi";
import { dataType } from "../../pages/Board";
import { IAllPosts } from "../../types/postType";
import Loading from "../Loading/Loading";
import PostCard from "./PostCard";

const Cover = () => {
  const { ref, inView } = useInView();
  const { data, status, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery(
      ["posts"],
      ({ pageParam = 1 }, category = "cover") =>
        getInfinitePostByCategory(pageParam, category),
      {
        getNextPageParam: (lastPage) =>
          !lastPage.last ? lastPage.nextPage : undefined,
      }
    );
  console.log(data);
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);
  //if (status === "loading") return <Loading />;
  if (status === "error") return <div>에러다 </div>;
  return (
    <>
      {status === "loading" ? (
        <Loading />
      ) : (
        <div>
          {data?.pages.map((page) => {
            return page.content.map((p: dataType) => {
              return <PostCard key={p.postId} post={p} />;
            });
          })}
        </div>
      )}
      {isFetchingNextPage ? <Loading /> : <div ref={ref}>여기 </div>}
    </>
  );
};

export default Cover;
