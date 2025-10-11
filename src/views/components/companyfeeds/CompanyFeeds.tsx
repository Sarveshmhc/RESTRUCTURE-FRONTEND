import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Search,
  Filter,
  RefreshCw,
  Clock,
} from "lucide-react";
import styles from "./companyfeeds.module.css";
// import { feedsAPI, Post } from "../../services/feedsApi";

/**
 * CompanyFeeds
 * - fetches company feeds via feedsAPI.getCompanyFeeds(filters)
 * - supports search, department/type filters, refresh and optimistic like/bookmark toggles
 * - accessible buttons, animated entries (framer-motion)
 *
 * Props:
 * - filters (optional): initial filters (department/type/search)
 * - pageSize (optional)
 * - className (optional)
 *
 * References:
 * - feedsAPI: [`feedsAPI`](c:\Users\sarxx\Downloads\front\src\services\feedsApi.ts)
 */
type Props = {
  initialFilters?: { department?: string; type?: string; search?: string };
  pageSize?: number;
  className?: string;
  onOpenPost?: (post: Post) => void;
};

const CompanyFeeds: React.FC<Props> = ({ initialFilters = {}, pageSize = 10, className = "", onOpenPost }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [departmentFilter, setDepartmentFilter] = useState(initialFilters.department ?? "");
  const [typeFilter, setTypeFilter] = useState(initialFilters.type ?? "");
  const [searchQuery, setSearchQuery] = useState(initialFilters.search ?? "");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetch = useCallback(
    async (reset = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const filters = {
          department: departmentFilter || undefined,
          type: typeFilter || undefined,
          search: searchQuery || undefined,
          page: page,
          page_size: pageSize,
        } as any;
        const res = await feedsAPI.getCompanyFeeds(filters);
        // feedsAPI returns { success, data: Post[] }
        if (res && res.data) {
          setPosts((prev) => (reset ? res.data : [...prev, ...res.data]));
          setHasMore(res.data.length === pageSize);
        } else {
          setError("Invalid response from server");
        }
      } catch (err: any) {
        console.error("Error fetching feeds:", err);
        setError(err?.message ?? "Unable to load feeds");
      } finally {
        setIsLoading(false);
      }
    },
    [departmentFilter, typeFilter, searchQuery, page, pageSize]
  );

  useEffect(() => {
    // initial load / reset when filters change
    setPage(1);
    fetch(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentFilter, typeFilter, searchQuery]);

  useEffect(() => {
    if (page === 1) return;
    fetch(false);
  }, [page, fetch]);

  const handleRefresh = () => {
    setPage(1);
    fetch(true);
  };

  const handleLoadMore = () => {
    if (isLoading || !hasMore) return;
    setPage((p) => p + 1);
  };

  const handleLike = async (postId: string) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p)));
    try {
      await feedsAPI.likePost(postId);
    } catch {
      // revert optimistic update on error
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p)));
    }
  };

  const handleBookmark = async (postId: string) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p)));
    try {
      await feedsAPI.bookmarkPost?.(postId);
    } catch {
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p)));
    }
  };

  const clearFilters = () => {
    setDepartmentFilter("");
    setTypeFilter("");
    setSearchQuery("");
  };

  const departments = useMemo(() => ["Engineering", "Marketing", "Finance", "HR"], []);
  const postTypes = useMemo(() => ["Announcement", "Reminder", "Update", "Event"], []);

  return (
    <motion.div
      className={`${styles.card} ${className}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      role="region"
      aria-label="Company feeds"
    >
      <div className={styles.header}>
        <h3 className={styles.title}>Company Feeds</h3>

        <div className={styles.controls}>
          <div className={styles.filterGroup}>
            <label className={styles.hiddenLabel} htmlFor="search">Search feeds</label>
            <div className={styles.search}>
              <Search className={styles.icon} />
              <input
                id="search"
                type="text"
                placeholder="Search company feeds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className={styles.select}>
              <option value="">All departments</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>

            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={styles.select}>
              <option value="">All types</option>
              {postTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>

            {(departmentFilter || typeFilter || searchQuery) && (
              <button className={styles.clearFilters} onClick={clearFilters} title="Clear filters">Clear</button>
            )}
          </div>

          <div className={styles.headerBtns}>
            <button onClick={() => { setPage(1); fetch(true); }} className={styles.iconBtn} title="Refresh feeds">
              <RefreshCw className={`${styles.iconSmall} ${isLoading ? styles.spin : ""}`} />
            </button>
            <button onClick={() => { /* open advanced filter UI if needed */ }} className={styles.iconBtn} title="Filter">
              <Filter className={styles.iconSmall} />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {error ? (
          <div className={styles.error}>
            <div className={styles.errorText}>{error}</div>
            <button className={styles.retryBtn} onClick={handleRefresh}>Try again</button>
          </div>
        ) : (
          <>
            <AnimatePresence>
              {posts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: i * 0.03 }}
                  className={styles.post}
                >
                  <div className={styles.postHeader}>
                    <div className={styles.author}>
                      <div className={styles.avatar}>{(post.author.name || "U").slice(0, 1)}</div>
                      <div>
                        <div className={styles.authorName}>{post.author.name}</div>
                        <div className={styles.meta}>{post.author.department} • {new Date(post.timestamp || post.created_at).toLocaleString()}</div>
                      </div>
                    </div>

                    <div className={styles.postActions}>
                      <button title="More options" className={styles.iconSmallBtn}><MoreHorizontal className={styles.iconSmall} /></button>
                    </div>
                  </div>

                  <div className={styles.postBody} onClick={() => onOpenPost?.(post)}>
                    <p className={styles.postText}>{post.content}</p>
                    {post.image && <img src={post.image} alt="" className={styles.postImage} />}
                    {post.type && <div className={styles.tag}>{post.type}</div>}
                  </div>

                  <div className={styles.postFooter}>
                    <div className={styles.actionRow}>
                      <button onClick={() => handleLike(post.id)} className={`${styles.actionBtn} ${post.isLiked ? styles.liked : ""}`} title="Like post">
                        <Heart className={styles.iconSmall} />
                        <span>{post.likes}</span>
                      </button>

                      <button className={styles.actionBtn} title="Comment">
                        <MessageCircle className={styles.iconSmall} />
                        <span>{post.comments ?? 0}</span>
                      </button>

                      <button className={styles.actionBtn} title="Share">
                        <Share2 className={styles.iconSmall} />
                      </button>
                    </div>

                    <div className={styles.rightRow}>
                      <button onClick={() => handleBookmark(post.id)} className={styles.iconSmallBtn} title="Bookmark">
                        <Bookmark className={`${styles.iconSmall} ${post.isBookmarked ? styles.bookmarked : ""}`} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>

            {posts.length === 0 && !isLoading && (
              <div className={styles.empty}>
                <Clock className={styles.emptyIcon} />
                <div>No posts found</div>
                <div className={styles.emptySub}>Be the first to post something here.</div>
              </div>
            )}

            {hasMore && (
              <div className={styles.loadMoreWrap}>
                <button onClick={handleLoadMore} disabled={isLoading} className={styles.loadMoreBtn}>
                  {isLoading ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default CompanyFeeds;