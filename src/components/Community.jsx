import React, { useEffect, useState } from "react";

export default function Community() {
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================================
  // LOAD POSTS FROM MONGODB
  // ================================
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/community/posts"
        );

        const data = await response.json();

        if (response.ok) {
          setPosts(data);
        }
      } catch (error) {
        console.error("Load posts error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // ================================
  // CREATE POST
  // ================================
  const handlePost = async () => {
    const savedUser = localStorage.getItem("campusUser");

    if (!savedUser) {
      alert("Please Login or Sign Up first.");
      return;
    }

    if (!postText.trim()) {
      alert("Please write something first.");
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      const response = await fetch(
        "http://localhost:5000/api/community/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            text: postText.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Could not create post.");
        return;
      }

      setPosts([data.post, ...posts]);
      setPostText("");

      alert("Post created successfully 🎉");
    } catch (error) {
      console.error("Create post error:", error);
      alert("Backend server se connection nahi ho raha.");
    }
  };

  // ================================
  // LIKE
  // ================================
  const handleLike = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/community/posts/${id}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Could not like post.");
        return;
      }

      setPosts(
        posts.map((post) =>
          post._id === id || post.id === id
            ? { ...post, likes: data.likes }
            : post
        )
      );
    } catch (error) {
      console.error("Like error:", error);
      alert("Backend server se connection nahi ho raha.");
    }
  };
  // ================================
  // COMMENT
  // ================================
  const handleComment = async (postId) => {
    const savedUser = localStorage.getItem("campusUser");

    if (!savedUser) {
      alert("Please Login or Sign Up first.");
      return;
    }

    const text = prompt("Write your comment:");

    if (!text || !text.trim()) {
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      const response = await fetch(
        `http://localhost:5000/api/community/posts/${postId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            text: text.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Could not add comment.");
        return;
      }

      setPosts(
        posts.map((post) =>
          post._id === postId || post.id === postId
            ? {
                ...post,
                comments: [...(post.comments || []), data.comment],
              }
            : post
        )
      );
    } catch (error) {
      console.error("Comment error:", error);
      alert("Backend server se connection nahi ho raha.");
    }
   };

  // ================================
  // DELETE POST
  // ================================
  const handleDelete = async (postId) => {
    const savedUser = localStorage.getItem("campusUser");

    if (!savedUser) {
      alert("Please Login first.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      const response = await fetch(
        `http://localhost:5000/api/community/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Could not delete post.");
        return;
      }

      setPosts(
        posts.filter(
          (post) => (post._id || post.id) !== postId
        )
      );

      alert("Post deleted successfully 🗑️");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Backend server se connection nahi ho raha.");
    }
  };
  // ================================
  // EDIT POST
  // ================================
  const handleEdit = async (postId, oldText) => {
    const savedUser = localStorage.getItem("campusUser");

    if (!savedUser) {
      alert("Please Login first.");
      return;
    }

    const newText = prompt("Edit your post:", oldText);

    if (!newText || !newText.trim()) {
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      const response = await fetch(
        `http://localhost:5000/api/community/posts/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            text: newText.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Could not edit post.");
        return;
      }

      setPosts(
        posts.map((post) =>
          (post._id || post.id) === postId
            ? { ...post, text: data.post.text }
            : post
        )
      );

      alert("Post updated successfully ✏️");
    } catch (error) {
      console.error("Edit error:", error);
      alert("Backend server se connection nahi ho raha.");
    }
  };

  return (
    <section id="community-feed" className="section">
      <div className="container">
        <div className="section-heading center">
          <span className="eyebrow">CAMPUS COMMUNITY</span>

          <h2>
            Connect with your <span>campus community.</span>
          </h2>

          <p>
            Share ideas, ask questions and connect with fellow students.
          </p>
        </div>

        {/* CREATE POST */}
        <div className="community-post-box">
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What's happening on campus?"
            rows="4"
          />

          <button
            type="button"
            className="primary-btn"
            onClick={handlePost}
          >
            Post
          </button>
        </div>

        {/* POSTS */}
        <div className="community-posts">
          {loading ? (
            <p className="community-empty">
              Loading community posts...
            </p>
          ) : posts.length === 0 ? (
            <p className="community-empty">
              No posts yet. Be the first to post! 🎓
            </p>
          ) : (
            posts.map((post) => (
              <div
                className="community-post"
                key={post._id || post.id}
              >
                <h3>{post.name}</h3>

                <p>{post.text}</p>

                <button
                  type="button"
                  onClick={() =>
                    handleLike(post._id || post.id)
                  }
                >
                  ❤️ {post.likes || 0}
                </button>
                <button
  type="button"
  onClick={() =>
    handleComment(post._id || post.id)
  }
>
  💬 Comment
  </button>
<button
  type="button"
  onClick={() =>
    handleEdit(post._id || post.id, post.text)
  }
>
  ✏️ Edit
</button>

<button
  type="button"
  onClick={() =>
    handleDelete(post._id || post.id)
  }
>
  🗑️ Delete
</button>
{post.comments && post.comments.length > 0 && (
  <div className="community-comments">
    {post.comments.map((comment) => (
      <div className="community-comment" key={comment.id}>
        <strong>{comment.name}</strong>
        <p>{comment.text}</p>
      </div>
    ))}
  </div>
)}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}