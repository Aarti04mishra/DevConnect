import React, { useState, useEffect, useCallback } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Database, 
  Bookmark, 
  Globe, 
  MoreHorizontal, 
  Star, 
  Clock, 
  Eye, 
  Users, 
  Code, 
  ExternalLink, 
  Github, 
  CheckCircle,
  RefreshCw,
  UserPlus,
  X
} from 'lucide-react';

// Import your API functions
import { 
  getFeedPosts, 
  getSuggestedUsers, 
  getTrendingProjects,
  likePost, 
  bookmarkPost, 
  addComment, 
  sharePost,
  followUser,
  unfollowUser 
} from '../Services/AuthServices';

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [trendingProjects, setTrendingProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');
  const [error, setError] = useState(null);

  // Fetch initial feed data
  const fetchFeedData = useCallback(async (pageNum = 1, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      setError(null);

      // Add detailed logging to understand the API response structure
      console.log('Fetching feed data for page:', pageNum);
      
      const [feedResponse, suggestionsResponse] = await Promise.all([
        getFeedPosts(pageNum, 10),
        pageNum === 1 ? getSuggestedUsers() : Promise.resolve({ data: { users: [] } })
      ]);

      // Detailed logging of the API responses
      console.log('Full feed response:', feedResponse);
      console.log('Full suggestions response:', suggestionsResponse);

      // More comprehensive data extraction with fallbacks
      let feedPosts = [];
      let feedPagination = {};
      
      // Try different possible response structures
      if (feedResponse) {
        feedPosts = feedResponse.data?.posts || 
                   feedResponse.posts || 
                   feedResponse.data || 
                   (Array.isArray(feedResponse) ? feedResponse : []);
        
        feedPagination = feedResponse.data?.pagination || 
                        feedResponse.pagination || 
                        { hasNextPage: false };
      }

      let suggestionUsers = [];
      if (suggestionsResponse && pageNum === 1) {
        suggestionUsers = suggestionsResponse.data?.users || 
                         suggestionsResponse.users || 
                         suggestionsResponse.data ||
                         (Array.isArray(suggestionsResponse) ? suggestionsResponse : []);
      }

      console.log('Extracted posts:', feedPosts);
      console.log('Extracted suggestions:', suggestionUsers);
      console.log('Pagination info:', feedPagination);

      // Ensure feedPosts is an array
      if (!Array.isArray(feedPosts)) {
        console.warn('Posts data is not an array:', feedPosts);
        feedPosts = [];
      }

      // Ensure suggestionUsers is an array
      if (!Array.isArray(suggestionUsers)) {
        console.warn('Suggestions data is not an array:', suggestionUsers);
        suggestionUsers = [];
      }

      if (pageNum === 1 || isRefresh) {
        setPosts(feedPosts);
        if (pageNum === 1) {
          setSuggestedUsers(suggestionUsers);
        }
      } else {
        setPosts(prev => [...prev, ...feedPosts]);
      }

      // Update hasMore based on API response
      setHasMore(feedPagination.hasNextPage || false);
      setPage(pageNum);

    } catch (error) {
      console.error('Error fetching feed:', error);
      console.error('Error details:', error.response?.data || error.message);
      setError(error.response?.data?.message || error.message || 'Failed to load feed');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  // Fetch trending projects
  const fetchTrendingProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching trending projects...');
      const response = await getTrendingProjects(10);
      console.log('Trending projects response:', response);
      
      // More comprehensive data extraction
      let trendingProjectsData = [];
      if (response) {
        trendingProjectsData = response.data?.projects || 
                              response.projects || 
                              response.data ||
                              (Array.isArray(response) ? response : []);
      }

      console.log('Extracted trending projects:', trendingProjectsData);

      // Ensure it's an array
      if (!Array.isArray(trendingProjectsData)) {
        console.warn('Trending projects data is not an array:', trendingProjectsData);
        trendingProjectsData = [];
      }

      setTrendingProjects(trendingProjectsData);
    } catch (error) {
      console.error('Error fetching trending projects:', error);
      console.error('Error details:', error.response?.data || error.message);
      setError(error.response?.data?.message || error.message || 'Failed to load trending projects');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    console.log('Active tab changed to:', activeTab);
    if (activeTab === 'feed') {
      fetchFeedData(1);
    } else {
      fetchTrendingProjects();
    }
  }, [activeTab, fetchFeedData, fetchTrendingProjects]);

  // Handle post interactions
  const handleLike = async (postId) => {
    try {
      const response = await likePost(postId);
      
      setPosts(posts.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              isLiked: response.isLiked || response.data?.isLiked,
              likes: response.likes || response.data?.likes || post.likes
            }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleBookmark = async (postId) => {
    try {
      const response = await bookmarkPost(postId);
      
      setPosts(posts.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              isBookmarked: response.isBookmarked || response.data?.isBookmarked,
              bookmarks: response.bookmarks || response.data?.bookmarks || post.bookmarks
            }
          : post
      ));
    } catch (error) {
      console.error('Error bookmarking post:', error);
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      const response = await addComment(postId, commentText);
      
      setPosts(posts.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              comments: response.comments || response.data?.comments || post.comments
            }
          : post
      ));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleShare = async (postId) => {
    try {
      await sharePost(postId);
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await followUser(userId);
      setSuggestedUsers(suggestedUsers.map(user => 
        user._id === userId 
          ? { ...user, isFollowing: true }
          : user
      ));
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await unfollowUser(userId);
      setSuggestedUsers(suggestedUsers.map(user => 
        user._id === userId 
          ? { ...user, isFollowing: false }
          : user
      ));
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const handleRefresh = () => {
    if (activeTab === 'feed') {
      fetchFeedData(1, true);
    } else {
      fetchTrendingProjects();
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && activeTab === 'feed') {
      fetchFeedData(page + 1);
    }
  };

  const getPostIcon = (type) => {
    switch (type) {
      case 'web': return <Globe className="h-8 w-8 text-blue-500" />;
      case 'mobile': return <Code className="h-8 w-8 text-green-500" />;
      case 'blockchain': return <Database className="h-8 w-8 text-purple-500" />;
      case 'project': return <Code className="h-8 w-8 text-indigo-500" />;
      default: return <Code className="h-8 w-8 text-gray-500" />;
    }
  };

  // Debug: Log current state
  console.log('Current component state:', {
    loading,
    posts: posts.length,
    trendingProjects: trendingProjects.length,
    activeTab,
    error
  });

  // Show loading only when actually loading and no data exists
  if (loading && ((activeTab === 'feed' && posts.length === 0) || (activeTab === 'trending' && trendingProjects.length === 0))) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-4 w-full">
              {[1, 2].map(i => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-16 h-4 bg-gray-200 rounded"></div>
                        <div className="w-12 h-3 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Header with tabs and refresh */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'feed' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              My Feed
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'trending' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Trending
            </button>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm">{error}</p>
            <button 
              onClick={handleRefresh}
              className="mt-2 text-red-700 underline text-sm hover:text-red-800"
            >
              Try again
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main feed - Taking 3 columns out of 4 */}
          <div className="flex-1 lg:w-[1200px] xl:w-[1200px]">
            <div className="space-y-6 w-full">
              {activeTab === 'feed' ? (
                <>
                  {posts.length === 0 && !loading ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No posts in your feed</h3>
                      <p className="text-gray-500 mb-4">Follow some developers to see their projects!</p>
                      <button 
                        onClick={() => setShowSuggestions(true)}
                        className="text-blue-600 font-medium hover:text-blue-700"
                      >
                        Find people to follow
                      </button>
                    </div>
                  ) : (
                    posts.map(post => (
                      <PostCard 
                        key={post._id || post.id} 
                        post={post} 
                        onLike={handleLike}
                        onBookmark={handleBookmark}
                        onComment={handleComment}
                        onShare={handleShare}
                        getPostIcon={getPostIcon}
                      />
                    ))
                  )}
                  
                  {hasMore && posts.length > 0 && (
                    <div className="text-center py-4">
                      <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loadingMore ? 'Loading...' : 'Load More'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {trendingProjects.length === 0 && !loading ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                      <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No trending projects</h3>
                      <p className="text-gray-500">Check back later for popular projects!</p>
                    </div>
                  ) : (
                    trendingProjects.map(project => (
                      <PostCard 
                        key={project._id || project.id} 
                        post={project} 
                        onLike={handleLike}
                        onBookmark={handleBookmark}
                        onComment={handleComment}
                        onShare={handleShare}
                        getPostIcon={getPostIcon}
                        isTrending={true}
                      />
                    ))
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sidebar - Taking 1 column out of 4 */}
          {/* <div className="space-y-6">
            {showSuggestions && suggestedUsers.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Suggested for you</h3>
                  <button
                    onClick={() => setShowSuggestions(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3 bg-red-700">
                  {suggestedUsers.slice(0, 5).map(user => (
                    <div key={user._id || user.id} className="flex items-center justify-between ">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {user.fullname?.charAt(0) || user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{user.fullname || user.name}</p>
                          <p className="text-gray-500 text-xs">{user.skillLevel || 'Developer'}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => user.isFollowing ? handleUnfollow(user._id || user.id) : handleFollow(user._id || user.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                          user.isFollowing
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {user.isFollowing ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

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

export default PostFeed;