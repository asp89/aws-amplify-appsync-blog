import { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { listPosts } from "./../src/graphql/queries";

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

    return posts.map((post, index) => <p key={index}>{post.title}</p>);
  };

  return (
    <div>
      <h1 className="text-sky-400 text-6xl font-bold underline">My Posts</h1>
      {renderPosts()}
    </div>
  );
};

export default home;
