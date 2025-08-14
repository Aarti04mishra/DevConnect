// Fixed Post Card Component with proper layout
const PostCard = ({ post, onLike, onBookmark, onComment, onShare, getPostIcon, isTrending = false }) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post._id || post.id, commentText.trim());
      setCommentText('');
      setShowCommentInput(false);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <article className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-sm w-full">
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
            {getPostIcon(post.type)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {post.author?.fullname?.charAt(0) || post.author?.name?.charAt(0) || 'U'}
                </div>
                <span className="font-semibold text-gray-900 text-sm">
                  {post.author?.fullname || post.author?.name || 'Anonymous'}
                </span>
                {post.author?.verified && (
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                )}
                <span className="text-gray-500 text-sm">
                  {post.author?.skillLevel || 'Developer'}
                </span>
                {isTrending && (
                  <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
                    Trending
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {post.rating && (
                  <>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-700">{post.rating}</span>
                    </div>
                    <span>•</span>
                  </>
                )}
                <span>{formatDate(post.createdAt)}</span>
                <button 
                  onClick={() => onShare(post._id || post.id)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors ml-2"
                >
                  <Share2 className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
            {post.title || 'Untitled Project'}
          </h2>

          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            {post.description || 'No description available.'}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200 transition-colors cursor-pointer">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Project Links */}
          {(post.projectLink || post.liveDemo) && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {post.projectLink && (
                <a
                  href={post.projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  <Github className="w-4 h-4" />
                  View Code
                </a>
              )}
              {post.liveDemo && (
                <a
                  href={post.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              )}
            </div>
          )}
        </div>

        {/* Stats and Actions Section */}
        <div className="border-t border-gray-100 pt-4">
          {/* Stats Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.views || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{post.likes || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments || 0}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onLike(post._id || post.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  post.isLiked 
                    ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                <span>Like</span>
              </button>
              
              <button 
                onClick={() => setShowCommentInput(!showCommentInput)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors text-sm font-medium"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Comment</span>
              </button>
            </div>

            <button 
              onClick={() => onBookmark(post._id || post.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                post.isBookmarked 
                  ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
              <span>Save</span>
            </button>
          </div>

          {/* Comment Input */}
          {showCommentInput && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Post
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};