import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { updateProfile } from "../features/auth/authSlice";
import { fetchPosts } from "../features/posts/postSlice";
import { ArrowLeft, User as UserIcon, Camera, Clock } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, loading, error } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.posts);
  
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (user) {
      setFormData({ name: user.name || "", email: user.email || "", password: "" });
      if (user.avatar) {
        setPreview(`http://localhost:5000${user.avatar}`);
      }
    }
    dispatch(fetchPosts());
  }, [user, token, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (formData.name) data.append("name", formData.name);
    if (formData.email) data.append("email", formData.email);
    if (formData.password) data.append("password", formData.password);
    if (avatar) data.append("avatar", avatar);

    const resultAction = await dispatch(updateProfile(data));
    if (updateProfile.fulfilled.match(resultAction)) {
      alert("Profile updated successfully!");
      setFormData((prev) => ({ ...prev, password: "" }));
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-300 flex flex-col font-sans transition-colors duration-300">
      <header className="border-b border-zinc-200 dark:border-zinc-800 p-8 flex justify-between items-center bg-zinc-50 dark:bg-[#09090b] sticky top-0 z-20 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Edit Profile
          </h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 p-8 md:p-16 flex justify-center">
        <div className="w-full max-w-md">
          {error && <p className="text-red-500 mb-6">{error.message || "Failed to update profile"}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                <div className="w-24 h-24 rounded-full border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 overflow-hidden flex items-center justify-center">
                  {preview ? (
                    <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-10 h-10 text-zinc-400 dark:text-zinc-600" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} ref={fileInputRef} />
              <p className="text-xs text-zinc-500 mt-2">Click to change avatar</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-4 bg-transparent border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-500 dark:focus:border-zinc-400 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 bg-transparent border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-500 dark:focus:border-zinc-400 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">New Password <span className="lowercase text-zinc-400">(leave blank to keep current)</span></label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-4 bg-transparent border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-500 dark:focus:border-zinc-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-bold text-sm hover:bg-zinc-800 dark:hover:bg-white transition-colors"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </main>

      {/* User's Posts Section */}
      <section className="p-8 md:p-16 border-t border-zinc-200 dark:border-zinc-800 max-w-4xl mx-auto w-full">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">Your Publications</h2>
        
        <div className="space-y-8">
          {posts.filter(p => p.user?._id === user._id).length === 0 ? (
            <p className="text-zinc-500 dark:text-zinc-400 italic">You haven't posted anything yet.</p>
          ) : (
            posts
              .filter(p => p.user?._id === user._id)
              .map((post) => (
                <article key={post._id} className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-transparent">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">{post.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
                    <Clock className="w-3 h-3" />
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(post.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-4">{post.content}</p>
                  
                  {post.image && (
                    <img src={`http://localhost:5000${post.image}`} alt="Post" className="w-full h-32 object-cover rounded mb-4 border border-zinc-200 dark:border-zinc-800" />
                  )}
                </article>
              ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;
