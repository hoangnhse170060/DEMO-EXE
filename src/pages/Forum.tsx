import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Plus,
  Send,
  LogIn,
  ThumbsUp,
  Medal,
  Laugh,
  Heart,
  User,
  PenLine,
  Trash2,
  CornerDownRight,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getActiveUser, type AppUser } from '../lib/auth';

const POSTS_KEY = 'echoes_forum_posts_v1';
const COMMENTS_KEY = 'echoes_forum_comments_v1';
const REACTIONS_KEY = 'echoes_forum_reactions_v1';
const COMMENT_REACTIONS_KEY = 'echoes_forum_comment_reactions_v1';

const CATEGORIES = ['Lịch sử', 'Bài viết', 'Lịch sử'];

const EMOTION_KEYS = ['like', 'proud', 'haha', 'love'] as const;

type EmotionKey = (typeof EMOTION_KEYS)[number];

type ForumMedia = {
  id: string;
  kind: 'image' | 'video';
  url: string;
  caption?: string;
  credit?: string;
};

type ForumPost = {
  id: string;
  title: string;
  content: string;
  category: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  media: ForumMedia[];
};

type ForumComment = {
  id: string;
  postId: string;
  parentId: string | null;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type ForumReaction = {
  postId: string;
  userId: string;
  emotion: EmotionKey;
};

type ForumCommentReaction = {
  commentId: string;
  userId: string;
};

type ReactionSummary = Record<EmotionKey, number>;

const EMOTION_CONFIG: Record<EmotionKey, { label: string; icon: LucideIcon; accent: string }> = {
  like: { label: 'Like', icon: ThumbsUp, accent: 'text-sky-600' },
  proud: { label: 'Tự hào', icon: Medal, accent: 'text-amber-600' },
  haha: { label: 'Haha', icon: Laugh, accent: 'text-emerald-600' },
  love: { label: 'Tim', icon: Heart, accent: 'text-rose-600' },
};

const formatTimestamp = (iso: string) =>
  new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
};

const readStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn('Không thể đọc dữ liệu forum từ localStorage', error);
    return fallback;
  }
};

const writeStorage = <T,>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Không thể lưu dữ liệu forum vào localStorage', error);
  }
};

const createEmptySummary = (): ReactionSummary => ({ like: 0, proud: 0, haha: 0, love: 0 });

const seedTimestampBase = Date.now();
const hoursAgo = (hours: number) => new Date(seedTimestampBase - hours * 60 * 60 * 1000).toISOString();

const SAMPLE_POSTS: ForumPost[] = [
  {
    id: 'post-dien-bien-phu-nhung-chon-dau',
    title: 'A50: Giải phóng Sài Gòn - Thống nhất đất nước',
    content:
      'Tự hào quá mọi người ơi!!! ❤️',
    category: 'Lịch sử',
    authorId: 'user-historian',
    authorName: 'Khánh Vy',
    createdAt: hoursAgo(42),
    updatedAt: hoursAgo(42),
    media: [
      {
  id: 'media-dbp-a50a80-clip',
  kind: 'video',
  url: 'https://www.youtube.com/embed/ajEDPzS-BAg?list=RDajEDPzS-BAg',
  caption: 'Việt Nam Tôi ĐÓ ',
  credit: 'Nguồn: VTV',
},

     
    ],
  },
  {
    id: 'post-bo-suu-tap-ky-vat',
    title: 'A80 - Cách mạng Tháng Tám (19/8/1945) ',
    content:
      ' Quá xịn xò rồi A80!!! ',
    category: 'Bài viết',
    authorId: 'user-collector',
    authorName: 'Trung Tín',
    createdAt: hoursAgo(28),
    updatedAt: hoursAgo(24),
    media: [
      {
        id: 'media-keepsake-letters',
        kind: 'image',
        url: 'https://bcp.cdnchinhphu.vn/334894974524682240/2025/9/2/img0631-17567967413481704453104.jpg',
        caption: 'Diễu binh',
      },
      {
        id: 'media-keepsake-scarf',
        kind: 'image',
        url: 'https://cdn.tienphong.vn/images/c092ce5af9d371e458ba5bf3dfc67eb3fbc53e44f0f54428a747e916762628ceed8f94251c6e533326cfb526e6bda8a4/a80-1.jpg',
        caption: 'Diễn Binh',
      },
    ],
  },
  {
    id: 'post-tu-lieu-am-nhac',
    title: 'Chiến thắng Điện Biên Phủ ',
    content:
      'Em bé giỏi quá !!!  🎶',
    category: 'Bài nghiên cứu',
    authorId: 'user-researcher',
    authorName: 'Nhựt Nguyễn',
    createdAt: hoursAgo(16),
    updatedAt: hoursAgo(12),
    media: [
     {
  id: 'media-choir-video',
  kind: 'video',
  url: 'https://www.tiktok.com/embed/7366159358230564113',
  caption: 'Hậu trường buổi dàn dựng hợp xướng "Hò kéo pháo" 2024.',
  credit: 'Nguồn: TikTok @cliphotnews',
},

      {
        id: 'media-score',
        kind: 'image',
        url: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&w=1600',
        caption: 'Bản chép tay ca khúc được lưu tại Nhà văn hóa Điện Biên.',
      },
    ],
  },
];

const SAMPLE_COMMENTS: ForumComment[] = [
  {
    id: 'comment-dbp-1',
    postId: 'post-dien-bien-phu-nhung-chon-dau',
    parentId: null,
    authorId: 'user-strategist',
    authorName: 'Xuân Hồng',
    content:
      'Quá tự hào bác ơi !! Em phải đi đánh con xe ra ngoài đó lấy chỗ ngồi mới được!!! 🚗 💨',
    createdAt: hoursAgo(34),
    updatedAt: hoursAgo(34),
  },
  {
    id: 'comment-dbp-1-reply',
    postId: 'post-dien-bien-phu-nhung-chon-dau',
    parentId: 'comment-dbp-1',
    authorId: 'user-historian',
    authorName: 'Khánh Vy',
    content:
      'Đúng rồi bạn Hồng ơi! Kẹt xe 3 tiếng chưa thấy đường về nhà bác ơi! 😂',
    createdAt: hoursAgo(32),
    updatedAt: hoursAgo(32),
  },
  {
    id: 'comment-keepsake-1',
    postId: 'post-bo-suu-tap-ky-vat',
    parentId: null,
    authorId: 'user-researcher',
    authorName: 'Minh Đạt',
    content:
      'Cho mình xin ảnh nha bạn!!!',
    createdAt: hoursAgo(20),
    updatedAt: hoursAgo(20),
  },
  {
    id: 'comment-keepsake-1-reply',
    postId: 'post-bo-suu-tap-ky-vat',
    parentId: 'comment-keepsake-1',
    authorId: 'user-collector',
    authorName: 'Trung Tín',
    content:
      '500K! BẠN ƠI!!!',
    createdAt: hoursAgo(18),
    updatedAt: hoursAgo(18),
  },
  {
    id: 'comment-music-1',
    postId: 'post-tu-lieu-am-nhac',
    parentId: null,
    authorId: 'user-historian',
    authorName: 'Khánh Vy',
    content:
      'Bản phối 1975 nghe dàn bè dày và nhấn mạnh phần đồng rất hay. Bạn có file âm thanh lossless không?',
    createdAt: hoursAgo(10),
    updatedAt: hoursAgo(10),
  },
];

const SAMPLE_REACTIONS: ForumReaction[] = [
  { postId: 'post-dien-bien-phu-nhung-chon-dau', userId: 'user-collector', emotion: 'love' },
  { postId: 'post-dien-bien-phu-nhung-chon-dau', userId: 'user-strategist', emotion: 'like' },
  { postId: 'post-bo-suu-tap-ky-vat', userId: 'user-historian', emotion: 'proud' },
  { postId: 'post-tu-lieu-am-nhac', userId: 'user-collector', emotion: 'love' },
  { postId: 'post-tu-lieu-am-nhac', userId: 'user-strategist', emotion: 'haha' },
];

const SAMPLE_COMMENT_REACTIONS: ForumCommentReaction[] = [
  { commentId: 'comment-dbp-1', userId: 'user-collector' },
  { commentId: 'comment-keepsake-1', userId: 'user-historian' },
  { commentId: 'comment-music-1', userId: 'user-researcher' },
];

export default function Forum() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AppUser | null>(() => getActiveUser());
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [reactions, setReactions] = useState<ForumReaction[]>([]);
  const [commentReactions, setCommentReactions] = useState<ForumCommentReaction[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [composerData, setComposerData] = useState({
    title: '',
    content: '',
    category: CATEGORIES[0],
  });
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

  const closePost = () => {
    setSelectedPostId(null);
    setNewComment('');
    setReplyDrafts({});
    setEditingCommentId(null);
    setCommentDrafts({});
  };

  const openPost = (postId: string) => {
    setSelectedPostId(postId);
    setNewComment('');
    setReplyDrafts({});
    setEditingCommentId(null);
    setCommentDrafts({});
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const storedPosts = readStorage<ForumPost[]>(POSTS_KEY, []);
    if (storedPosts.length === 0) {
      setPosts(SAMPLE_POSTS);
      writeStorage(POSTS_KEY, SAMPLE_POSTS);
    } else {
      setPosts(
        storedPosts.map((post) => ({
          ...post,
          updatedAt: post.updatedAt ?? post.createdAt,
          media: post.media ?? [],
        }))
      );
    }

    const storedComments = readStorage<ForumComment[]>(COMMENTS_KEY, []);
    if (storedComments.length === 0 && storedPosts.length === 0) {
      setComments(SAMPLE_COMMENTS);
      writeStorage(COMMENTS_KEY, SAMPLE_COMMENTS);
    } else {
      setComments(
        storedComments.map((comment) => ({
          ...comment,
          parentId: comment.parentId ?? null,
          updatedAt: comment.updatedAt ?? comment.createdAt,
        }))
      );
    }

    const storedReactions = readStorage<ForumReaction[]>(REACTIONS_KEY, []);
    if (storedReactions.length === 0 && storedPosts.length === 0) {
      setReactions(SAMPLE_REACTIONS);
      writeStorage(REACTIONS_KEY, SAMPLE_REACTIONS);
    } else {
      setReactions(storedReactions);
    }

    const storedCommentReactions = readStorage<ForumCommentReaction[]>(COMMENT_REACTIONS_KEY, []);
    if (storedCommentReactions.length === 0 && storedComments.length === 0) {
      setCommentReactions(SAMPLE_COMMENT_REACTIONS);
      writeStorage(COMMENT_REACTIONS_KEY, SAMPLE_COMMENT_REACTIONS);
    } else {
      setCommentReactions(storedCommentReactions);
    }
  }, []);

  useEffect(() => {
    const syncUser = () => setUser(getActiveUser());
    syncUser();
    if (typeof window === 'undefined') return;
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  useEffect(() => {
    if (!user) {
      setShowComposer(false);
      setEditingPostId(null);
      setEditingCommentId(null);
      setReplyDrafts({});
      setCommentDrafts({});
    }
  }, [user]);

  useEffect(() => {
    writeStorage(POSTS_KEY, posts);
  }, [posts]);

  useEffect(() => {
    writeStorage(COMMENTS_KEY, comments);
  }, [comments]);

  useEffect(() => {
    writeStorage(REACTIONS_KEY, reactions);
  }, [reactions]);

  useEffect(() => {
    writeStorage(COMMENT_REACTIONS_KEY, commentReactions);
  }, [commentReactions]);

  useEffect(() => {
    if (selectedPostId && !posts.some((post) => post.id === selectedPostId)) {
      closePost();
    }
  }, [posts, selectedPostId]);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [posts]);

  const latestCommentByPost = useMemo(() => {
    const map: Record<string, ForumComment | null> = {};
    sortedPosts.forEach((post) => {
      map[post.id] = null;
    });
    comments.forEach((comment) => {
      const current = map[comment.postId];
      if (!current || new Date(comment.createdAt).getTime() > new Date(current.createdAt).getTime()) {
        map[comment.postId] = comment;
      }
    });
    return map;
  }, [comments, sortedPosts]);

  const commentCountByPost = useMemo(() => {
    const map: Record<string, number> = {};
    comments.forEach((comment) => {
      map[comment.postId] = (map[comment.postId] || 0) + 1;
    });
    return map;
  }, [comments]);

  const reactionSummaryByPost = useMemo(() => {
    const map: Record<string, ReactionSummary> = {};
    sortedPosts.forEach((post) => {
      map[post.id] = createEmptySummary();
    });
    reactions.forEach((reaction) => {
      if (!map[reaction.postId]) {
        map[reaction.postId] = createEmptySummary();
      }
      map[reaction.postId][reaction.emotion] += 1;
    });
    return map;
  }, [reactions, sortedPosts]);

  const reactionTotalsByPost = useMemo(() => {
    const totals: Record<string, number> = {};
    Object.entries(reactionSummaryByPost).forEach(([postId, summary]) => {
      totals[postId] = EMOTION_KEYS.reduce((acc, key) => acc + summary[key], 0);
    });
    return totals;
  }, [reactionSummaryByPost]);

  const selectedPost = useMemo(() => {
    return selectedPostId ? posts.find((post) => post.id === selectedPostId) ?? null : null;
  }, [posts, selectedPostId]);

  const repliesByComment = useMemo(() => {
    const map: Record<string, ForumComment[]> = {};
    comments.forEach((comment) => {
      if (!comment.parentId) return;
      if (!map[comment.parentId]) {
        map[comment.parentId] = [];
      }
      map[comment.parentId].push(comment);
    });
    Object.values(map).forEach((group) =>
      group.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    );
    return map;
  }, [comments]);

  const selectedRootComments = useMemo(() => {
    if (!selectedPostId) return [] as ForumComment[];
    return comments
      .filter((comment) => comment.postId === selectedPostId && comment.parentId === null)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [comments, selectedPostId]);

  const commentLikeCount = useMemo(() => {
    const map: Record<string, number> = {};
    commentReactions.forEach((reaction) => {
      map[reaction.commentId] = (map[reaction.commentId] || 0) + 1;
    });
    return map;
  }, [commentReactions]);

  const likedCommentIds = useMemo(() => {
    if (!user) return new Set<string>();
    return new Set(
      commentReactions
        .filter((reaction) => reaction.userId === user.id)
        .map((reaction) => reaction.commentId)
    );
  }, [commentReactions, user]);

  const topAuthors = useMemo(() => {
    const map: Record<string, { name: string; posts: number; comments: number }> = {};
    posts.forEach((post) => {
      if (!map[post.authorId]) {
        map[post.authorId] = { name: post.authorName, posts: 0, comments: 0 };
      }
      map[post.authorId].posts += 1;
    });
    comments.forEach((comment) => {
      if (!map[comment.authorId]) {
        map[comment.authorId] = { name: comment.authorName, posts: 0, comments: 0 };
      }
      map[comment.authorId].comments += 1;
    });
    return Object.entries(map)
      .map(([id, stats]) => ({ id, ...stats }))
      .sort((a, b) => b.posts + b.comments - (a.posts + a.comments))
      .slice(0, 3);
  }, [posts, comments]);

  const categoryStats = useMemo(() => {
    const map: Record<string, number> = {};
    posts.forEach((post) => {
      map[post.category] = (map[post.category] || 0) + 1;
    });
    return CATEGORIES.map((category) => ({
      name: category,
      count: map[category] || 0,
    }));
  }, [posts]);

  const totalParticipatingMembers = useMemo(() => {
    const members = new Set<string>();
    posts.forEach((post) => members.add(post.authorId));
    comments.forEach((comment) => members.add(comment.authorId));
    return members.size;
  }, [posts, comments]);

  const trendingPost = useMemo<ForumPost | null>(() => {
    if (sortedPosts.length === 0) return null;
    let bestPost: ForumPost | null = null;
    let bestScore = -Infinity;
    const now = Date.now();
    sortedPosts.forEach((post) => {
      const reactionsTotal = reactionTotalsByPost[post.id] ?? 0;
      const commentsTotal = commentCountByPost[post.id] ?? 0;
      const hoursSince = (now - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
      const recencyBoost = Math.max(0, 72 - hoursSince);
      const score = reactionsTotal * 2 + commentsTotal * 3 + recencyBoost;
      if (score > bestScore) {
        bestScore = score;
        bestPost = post;
      }
    });
    return bestPost;
  }, [sortedPosts, reactionTotalsByPost, commentCountByPost]);

  const userReactionForSelected = useMemo(() => {
    if (!user || !selectedPostId) return null;
    const record = reactions.find((reaction) => reaction.postId === selectedPostId && reaction.userId === user.id);
    return record?.emotion ?? null;
  }, [reactions, selectedPostId, user]);

  const requireLogin = () => {
    if (user) return true;
    navigate('/login');
    return false;
  };

  const openComposer = () => {
    if (!requireLogin()) return;
    setEditingPostId(null);
    setComposerData({ title: '', content: '', category: CATEGORIES[0] });
    setShowComposer(true);
  };

  const closeComposer = () => {
    setShowComposer(false);
    setEditingPostId(null);
    setComposerData({ title: '', content: '', category: CATEGORIES[0] });
  };

  const startEditPost = (post: ForumPost) => {
    if (!requireLogin() || user?.id !== post.authorId) return;
    setComposerData({ title: post.title, content: post.content, category: post.category });
    setEditingPostId(post.id);
    setShowComposer(true);
    closePost();
  };

  const handleSubmitPost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!requireLogin()) return;
    const title = composerData.title.trim();
    const content = composerData.content.trim();
    if (!title || !content) return;

    if (editingPostId) {
      const timestamp = new Date().toISOString();
      setPosts((prev) =>
        prev.map((post) =>
          post.id === editingPostId
            ? { ...post, title, content, category: composerData.category, updatedAt: timestamp }
            : post
        )
      );
    } else {
      const timestamp = new Date().toISOString();
      const post: ForumPost = {
        id: createId(),
        title,
        content,
        category: composerData.category,
        authorId: user!.id,
        authorName: user!.fullName,
        createdAt: timestamp,
        updatedAt: timestamp,
        media: [],
      };
      setPosts((prev) => [post, ...prev]);
    }

    closeComposer();
  };

  const handleToggleReaction = (postId: string, emotion: EmotionKey) => {
    if (!requireLogin()) return;
    setReactions((prev) => {
      const existingIndex = prev.findIndex(
        (reaction) => reaction.postId === postId && reaction.userId === user!.id
      );
      if (existingIndex === -1) {
        return [...prev, { postId, userId: user!.id, emotion }];
      }

      const existing = prev[existingIndex];
      if (existing.emotion === emotion) {
        const next = [...prev];
        next.splice(existingIndex, 1);
        return next;
      }

      const next = [...prev];
      next[existingIndex] = { ...existing, emotion };
      return next;
    });
  };

  const handleDeletePost = (postId: string) => {
    if (!requireLogin()) return;
    const target = posts.find((post) => post.id === postId);
    if (!target || target.authorId !== user!.id) return;
    if (!window.confirm('Bạn có chắc muốn xóa bài viết này và toàn bộ thảo luận liên quan?')) return;

    const relatedComments = comments.filter((comment) => comment.postId === postId);
    const relatedCommentIds = new Set(relatedComments.map((comment) => comment.id));

    setPosts((prev) => prev.filter((post) => post.id !== postId));
    setComments((prev) => prev.filter((comment) => comment.postId !== postId));
    setReactions((prev) => prev.filter((reaction) => reaction.postId !== postId));
    setCommentReactions((prev) =>
      prev.filter((reaction) => !relatedCommentIds.has(reaction.commentId))
    );
    setReplyDrafts((prev) => {
      const next = { ...prev };
      relatedCommentIds.forEach((id) => {
        delete next[id];
      });
      return next;
    });
    setCommentDrafts((prev) => {
      const next = { ...prev };
      relatedCommentIds.forEach((id) => {
        delete next[id];
      });
      return next;
    });

    if (selectedPostId === postId) {
      closePost();
    }
    if (editingPostId === postId) {
      setEditingPostId(null);
    }
  };

  const handleAddComment = (event: FormEvent<HTMLFormElement>, parentId: string | null = null) => {
    event.preventDefault();
    if (!requireLogin() || !selectedPost) return;

    const draft = parentId ? replyDrafts[parentId] ?? '' : newComment;
    const content = draft.trim();
    if (!content) return;

    const timestamp = new Date().toISOString();
    const comment: ForumComment = {
      id: createId(),
      postId: selectedPost.id,
      parentId,
      authorId: user!.id,
      authorName: user!.fullName,
      content,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setComments((prev) => [...prev, comment]);

    if (parentId) {
      setReplyDrafts((prev) => {
        const next = { ...prev };
        delete next[parentId];
        return next;
      });
    } else {
      setNewComment('');
    }
  };

  const toggleReplyForm = (commentId: string) => {
    if (!requireLogin()) return;
    if (editingCommentId === commentId) {
      setEditingCommentId(null);
      setCommentDrafts((prev) => {
        const next = { ...prev };
        delete next[commentId];
        return next;
      });
    }
    setReplyDrafts((prev) => {
      if (prev[commentId] !== undefined) {
        const next = { ...prev };
        delete next[commentId];
        return next;
      }
      return { ...prev, [commentId]: '' };
    });
  };

  const cancelReply = (commentId: string) => {
    setReplyDrafts((prev) => {
      const next = { ...prev };
      delete next[commentId];
      return next;
    });
  };

  const startEditComment = (comment: ForumComment) => {
    if (!requireLogin() || user?.id !== comment.authorId) return;
    setEditingCommentId(comment.id);
    setCommentDrafts((prev) => ({ ...prev, [comment.id]: comment.content }));
    setReplyDrafts((prev) => {
      if (prev[comment.id] === undefined) return prev;
      const next = { ...prev };
      delete next[comment.id];
      return next;
    });
  };

  const cancelEditComment = (commentId: string) => {
    setEditingCommentId((prev) => (prev === commentId ? null : prev));
    setCommentDrafts((prev) => {
      const next = { ...prev };
      delete next[commentId];
      return next;
    });
  };

  const handleUpdateComment = (event: FormEvent<HTMLFormElement>, commentId: string) => {
    event.preventDefault();
    if (!requireLogin()) return;
    const draft = commentDrafts[commentId]?.trim();
    if (!draft) return;

    const timestamp = new Date().toISOString();
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId ? { ...comment, content: draft, updatedAt: timestamp } : comment
      )
    );
    cancelEditComment(commentId);
  };

  const handleDeleteComment = (commentId: string) => {
    if (!requireLogin()) return;
    const target = comments.find((comment) => comment.id === commentId);
    if (!target || target.authorId !== user!.id) return;
    if (!window.confirm('Bạn có chắc muốn xóa bình luận này cùng các phản hồi phía dưới?')) return;

    const idsToRemove = new Set<string>();
    const collect = (id: string) => {
      idsToRemove.add(id);
      comments.forEach((comment) => {
        if (comment.parentId === id) {
          collect(comment.id);
        }
      });
    };
    collect(commentId);

    setComments((prev) => prev.filter((comment) => !idsToRemove.has(comment.id)));
    setCommentReactions((prev) => prev.filter((reaction) => !idsToRemove.has(reaction.commentId)));
    setReplyDrafts((prev) => {
      const next = { ...prev };
      idsToRemove.forEach((id) => {
        delete next[id];
      });
      return next;
    });
    setCommentDrafts((prev) => {
      const next = { ...prev };
      idsToRemove.forEach((id) => {
        delete next[id];
      });
      return next;
    });
    if (editingCommentId && idsToRemove.has(editingCommentId)) {
      setEditingCommentId(null);
    }
  };

  const toggleCommentLike = (commentId: string) => {
    if (!requireLogin()) return;
    setCommentReactions((prev) => {
      const index = prev.findIndex(
        (reaction) => reaction.commentId === commentId && reaction.userId === user!.id
      );
      if (index === -1) {
        return [...prev, { commentId, userId: user!.id }];
      }
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  const renderReactionSummary = (postId: string, condensed = false) => {
    const summary = reactionSummaryByPost[postId] ?? createEmptySummary();
    return (
      <div className={`flex flex-wrap gap-4 ${condensed ? 'text-xs' : 'text-sm'} text-brand-muted`}>
        {EMOTION_KEYS.map((emotion) => {
          const IconComponent = EMOTION_CONFIG[emotion].icon;
          const count = summary[emotion];
          return (
            <span key={emotion} className="inline-flex items-center gap-2">
              <IconComponent size={condensed ? 14 : 16} className={EMOTION_CONFIG[emotion].accent} />
              {count}
            </span>
          );
        })}
      </div>
    );
  };

  const renderMediaPreview = (media: ForumMedia[]) => {
    if (media.length === 0) return null;
    const primary = media[0];
    const caption = primary.caption ?? 'Nội dung minh họa';
    if (primary.kind === 'image') {
      return (
        <figure className="mt-4 overflow-hidden rounded-2xl border border-brand-blue/10 bg-brand-sand/30">
          <img
            src={primary.url}
            alt={caption}
            className="h-56 w-full object-cover"
            loading="lazy"
          />
          {(primary.caption || primary.credit) && (
            <figcaption className="px-4 py-3 text-xs text-brand-muted space-y-1">
              {primary.caption && <p className="font-semibold text-brand-text/80">{primary.caption}</p>}
              {primary.credit && <p className="italic">{primary.credit}</p>}
            </figcaption>
          )}
          {media.length > 1 && (
            <div className="border-t border-brand-blue/10 bg-white/70 px-4 py-2 text-[11px] uppercase tracking-wide text-brand-muted">
              + {media.length - 1} nội dung kèm theo
            </div>
          )}
        </figure>
      );
    }

    return (
      <figure className="mt-4 overflow-hidden rounded-2xl border border-brand-blue/10 bg-black">
        <div className="aspect-video">
          <iframe
            src={primary.url}
            title={caption}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {(primary.caption || primary.credit) && (
          <figcaption className="px-4 py-3 text-xs text-brand-muted space-y-1 bg-white/80">
            {primary.caption && <p className="font-semibold text-brand-text/80">{primary.caption}</p>}
            {primary.credit && <p className="italic">{primary.credit}</p>}
          </figcaption>
        )}
        {media.length > 1 && (
          <div className="border-t border-brand-blue/10 bg-white/70 px-4 py-2 text-[11px] uppercase tracking-wide text-brand-muted">
            + {media.length - 1} nội dung kèm theo
          </div>
        )}
      </figure>
    );
  };

  const renderMediaGallery = (media: ForumMedia[]) => {
    if (media.length === 0) return null;
    return (
      <div className="space-y-5">
        {media.map((item) => {
          const caption = item.caption ?? 'Nội dung minh họa';
          return (
            <figure
              key={item.id}
              className="overflow-hidden rounded-2xl border border-brand-blue/15 bg-brand-sand/40"
            >
              {item.kind === 'image' ? (
                <img
                  src={item.url}
                  alt={caption}
                  className="w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="aspect-video bg-black">
                  <iframe
                    src={item.url}
                    title={caption}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              {(item.caption || item.credit) && (
                <figcaption className="px-5 py-4 text-xs text-brand-muted space-y-1">
                  {item.caption && <p className="font-semibold text-brand-text/80">{item.caption}</p>}
                  {item.credit && <p className="italic">{item.credit}</p>}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>
    );
  };

  const renderComment = (comment: ForumComment, depth = 0): JSX.Element => {
    const childComments = repliesByComment[comment.id] ?? [];
    const isEditing = editingCommentId === comment.id;
    const likeCount = commentLikeCount[comment.id] ?? 0;
    const likedByUser = likedCommentIds.has(comment.id);
    const draft = commentDrafts[comment.id] ?? comment.content;

    return (
      <div
        key={comment.id}
        className={`space-y-3 ${depth > 0 ? 'ml-8 border-l border-brand-blue/20 pl-5' : ''}`}
      >
        <div className="rounded-2xl border border-brand-blue/15 bg-brand-sand/30 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-blue text-white flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="flex flex-col text-sm text-brand-muted">
              <span className="font-semibold text-brand-text">{comment.authorName}</span>
              <span>
                {formatTimestamp(comment.createdAt)}
                {comment.updatedAt !== comment.createdAt && (
                  <span className="ml-1 italic text-xs">· đã chỉnh sửa</span>
                )}
              </span>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={(event) => handleUpdateComment(event, comment.id)} className="space-y-3">
              <textarea
                value={draft}
                onChange={(event) =>
                  setCommentDrafts((prev) => ({ ...prev, [comment.id]: event.target.value }))
                }
                rows={3}
                className="w-full rounded-2xl border border-brand-blue/40 px-4 py-3 resize-none focus:border-brand-blue outline-none"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => cancelEditComment(comment.id)}
                  className="rounded-full border border-brand-blue px-5 py-2 text-xs font-semibold text-brand-blue hover:bg-brand-blue hover:text-white transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-brand-blue px-5 py-2 text-xs font-semibold text-white shadow-md shadow-brand-blue/30 hover:-translate-y-0.5 transition"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-brand-muted whitespace-pre-line leading-relaxed">
              {comment.content}
            </p>
          )}

          {!isEditing && (
            <div className="flex flex-wrap items-center gap-3 text-xs text-brand-muted">
              <button
                type="button"
                onClick={() => toggleCommentLike(comment.id)}
                className={`inline-flex items-center gap-2 transition ${
                  likedByUser ? 'text-brand-blue font-semibold' : 'hover:text-brand-text'
                }`}
              >
                <ThumbsUp size={14} className={likedByUser ? 'text-brand-blue' : 'text-brand-muted'} />
                <span>Thích</span>
                <span className="text-brand-text">{likeCount}</span>
              </button>
              <button
                type="button"
                onClick={() => toggleReplyForm(comment.id)}
                className="inline-flex items-center gap-2 hover:text-brand-text"
              >
                <CornerDownRight size={14} />
                Trả lời
              </button>
              {comment.authorId === user?.id && (
                <>
                  <button
                    type="button"
                    onClick={() => startEditComment(comment)}
                    className="inline-flex items-center gap-2 hover:text-brand-text"
                  >
                    <PenLine size={14} />
                    Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteComment(comment.id)}
                    className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700"
                  >
                    <Trash2 size={14} />
                    Xóa
                  </button>
                </>
              )}
            </div>
          )}

          {replyDrafts[comment.id] !== undefined && !isEditing && (
            <form onSubmit={(event) => handleAddComment(event, comment.id)} className="space-y-3">
              <textarea
                value={replyDrafts[comment.id] ?? ''}
                onChange={(event) =>
                  setReplyDrafts((prev) => ({ ...prev, [comment.id]: event.target.value }))
                }
                rows={3}
                placeholder="Phản hồi lại bình luận này..."
                className="w-full rounded-2xl border border-brand-blue/40 px-4 py-3 resize-none focus:border-brand-blue outline-none"
                required
              />
              <div className="flex justify-end gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => cancelReply(comment.id)}
                  className="rounded-full border border-brand-blue px-5 py-2 font-semibold text-brand-blue hover:bg-brand-blue hover:text-white transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-brand-blue px-5 py-2 font-semibold text-white shadow-md shadow-brand-blue/30 hover:-translate-y-0.5 transition"
                >
                  Gửi phản hồi
                </button>
              </div>
            </form>
          )}
        </div>

        {childComments.length > 0 && (
          <div className="space-y-3">
            {childComments.map((child) => renderComment(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const totalReactions = reactions.length;
  const totalCommentLikes = commentReactions.length;

  return (
    <div className="min-h-screen bg-brand-base">
      <div
        className="relative h-80 bg-cover bg-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(47, 58, 69, 0.6), rgba(47, 58, 69, 0.75)), url(https://images.pexels.com/photos/2382665/pexels-photo-2382665.jpeg)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4">DIỄN ĐÀN</h1>
            <p className="text-xl text-brand-sand font-serif italic">Trao đổi và kết nối cộng đồng yêu lịch sử</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14 space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-brand-text/70 text-sm">
            Đăng bài, phản hồi đa tầng, thả cảm xúc và tương tác cùng những nhà nghiên cứu lịch sử khác.
          </p>
          {user ? (
            <button
              onClick={openComposer}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-semibold shadow-lg shadow-brand-blue/20 hover:-translate-y-0.5 transition"
              type="button"
            >
              <Plus size={18} />
              Tạo bài viết
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 px-6 py-3 border border-brand-blue text-brand-blue font-semibold hover:bg-brand-blue hover:text-white transition"
              type="button"
            >
              <LogIn size={18} />
              Đăng nhập để tham gia
            </button>
          )}
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <section className="space-y-6">
            {sortedPosts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-brand-blue/30 bg-white/80 px-8 py-12 text-center text-brand-muted">
                <p className="text-lg font-semibold text-brand-text mb-2">Chưa có bài viết nào.</p>
                <p className="text-sm">
                  {user
                    ? 'Hãy là người mở đầu cuộc thảo luận với một bài viết mới.'
                    : 'Đăng nhập để trở thành người mở đầu cuộc thảo luận.'}
                </p>
              </div>
            ) : (
              sortedPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white border border-brand-blue/15 shadow-sm hover:shadow-xl transition rounded-3xl p-6 md:p-8 cursor-pointer"
                  onClick={() => openPost(post.id)}
                >
                  <header className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-brand-blue text-white flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-brand-text">{post.authorName}</p>
                        <p className="text-xs text-brand-muted">
                          {formatTimestamp(post.createdAt)}
                          {post.updatedAt !== post.createdAt && (
                            <span className="ml-1 italic">· đã chỉnh sửa</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center rounded-full border border-brand-blue/40 bg-brand-sand/70 px-3 py-1 text-xs font-semibold text-brand-blue">
                        {post.category}
                      </span>
                      {user?.id === post.authorId && (
                        <div className="flex items-center gap-2 text-xs">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              startEditPost(post);
                            }}
                            className="inline-flex items-center gap-1 rounded-full border border-brand-blue px-3 py-1 text-brand-blue hover:bg-brand-blue hover:text-white transition"
                          >
                            <PenLine size={14} />
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDeletePost(post.id);
                            }}
                            className="inline-flex items-center gap-1 rounded-full border border-rose-500/70 px-3 py-1 text-rose-600 hover:bg-rose-600 hover:text-white transition"
                          >
                            <Trash2 size={14} />
                            Xóa
                          </button>
                        </div>
                      )}
                    </div>
                  </header>

                  <h3 className="text-2xl font-serif text-brand-text mb-2">{post.title}</h3>
                  <p className="text-brand-muted line-clamp-3 mb-4 whitespace-pre-line">{post.content}</p>

                  {renderMediaPreview(post.media)}

                  <div className="rounded-2xl border border-brand-blue/10 bg-brand-sand/40 p-4 mb-4 text-sm text-brand-muted">
                    <p className="uppercase text-xs tracking-wide text-brand-muted/70">Bình luận gần nhất</p>
                    {latestCommentByPost[post.id] ? (
                      <div className="mt-2 space-y-1">
                        <p className="text-brand-text text-sm line-clamp-2">
                          “{latestCommentByPost[post.id]!.content}”
                        </p>
                        <p className="text-xs text-brand-muted">
                          — {latestCommentByPost[post.id]!.authorName} ·{' '}
                          {formatTimestamp(latestCommentByPost[post.id]!.createdAt)}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm">Chưa có bình luận nào.</p>
                    )}
                  </div>

                  <footer className="flex flex-wrap items-center gap-5">
                    {renderReactionSummary(post.id, true)}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        if (!requireLogin()) return;
                        openPost(post.id);
                      }}
                      className="inline-flex items-center gap-2 text-brand-blue text-sm hover:text-brand-text transition"
                    >
                      <MessageSquare size={16} />
                      <span>{commentCountByPost[post.id] ?? 0} bình luận</span>
                    </button>
                  </footer>
                </article>
              ))
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-brand-blue/15 bg-white/90 p-6 space-y-6 shadow-lg shadow-brand-blue/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-blue/90 text-white flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-blue uppercase tracking-wide">Phòng tương tác</p>
                  <p className="text-xs text-brand-muted">Những hoạt động nổi bật nhất hôm nay</p>
                </div>
              </div>

              <div className="rounded-2xl border border-brand-blue/20 bg-brand-sand/40 p-4 space-y-3">
                <p className="text-xs font-semibold text-brand-muted uppercase tracking-wide">
                  Bài viết đang nổi
                </p>
                {trendingPost ? (
                  <button
                    type="button"
                    onClick={() => openPost(trendingPost.id)}
                    className="text-left space-y-2"
                  >
                    <p className="text-brand-text font-serif text-lg">{trendingPost.title}</p>
                    <p className="text-xs text-brand-muted line-clamp-2">
                      {trendingPost.content}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-brand-muted">
                      <span>{commentCountByPost[trendingPost.id] ?? 0} bình luận</span>
                      <span>{reactionTotalsByPost[trendingPost.id] ?? 0} cảm xúc</span>
                    </div>
                  </button>
                ) : (
                  <p className="text-sm text-brand-muted">Hãy đăng bài để tạo chủ đề đầu tiên!</p>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-brand-muted uppercase tracking-wide mb-3">
                    Danh mục được quan tâm
                  </p>
                  <div className="space-y-3">
                    {categoryStats.map(({ name, count }) => (
                      <div key={name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-brand-muted">
                          <span>{name}</span>
                          <span>{count} bài</span>
                        </div>
                        <div className="h-2 rounded-full bg-brand-sand/60">
                          <div
                            className="h-full rounded-full bg-brand-blue"
                            style={{
                              width: `${sortedPosts.length === 0 ? 0 : Math.min(100, (count / sortedPosts.length) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-brand-muted uppercase tracking-wide mb-3">
                    Thành viên hoạt động mạnh
                  </p>
                  {topAuthors.length === 0 ? (
                    <p className="text-sm text-brand-muted">Chưa có thành viên nổi bật.</p>
                  ) : (
                    <ul className="space-y-3 text-sm text-brand-muted">
                      {topAuthors.map((author) => (
                        <li key={author.id} className="flex items-center justify-between">
                          <span className="font-semibold text-brand-text">{author.name}</span>
                          <span>{author.posts} bài · {author.comments} phản hồi</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="rounded-2xl border border-brand-blue/20 bg-brand-sand/40 p-4 text-xs text-brand-muted leading-relaxed">
                  <p>{totalParticipatingMembers} thành viên đã tham gia thảo luận.</p>
                  <p>{posts.length} bài viết · {comments.length} bình luận · {totalReactions + totalCommentLikes} cảm xúc được trao.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {showComposer && (
        <div className="fixed inset-0 z-50 bg-brand-text/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-3xl bg-white border border-brand-blue/30 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8 space-y-6">
              <header className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-serif text-brand-text">
                    {editingPostId ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
                  </h2>
                  <p className="text-sm text-brand-muted mt-1">
                    {editingPostId
                      ? 'Cập nhật lại góc nhìn của bạn để mọi người cùng tiếp tục thảo luận.'
                      : 'Chia sẻ góc nhìn lịch sử cùng cộng đồng.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeComposer}
                  className="text-brand-muted hover:text-brand-text"
                >
                  ✕
                </button>
              </header>

              <form onSubmit={handleSubmitPost} className="space-y-5">
                <label className="flex flex-col gap-2 text-sm">
                  <span className="font-semibold text-brand-text">Danh mục</span>
                  <select
                    value={composerData.category}
                    onChange={(event) => setComposerData({ ...composerData, category: event.target.value })}
                    className="rounded-2xl border border-brand-blue/30 px-4 py-3"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="font-semibold text-brand-text">Tiêu đề</span>
                  <input
                    value={composerData.title}
                    onChange={(event) => setComposerData({ ...composerData, title: event.target.value })}
                    placeholder="Ví dụ: 5 giai đoạn quan trọng của chiến dịch Điện Biên Phủ"
                    className="rounded-2xl border border-brand-blue/30 px-4 py-3"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="font-semibold text-brand-text">Nội dung</span>
                  <textarea
                    value={composerData.content}
                    onChange={(event) => setComposerData({ ...composerData, content: event.target.value })}
                    placeholder="Chia sẻ quan điểm, tư liệu hoặc câu hỏi của bạn..."
                    rows={8}
                    className="rounded-2xl border border-brand-blue/30 px-4 py-3 resize-none"
                    required
                  />
                </label>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeComposer}
                    className="rounded-full border border-brand-blue px-6 py-3 text-sm font-semibold text-brand-blue hover:bg-brand-blue hover:text-white transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/30 hover:-translate-y-0.5 transition"
                  >
                    {editingPostId ? 'Lưu bài viết' : 'Đăng bài'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {selectedPost && (
        <div className="fixed inset-0 z-40 bg-brand-text/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-4xl bg-white border border-brand-blue/20 rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="p-8 space-y-8">
              <header className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center">
                    <User size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-brand-text">{selectedPost.authorName}</p>
                    <p className="text-xs text-brand-muted">
                      {formatTimestamp(selectedPost.createdAt)}
                      {selectedPost.updatedAt !== selectedPost.createdAt && (
                        <span className="ml-1 italic">· đã chỉnh sửa</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedPost.authorId === user?.id && (
                    <>
                      <button
                        type="button"
                        onClick={() => startEditPost(selectedPost)}
                        className="inline-flex items-center gap-2 rounded-full border border-brand-blue px-3 py-1 text-xs font-semibold text-brand-blue hover:bg-brand-blue hover:text-white transition"
                      >
                        <PenLine size={14} />
                        Sửa bài
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePost(selectedPost.id)}
                        className="inline-flex items-center gap-2 rounded-full border border-rose-500/70 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-600 hover:text-white transition"
                      >
                        <Trash2 size={14} />
                        Xóa bài
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={closePost}
                    className="text-brand-muted hover:text-brand-text"
                  >
                    ✕
                  </button>
                </div>
              </header>

              <span className="inline-flex items-center rounded-full border border-brand-blue/40 bg-brand-sand/70 px-3 py-1 text-xs font-semibold text-brand-blue">
                {selectedPost.category}
              </span>

              <div className="space-y-4">
                <h2 className="text-3xl font-serif text-brand-text">{selectedPost.title}</h2>
                <p className="text-brand-muted whitespace-pre-line leading-relaxed">{selectedPost.content}</p>
              </div>

              {renderMediaGallery(selectedPost.media)}

              <section className="space-y-4 border-t border-brand-blue/10 pt-6">
                <div className="flex flex-wrap items-center gap-3">
                  {EMOTION_KEYS.map((emotion) => {
                    const IconComponent = EMOTION_CONFIG[emotion].icon;
                    const active = userReactionForSelected === emotion;
                    return (
                      <button
                        key={emotion}
                        type="button"
                        onClick={() => handleToggleReaction(selectedPost.id, emotion)}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                          active
                            ? 'border-brand-blue bg-brand-blue text-white shadow'
                            : 'border-brand-blue/30 text-brand-text hover:border-brand-blue'
                        }`}
                      >
                        <IconComponent size={16} className={active ? 'text-white' : EMOTION_CONFIG[emotion].accent} />
                        {EMOTION_CONFIG[emotion].label}
                      </button>
                    );
                  })}
                </div>
                {renderReactionSummary(selectedPost.id)}
              </section>

              <section className="space-y-6">
                <h3 className="text-xl font-serif text-brand-text">Bình luận</h3>
                {user ? (
                  <form onSubmit={(event) => handleAddComment(event, null)} className="space-y-3">
                    <textarea
                      value={newComment}
                      onChange={(event) => setNewComment(event.target.value)}
                      placeholder="Chia sẻ ý kiến của bạn..."
                      rows={3}
                      className="w-full rounded-2xl border border-brand-blue/30 px-4 py-3 resize-none focus:border-brand-blue outline-none"
                      required
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-6 py-2 text-sm font-semibold text-white shadow-md shadow-brand-blue/30 hover:-translate-y-0.5 transition"
                      >
                        <Send size={16} />
                        Gửi bình luận
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="rounded-2xl border border-brand-blue/20 bg-brand-sand/40 p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-brand-text">
                      Đăng nhập để bình luận và kết nối với cộng đồng yêu lịch sử.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white hover:-translate-y-0.5 transition"
                    >
                      <LogIn size={16} />
                      Đăng nhập
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  {selectedRootComments.length === 0 ? (
                    <p className="text-sm text-brand-muted">Chưa có bình luận nào. Hãy mở đầu cuộc trò chuyện!</p>
                  ) : (
                    selectedRootComments.map((comment) => renderComment(comment))
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
