import { withAuthenticator } from "@aws-amplify/ui-react";
import { Auth, API, Storage } from "aws-amplify";
import { useState, React, useRef } from "react";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";
import { createPost } from "../src/graphql/mutations";
import dynamic from "next/dynamic";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});
import "easymde/dist/easymde.min.css";

const initialState = { title: "", content: "" };

const CreatePost = () => {
  const [post, setPost] = useState(initialState);
  const [image, setImage] = useState(null);
  const imageFileInput = useRef(null);

  const { title, content } = post;
  const router = new useRouter();

  const onChange = (e) => {
    setPost(() => ({
      ...post,
      [e.target.name]: e.target.value,
    }));
  };

  const savePost = async () => {
    if (!title || !content) return;
    const id = uuid();
    post.id = id;

    const { username } = await Auth.currentAuthenticatedUser();
    post.username = username;

    if (image) {
      // Split the file name and extension
      const splitImageFileName = image.name.split('.')

      // Generate the file name with UUID
      const filename = `${splitImageFileName[0]}_${uuid()}.${splitImageFileName[1]}`;
      post.coverImage = filename;
      await Storage.put(filename, image);
    }
    
    await API.graphql({
      query: createPost,
      variables: { input: post },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });
    router.push(`/posts/${id}`);
  };

  const uploadImage = async () => {
    imageFileInput.current.click();
  };

  const handleFileUploadChange = (e) => {
    const fileUploaded = e.target.files[0];

    if (!fileUploaded) return;

    setImage(fileUploaded);
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6">
        Create new Post
      </h1>
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={post.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      />
      {
        image && (
          <img 
            src={URL.createObjectURL(image)}
            className="my-4"
          />
        )
      }
      <SimpleMDE
        value={post.content}
        onChange={(value) => setPost({ ...post, content: value })}
      />
      <input
        type="file"
        ref={imageFileInput}
        className="absolute w-0 h-0"
        onChange={handleFileUploadChange}
        accept="image/png, image/jpeg"
      />
      <button
        type="button"
        className="mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg"
        onClick={uploadImage}
      >
        Upload Cover Image
      </button>{" "}
      <button
        type="button"
        className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
        onClick={savePost}
      >
        Create Post
      </button>
    </div>
  );
};

export default withAuthenticator(CreatePost);
