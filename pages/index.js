import { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { listPosts } from "./../src/graphql/queries";
import Link from "next/link";

const home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postData = await API.graphql({
        query: listPosts,
      });
      setPosts(postData.data.listPosts.items);
    };
    fetchPosts();
  }, []);

  const renderPosts = () => {
    if (posts.length === 0) return;

    return posts.map((post, index) => (
      <Link key={index} href={`/posts/${post.id}`}>
        <div className="cursor-pointer border-b  border-gray-300 mt-8 pb-4">
          <h2 className="text-xl font-semibold" key={index}>
            {post.title}
          </h2>
          <p className="text-gray-500 mt-2">Author: {post.username}</p>
        </div>
      </Link>
    ));
  };

  return (
    <div>
      <h1 className="text-sky-400 text-3xl font-bold tracking-wide mt-6 mt-2">
        My Posts
      </h1>
      {renderPosts()}
    </div>
  );
};

export default home;
