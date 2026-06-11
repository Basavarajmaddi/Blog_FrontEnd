import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown, LogOut, PenLine, ArrowRight, Trash2, Image as ImageIcon, MessageSquare, User as UserIcon } from "lucide-react";
import { fetchPosts, createPost, deletePost, likePost, dislikePost } from "../features/posts/postSlice";
import { logout } from "../features/auth/authSlice";
import ThemeToggle from "../components/ThemeToggle";
import CommentSection from "../components/CommentSection";

const Home = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);
  const { user, token } = useSelector((state) => state.auth);

  const [postData, setPostData] = useState({ title: "", content: "" });
  const [image, setImage] = useState(null);
  const [activeComments, setActiveComments] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please Login First");
      return;
    }
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("content", postData.content);
    if (image) {
      formData.append("image", image);
    }
    dispatch(createPost(formData));
    setPostData({ title: "", content: "" });
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLike = (id) => {
    if (!token) return alert("Please Login First");
    dispatch(likePost(id));
  };

  const handleDislike = (id) => {
    if (!token) return alert("Please Login First");
    dispatch(dislikePost(id));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost(id));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-300 flex flex-col md:flex-row font-sans selection:bg-zinc-900 selection:text-zinc-100 dark:selection:bg-zinc-100 dark:selection:text-zinc-900 transition-colors duration-300">
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 p-8 flex flex-col justify-between md:sticky md:top-0 md:h-screen bg-zinc-50 dark:bg-[#09090b] z-20 transition-colors duration-300">
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tighter">
              FocusForge
            </h1>
            <ThemeToggle />
          </div>
          <p className="text-sm text-zinc-500 mb-12">Block distractions. Protect your time. Be present<br/>“Small wins every day add up.”</p>

          <div className="space-y-6">
            <h2 className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-600 font-semibold">
              Menu
            </h2>
            <div className="flex flex-col gap-4">
              {token ? (
                <>
                  <div className="p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm">
                    Logged in as <span className="text-zinc-900 dark:text-zinc-100 font-medium">{user?.name}</span>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center justify-between px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {user?.avatar ? (
                        <img src={`https://focusforge-v9x1.onrender.com${user.avatar}`} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />
                      ) : (
                        <UserIcon className="w-5 h-5" />
                      )}
                      Profile
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-between px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-900 border border-transparent hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors"
                  >
                    Sign Out <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex justify-between items-center px-4 py-3 text-sm font-medium border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-900 transition-colors"
                  >
                    Sign In <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/register"
                    className="flex justify-between items-center px-4 py-3 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white transition-colors"
                  >
                    Create Account <PenLine className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-16 lg:px-24 max-w-4xl relative">
        <section className="mb-20">
          <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-6">
            New post
            
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-0 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-transparent">
            <input
              type="text"
              name="title"
              placeholder="Title..."
              value={postData.title}
              onChange={handleChange}
              className="w-full p-4 bg-transparent border-b border-zinc-200 dark:border-zinc-800 text-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 outline-none focus:bg-zinc-50 dark:focus:bg-zinc-900/50 transition-colors"
            />
            <textarea
              name="content"
              placeholder="What are your thoughts...?"
              value={postData.content}
              onChange={handleChange}
              className="w-full h-40 p-4 bg-transparent border-b border-zinc-200 dark:border-zinc-800 text-base text-zinc-700 dark:text-zinc-300 placeholder-zinc-400 dark:placeholder-zinc-600 outline-none resize-none focus:bg-zinc-50 dark:focus:bg-zinc-900/50 transition-colors"
            />
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-zinc-50 dark:bg-transparent">
              <label className="flex items-center gap-2 cursor-pointer text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-4 sm:mb-0">
                <ImageIcon className="w-5 h-5" />
                <span className="text-sm">Upload Image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} ref={fileInputRef} />
              </label>
              {image && <span className="text-xs text-zinc-500 mx-4 truncate max-w-[200px]">{image.name}</span>}
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-medium text-sm hover:bg-zinc-800 dark:hover:bg-white transition-colors"
              >
                Publish Post
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-12">
          <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100 mb-8 pb-4 border-b border-zinc-200 dark:border-zinc-800">
            Recent Publications
          </h2>

          {posts.length === 0 ? (
            <p className="text-zinc-500 dark:text-zinc-600 font-serif italic text-lg">
              No entries found. Be the first to write.
            </p>
          ) : (
            posts.map((post) => {
              const isLiked = user && post.likes?.some((id) => id.toString() === user._id);
              return (
                <article key={post._id} className="group">
                  <header className="mb-4 flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-sm text-zinc-500 mt-1">
                        Written by <span className="text-zinc-700 dark:text-zinc-300">{post.user?.name || "Unknown"}</span>
                        <span className="mx-2">•</span>
                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(post.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                    {user && post.user?._id === user._id && (
                      <button onClick={() => handleDelete(post._id)} className="text-red-500 hover:text-red-600 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </header>

                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap mb-6">
                    {post.content}
                  </p>
                  
                  {post.image && (
                    <img src={`https://focusforge-v9x1.onrender.com${post.image}`} alt="Post content" className="w-full max-h-[500px] object-cover border border-zinc-200 dark:border-zinc-800 mb-6" />
                  )}

                  <footer className="flex items-center gap-6">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                        isLiked ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                      {post.likes?.length || 0}
                    </button>
                    <button
                      onClick={() => handleDislike(post._id)}
                      className="flex items-center gap-2 text-sm font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveComments(activeComments === post._id ? null : post._id)}
                      className="flex items-center gap-2 text-sm font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" /> Comments
                    </button>
                  </footer>
                  
                  {activeComments === post._id && (
                    <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                      <CommentSection postId={post._id} />
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
