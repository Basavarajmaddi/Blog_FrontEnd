import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments, addComment, deleteComment, addReply, deleteReply } from "../features/comment/commentSlice";
import { Trash2, Reply } from "lucide-react";

const CommentSection = ({ postId }) => {
  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.comments);
  const { user, token } = useSelector((state) => state.auth);
  
  const [text, setText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    dispatch(fetchComments(postId));
  }, [dispatch, postId]);

  const postComments = comments.filter((c) => c.postId === postId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token) return alert("Please Login First");
    if (!text.trim()) return;
    dispatch(addComment({ postId, text }));
    setText("");
  };

  const handleReplySubmit = (e, commentId) => {
    e.preventDefault();
    if (!token) return alert("Please Login First");
    if (!replyText.trim()) return;
    dispatch(addReply({ commentId, text: replyText }));
    setReplyText("");
    setReplyingTo(null);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Comments</h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 p-3 bg-transparent border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-500 dark:focus:border-zinc-600 transition-colors"
        />
        <button type="submit" className="px-6 py-3 font-medium bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white transition-colors">
          Post
        </button>
      </form>

      <div className="space-y-4">
        {postComments.map((comment) => (
          <div key={comment._id} className="p-4 border border-zinc-200 dark:border-zinc-800">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{comment.user?.name}</span>
              {user && comment.user?._id === user._id && (
                <button onClick={() => dispatch(deleteComment(comment._id))} className="text-red-500 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-zinc-700 dark:text-zinc-300 text-sm mb-3 whitespace-pre-wrap">{comment.text}</p>
            
            <button onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)} className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              <Reply className="w-3 h-3" /> Reply
            </button>

            {replyingTo === comment._id && (
              <form onSubmit={(e) => handleReplySubmit(e, comment._id)} className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 p-2 text-sm bg-transparent border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-500 dark:focus:border-zinc-600 transition-colors"
                />
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white transition-colors">
                  Reply
                </button>
              </form>
            )}

            {comment.replies?.length > 0 && (
              <div className="mt-6 pl-4 border-l border-zinc-300 dark:border-zinc-800 space-y-4">
                {comment.replies.map((reply) => (
                  <div key={reply._id} className="text-sm">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">{reply.user?.name}</span>
                      {user && reply.user?._id === user._id && (
                        <button onClick={() => dispatch(deleteReply({ commentId: comment._id, replyId: reply._id }))} className="text-red-500 hover:text-red-600 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-1 whitespace-pre-wrap">{reply.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;