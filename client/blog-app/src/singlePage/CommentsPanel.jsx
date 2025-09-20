// CommentsPanel.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function CommentsPanel({ postId, user }) {
  const [comments, setComments] = useState([]);      // newest first
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [text, setText] = useState('');
  const panelRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // reset when postId changes
    setComments([]);
    setPage(1);
    fetchPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  async function fetchPage(p = page, reset = false) {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/single-post/${postId}/comments?page=${p}&limit=${limit}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load comments');
      // comments come newest first (desc). For UI we display newest at top.
      setComments(prev => reset ? data.comments : [...prev, ...data.comments]);
      setHasMore(data.hasMore);
      setPage(p);
    } catch (err) {
      console.error('Load comments error', err);
    } finally {
      setLoading(false);
    }
  }

  // post a comment
  async function handlePost(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`http://localhost:3000/single-post/${postId}/comments`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text.trim() })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) alert(data.errors[0].msg);
        else alert(data.message || 'Failed to post comment');
        setPosting(false);
        return;
      }
      // Prepend newly created comment (it's newest)
      setComments(prev => [data.comment, ...prev]);
      setText('');
      // optionally bump total/hasMore not required here
    } catch (err) {
      console.error(err);
      alert('Server error');
    } finally {
      setPosting(false);
    }
  }

  // infinite load: detect when user scrolls near bottom of comments container
  useEffect(() => {
    const container = panelRef.current;
    if (!container) return;
    function onScroll() {
      // load more when scrolled to 90% of scrollHeight
      const nearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 50;
      if (nearBottom && hasMore && !loading) {
        fetchPage(page + 1);
      }
    }
    container.addEventListener('scroll', onScroll);
    return () => container.removeEventListener('scroll', onScroll);
  }, [hasMore, loading, page]);

  return (
    <div className="w-full md:w-1/2 lg:w-1/2 p-4">
      <div className="bg-gray-100 rounded-xl shadow-xl p-4 h-[720px] flex flex-col"> 
        {/* fixed height, internal scroll area for comments */}
        <h3 className="text-lg font-semibold mb-3">Comments</h3>

        {user ? (
          <form onSubmit={handlePost} className="mb-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full border rounded px-3 py-2 mb-2"
              rows={2}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={posting}
                className="px-3 py-1 bg-indigo-500 text-white rounded disabled:opacity-50"
              >
                {posting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-gray-300 mb-3">Login to post a comment</p>
        )}

        <div
          ref={panelRef}
          className="overflow-y-auto"
          style={{ flex: 1 }} // allow this to grow and scroll
        >
          {comments.length === 0 && !loading && (
            <p className="text-sm text-gray-300">No comments yet. Be the first!</p>
          )}

          <ul className="space-y-3">
            {comments.map((c) => (
              <li key={c._id} className="p-3 bg-white rounded hover:scale-102 transition-all delay-75 duration-100 ease-out">
                <div className="flex justify-between items-start ">
                  <div>
                    <div className="font-semibold">{c.author?.username || 'User'}</div>
                    <div className="text-sm text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                <p className="mt-2 text-gray-800">{c.content}</p>
              </li>
            ))}
          </ul>

          <div className="flex justify-center mt-3">
            {loading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : hasMore ? (
              <button
                onClick={() => fetchPage(page + 1)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Load more
              </button>
            ) : (
              comments.length > 0 && <div className="text-sm text-gray-400">No more comments</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
