import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { DefaultEditor } from "react-simple-wysiwyg";

function CratePost() {

  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [content, setContent] = useState("")
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  function handlefileChange(e) {
    const file = e.target.files[0];
    setFile(file)
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({})

    try {

      const formData = new FormData()
      formData.append("title", title);
      formData.append("summary", summary);
      formData.append("content", content);
      if (file) formData.append('file', file)

      const response = await fetch('http://localhost:3000/post', {
        method: "POST",
        body: formData,
        credentials: "include"
      })

      const data = await response.json();

      if (!response.ok) {
        const formatedErrors = {};
        if (data.errors) {
          data.errors.forEach((err) => {
            formatedErrors[err.path] = err.msg;
          });
          console.log(formatedErrors)
          setErrors(formatedErrors)
        } else if (data.message) {
          alert(data.message)
        } else {
          alert("Server error please try again later!")
        }
        return;
      }
      alert("Post is created...")
      navigate('/')
    } catch (err) {
      alert("Server error please try again later!...")
    }

  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-gray-200 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          ✍️ Create New Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div >
            <label className="block text-gray-700 font-medium mb-2">Title</label>
            <input type="text"
              placeholder='Enter post title'
              name='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Summary</label>
            <textarea
              placeholder="Write a short summary..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows="3"
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            ></textarea>
             {errors.summary && (
              <p className="text-red-500 text-sm mt-1">{errors.summary}</p>
            )}
          </div>

          <div>

            <label className="block text-gray-700 font-medium mb-2">Cover Image</label>
            <input
              type="file"
              accept='image/*'
              onChange={handlefileChange}
              required
              className='border rounded flex justify-center items-center w-35 p-1' />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 min-w-100 max-h-80 object-cover rounded-2xl "
              />)}
              

          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Content</label>
            <div className="border border-gray-300 rounded-xl overflow-hidden">
              <DefaultEditor
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
               {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content}</p>
            )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow-md transition duration-300"
          >
            🚀 Publish Post
          </button>

        </form>

      </div>
    </div>
  )
}

export default CratePost