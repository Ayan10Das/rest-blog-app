import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function singlePage() {

  const { postId } = useParams()
  const [post, setPost] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    async function fetchPost() {
      setError(null)
      try {
        const response =await fetch(`http://localhost:3000/single-post/${postId}`, {
          method: "GET"
        })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch post");
        }

        setPost(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    console.log(post)
    fetchPost()

  }, [postId])

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-6 mb-5 max-h-screen">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

    <div className="flex items-center text-sm text-gray-500 mb-4">
        <span className="mr-3 text-lg">✍️ Author:-  {post.author?.username}</span>
        <span className='text-lg'>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      <p className="text-gray-600 mb-4">{post.summary}</p>
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