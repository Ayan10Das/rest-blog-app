import React from "react";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  // console.log(post)
  return (
    <div
      className="max-w-sm bg-white rounded-2xl shadow-lg 
                 hover:shadow-2xl hover:scale-[1.03] 
                 transition-transform duration-300 ease-in-out"
    >
      <Link to={`/single-post/${post._id}`}>
        {/* Image */}
        <div className="h-70 overflow-hidden rounded-t-2xl">
          <img
            src={`http://localhost:3000${post.coverImage}`}
            alt={post.title}
            className="w-full h-full object-cover 
          transition-transform duration-500 
          hover:scale-110"
          />
        </div>

        {/* Text */}
        <div className="p-4">
          <h2
            className="text-lg font-semibold text-gray-800 mb-1 
          transition-colors duration-300 
          hover:text-indigo-600"
          >
            {post.title}
          </h2>
          <p className="text-gray-600 text-sm line-clamp-2">{post.summary}</p>
          <p className="text-xs text-gray-400 mt-3">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default Post;

