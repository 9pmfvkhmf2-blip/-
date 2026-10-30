/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Scroll,
  PenTool,
  BookOpen,
  Clock,
  Award,
  User as UserIcon,
  LogIn,
  LogOut,
  Plus,
  Trash2,
  X,
  Sparkles,
  Menu,
  Quote,
  Shield,
  Star,
  Flag,
  Send,
  Eye,
  CheckCircle2,
  Users,
  FileQuestion,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

import {
  User,
  Topic,
  Submission,
  Article,
  GradeLevel,
  Quiz,
  QuizQuestion,
  QuizAttempt
} from './types';
import {
  INITIAL_TEACHER,
  INITIAL_STUDENTS,
  INITIAL_DAILY_QUOTE,
  INITIAL_TOPICS,
  INITIAL_ARTICLES,
  INITIAL_SUBMISSIONS,
  INITIAL_QUIZZES,
  INITIAL_QUIZ_ATTEMPTS
} from './initialData';

export default function App() {
  // --- Persistent Storage State ---
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('app_users');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('app_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [dailyQuote, setDailyQuote] = useState<string>(() => {
    const saved = localStorage.getItem('app_dailyQuote');
    return saved !== null ? saved : INITIAL_DAILY_QUOTE;
  });

  const [topics, setTopics] = useState<Topic[]>(() => {
    const saved = localStorage.getItem('app_topics');
    return saved ? JSON.parse(saved) : INITIAL_TOPICS;
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const saved = localStorage.getItem('app_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('app_articles');
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('app_quizzes');
    return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
  });

  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() => {
    const saved = localStorage.getItem('app_quiz_attempts');
    return saved ? JSON.parse(saved) : INITIAL_QUIZ_ATTEMPTS;
  });

  // --- Navigation & UI State ---
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // --- Writing Studio State ---
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [essayTitle, setEssayTitle] = useState('');
  const [essayContent, setEssayContent] = useState('');

  // --- Modal States ---
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'student-login' | 'student-register' | 'teacher-login'>('student-login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');

  // Grading Modal
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(90);
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('特優');
  const [gradeFeedback, setGradeFeedback] = useState<string>('');

  // Article Publish Modal
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [newArtTitle, setNewArtTitle] = useState('');
  const [newArtCategory, setNewArtCategory] = useState('寫作技巧');
  const [newArtContent, setNewArtContent] = useState('');

  // Reading Article Modal
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);

  // Articles Filter
  const [articleFilter, setArticleFilter] = useState<'all' | 'bookmarked' | 'flagged'>('all');

  // Manage Topics Form
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDesc, setNewTopicDesc] = useState('');
  const [newTopicDueDate, setNewTopicDueDate] = useState('');
  const [newTopicIsWeekly, setNewTopicIsWeekly] = useState(true);

  // Teacher Daily Quote Input
  const [quoteInput, setQuoteInput] = useState(dailyQuote);

  // --- Quiz System State ---
  // Taking a quiz
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIndex: number]: number }>({});
  const [quizResultModal, setQuizResultModal] = useState<{ quiz: Quiz; attempt: QuizAttempt } | null>(null);

  // Publishing a quiz (Teacher)
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizDesc, setNewQuizDesc] = useState('');
  const [newQuizPassage, setNewQuizPassage] = useState('');
  const [newQuizDueDate, setNewQuizDueDate] = useState('');
  const [newQuizQuestions, setNewQuizQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q_1',
      question: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0,
      explanation: '',
      points: 25,
    },
  ]);

  // Synchronize to localStorage
  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('app_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('app_currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('app_dailyQuote', dailyQuote);
    setQuoteInput(dailyQuote);
  }, [dailyQuote]);

  useEffect(() => {
    localStorage.setItem('app_topics', JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem('app_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('app_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('app_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('app_quiz_attempts', JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  // Synchronize selected topic
  useEffect(() => {
    if (topics.length > 0) {
      if (!selectedTopicId || !topics.some(t => t.id === selectedTopicId)) {
        const weekly = topics.find(t => t.isWeekly) || topics[0];
        setSelectedTopicId(weekly.id);
      }
    } else {
      setSelectedTopicId('');
    }
  }, [topics, selectedTopicId]);

  // Toast Notification
  const notify = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3200);
  };

  const switchNav = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const weeklyTopic = useMemo(() => {
    if (topics.length === 0) return null;
    return topics.find(t => t.isWeekly) || topics[0];
  }, [topics]);

  const currentWritingTopic = useMemo(() => {
    return topics.find(t => t.id === selectedTopicId) || null;
  }, [topics, selectedTopicId]);

  // 動態即時字數與寫作學情統計
  const dynamicStats = useMemo(() => {
    const text = essayContent;
    const totalChars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;
    const estReadingTimeMinutes = Math.max(1, Math.ceil(charsNoSpaces / 300));
    const targetWords = 600;
    const progressPercent = Math.min(100, Math.round((charsNoSpaces / targetWords) * 100));

    let statusLabel = '剛剛起筆';
    let statusBadgeColor = 'bg-[#e4d7be] text-[#7c634b] border-[#b8a686]';
    if (charsNoSpaces >= 900) {
      statusLabel = '篇幅宏闊 · 文思泉湧';
      statusBadgeColor = 'bg-[#2d5a3f] text-white border-[#2d5a3f]';
    } else if (charsNoSpaces >= 600) {
      statusLabel = '篇幅達標 · 結構充實';
      statusBadgeColor = 'bg-[#2d5a3f] text-white border-[#2d5a3f]';
    } else if (charsNoSpaces >= 300) {
      statusLabel = '循序漸進 · 鋪陳演繹';
      statusBadgeColor = 'bg-[#b8a686] text-[#4a2e1b] border-[#b8a686]';
    } else if (charsNoSpaces > 0) {
      statusLabel = '點題破題 · 初見端倪';
      statusBadgeColor = 'bg-[#8c2e1b] text-white border-[#8c2e1b]';
    }

    return {
      totalChars,
      charsNoSpaces,
      chineseChars,
      paragraphs,
      estReadingTimeMinutes,
      progressPercent,
      statusLabel,
      statusBadgeColor,
    };
  }, [essayContent]);

  const filteredArticles = useMemo(() => {
    return articles.filter(a => {
      if (articleFilter === 'bookmarked' && !a.bookmarked) return false;
      if (articleFilter === 'flagged' && !a.flagged) return false;
      return true;
    });
  }, [articles, articleFilter]);

  const mySubmissions = useMemo(() => {
    if (!currentUser || currentUser.role !== 'student') return [];
    return submissions.filter(s => s.studentId === currentUser.id);
  }, [submissions, currentUser]);

  const myQuizAttempts = useMemo(() => {
    if (!currentUser || currentUser.role !== 'student') return [];
    return quizAttempts.filter(qa => qa.studentId === currentUser.id);
  }, [quizAttempts, currentUser]);

  // Handle Auth
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'teacher-login') {
      if (authEmail.trim() === 'wen' && authPassword.trim() === '25336478') {
        const teacher = { ...INITIAL_TEACHER };
        setCurrentUser(teacher);
        setAuthModalOpen(false);
        setAuthEmail('');
        setAuthPassword('');
        notify(`尊貴的 wen 老師，歡迎登入管理後台！`, 'success');
        switchNav('teacher');
      } else {
        notify('教師帳號或密碼不正確！', 'error');
      }
    } else if (authMode === 'student-login') {
      const found = users.find(
        u => u.email.toLowerCase() === authEmail.trim().toLowerCase() && u.password === authPassword
      );
      if (found && found.role === 'student') {
        setCurrentUser(found);
        setAuthModalOpen(false);
        setAuthEmail('');
        setAuthPassword('');
        notify(`歡迎回來，${found.name} 同學！`, 'success');
      } else {
        notify('學生 Email 或密碼不正確！', 'error');
      }
    } else if (authMode === 'student-register') {
      if (!authName.trim()) {
        notify('請輸入學生姓名！', 'error');
        return;
      }
      if (users.some(u => u.email.toLowerCase() === authEmail.trim().toLowerCase())) {
        notify('此 Email 已經被註冊！', 'error');
        return;
      }
      const newUser: User = {
        id: 'u_' + Date.now(),
        name: authName.trim(),
        email: authEmail.trim(),
        password: authPassword,
        role: 'student',
      };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setAuthModalOpen(false);
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
      notify(`註冊成功！歡迎使用學習平台，${newUser.name}。`, 'success');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    notify('已安全登出！', 'info');
    switchNav('home');
  };

  const handleStartWriting = (topicId?: string) => {
    if (topics.length === 0) {
      notify('目前尚未發布題目，請稍後查看！', 'info');
      return;
    }
    if (topicId) {
      setSelectedTopicId(topicId);
    }
    if (!currentUser) {
      setAuthMode('student-login');
      setAuthModalOpen(true);
      return;
    }
    switchNav('write');
  };

  // Submit Essay
  const handleSubmitEssay = () => {
    if (!currentUser || currentUser.role !== 'student') {
      notify('請先以學生身份登入！', 'error');
      setAuthMode('student-login');
      setAuthModalOpen(true);
      return;
    }
    if (!currentWritingTopic) {
      notify('請先選擇一個有效的作文題目！', 'error');
      return;
    }
    if (!essayTitle.trim() || !essayContent.trim()) {
      notify('請填寫完整題目與內容！', 'error');
      return;
    }

    const newSub: Submission = {
      id: 's_' + Date.now(),
      studentId: currentUser.id,
      studentName: currentUser.name,
      topicId: currentWritingTopic.id,
      topicTitle: currentWritingTopic.title,
      essayTitle: essayTitle.trim(),
      content: essayContent.trim(),
      date: new Date().toLocaleDateString('zh-TW'),
      status: 'pending',
      score: null,
      level: null,
      feedback: '',
    };

    setSubmissions(prev => [newSub, ...prev]);
    setEssayTitle('');
    setEssayContent('');
    notify('作業提交成功！已呈交 wen 老師批閱。', 'success');
    switchNav('records');
  };

  const handleSaveDraft = () => {
    notify('作文草稿已儲存至瀏覽器！', 'success');
  };

  // Teacher Grade Submission
  const openGradeModal = (sub: Submission) => {
    setGradingSubmission(sub);
    setGradeScore(sub.score || 90);
    setGradeLevel(sub.level || '特優');
    setGradeFeedback(sub.feedback || '');
  };

  const handleSaveGrade = () => {
    if (!gradingSubmission) return;
    setSubmissions(prev =>
      prev.map(s => {
        if (s.id === gradingSubmission.id) {
          return {
            ...s,
            status: 'graded',
            score: Number(gradeScore),
            level: gradeLevel,
            feedback: gradeFeedback.trim() || '文筆清暢，立意深遠！',
          };
        }
        return s;
      })
    );
    setGradingSubmission(null);
    notify('批閱完成！評語已公佈予學生。', 'success');
  };

  // Publish Topic
  const handlePublishTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !newTopicDesc.trim() || !newTopicDueDate) {
      notify('請填寫完整作文題目與截止日期！', 'error');
      return;
    }

    const updatedTopics = topics.map(t => (newTopicIsWeekly ? { ...t, isWeekly: false } : t));
    const newTopic: Topic = {
      id: 't_' + Date.now(),
      title: newTopicTitle.trim(),
      desc: newTopicDesc.trim(),
      dueDate: newTopicDueDate,
      isWeekly: newTopicIsWeekly,
    };

    setTopics([newTopic, ...updatedTopics]);
    setSelectedTopicId(newTopic.id);
    setNewTopicTitle('');
    setNewTopicDesc('');
    setNewTopicDueDate('');
    setNewTopicIsWeekly(false);
    notify('新作文題目發布成功！', 'success');
    switchNav('home');
  };

  const handleDeleteTopic = (topicId: string) => {
    if (confirm('確定要刪除此作文題目嗎？')) {
      setTopics(prev => prev.filter(t => t.id !== topicId));
      notify('題目已刪除', 'info');
    }
  };

  // Update Daily Quote
  const handleUpdateDailyQuote = () => {
    setDailyQuote(quoteInput.trim());
    notify('每日名言佳句已更新成功！', 'success');
    switchNav('home');
  };

  // Publish Article
  const handlePublishArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtTitle.trim() || !newArtContent.trim()) {
      notify('請填寫完整文章內容！', 'error');
      return;
    }
    const newArt: Article = {
      id: 'a_' + Date.now(),
      title: newArtTitle.trim(),
      category: newArtCategory.trim() || '寫作技巧',
      content: newArtContent.trim(),
      author: 'wen 老師',
      date: new Date().toLocaleDateString('zh-TW'),
      bookmarked: false,
      flagged: false,
    };
    setArticles(prev => [newArt, ...prev]);
    setArticleModalOpen(false);
    setNewArtTitle('');
    setNewArtContent('');
    notify('知識文章發布成功！', 'success');
  };

  // Delete Article (Feature specifically requested)
  const handleDeleteArticle = (articleId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('確定要刪除這篇知識文章嗎？此操作無法撤回。')) {
      setArticles(prev => prev.filter(a => a.id !== articleId));
      notify('文章已成功刪除！', 'info');
    }
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setArticles(prev =>
      prev.map(a => (a.id === id ? { ...a, bookmarked: !a.bookmarked } : a))
    );
  };

  const toggleFlag = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setArticles(prev =>
      prev.map(a => (a.id === id ? { ...a, flagged: !a.flagged } : a))
    );
  };

  // --- Quiz Management & Execution ---
  const addQuestionField = () => {
    setNewQuizQuestions(prev => [
      ...prev,
      {
        id: 'q_' + Date.now(),
        question: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: '',
        points: 25,
      },
    ]);
  };

  const removeQuestionField = (index: number) => {
    if (newQuizQuestions.length <= 1) {
      notify('測驗至少需要保留一道題目！', 'error');
      return;
    }
    setNewQuizQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuestionField = (
    index: number,
    field: keyof QuizQuestion,
    value: string | number | string[]
  ) => {
    setNewQuizQuestions(prev =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const updateOptionText = (qIndex: number, optIndex: number, text: string) => {
    setNewQuizQuestions(prev =>
      prev.map((q, i) => {
        if (i === qIndex) {
          const updatedOptions = [...q.options];
          updatedOptions[optIndex] = text;
          return { ...q, options: updatedOptions };
        }
        return q;
      })
    );
  };

  // Publish Quiz
  const handlePublishQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizTitle.trim()) {
      notify('請輸入測驗名稱！', 'error');
      return;
    }
    // Validation: check each question
    for (let i = 0; i < newQuizQuestions.length; i++) {
      const q = newQuizQuestions[i];
      if (!q.question.trim()) {
        notify(`第 ${i + 1} 題的題目內容不能為空！`, 'error');
        return;
      }
      if (q.options.some(opt => !opt.trim())) {
        notify(`第 ${i + 1} 題的所有選項都必須填寫！`, 'error');
        return;
      }
    }

    const createdQuiz: Quiz = {
      id: 'quiz_' + Date.now(),
      title: newQuizTitle.trim(),
      description: newQuizDesc.trim() || '請仔細閱讀文本與題目，選出最適當的選項。',
      passage: newQuizPassage.trim(),
      dueDate: newQuizDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      questions: newQuizQuestions,
      createdAt: new Date().toLocaleDateString('zh-TW'),
    };

    setQuizzes(prev => [createdQuiz, ...prev]);
    // Reset form
    setNewQuizTitle('');
    setNewQuizDesc('');
    setNewQuizPassage('');
    setNewQuizDueDate('');
    setNewQuizQuestions([
      {
        id: 'q_' + Date.now(),
        question: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: '',
        points: 25,
      },
    ]);
    notify('測驗已成功發布！學生可於線上測驗區進行作答。', 'success');
    switchNav('quizzes');
  };

  const handleDeleteQuiz = (quizId: string) => {
    if (confirm('確定要刪除這份測驗嗎？學生先前的測驗記錄亦會保留。')) {
      setQuizzes(prev => prev.filter(q => q.id !== quizId));
      notify('測驗已刪除', 'info');
    }
  };

  // Start Taking Quiz
  const handleStartQuiz = (quiz: Quiz) => {
    if (!currentUser) {
      notify('請先登入學生帳號以開始測驗！', 'info');
      setAuthMode('student-login');
      setAuthModalOpen(true);
      return;
    }
    setActiveQuiz(quiz);
    setSelectedAnswers({});
  };

  // Submit Quiz Answers
  const handleSubmitQuizAttempt = () => {
    if (!activeQuiz || !currentUser) return;

    // Check if all answered
    const unanswered = activeQuiz.questions.findIndex((_, idx) => selectedAnswers[idx] === undefined);
    if (unanswered !== -1) {
      if (!confirm(`第 ${unanswered + 1} 題尚未作答，確定要現在交卷嗎？`)) {
        return;
      }
    }

    let earnedScore = 0;
    const totalPoints = activeQuiz.questions.reduce((sum, q) => sum + (q.points || 10), 0);
    const answersArray: number[] = [];

    activeQuiz.questions.forEach((q, idx) => {
      const chosen = selectedAnswers[idx];
      answersArray.push(chosen !== undefined ? chosen : -1);
      if (chosen === q.correctAnswerIndex) {
        earnedScore += q.points || 10;
      }
    });

    const newAttempt: QuizAttempt = {
      id: 'qa_' + Date.now(),
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      studentId: currentUser.id,
      studentName: currentUser.name,
      answers: answersArray,
      score: earnedScore,
      totalPoints: totalPoints,
      submittedAt: new Date().toLocaleDateString('zh-TW'),
    };

    setQuizAttempts(prev => [newAttempt, ...prev]);
    setQuizResultModal({ quiz: activeQuiz, attempt: newAttempt });
    setActiveQuiz(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between text-[#3b2c21] overflow-x-hidden">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 sm:right-6 md:right-8 z-50 max-w-[90vw] sm:max-w-md animate-bounce duration-300">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl border flex items-center space-x-2.5 text-xs sm:text-sm font-bold ${
              notification.type === 'error'
                ? 'bg-[#8c2e1b] text-white border-red-950'
                : notification.type === 'info'
                ? 'bg-[#2d5a3f] text-white border-emerald-950'
                : 'bg-[#4a2e1b] text-[#f7f4ed] border-[#c9b99a]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#e8dec8] flex-shrink-0" />
            <span className="break-words">{notification.message}</span>
          </div>
        </div>
      )}

      {/* 頂部導覽列 */}
      <header className="bg-[#f2ebdc] border-b-2 border-[#b8a686] sticky top-0 z-40 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo & Platform Name */}
          <div
            className="flex items-center space-x-2.5 sm:space-x-4 cursor-pointer select-none"
            onClick={() => switchNav('home')}
          >
            <div className="bg-[#8c2e1b] text-[#f2ebdc] p-2 sm:p-2.5 rounded-lg sm:rounded-xl font-bold flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 shadow flex-shrink-0">
              <Scroll className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="font-black text-sm sm:text-lg md:text-xl tracking-wider text-[#4a2e1b] truncate max-w-[200px] sm:max-w-none">
                寫作與閱讀學習平台
              </h1>
              <p className="text-[10px] sm:text-xs text-[#7c634b] font-semibold truncate">
                線上作文批改 · 每週知識與出題
              </p>
            </div>
          </div>

          {/* Account status & menu trigger */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs sm:text-sm font-black text-[#4a2e1b]">
                    {currentUser.name}
                  </p>
                  <p
                    className={`text-[10px] sm:text-xs font-bold ${
                      currentUser.role === 'teacher' ? 'text-[#8c2e1b]' : 'text-[#2d5a3f]'
                    }`}
                  >
                    {currentUser.role === 'teacher' ? '專任教師' : '學生帳號'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs bg-[#e4d7be] hover:bg-[#d8c7a7] text-[#4a2e1b] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold border border-[#b8a686] transition flex items-center space-x-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">登出</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('student-login');
                  setAuthModalOpen(true);
                }}
                className="bg-[#8c2e1b] text-[#fefcf8] hover:bg-[#6f2213] text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold shadow transition flex items-center space-x-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>學生登入</span>
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#4a2e1b] hover:text-[#8c2e1b] focus:outline-none rounded-lg bg-[#e8dec8]/70 border border-[#b8a686]"
              aria-label="打開選單"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* 手機版下拉選單 Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#f7f4ed] border-b-2 border-[#b8a686] px-4 pt-2 pb-4 space-y-1.5 shadow-lg">
            <button
              onClick={() => switchNav('home')}
              className={`w-full text-left py-2.5 px-3 font-bold rounded-lg flex items-center space-x-2.5 text-sm transition ${
                currentTab === 'home' ? 'bg-[#e4d7be] text-[#8c2e1b]' : 'text-[#4a2e1b]'
              }`}
            >
              <Scroll className="w-4 h-4 text-[#8c2e1b]" />
              <span>平台公告</span>
            </button>
            <button
              onClick={() => switchNav('write')}
              className={`w-full text-left py-2.5 px-3 font-bold rounded-lg flex items-center space-x-2.5 text-sm transition ${
                currentTab === 'write' ? 'bg-[#e4d7be] text-[#8c2e1b]' : 'text-[#4a2e1b]'
              }`}
            >
              <PenTool className="w-4 h-4 text-[#8c2e1b]" />
              <span>作文寫作區</span>
            </button>
            <button
              onClick={() => switchNav('articles')}
              className={`w-full text-left py-2.5 px-3 font-bold rounded-lg flex items-center space-x-2.5 text-sm transition ${
                currentTab === 'articles' ? 'bg-[#e4d7be] text-[#8c2e1b]' : 'text-[#4a2e1b]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#8c2e1b]" />
              <span>知識文章庫</span>
            </button>
            <button
              onClick={() => switchNav('quizzes')}
              className={`w-full text-left py-2.5 px-3 font-bold rounded-lg flex items-center space-x-2.5 text-sm transition ${
                currentTab === 'quizzes' ? 'bg-[#e4d7be] text-[#8c2e1b]' : 'text-[#4a2e1b]'
              }`}
            >
              <FileQuestion className="w-4 h-4 text-[#8c2e1b]" />
              <span>線上閱讀測驗</span>
            </button>

            {/* Student specific menu */}
            {currentUser?.role === 'student' && (
              <button
                onClick={() => switchNav('records')}
                className={`w-full text-left py-2.5 px-3 font-bold rounded-lg flex items-center space-x-2.5 text-sm transition ${
                  currentTab === 'records' ? 'bg-[#e4d7be] text-[#8c2e1b]' : 'text-[#4a2e1b]'
                }`}
              >
                <Clock className="w-4 h-4 text-[#8c2e1b]" />
                <span>個人作業紀錄</span>
              </button>
            )}

            {/* Teacher specific menu */}
            {currentUser?.role === 'teacher' && (
              <>
                <div className="pt-2 border-t border-[#d8caa7] text-xs font-bold text-[#8c2e1b] px-3">
                  教師管理後台
                </div>
                <button
                  onClick={() => switchNav('teacher')}
                  className={`w-full text-left py-2.5 px-3 font-bold rounded-lg flex items-center space-x-2.5 text-sm transition ${
                    currentTab === 'teacher' ? 'bg-[#e4d7be] text-[#8c2e1b]' : 'text-[#8c2e1b]'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>作文批改中心</span>
                </button>
                <button
                  onClick={() => switchNav('manage-articles')}
                  className={`w-full text-left py-2.5 px-3 font-bold rounded-lg flex items-center space-x-2.5 text-sm transition ${
                    currentTab === 'manage-articles' ? 'bg-[#e4d7be] text-[#8c2e1b]' : 'text-[#8c2e1b]'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>文章管理與刪除</span>
                </button>
                <button
                  onClick={() => switchNav('manage-quizzes')}
                  className={`w-full text-left py-2.5 px-3 font-bold rounded-lg flex items-center space-x-2.5 text-sm transition ${
                    currentTab === 'manage-quizzes' ? 'bg-[#e4d7be] text-[#8c2e1b]' : 'text-[#8c2e1b]'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>發布新測驗</span>
                </button>
                <button
                  onClick={() => switchNav('quotes')}
                  className={`w-full text-left py-2.5 px-3 font-bold rounded-lg flex items-center space-x-2.5 text-sm transition ${
                    currentTab === 'quotes' ? 'bg-[#e4d7be] text-[#8c2e1b]' : 'text-[#8c2e1b]'
                  }`}
                >
                  <Quote className="w-4 h-4" />
                  <span>每日名言發布</span>
                </button>
                <button
                  onClick={() => switchNav('manage-topics')}
                  className={`w-full text-left py-2.5 px-3 font-bold rounded-lg flex items-center space-x-2.5 text-sm transition ${
                    currentTab === 'manage-topics' ? 'bg-[#e4d7be] text-[#8c2e1b]' : 'text-[#8c2e1b]'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>發布題目</span>
                </button>
                <button
                  onClick={() => switchNav('students')}
                  className={`w-full text-left py-2.5 px-3 font-bold rounded-lg flex items-center space-x-2.5 text-sm transition ${
                    currentTab === 'students' ? 'bg-[#e4d7be] text-[#8c2e1b]' : 'text-[#8c2e1b]'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>學生名冊</span>
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* 主要內容區 */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 flex-1 w-full">
        {/* 未登入提示 Banner */}
        {!currentUser && (
          <div className="ancient-card p-4 sm:p-6 rounded-2xl mb-6 sm:mb-8 border-l-6 sm:border-l-8 border-l-[#8c2e1b] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition shadow-sm">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-2.5 rounded-xl bg-[#8c2e1b]/10 text-[#8c2e1b] flex-shrink-0">
                <Scroll className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <p className="font-bold text-sm sm:text-base md:text-lg text-[#4a2e1b]">
                  歡迎使用學習平台
                </p>
                <p className="text-xs sm:text-sm text-[#7c634b]">
                  學生請先登入或註冊；老師請由頁尾專屬通道登入管理後台。
                </p>
              </div>
            </div>
            <div className="flex space-x-2 sm:space-x-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  setAuthMode('student-login');
                  setAuthModalOpen(true);
                }}
                className="flex-1 sm:flex-none bg-[#8c2e1b] hover:bg-[#6f2213] text-[#fefcf8] text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl font-bold transition shadow text-center"
              >
                學生登入
              </button>
              <button
                onClick={() => {
                  setAuthMode('student-register');
                  setAuthModalOpen(true);
                }}
                className="flex-1 sm:flex-none bg-[#e4d7be] hover:bg-[#d8c7a7] text-[#4a2e1b] text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl font-bold transition border border-[#b8a686] text-center"
              >
                註冊帳號
              </button>
            </div>
          </div>
        )}

        {/* 桌機版功能分頁選單 */}
        <div className="hidden lg:flex border-b-2 border-[#d8caa7] mb-8 space-x-6 text-base font-bold overflow-x-auto">
          <button
            onClick={() => switchNav('home')}
            className={`pb-3 px-1 flex items-center space-x-2 whitespace-nowrap transition-all ${
              currentTab === 'home'
                ? 'border-b-3 border-[#8c2e1b] text-[#8c2e1b]'
                : 'text-[#7c634b] hover:text-[#4a2e1b]'
            }`}
          >
            <Scroll className="w-4 h-4" />
            <span>平台公告</span>
          </button>
          <button
            onClick={() => switchNav('write')}
            className={`pb-3 px-1 flex items-center space-x-2 whitespace-nowrap transition-all ${
              currentTab === 'write'
                ? 'border-b-3 border-[#8c2e1b] text-[#8c2e1b]'
                : 'text-[#7c634b] hover:text-[#4a2e1b]'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>作文寫作區</span>
          </button>
          <button
            onClick={() => switchNav('articles')}
            className={`pb-3 px-1 flex items-center space-x-2 whitespace-nowrap transition-all ${
              currentTab === 'articles'
                ? 'border-b-3 border-[#8c2e1b] text-[#8c2e1b]'
                : 'text-[#7c634b] hover:text-[#4a2e1b]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>知識文章庫</span>
          </button>
          <button
            onClick={() => switchNav('quizzes')}
            className={`pb-3 px-1 flex items-center space-x-2 whitespace-nowrap transition-all ${
              currentTab === 'quizzes'
                ? 'border-b-3 border-[#8c2e1b] text-[#8c2e1b]'
                : 'text-[#7c634b] hover:text-[#4a2e1b]'
            }`}
          >
            <FileQuestion className="w-4 h-4" />
            <span>線上閱讀測驗</span>
          </button>

          {/* Student Tab */}
          {currentUser?.role === 'student' && (
            <button
              onClick={() => switchNav('records')}
              className={`pb-3 px-1 flex items-center space-x-2 whitespace-nowrap transition-all ${
                currentTab === 'records'
                  ? 'border-b-3 border-[#8c2e1b] text-[#8c2e1b]'
                  : 'text-[#7c634b] hover:text-[#4a2e1b]'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>個人作業紀錄</span>
            </button>
          )}

          {/* Teacher Tabs */}
          {currentUser?.role === 'teacher' && (
            <>
              <button
                onClick={() => switchNav('teacher')}
                className={`pb-3 px-1 flex items-center space-x-2 whitespace-nowrap transition-all ${
                  currentTab === 'teacher'
                    ? 'border-b-3 border-[#8c2e1b] text-[#8c2e1b]'
                    : 'text-[#8c2e1b]/80 hover:text-[#8c2e1b]'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>作文批改中心</span>
              </button>
              <button
                onClick={() => switchNav('manage-articles')}
                className={`pb-3 px-1 flex items-center space-x-2 whitespace-nowrap transition-all ${
                  currentTab === 'manage-articles'
                    ? 'border-b-3 border-[#8c2e1b] text-[#8c2e1b]'
                    : 'text-[#8c2e1b]/80 hover:text-[#8c2e1b]'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>文章管理</span>
              </button>
              <button
                onClick={() => switchNav('manage-quizzes')}
                className={`pb-3 px-1 flex items-center space-x-2 whitespace-nowrap transition-all ${
                  currentTab === 'manage-quizzes'
                    ? 'border-b-3 border-[#8c2e1b] text-[#8c2e1b]'
                    : 'text-[#8c2e1b]/80 hover:text-[#8c2e1b]'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>發布新測驗</span>
              </button>
              <button
                onClick={() => switchNav('quotes')}
                className={`pb-3 px-1 flex items-center space-x-2 whitespace-nowrap transition-all ${
                  currentTab === 'quotes'
                    ? 'border-b-3 border-[#8c2e1b] text-[#8c2e1b]'
                    : 'text-[#8c2e1b]/80 hover:text-[#8c2e1b]'
                }`}
              >
                <Quote className="w-4 h-4" />
                <span>每日名言發布</span>
              </button>
              <button
                onClick={() => switchNav('manage-topics')}
                className={`pb-3 px-1 flex items-center space-x-2 whitespace-nowrap transition-all ${
                  currentTab === 'manage-topics'
                    ? 'border-b-3 border-[#8c2e1b] text-[#8c2e1b]'
                    : 'text-[#8c2e1b]/80 hover:text-[#8c2e1b]'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>發布題目</span>
              </button>
              <button
                onClick={() => switchNav('students')}
                className={`pb-3 px-1 flex items-center space-x-2 whitespace-nowrap transition-all ${
                  currentTab === 'students'
                    ? 'border-b-3 border-[#8c2e1b] text-[#8c2e1b]'
                    : 'text-[#8c2e1b]/80 hover:text-[#8c2e1b]'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>學生名冊</span>
              </button>
            </>
          )}
        </div>

        {/* ----------------- 頁面 1: 首頁 ----------------- */}
        {currentTab === 'home' && (
          <section className="space-y-6 sm:space-y-8 animate-fadeIn">
            {/* 每日名言佳句專區 */}
            <div className="ancient-card p-4 sm:p-6 rounded-2xl border-2 border-[#b8a686] bg-[#fcf8ef] relative overflow-hidden shadow-sm">
              <div className="absolute -right-3 -bottom-3 sm:-right-4 sm:-bottom-4 text-[#e2d9c8]/30 pointer-events-none select-none">
                <Quote className="w-20 h-20 sm:w-24 sm:h-24" />
              </div>
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="bg-[#8c2e1b] text-[#f2ebdc] text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold">
                      每日名言佳句
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#7c634b] font-semibold flex items-center">
                      <Sparkles className="w-3 h-3 mr-1 inline" />
                      wen 老師推薦
                    </span>
                  </div>
                  <blockquote
                    className={`text-sm sm:text-base md:text-lg font-bold text-[#4a2e1b] pt-1 leading-relaxed ${
                      dailyQuote ? '' : 'italic text-[#7c634b]'
                    }`}
                  >
                    {dailyQuote && dailyQuote.trim() !== '' ? `「${dailyQuote}」` : '今日暫無名言佳句'}
                  </blockquote>
                </div>
              </div>
            </div>

            {/* 本週試題主打 Banner */}
            <div className="bg-gradient-to-r from-[#8c2e1b] to-[#5c1c0f] rounded-2xl p-5 sm:p-8 md:p-10 text-[#f7f4ed] shadow-lg border border-[#a8422d]">
              <div className="max-w-3xl space-y-3 sm:space-y-4">
                <span className="bg-[#f2ebdc]/20 text-[#f2ebdc] text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold border border-[#f2ebdc]/30 inline-block">
                  本週試題
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-wide leading-snug">
                  {weeklyTopic ? weeklyTopic.title : '目前尚未發布題目'}
                </h2>
                <p className="text-[#e2d9c8] text-xs sm:text-sm md:text-base leading-relaxed">
                  {weeklyTopic
                    ? weeklyTopic.desc
                    : '老師尚未發布本週作文題目，請稍後再來查看。'}
                </p>
                <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-[#d8caa7]">
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 inline" /> 截止日期：{weeklyTopic ? weeklyTopic.dueDate : '--'}
                  </span>
                  <span className="flex items-center">
                    <UserIcon className="w-3.5 h-3.5 mr-1 inline" /> 出題老師：wen 老師
                  </span>
                </div>
                <div className="pt-2 sm:pt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleStartWriting(weeklyTopic?.id)}
                    className="w-full sm:w-auto justify-center bg-[#f2ebdc] text-[#8c2e1b] hover:bg-white px-6 py-2.5 sm:py-3 rounded-xl font-bold shadow transition flex items-center space-x-2"
                  >
                    <PenTool className="w-4 h-4" />
                    <span>開始寫作</span>
                  </button>
                  <button
                    onClick={() => switchNav('quizzes')}
                    className="w-full sm:w-auto justify-center bg-black/25 hover:bg-black/35 text-[#f2ebdc] px-5 py-2.5 sm:py-3 rounded-xl font-bold border border-white/20 transition flex items-center space-x-2"
                  >
                    <FileQuestion className="w-4 h-4" />
                    <span>線上閱讀測驗 ({quizzes.length})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 歷屆題目列表與每週精選文章 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* 歷屆題目列表 */}
              <div className="ancient-card p-4 sm:p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-base md:text-lg mb-4 text-[#4a2e1b] flex items-center space-x-2 border-b border-[#d8caa7] pb-2">
                    <Scroll className="w-4 h-4 sm:w-5 sm:h-5 text-[#8c2e1b]" />
                    <span>歷屆題目列表</span>
                  </h3>
                  <div className="space-y-3">
                    {topics.length === 0 ? (
                      <p className="text-xs text-[#7c634b] py-4 text-center">
                        目前尚無發布的題目。
                      </p>
                    ) : (
                      topics.map(t => (
                        <div
                          key={t.id}
                          className="p-3 bg-[#f2ebdc] rounded-xl border border-[#b8a686] flex justify-between items-center gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-[#4a2e1b] text-xs sm:text-sm truncate">
                              {t.title}{' '}
                              {t.isWeekly && (
                                <span className="text-[10px] bg-[#8c2e1b] text-white font-bold px-1.5 py-0.5 rounded ml-1">
                                  每週主打
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] sm:text-xs text-[#7c634b] mt-0.5">
                              截止日期：{t.dueDate}
                            </p>
                          </div>
                          <button
                            onClick={() => handleStartWriting(t.id)}
                            className="text-xs bg-[#f7f4ed] border border-[#b8a686] hover:bg-[#e4d7be] text-[#4a2e1b] font-bold px-3 py-1.5 rounded-lg transition flex-shrink-0"
                          >
                            寫作
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* 每週精選文章 */}
              <div className="ancient-card p-4 sm:p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-base md:text-lg mb-4 text-[#4a2e1b] flex items-center space-x-2 border-b border-[#d8caa7] pb-2">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#8c2e1b]" />
                    <span>每週精選文章</span>
                  </h3>
                  <div className="space-y-3">
                    {articles.length === 0 ? (
                      <p className="text-xs text-[#7c634b] py-4 text-center">
                        目前尚無每週精選文章。
                      </p>
                    ) : (
                      articles.slice(0, 3).map(a => (
                        <div
                          key={a.id}
                          onClick={() => setReadingArticle(a)}
                          className="p-3 bg-[#f2ebdc] rounded-xl border border-[#b8a686] flex justify-between items-center cursor-pointer hover:bg-[#ebdcc0] transition gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-[#4a2e1b] text-xs sm:text-sm truncate">
                              {a.title}
                            </p>
                            <p className="text-[10px] sm:text-xs text-[#7c634b]">
                              分類：{a.category}
                            </p>
                          </div>
                          <span className="text-xs text-[#8c2e1b] font-bold flex-shrink-0">
                            閱讀 →
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ----------------- 頁面 2: 作文寫作區 ----------------- */}
        {currentTab === 'write' && (
          <section className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <div className="ancient-card p-4 sm:p-8 rounded-2xl space-y-5 sm:space-y-6">
              <div>
                <label className="block text-xs font-bold text-[#7c634b] uppercase mb-2">
                  選擇要寫作的題目
                </label>
                <select
                  value={selectedTopicId}
                  onChange={e => setSelectedTopicId(e.target.value)}
                  className="w-full border-2 border-[#b8a686] bg-[#f7f4ed] rounded-xl p-3 text-xs sm:text-sm md:text-base font-bold text-[#4a2e1b] outline-none focus:border-[#8c2e1b]"
                >
                  {topics.length === 0 ? (
                    <option value="">尚無可選題目</option>
                  ) : (
                    topics.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.title} {t.isWeekly ? '(每週主打)' : ''}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="bg-[#f2ebdc] p-3 sm:p-4 rounded-xl border border-[#b8a686]">
                <p className="font-bold text-[#4a2e1b] text-xs sm:text-sm mb-1 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-[#8c2e1b] inline" />
                  題目引導說明：
                </p>
                <p className="text-xs sm:text-sm text-[#614935] leading-relaxed">
                  {currentWritingTopic ? currentWritingTopic.desc : '目前尚未發布任何作文題目。'}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-bold text-[#4a2e1b]">
                  作文標題
                </label>
                <input
                  type="text"
                  value={essayTitle}
                  onChange={e => setEssayTitle(e.target.value)}
                  placeholder="請輸入文章標題..."
                  className="w-full border-2 border-[#b8a686] bg-[#f7f4ed] rounded-xl p-3 text-xs sm:text-sm outline-none focus:border-[#8c2e1b] text-[#4a2e1b] font-bold"
                />
              </div>

              {/* 作文內文與動態字數統計 */}
              <div className="space-y-3">
                {/* 標題列與即時字數狀態 */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center space-x-2">
                    <label className="block text-xs sm:text-sm font-bold text-[#4a2e1b]">
                      作文內文
                    </label>
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f2ebdc] text-[#8c2e1b] border border-[#b8a686]">
                      <span className="w-2 h-2 rounded-full bg-[#8c2e1b] animate-pulse"></span>
                      <span>動態即時統計中</span>
                    </span>
                  </div>

                  {/* 即時字數指示 */}
                  <div className="flex items-center space-x-2 text-xs">
                    <span className={`px-2.5 py-0.5 rounded-md font-bold border text-[11px] ${dynamicStats.statusBadgeColor}`}>
                      {dynamicStats.statusLabel}
                    </span>
                    <span className="text-[#7c634b]">
                      實質字數：
                      <strong className="text-sm sm:text-base text-[#8c2e1b] font-black">
                        {dynamicStats.charsNoSpaces}
                      </strong>{' '}
                      字
                    </span>
                  </div>
                </div>

                {/* 動態字數多維度儀表板 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#f2ebdc] p-3 rounded-xl border border-[#b8a686] text-xs">
                  <div className="bg-[#fcfaf5] p-2 rounded-lg border border-[#d8caa7] text-center">
                    <span className="text-[10px] text-[#7c634b] block">中文字數</span>
                    <strong className="text-sm font-bold text-[#4a2e1b]">
                      {dynamicStats.chineseChars}
                    </strong>
                    <span className="text-[10px] text-[#7c634b] ml-0.5">字</span>
                  </div>
                  <div className="bg-[#fcfaf5] p-2 rounded-lg border border-[#d8caa7] text-center">
                    <span className="text-[10px] text-[#7c634b] block">總字符（含符號）</span>
                    <strong className="text-sm font-bold text-[#4a2e1b]">
                      {dynamicStats.totalChars}
                    </strong>
                    <span className="text-[10px] text-[#7c634b] ml-0.5">字</span>
                  </div>
                  <div className="bg-[#fcfaf5] p-2 rounded-lg border border-[#d8caa7] text-center">
                    <span className="text-[10px] text-[#7c634b] block">段落段數</span>
                    <strong className="text-sm font-bold text-[#4a2e1b]">
                      {dynamicStats.paragraphs}
                    </strong>
                    <span className="text-[10px] text-[#7c634b] ml-0.5">段</span>
                  </div>
                  <div className="bg-[#fcfaf5] p-2 rounded-lg border border-[#d8caa7] text-center">
                    <span className="text-[10px] text-[#7c634b] block">預估閱讀時間</span>
                    <strong className="text-sm font-bold text-[#4a2e1b]">
                      ~{dynamicStats.estReadingTimeMinutes}
                    </strong>
                    <span className="text-[10px] text-[#7c634b] ml-0.5">分鐘</span>
                  </div>
                </div>

                {/* 篇幅進度條 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#7c634b]">
                    <span>
                      標準篇幅目標：
                      <strong className="text-[#4a2e1b]">
                        {dynamicStats.charsNoSpaces} / 600~900 字
                      </strong>
                    </span>
                    <span className="font-bold text-[#4a2e1b]">{dynamicStats.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-[#e4d7be] h-2 rounded-full overflow-hidden border border-[#b8a686]">
                    <div
                      className={`h-full transition-all duration-300 ${
                        dynamicStats.charsNoSpaces >= 600 ? 'bg-[#2d5a3f]' : 'bg-[#8c2e1b]'
                      }`}
                      style={{ width: `${dynamicStats.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* 作文編輯框容器 (右下角貼心浮動即時字數統計) */}
                <div className="relative">
                  <textarea
                    rows={12}
                    value={essayContent}
                    onChange={e => setEssayContent(e.target.value)}
                    placeholder="由此揮毫鋪陳，融情入景，抒寫胸臆..."
                    className="w-full border-2 border-[#b8a686] bg-[#f7f4ed] rounded-xl p-3 sm:p-4 outline-none focus:border-[#8c2e1b] leading-relaxed text-xs sm:text-sm md:text-base text-[#3b2c21] pb-8 font-serif"
                  />
                  <div className="absolute right-3 bottom-3 pointer-events-none select-none text-[11px] bg-[#f2ebdc]/90 backdrop-blur-xs px-2.5 py-0.5 rounded-md border border-[#b8a686] text-[#7c634b] font-bold shadow-xs">
                    即時字數：<span className="text-[#8c2e1b] font-black">{dynamicStats.charsNoSpaces}</span> 字
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#d8caa7]">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="w-full sm:w-auto bg-[#e4d7be] hover:bg-[#d8c7a7] text-[#4a2e1b] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition border border-[#b8a686]"
                >
                  儲存草稿
                </button>
                <button
                  type="button"
                  onClick={handleSubmitEssay}
                  className="w-full sm:w-auto bg-[#8c2e1b] hover:bg-[#6f2213] text-[#fefcf8] px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow transition"
                >
                  正式呈交作業
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ----------------- 頁面 3: 知識文章庫 ----------------- */}
        {currentTab === 'articles' && (
          <section className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ancient-card p-4 rounded-xl">
              <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setArticleFilter('all')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                    articleFilter === 'all'
                      ? 'bg-[#8c2e1b] text-white'
                      : 'bg-[#e4d7be] text-[#4a2e1b] hover:bg-[#d8c7a7]'
                  }`}
                >
                  全部文章
                </button>
                <button
                  onClick={() => setArticleFilter('bookmarked')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold rounded-lg transition whitespace-nowrap flex items-center space-x-1 ${
                    articleFilter === 'bookmarked'
                      ? 'bg-[#8c2e1b] text-white'
                      : 'bg-[#e4d7be] text-[#4a2e1b] hover:bg-[#d8c7a7]'
                  }`}
                >
                  <span>⭐ 收藏清單</span>
                </button>
                <button
                  onClick={() => setArticleFilter('flagged')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold rounded-lg transition whitespace-nowrap flex items-center space-x-1 ${
                    articleFilter === 'flagged'
                      ? 'bg-[#8c2e1b] text-white'
                      : 'bg-[#e4d7be] text-[#4a2e1b] hover:bg-[#d8c7a7]'
                  }`}
                >
                  <span>🚩 重要標記</span>
                </button>
              </div>

              {currentUser?.role === 'teacher' && (
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={() => switchNav('manage-articles')}
                    className="flex-1 sm:flex-none justify-center bg-[#e4d7be] hover:bg-[#d8c7a7] text-[#4a2e1b] px-3.5 py-2 rounded-lg text-xs font-bold transition border border-[#b8a686] flex items-center space-x-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>文章管理與刪除</span>
                  </button>
                  <button
                    onClick={() => setArticleModalOpen(true)}
                    className="flex-1 sm:flex-none justify-center bg-[#2d5a3f] hover:bg-[#20432f] text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>發布知識文章</span>
                  </button>
                </div>
              )}
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.length === 0 ? (
                <div className="col-span-full ancient-card p-8 rounded-2xl text-center text-[#7c634b]">
                  <p className="text-xs sm:text-sm py-4">目前尚無發布的文章。</p>
                  {currentUser?.role === 'teacher' && (
                    <button
                      onClick={() => setArticleModalOpen(true)}
                      className="mt-2 text-xs bg-[#2d5a3f] text-white px-4 py-2 rounded-lg font-bold"
                    >
                      立即發布首篇文章
                    </button>
                  )}
                </div>
              ) : (
                filteredArticles.map(a => (
                  <div
                    key={a.id}
                    className="ancient-card p-4 sm:p-5 rounded-2xl flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs bg-[#e4d7be] text-[#4a2e1b] font-bold px-2.5 py-1 rounded-md border border-[#b8a686]">
                          {a.category}
                        </span>
                        <div className="flex items-center space-x-2 text-stone-400">
                          <button
                            onClick={e => toggleBookmark(a.id, e)}
                            className={`hover:text-amber-600 transition ${
                              a.bookmarked ? 'text-amber-600' : ''
                            }`}
                          >
                            <Star className={`w-4 h-4 ${a.bookmarked ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={e => toggleFlag(a.id, e)}
                            className={`hover:text-red-700 transition ${
                              a.flagged ? 'text-red-700' : ''
                            }`}
                          >
                            <Flag className={`w-4 h-4 ${a.flagged ? 'fill-current' : ''}`} />
                          </button>
                          {currentUser?.role === 'teacher' && (
                            <button
                              onClick={e => handleDeleteArticle(a.id, e)}
                              className="text-[#8c2e1b] hover:text-red-700 p-1 transition"
                              title="刪除此文章"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-[#4a2e1b] mb-2">
                        {a.title}
                      </h4>
                      <p className="text-xs text-[#614935] line-clamp-3 leading-relaxed">
                        {a.content}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#d8caa7] flex justify-between items-center">
                      <span className="text-[10px] text-[#7c634b]">
                        {a.author || 'wen 老師'} · {a.date}
                      </span>
                      <button
                        onClick={() => setReadingArticle(a)}
                        className="text-xs bg-[#e4d7be] hover:bg-[#d8c7a7] text-[#4a2e1b] font-bold px-3 py-1.5 rounded-lg border border-[#b8a686]"
                      >
                        閱讀全文
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* ----------------- 頁面 4: 線上閱讀測驗區 ----------------- */}
        {currentTab === 'quizzes' && (
          <section className="space-y-6 animate-fadeIn">
            <div className="ancient-card p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-base sm:text-lg text-[#4a2e1b] flex items-center space-x-2">
                  <FileQuestion className="w-5 h-5 text-[#8c2e1b]" />
                  <span>線上閱讀理解測驗專區</span>
                </h3>
                <p className="text-xs text-[#7c634b] mt-0.5">
                  測試文意理解、詞彙修辭與文學常識，完成後即時查看分析與題解。
                </p>
              </div>

              {currentUser?.role === 'teacher' && (
                <button
                  onClick={() => switchNav('manage-quizzes')}
                  className="bg-[#8c2e1b] hover:bg-[#6f2213] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>發布新測驗</span>
                </button>
              )}
            </div>

            {/* Quizzes List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quizzes.length === 0 ? (
                <div className="col-span-full ancient-card p-8 rounded-2xl text-center text-[#7c634b]">
                  <FileQuestion className="w-12 h-12 text-[#b8a686] mx-auto mb-2" />
                  <p className="text-xs sm:text-sm py-2">目前尚無發布的測驗。</p>
                  <p className="text-xs text-[#7c634b]">
                    老師可在教師後台點選「發布新測驗」為學生設計閱讀測驗試卷。
                  </p>
                  {currentUser?.role === 'teacher' && (
                    <button
                      onClick={() => switchNav('manage-quizzes')}
                      className="mt-4 bg-[#8c2e1b] text-white px-5 py-2 rounded-xl text-xs font-bold"
                    >
                      前往發布測驗
                    </button>
                  )}
                </div>
              ) : (
                quizzes.map(quiz => {
                  const studentAttempt = myQuizAttempts.find(a => a.quizId === quiz.id);
                  const totalQuizPoints = quiz.questions.reduce((s, q) => s + (q.points || 10), 0);

                  return (
                    <div
                      key={quiz.id}
                      className="ancient-card p-5 sm:p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:shadow-md transition border border-[#d8caa7]"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[11px] bg-[#e4d7be] text-[#4a2e1b] font-bold px-2.5 py-1 rounded-md border border-[#b8a686]">
                            共 {quiz.questions.length} 題 · 滿分 {totalQuizPoints} 分
                          </span>
                          <span className="text-[10px] text-[#7c634b]">
                            截止：{quiz.dueDate}
                          </span>
                        </div>

                        <h4 className="font-bold text-base sm:text-lg text-[#4a2e1b]">
                          {quiz.title}
                        </h4>

                        <p className="text-xs text-[#614935] line-clamp-2 leading-relaxed">
                          {quiz.description}
                        </p>

                        {quiz.passage && (
                          <div className="bg-[#f2ebdc] p-3 rounded-xl border border-[#b8a686] text-xs text-[#523d2c] line-clamp-2 italic">
                            閱讀引文：{quiz.passage}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-[#d8caa7] flex justify-between items-center">
                        <div>
                          {studentAttempt ? (
                            <span className="text-xs font-bold text-[#2d5a3f] flex items-center space-x-1">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>
                                已完成：{studentAttempt.score} / {studentAttempt.totalPoints} 分
                              </span>
                            </span>
                          ) : (
                            <span className="text-xs text-[#7c634b]">尚未作答</span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          {currentUser?.role === 'teacher' && (
                            <button
                              onClick={() => handleDeleteQuiz(quiz.id)}
                              className="text-xs text-[#8c2e1b] hover:text-red-700 font-bold p-1.5"
                              title="刪除測驗"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleStartQuiz(quiz)}
                            className="text-xs bg-[#8c2e1b] hover:bg-[#6f2213] text-white font-bold px-4 py-2 rounded-xl transition shadow"
                          >
                            {studentAttempt ? '重新測驗' : '開始測驗'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        )}

        {/* ----------------- 頁面 5: 老師發布測驗後台 (manage-quizzes) ----------------- */}
        {currentTab === 'manage-quizzes' && currentUser?.role === 'teacher' && (
          <section className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
            <div className="ancient-card p-4 sm:p-8 rounded-2xl space-y-6">
              <div className="border-b border-[#d8caa7] pb-3 flex justify-between items-center">
                <h3 className="font-bold text-base sm:text-lg text-[#4a2e1b] flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-[#8c2e1b]" />
                  <span>發布線上閱讀測驗試卷</span>
                </h3>
                <button
                  onClick={() => switchNav('quizzes')}
                  className="text-xs text-[#8c2e1b] hover:underline font-bold"
                >
                  返回測驗列表
                </button>
              </div>

              <form onSubmit={handlePublishQuiz} className="space-y-5 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold mb-1 text-[#4a2e1b]">測驗名稱 / 主題</label>
                  <input
                    type="text"
                    required
                    value={newQuizTitle}
                    onChange={e => setNewQuizTitle(e.target.value)}
                    placeholder="例如：《師說》文言文閱讀測驗 / 修辭法綜合辨析"
                    className="w-full border-2 border-[#b8a686] bg-[#f7f4ed] rounded-xl p-3 outline-none focus:border-[#8c2e1b] font-bold text-[#4a2e1b]"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-[#4a2e1b]">測驗說明</label>
                  <input
                    type="text"
                    value={newQuizDesc}
                    onChange={e => setNewQuizDesc(e.target.value)}
                    placeholder="例如：請細讀文段，選出最適切的答案，每題配分標註於題旁。"
                    className="w-full border-2 border-[#b8a686] bg-[#f7f4ed] rounded-xl p-3 outline-none focus:border-[#8c2e1b] text-[#4a2e1b]"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-[#4a2e1b]">
                    閱讀文章材料 / 段落引文（選填，若有材料則學生作答時可對照）
                  </label>
                  <textarea
                    rows={4}
                    value={newQuizPassage}
                    onChange={e => setNewQuizPassage(e.target.value)}
                    placeholder="可貼入文言文或白話文文章段落..."
                    className="w-full border-2 border-[#b8a686] bg-[#f7f4ed] rounded-xl p-3 outline-none focus:border-[#8c2e1b] text-[#4a2e1b]"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-[#4a2e1b]">截止日期</label>
                  <input
                    type="date"
                    required
                    value={newQuizDueDate}
                    onChange={e => setNewQuizDueDate(e.target.value)}
                    className="w-full border-2 border-[#b8a686] bg-[#f7f4ed] rounded-xl p-3 outline-none focus:border-[#8c2e1b] text-[#4a2e1b]"
                  />
                </div>

                {/* Question List Builder */}
                <div className="space-y-4 pt-3 border-t border-[#d8caa7]">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm text-[#4a2e1b]">
                      測驗試題編輯（共 {newQuizQuestions.length} 題）
                    </h4>
                    <button
                      type="button"
                      onClick={addQuestionField}
                      className="bg-[#2d5a3f] hover:bg-[#20432f] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>增加題目</span>
                    </button>
                  </div>

                  {newQuizQuestions.map((q, qIndex) => (
                    <div
                      key={q.id || qIndex}
                      className="p-4 bg-[#f2ebdc] rounded-xl border border-[#b8a686] space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs bg-[#8c2e1b] text-white px-2 py-0.5 rounded">
                          第 {qIndex + 1} 題
                        </span>
                        <div className="flex items-center space-x-2">
                          <label className="text-xs text-[#7c634b]">配分：</label>
                          <input
                            type="number"
                            min={1}
                            max={100}
                            value={q.points}
                            onChange={e =>
                              updateQuestionField(qIndex, 'points', Number(e.target.value))
                            }
                            className="w-16 border border-[#b8a686] bg-[#f7f4ed] px-2 py-0.5 rounded text-xs text-center font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => removeQuestionField(qIndex)}
                            className="text-[#8c2e1b] hover:text-red-700 ml-2 text-xs font-bold"
                            title="刪除此題"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Question Text */}
                      <div>
                        <label className="block text-xs font-bold text-[#4a2e1b] mb-1">
                          題目題幹
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={q.question}
                          onChange={e => updateQuestionField(qIndex, 'question', e.target.value)}
                          placeholder="例如：下列關於文章中「不恥下問」的涵義，何者最適切？"
                          className="w-full border border-[#b8a686] bg-[#f7f4ed] p-2 rounded-lg text-xs outline-none"
                        />
                      </div>

                      {/* 4 Options */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-[#4a2e1b]">
                          選項設定（請勾選單選正確答案）：
                        </label>
                        {['A', 'B', 'C', 'D'].map((letter, optIndex) => (
                          <div key={optIndex} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`correct_${qIndex}`}
                              checked={q.correctAnswerIndex === optIndex}
                              onChange={() =>
                                updateQuestionField(qIndex, 'correctAnswerIndex', optIndex)
                              }
                              className="accent-[#8c2e1b] w-4 h-4 cursor-pointer"
                              title="設為正確答案"
                            />
                            <span className="font-bold text-xs w-4">{letter}.</span>
                            <input
                              type="text"
                              required
                              value={q.options[optIndex] || ''}
                              onChange={e => updateOptionText(qIndex, optIndex, e.target.value)}
                              placeholder={`選項 ${letter} 內容...`}
                              className="flex-1 border border-[#b8a686] bg-[#f7f4ed] p-1.5 rounded-lg text-xs outline-none"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Explanation */}
                      <div>
                        <label className="block text-xs font-bold text-[#7c634b] mb-1">
                          題目題解與解析說明（交卷後學生可見）
                        </label>
                        <input
                          type="text"
                          value={q.explanation || ''}
                          onChange={e => updateQuestionField(qIndex, 'explanation', e.target.value)}
                          placeholder="例如：選 B。此處「不恥下問」指不以向地位學問不如自己的人請教為恥。"
                          className="w-full border border-[#b8a686] bg-[#f7f4ed] p-1.5 rounded-lg text-xs outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#d8caa7] flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-[#8c2e1b] hover:bg-[#6f2213] text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow transition"
                  >
                    正式發布測驗
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* ----------------- 頁面 6: 老師文章管理與刪除 (manage-articles) ----------------- */}
        {currentTab === 'manage-articles' && currentUser?.role === 'teacher' && (
          <section className="space-y-6 animate-fadeIn">
            <div className="ancient-card p-4 sm:p-6 rounded-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 border-b border-[#d8caa7] pb-3">
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-[#4a2e1b] flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-[#8c2e1b]" />
                    <span>文章管理與刪除中心</span>
                  </h3>
                  <p className="text-xs text-[#7c634b]">
                    在此統一檢視您發布的知識文章，並可直接執行刪除操作。
                  </p>
                </div>
                <button
                  onClick={() => setArticleModalOpen(true)}
                  className="bg-[#2d5a3f] hover:bg-[#20432f] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>發布新文章</span>
                </button>
              </div>

              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <table className="w-full text-left text-xs sm:text-sm text-[#4a2e1b] min-w-[550px]">
                  <thead className="bg-[#f2ebdc] text-[#7c634b] uppercase text-[10px] sm:text-xs">
                    <tr>
                      <th className="p-3">文章標題</th>
                      <th className="p-3">分類</th>
                      <th className="p-3">發布日期</th>
                      <th className="p-3">字數</th>
                      <th className="p-3 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d8caa7]">
                    {articles.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-[#7c634b]">
                          目前尚無發布的文章。
                        </td>
                      </tr>
                    ) : (
                      articles.map(a => (
                        <tr key={a.id} className="hover:bg-[#f2ebdc] transition">
                          <td className="p-3 font-bold text-[#4a2e1b]">{a.title}</td>
                          <td className="p-3">
                            <span className="bg-[#e4d7be] px-2 py-0.5 rounded text-[11px] font-bold">
                              {a.category}
                            </span>
                          </td>
                          <td className="p-3 text-xs text-[#7c634b]">{a.date}</td>
                          <td className="p-3 text-xs text-[#7c634b]">{a.content.length} 字</td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => setReadingArticle(a)}
                              className="text-xs bg-[#e4d7be] hover:bg-[#d8c7a7] text-[#4a2e1b] font-bold px-2.5 py-1 rounded"
                            >
                              檢視
                            </button>
                            <button
                              onClick={e => handleDeleteArticle(a.id, e)}
                              className="text-xs bg-[#8c2e1b] hover:bg-[#6f2213] text-white font-bold px-2.5 py-1 rounded shadow-sm inline-flex items-center space-x-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>刪除文章</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ----------------- 頁面 7: 學生個人作業紀錄 ----------------- */}
        {currentTab === 'records' && (
          <section className="space-y-6 animate-fadeIn">
            <div className="ancient-card p-4 sm:p-6 rounded-2xl">
              <h3 className="font-bold text-base sm:text-lg mb-4 text-[#4a2e1b] flex items-center space-x-2 border-b border-[#d8caa7] pb-3">
                <Clock className="w-5 h-5 text-[#8c2e1b]" />
                <span>個人作業呈交與批閱記錄</span>
              </h3>
              <div className="space-y-4">
                {mySubmissions.length === 0 ? (
                  <p className="text-xs sm:text-sm text-[#7c634b] py-6 text-center">
                    目前尚無作文呈交記錄。
                  </p>
                ) : (
                  mySubmissions.map(s => (
                    <div
                      key={s.id}
                      className="border border-[#b8a686] rounded-xl p-3 sm:p-4 bg-[#f2ebdc] space-y-2 sm:space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-0">
                        <div>
                          <span className="text-xs font-bold text-[#8c2e1b]">
                            [{s.topicTitle}]
                          </span>
                          <h4 className="font-bold text-sm sm:text-base text-[#4a2e1b]">
                            {s.essayTitle}
                          </h4>
                          <p className="text-[10px] sm:text-xs text-[#7c634b]">
                            呈交日期：{s.date}
                          </p>
                        </div>
                        <div>
                          {s.status === 'graded' ? (
                            <span className="bg-[#2d5a3f] text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full">
                              已批閱: {s.score}分 ({s.level})
                            </span>
                          ) : (
                            <span className="bg-[#8c2e1b] text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full">
                              待 wen 老師批閱
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-[#614935] line-clamp-2 leading-relaxed">
                        {s.content}
                      </p>
                      {s.status === 'graded' && (
                        <div className="bg-[#f7f4ed] p-2.5 sm:p-3 rounded-lg border border-[#b8a686] text-xs text-[#4a2e1b]">
                          <p className="font-bold text-[#8c2e1b] mb-1">wen 老師講評：</p>
                          <p>{s.feedback || '文筆流暢，立意深遠！'}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {/* ----------------- 頁面 8: 老師批改中心 ----------------- */}
        {currentTab === 'teacher' && (
          <section className="space-y-6 animate-fadeIn">
            <div className="ancient-card p-4 sm:p-6 rounded-2xl">
              <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-[#4a2e1b] flex items-center space-x-2 border-b border-[#d8caa7] pb-3">
                <Award className="w-5 h-5 text-[#8c2e1b]" />
                <span>學生作文呈交清單</span>
              </h3>
              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <table className="w-full text-left text-xs sm:text-sm text-[#4a2e1b] min-w-[600px]">
                  <thead className="bg-[#f2ebdc] text-[#7c634b] uppercase text-[10px] sm:text-xs">
                    <tr>
                      <th className="p-3">學生姓名</th>
                      <th className="p-3">題目</th>
                      <th className="p-3">呈交日期</th>
                      <th className="p-3">狀態</th>
                      <th className="p-3">得分 / 等級</th>
                      <th className="p-3 text-right">批閱操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d8caa7]">
                    {submissions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-[#7c634b] text-xs sm:text-sm">
                          目前尚無學生呈交作文。
                        </td>
                      </tr>
                    ) : (
                      submissions.map(s => (
                        <tr key={s.id} className="hover:bg-[#f2ebdc] transition">
                          <td className="p-3 font-bold text-[#4a2e1b]">{s.studentName}</td>
                          <td className="p-3">{s.topicTitle}</td>
                          <td className="p-3 text-xs text-[#7c634b]">{s.date}</td>
                          <td className="p-3">
                            {s.status === 'graded' ? (
                              <span className="text-[10px] sm:text-xs bg-[#2d5a3f] text-white px-2 py-0.5 rounded font-bold">
                                已批閱
                              </span>
                            ) : (
                              <span className="text-[10px] sm:text-xs bg-[#8c2e1b] text-white px-2 py-0.5 rounded font-bold">
                                待批閱
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-bold">
                            {s.score !== null ? `${s.score}分 (${s.level})` : '--'}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => openGradeModal(s)}
                              className="text-xs bg-[#8c2e1b] text-white hover:bg-[#6f2213] font-bold px-3 py-1.5 rounded-lg shadow transition"
                            >
                              {s.status === 'graded' ? '重審批閱' : '開始批閱'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ----------------- 頁面 9: 老師每日名言管理 ----------------- */}
        {currentTab === 'quotes' && (
          <section className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
            <div className="ancient-card p-4 sm:p-8 rounded-2xl space-y-6">
              <h3 className="font-bold text-base sm:text-lg text-[#4a2e1b] border-b border-[#d8caa7] pb-3 flex items-center space-x-2">
                <Quote className="w-5 h-5 text-[#8c2e1b]" />
                <span>發布首頁「每日名言佳句」</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#7c634b] mb-1">
                    今日名言佳句內容
                  </label>
                  <textarea
                    rows={4}
                    value={quoteInput}
                    onChange={e => setQuoteInput(e.target.value)}
                    placeholder="例如：長風破浪會有時，直掛雲帆濟滄海。—— 李白"
                    className="w-full border-2 border-[#b8a686] bg-[#f7f4ed] rounded-xl p-3 text-xs sm:text-sm outline-none focus:border-[#8c2e1b] text-[#4a2e1b]"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleUpdateDailyQuote}
                    className="w-full sm:w-auto bg-[#8c2e1b] hover:bg-[#6f2213] text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow"
                  >
                    更新首頁名言佳句
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ----------------- 頁面 10: 老師發布題目 ----------------- */}
        {currentTab === 'manage-topics' && (
          <section className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
            <div className="ancient-card p-4 sm:p-8 rounded-2xl space-y-6">
              <h3 className="font-bold text-base sm:text-lg text-[#4a2e1b] border-b border-[#d8caa7] pb-3 flex items-center space-x-2">
                <Plus className="w-5 h-5 text-[#8c2e1b]" />
                <span>發布每週作文題目</span>
              </h3>
              <form onSubmit={handlePublishTopic} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold mb-1 text-[#4a2e1b]">作文題目</label>
                  <input
                    type="text"
                    required
                    value={newTopicTitle}
                    onChange={e => setNewTopicTitle(e.target.value)}
                    placeholder="例如：記一次難忘的遊歷"
                    className="w-full border-2 border-[#b8a686] bg-[#f7f4ed] rounded-xl p-3 outline-none focus:border-[#8c2e1b] text-[#4a2e1b]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-[#4a2e1b]">題目引導說明</label>
                  <textarea
                    rows={4}
                    required
                    value={newTopicDesc}
                    onChange={e => setNewTopicDesc(e.target.value)}
                    placeholder="請輸入對學生作文的引導要求與思考方向..."
                    className="w-full border-2 border-[#b8a686] bg-[#f7f4ed] rounded-xl p-3 outline-none focus:border-[#8c2e1b] text-[#4a2e1b]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-[#4a2e1b]">截止日期</label>
                  <input
                    type="date"
                    required
                    value={newTopicDueDate}
                    onChange={e => setNewTopicDueDate(e.target.value)}
                    className="w-full border-2 border-[#b8a686] bg-[#f7f4ed] rounded-xl p-3 outline-none focus:border-[#8c2e1b] text-[#4a2e1b]"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="newTopicIsWeekly"
                    checked={newTopicIsWeekly}
                    onChange={e => setNewTopicIsWeekly(e.target.checked)}
                    className="w-4 h-4 text-[#8c2e1b] accent-[#8c2e1b] rounded cursor-pointer"
                  />
                  <label
                    htmlFor="newTopicIsWeekly"
                    className="font-bold text-[#4a2e1b] cursor-pointer"
                  >
                    設為本週首頁主打題目
                  </label>
                </div>
                <div className="pt-4 border-t border-[#d8caa7] flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-[#8c2e1b] hover:bg-[#6f2213] text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow"
                  >
                    正式發布題目
                  </button>
                </div>
              </form>

              {topics.length > 0 && (
                <div className="border-t border-[#d8caa7] pt-4 space-y-3">
                  <h4 className="font-bold text-xs sm:text-sm text-[#4a2e1b]">已發布題目列表</h4>
                  <div className="space-y-2">
                    {topics.map(t => (
                      <div
                        key={t.id}
                        className="p-3 bg-[#f2ebdc] rounded-xl border border-[#b8a686] flex justify-between items-center text-xs"
                      >
                        <div>
                          <p className="font-bold text-[#4a2e1b]">
                            {t.title}{' '}
                            {t.isWeekly && (
                              <span className="text-[10px] bg-[#8c2e1b] text-white px-1.5 py-0.5 rounded font-bold">
                                主打
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-[#7c634b]">截止日期：{t.dueDate}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteTopic(t.id)}
                          className="text-[#8c2e1b] hover:text-red-700 p-1"
                          title="刪除題目"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ----------------- 頁面 11: 學生名冊管理 ----------------- */}
        {currentTab === 'students' && (
          <section className="space-y-6 animate-fadeIn">
            <div className="ancient-card p-4 sm:p-6 rounded-2xl">
              <h3 className="font-bold text-base sm:text-lg text-[#4a2e1b] mb-4 sm:mb-6 border-b border-[#d8caa7] pb-3 flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#8c2e1b]" />
                <span>全班學生名冊與學習數據</span>
              </h3>
              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <table className="w-full text-left text-xs sm:text-sm text-[#4a2e1b] min-w-[500px]">
                  <thead className="bg-[#f2ebdc] text-[#7c634b] uppercase text-[10px] sm:text-xs">
                    <tr>
                      <th className="p-3">學生姓名</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">已呈交篇數</th>
                      <th className="p-3">平均分數</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d8caa7]">
                    {users.filter(u => u.role === 'student').length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-[#7c634b] text-xs sm:text-sm">
                          目前尚無已註冊帳號之學生。
                        </td>
                      </tr>
                    ) : (
                      users
                        .filter(u => u.role === 'student')
                        .map(s => {
                          const mySubs = submissions.filter(
                            sub => sub.studentId === s.id && sub.status === 'graded'
                          );
                          const avgScore =
                            mySubs.length > 0
                              ? Math.round(
                                  mySubs.reduce((acc, curr) => acc + (curr.score || 0), 0) /
                                    mySubs.length
                                )
                              : '--';

                          return (
                            <tr key={s.id} className="hover:bg-[#f2ebdc] transition">
                              <td className="p-3 font-bold text-[#4a2e1b]">{s.name}</td>
                              <td className="p-3">{s.email}</td>
                              <td className="p-3 font-bold text-[#8c2e1b]">
                                {submissions.filter(sub => sub.studentId === s.id).length} 篇
                              </td>
                              <td className="p-3 font-bold text-[#2d5a3f]">{avgScore}</td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* 頁尾區域 (已徹底移除清空按鈕與密碼文字) */}
      <footer className="bg-[#e8dec8] border-t border-[#b8a686] py-6 text-center text-xs text-[#7c634b] mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 寫作與閱讀學習平台</p>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setAuthMode('teacher-login');
                setAuthModalOpen(true);
              }}
              className="text-[#8c2e1b] hover:underline font-bold flex items-center space-x-1"
            >
              <Shield className="w-3.5 h-3.5 mr-0.5 inline" />
              <span>教師管理後台通道</span>
            </button>
          </div>
        </div>
      </footer>

      {/* ----------------- Modal 1: 登入/註冊 Modal (已去除任何帳號密碼提示) ----------------- */}
      {authModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="ancient-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border-2 border-[#b8a686]">
            <div className="p-5 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex justify-between items-center border-b border-[#d8caa7] pb-3">
                <h3 className="text-lg sm:text-xl font-bold text-[#4a2e1b]">
                  {authMode === 'student-login'
                    ? '學生登入'
                    : authMode === 'student-register'
                    ? '註冊學生帳號'
                    : '教師管理後台登入'}
                </h3>
                <button
                  onClick={() => setAuthModalOpen(false)}
                  className="text-[#7c634b] hover:text-[#4a2e1b]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'student-register' && (
                  <div>
                    <label className="block text-xs font-bold text-[#7c634b] mb-1">學生姓名</label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={e => setAuthName(e.target.value)}
                      placeholder="例如：李小華"
                      className="w-full border-2 border-[#b8a686] bg-[#f7f4ed] p-2.5 rounded-lg text-sm outline-none focus:border-[#8c2e1b] text-[#4a2e1b]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#7c634b] mb-1">
                    {authMode === 'teacher-login' ? '教師管理帳號' : '電子郵件 Email'}
                  </label>
                  <input
                    type="text"
                    required
                    value={authEmail}
                    onChange={e => setAuthEmail(e.target.value)}
                    placeholder={
                      authMode === 'teacher-login' ? '請輸入管理帳號' : 'student@example.com'
                    }
                    className="w-full border-2 border-[#b8a686] bg-[#f7f4ed] p-2.5 rounded-lg text-sm outline-none focus:border-[#8c2e1b] text-[#4a2e1b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7c634b] mb-1">密碼</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={e => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border-2 border-[#b8a686] bg-[#f7f4ed] p-2.5 rounded-lg text-sm outline-none focus:border-[#8c2e1b] text-[#4a2e1b]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#8c2e1b] hover:bg-[#6f2213] text-white font-bold py-3 rounded-xl transition text-sm shadow"
                >
                  {authMode === 'student-login'
                    ? '登入'
                    : authMode === 'student-register'
                    ? '完成註冊並登入'
                    : '進入管理後台'}
                </button>
              </form>

              <div className="flex justify-between items-center text-xs text-[#7c634b] pt-2 border-t border-[#d8caa7]">
                {authMode === 'student-login' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setAuthMode('student-register')}
                      className="hover:underline text-[#4a2e1b] font-bold"
                    >
                      尚未有帳號？註冊帳號
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode('teacher-login')}
                      className="hover:underline text-[#8c2e1b]"
                    >
                      教師通道
                    </button>
                  </>
                ) : authMode === 'student-register' ? (
                  <button
                    type="button"
                    onClick={() => setAuthMode('student-login')}
                    className="hover:underline text-[#4a2e1b] font-bold mx-auto"
                  >
                    已有帳號？返回學生登入
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAuthMode('student-login')}
                    className="hover:underline text-[#4a2e1b] font-bold mx-auto"
                  >
                    切換回學生登入
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- Modal 2: 學生進行測驗 Modal ----------------- */}
      {activeQuiz && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="ancient-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border-2 border-[#b8a686]">
            <div className="p-4 sm:p-6 border-b border-[#d8caa7] flex justify-between items-center bg-[#fdfbf7]">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#4a2e1b] flex items-center space-x-1.5">
                  <FileQuestion className="w-5 h-5 text-[#8c2e1b]" />
                  <span>{activeQuiz.title}</span>
                </h3>
                <p className="text-[11px] text-[#7c634b]">
                  考生：{currentUser?.name} · 共 {activeQuiz.questions.length} 題
                </p>
              </div>
              <button
                onClick={() => setActiveQuiz(null)}
                className="text-[#7c634b] hover:text-[#4a2e1b]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-[#f7f4ed]">
              {/* Optional Reading Passage */}
              {activeQuiz.passage && (
                <div className="bg-[#f2ebdc] p-4 rounded-xl border border-[#b8a686] space-y-1.5">
                  <span className="text-xs font-bold text-[#8c2e1b] flex items-center">
                    <BookOpen className="w-3.5 h-3.5 mr-1 inline" />
                    閱讀材料：
                  </span>
                  <p className="text-xs sm:text-sm text-[#4a2e1b] leading-relaxed whitespace-pre-wrap font-serif">
                    {activeQuiz.passage}
                  </p>
                </div>
              )}

              {/* Questions */}
              <div className="space-y-4">
                {activeQuiz.questions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="p-4 bg-[#fdfbf7] rounded-xl border border-[#b8a686] space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-xs sm:text-sm text-[#4a2e1b]">
                        <span className="text-[#8c2e1b] mr-1">{idx + 1}.</span>
                        {q.question}
                      </p>
                      <span className="text-[10px] text-[#7c634b] bg-[#e4d7be] px-1.5 py-0.5 rounded font-bold">
                        {q.points} 分
                      </span>
                    </div>

                    {/* Options */}
                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const letter = ['A', 'B', 'C', 'D'][optIdx];
                        const isSelected = selectedAnswers[idx] === optIdx;
                        return (
                          <div
                            key={optIdx}
                            onClick={() =>
                              setSelectedAnswers(prev => ({ ...prev, [idx]: optIdx }))
                            }
                            className={`p-2.5 rounded-lg border text-xs sm:text-sm flex items-center space-x-2.5 cursor-pointer transition ${
                              isSelected
                                ? 'bg-[#8c2e1b] text-white border-[#8c2e1b] font-bold'
                                : 'bg-[#f7f4ed] text-[#4a2e1b] border-[#d8caa7] hover:bg-[#e4d7be]'
                            }`}
                          >
                            <span className="w-5 text-center font-black">{letter}.</span>
                            <span className="flex-1">{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 sm:p-4 border-t border-[#d8caa7] bg-[#f2ebdc] flex justify-between items-center text-xs">
              <span className="text-[#7c634b]">
                已作答：
                <strong className="text-[#8c2e1b]">
                  {Object.keys(selectedAnswers).length}
                </strong>{' '}
                / {activeQuiz.questions.length} 題
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="px-3 py-1.5 text-[#7c634b]"
                >
                  放棄作答
                </button>
                <button
                  onClick={handleSubmitQuizAttempt}
                  className="bg-[#8c2e1b] hover:bg-[#6f2213] text-white px-5 py-2 rounded-lg font-bold shadow transition"
                >
                  送出測驗卷
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- Modal 3: 測驗結果與詳細題解 Modal ----------------- */}
      {quizResultModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="ancient-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border-2 border-[#b8a686]">
            <div className="p-4 sm:p-6 border-b border-[#d8caa7] flex justify-between items-center bg-[#fdfbf7]">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#4a2e1b] flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-[#2d5a3f]" />
                  <span>測驗評分結果</span>
                </h3>
                <p className="text-xs text-[#7c634b]">{quizResultModal.quiz.title}</p>
              </div>
              <button
                onClick={() => setQuizResultModal(null)}
                className="text-[#7c634b] hover:text-[#4a2e1b]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-[#f7f4ed]">
              {/* Score Banner */}
              <div className="bg-[#f2ebdc] p-5 rounded-2xl border-2 border-[#b8a686] text-center space-y-1">
                <p className="text-xs text-[#7c634b] font-bold">本次測驗得分</p>
                <div className="text-3xl sm:text-4xl font-black text-[#8c2e1b]">
                  {quizResultModal.attempt.score}{' '}
                  <span className="text-sm text-[#7c634b] font-normal">
                    / {quizResultModal.attempt.totalPoints} 分
                  </span>
                </div>
                <p className="text-xs text-[#2d5a3f] font-bold pt-1">
                  {quizResultModal.attempt.score >= quizResultModal.attempt.totalPoints * 0.8
                    ? '恭喜！理解深刻，表現優異！'
                    : '測驗已完成，請詳讀下方題解複習關鍵概念。'}
                </p>
              </div>

              {/* Detailed Question Review */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs sm:text-sm text-[#4a2e1b]">
                  試題解析與對照檢視：
                </h4>
                {quizResultModal.quiz.questions.map((q, idx) => {
                  const studentAns = quizResultModal.attempt.answers[idx];
                  const isCorrect = studentAns === q.correctAnswerIndex;
                  const letters = ['A', 'B', 'C', 'D'];

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border space-y-2 text-xs sm:text-sm ${
                        isCorrect
                          ? 'bg-[#fdfbf7] border-[#2d5a3f]/40'
                          : 'bg-[#fff5f2] border-[#8c2e1b]/40'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-[#4a2e1b]">
                          {idx + 1}. {q.question}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isCorrect ? 'bg-[#2d5a3f] text-white' : 'bg-[#8c2e1b] text-white'
                          }`}
                        >
                          {isCorrect ? '答對' : '答錯'}
                        </span>
                      </div>

                      <div className="text-xs space-y-1">
                        <p>
                          您的選擇：
                          <strong className={isCorrect ? 'text-[#2d5a3f]' : 'text-[#8c2e1b]'}>
                            {studentAns !== -1 ? `${letters[studentAns]}. ${q.options[studentAns]}` : '未作答'}
                          </strong>
                        </p>
                        {!isCorrect && (
                          <p>
                            正確答案：
                            <strong className="text-[#2d5a3f]">
                              {letters[q.correctAnswerIndex]}. {q.options[q.correctAnswerIndex]}
                            </strong>
                          </p>
                        )}
                        {q.explanation && (
                          <div className="bg-[#f2ebdc] p-2 rounded text-[#614935] mt-1.5 text-xs">
                            <strong>導師題解解析：</strong>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3 sm:p-4 border-t border-[#d8caa7] bg-[#f2ebdc] flex justify-end">
              <button
                onClick={() => setQuizResultModal(null)}
                className="bg-[#8c2e1b] text-white px-5 py-2 rounded-xl text-xs font-bold"
              >
                完成複習並關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- Modal 4: 老師批改作文 Modal ----------------- */}
      {gradingSubmission && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="ancient-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border-2 border-[#b8a686]">
            <div className="p-4 sm:p-6 border-b border-[#d8caa7] flex justify-between items-center bg-[#fdfbf7]">
              <h3 className="text-lg sm:text-xl font-bold text-[#4a2e1b]">作文線上批閱</h3>
              <button
                onClick={() => setGradingSubmission(null)}
                className="text-[#7c634b] hover:text-[#4a2e1b]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1 bg-[#f7f4ed]">
              <div>
                <h4 className="text-base sm:text-lg font-bold text-[#4a2e1b]">
                  {gradingSubmission.topicTitle} - {gradingSubmission.essayTitle}
                </h4>
                <p className="text-xs text-[#7c634b] mt-1">
                  作者：<span className="font-bold text-[#4a2e1b]">{gradingSubmission.studentName}</span>{' '}
                  | 字數：<span className="font-bold text-[#8c2e1b]">{gradingSubmission.content.length}</span> 字
                </p>
              </div>
              <div className="bg-[#f2ebdc] p-3 sm:p-4 rounded-xl border border-[#b8a686]">
                <p className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed text-[#4a2e1b]">
                  {gradingSubmission.content}
                </p>
              </div>
              <div className="space-y-4 border-t border-[#d8caa7] pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#7c634b] mb-1">
                      得分 (0 - 100)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={gradeScore}
                      onChange={e => setGradeScore(Number(e.target.value))}
                      className="w-full border-2 border-[#b8a686] bg-[#f7f4ed] p-2.5 rounded-lg text-sm outline-none focus:border-[#8c2e1b] font-bold text-[#8c2e1b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#7c634b] mb-1">
                      評級標籤
                    </label>
                    <select
                      value={gradeLevel}
                      onChange={e => setGradeLevel(e.target.value as GradeLevel)}
                      className="w-full border-2 border-[#b8a686] bg-[#f7f4ed] p-2.5 rounded-lg text-sm outline-none focus:border-[#8c2e1b] text-[#4a2e1b]"
                    >
                      <option value="特優">特優 (A+)</option>
                      <option value="優等">優等 (A)</option>
                      <option value="甲等">甲等 (B)</option>
                      <option value="尚可">尚可 (C)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#7c634b] mb-1">
                    批閱導師評語
                  </label>
                  <textarea
                    rows={3}
                    value={gradeFeedback}
                    onChange={e => setGradeFeedback(e.target.value)}
                    placeholder="請撰寫對作文章法、用語、立意之講評..."
                    className="w-full border-2 border-[#b8a686] bg-[#f7f4ed] p-2.5 rounded-lg text-sm outline-none focus:border-[#8c2e1b] text-[#4a2e1b]"
                  />
                </div>
              </div>
            </div>
            <div className="p-3 sm:p-4 border-t border-[#d8caa7] bg-[#f2ebdc] flex justify-end space-x-3">
              <button
                onClick={() => setGradingSubmission(null)}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-[#7c634b]"
              >
                取消
              </button>
              <button
                onClick={handleSaveGrade}
                className="bg-[#8c2e1b] hover:bg-[#6f2213] text-white px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold shadow transition"
              >
                發布批改評語
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- Modal 5: 老師發布知識文章 Modal ----------------- */}
      {articleModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="ancient-card w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border-2 border-[#b8a686]">
            <div className="p-4 sm:p-6 border-b border-[#d8caa7] flex justify-between items-center bg-[#fdfbf7]">
              <h3 className="text-lg sm:text-xl font-bold text-[#4a2e1b]">發布知識文章</h3>
              <button
                onClick={() => setArticleModalOpen(false)}
                className="text-[#7c634b] hover:text-[#4a2e1b]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handlePublishArticle} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#7c634b] mb-1">文章標題</label>
                <input
                  type="text"
                  required
                  value={newArtTitle}
                  onChange={e => setNewArtTitle(e.target.value)}
                  placeholder="例如：寫作靈感與修辭方法"
                  className="w-full border-2 border-[#b8a686] bg-[#f7f4ed] p-2.5 rounded-lg text-sm outline-none focus:border-[#8c2e1b] text-[#4a2e1b]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#7c634b] mb-1">分類標籤</label>
                <input
                  type="text"
                  value={newArtCategory}
                  onChange={e => setNewArtCategory(e.target.value)}
                  placeholder="例如：寫作技巧 / 文章賞析"
                  className="w-full border-2 border-[#b8a686] bg-[#f7f4ed] p-2.5 rounded-lg text-sm outline-none focus:border-[#8c2e1b] text-[#4a2e1b]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#7c634b] mb-1">文章內文</label>
                <textarea
                  rows={5}
                  required
                  value={newArtContent}
                  onChange={e => setNewArtContent(e.target.value)}
                  placeholder="請輸入文章內容..."
                  className="w-full border-2 border-[#b8a686] bg-[#f7f4ed] p-2.5 rounded-lg text-sm outline-none focus:border-[#8c2e1b] text-[#4a2e1b]"
                />
              </div>
              <div className="pt-3 border-t border-[#d8caa7] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setArticleModalOpen(false)}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-[#7c634b]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="bg-[#8c2e1b] hover:bg-[#6f2213] text-white px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold shadow transition"
                >
                  發布文章
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- Modal 6: 閱讀文章 Modal ----------------- */}
      {readingArticle && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="ancient-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border-2 border-[#b8a686]">
            <div className="p-4 sm:p-6 border-b border-[#d8caa7] flex justify-between items-center bg-[#fdfbf7]">
              <span className="text-xs bg-[#e4d7be] text-[#4a2e1b] font-bold px-3 py-1 rounded-full border border-[#b8a686]">
                {readingArticle.category}
              </span>
              <div className="flex items-center space-x-2">
                {currentUser?.role === 'teacher' && (
                  <button
                    onClick={() => {
                      handleDeleteArticle(readingArticle.id);
                      setReadingArticle(null);
                    }}
                    className="text-xs bg-[#8c2e1b] text-white px-2.5 py-1 rounded font-bold hover:bg-[#6f2213] transition flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>刪除此文</span>
                  </button>
                )}
                <button
                  onClick={() => setReadingArticle(null)}
                  className="text-[#7c634b] hover:text-[#4a2e1b]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1 bg-[#fcfaf5]">
              <h3 className="text-xl sm:text-2xl font-black text-[#4a2e1b]">
                {readingArticle.title}
              </h3>
              <p className="text-[#4a2e1b] leading-relaxed text-sm sm:text-base whitespace-pre-wrap font-serif">
                {readingArticle.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
