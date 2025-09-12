import React, { useState, useEffect } from "react";
import Post from "./Post";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/post")
      .then((response) => response.json())
      .then((data) => setPosts(data.posts))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-purple-70 p-6">
      {/* Header */}
      <h1
        className="text-3xl font-bold text-center text-transparent bg-clip-text 
                   bg-gradient-to-r from-indigo-500 to-purple-600 mb-10"
      >
        ✨ Latest Blog Posts ✨
      </h1>

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts yet!</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 cursor-pointer">
          {posts.map((post, index) => (
            <div
              key={post._id}
              className="opacity-0 animate-fadeInUp"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: "forwards",
              }}
            >
              <Post post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
