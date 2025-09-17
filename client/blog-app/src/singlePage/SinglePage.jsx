import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from "../context/AuthContext"

function singlePage() {
  const { user } = useContext(AuthContext)
  const { postId } = useParams()
  const [post, setPost] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthor, setIsAuthor] = useState(false)
  const navigate=useNavigate()



  useEffect(() => {
    async function fetchPost() {
      setError(null)
      try {
        const response = await fetch(`http://localhost:3000/single-post/${postId}`, {
          method: "GET"
        })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch post");
        }

        setPost(data)
        // console.log(post)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()

  }, [postId])

  useEffect(() => {
    if (post) {
      const isAuthorCheck = user && user._id === post.author?._id
      setIsAuthor(isAuthorCheck)
      console.log("Updated post:", post);
    }
  }, [post]);

  function handleEdit() {

  }

  async function handleDelete() {
    try {
      const response = await fetch(`http://localhost:3000/single-post/${postId}`, {
        method: "DELETE",
        credentials: "include"
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert(data.message)
      navigate('/')
    }catch(err){
      alert("Server error please try again later!")
      console.error(err)
    }  
  }



  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-6 mb-5 max-h-screen">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div>

          <span className="mr-3 text-xl">✍️ Author:-  {post.author?.username}</span>
          <span className='text-lg'>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        {/* Edit and Delete option */}
        {isAuthor && (
          <div className="flex gap-4 mb-6 justify-end mt-0">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
      <p className="text-gray-600 mb-3 text-xl">About: {post.summary}</p>
      {post.coverImage && (
        <img
          src={`http://localhost:3000${post.coverImage}`}
          alt={post.title}
          className="w-full h-100 object-contain rounded-xl mb-6"
        />
      )}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>
    </div>
  );
}

export default singlePage