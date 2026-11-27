import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

const messages = {
  vi: {
    'Movie list': 'Danh sách phim',
    Search: 'Tìm kiếm',
    Categories: 'Thể loại',
    'Discover movies': 'Khám phá phim',
    'Short dramas, lasting feelings.': 'Phim ngắn, cảm xúc dài.',
    'Find your next story and start watching.': 'Tìm câu chuyện tiếp theo và bắt đầu xem.',
    'Search for a movie': 'Tìm tên phim bạn yêu thích',
    'Recommended for you': 'Được đề xuất cho bạn',
    'Loading movies': 'Đang tải phim',
    'Load more movies': 'Xem thêm phim',
    'No movies yet': 'Chưa có phim',
    'Please come back later.': 'Vui lòng quay lại sau.',
    'Could not load content': 'Chưa tải được nội dung',
    'Try again': 'Thử lại',
    All: 'Tất cả',
    Trending: 'Thịnh hành',
    'Browse by category': 'Khám phá theo thể loại',
    'All dramas': 'Tất cả phim',
    'movies loaded': 'phim đã tải',
    'No movies in this category': 'Chưa có phim trong thể loại này',
    'Load more to see more movies in this category.':
      'Tải thêm phim để xem thêm trong thể loại này.',
    'Start with a movie title': 'Bắt đầu với tên phim',
    'Enter a keyword to find a story.': 'Nhập từ khóa để tìm phim bạn muốn xem.',
    'Movie search': 'Tìm kiếm phim',
    'Movie title': 'Tên phim',
    'Enter a title…': 'Nhập tên phim…',
    'Clear search': 'Xóa từ khóa',
    'Search movies': 'Tìm phim',
    'Results for': 'Kết quả cho',
    'No movies found': 'Không tìm thấy phim',
    'Try another title or keyword.': 'Thử tên phim hoặc từ khóa khác.',
    'Back to movies': 'Về danh sách phim',
    'Playing episode': 'Đang xem tập',
    'Previous episode': 'Tập trước',
    'Next episode': 'Tập tiếp',
    'Play next automatically': 'Tự phát tập tiếp theo',
    'Episode list': 'Danh sách tập',
    episode: 'tập',
    'This episode is not available to guests.': 'Tập này chưa được mở cho khách.',
    'Some episodes are not available to guests.': 'Một số tập chưa được mở cho khách.',
    'Could not play this episode. Reload the source.':
      'Không phát được tập này. Vui lòng tải lại nguồn phát.',
    'Could not open page': 'Không mở được trang',
    Reload: 'Tải lại',
    'A little time, a new story': 'MỘT CHÚT THỜI GIAN, MỘT CÂU CHUYỆN MỚI',
    'Pine collection': 'BỘ SƯU TẬP PINE',
    'Choose a category': 'Chọn thể loại',
    'Category is unavailable': 'Thể loại không tồn tại',
    'All categories': 'Tất cả thể loại',
    episodes: 'tập',
    'Search failed': 'Tìm kiếm chưa thành công',
    Movie: 'Phim ngắn',
    Episodes: 'TẬP',
    Episode: 'Tập',
    'This episode is locked': 'Tập này chưa được mở cho khách',
  },
  en: {
    'Movie list': 'Movies',
    Search: 'Search',
    Categories: 'Categories',
    'Discover movies': 'Discover movies',
    'Short dramas, lasting feelings.': 'Short dramas, lasting feelings.',
    'Find your next story and start watching.': 'Find your next story and start watching.',
    'Search for a movie': 'Search for a movie',
    'Recommended for you': 'Recommended for you',
    'Loading movies': 'Loading movies',
    'Load more movies': 'Load more movies',
    'No movies yet': 'No movies yet',
    'Please come back later.': 'Please come back later.',
    'Could not load content': 'Could not load content',
    'Try again': 'Try again',
    All: 'All',
    Trending: 'Trending',
    'Browse by category': 'Browse by category',
    'All dramas': 'All dramas',
    'movies loaded': 'movies loaded',
    'No movies in this category': 'No movies in this category',
    'Load more to see more movies in this category.':
      'Load more to see more movies in this category.',
    'Start with a movie title': 'Start with a movie title',
    'Enter a keyword to find a story.': 'Enter a keyword to find a story.',
    'Movie search': 'Movie search',
    'Movie title': 'Movie title',
    'Enter a title…': 'Enter a title…',
    'Clear search': 'Clear search',
    'Search movies': 'Search movies',
    'Results for': 'Results for',
    'No movies found': 'No movies found',
    'Try another title or keyword.': 'Try another title or keyword.',
    'Back to movies': 'Back to movies',
    'Playing episode': 'Playing episode',
    'Previous episode': 'Previous episode',
    'Next episode': 'Next episode',
    'Play next automatically': 'Play next automatically',
    'Episode list': 'Episode list',
    episode: 'episodes',
    'This episode is not available to guests.': 'This episode is not available to guests.',
    'Some episodes are not available to guests.': 'Some episodes are not available to guests.',
    'Could not play this episode. Reload the source.':
      'Could not play this episode. Reload the source.',
    'Could not open page': 'Could not open page',
    Reload: 'Reload',
    'A little time, a new story': 'A LITTLE TIME, A NEW STORY',
    'Pine collection': 'PINE COLLECTION',
    'Choose a category': 'Choose a category',
    'Category is unavailable': 'Category is unavailable',
    'All categories': 'All categories',
    episodes: 'episodes',
    'Search failed': 'Search failed',
    Movie: 'Short drama',
    Episodes: 'EPISODES',
    Episode: 'Episode',
    'This episode is locked': 'This episode is not available to guests',
  },
} as const;

type MessageKey = keyof typeof messages.vi;
type Language = 'vi' | 'en';
const LanguageContext = createContext<{
  language: Language;
  setLanguage: (value: Language) => void;
  t: (key: MessageKey) => string;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() =>
    localStorage.getItem('pine-language') === 'en' ? 'en' : 'vi',
  );
  const value = useMemo(
    () => ({
      language,
      setLanguage: (next: Language) => {
        localStorage.setItem('pine-language', next);
        setLanguageState(next);
      },
      t: (key: MessageKey) => messages[language][key],
    }),
    [language],
  );
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage must be inside LanguageProvider');
  return value;
}

const categoryTranslations: Record<string, string> = {
  'Tất cả': 'All',
  'Thịnh hành': 'Trending',
  'Tâm lý gia đình': 'Family drama',
  'Thân phận bí mật': 'Secret identity',
  'Tình yêu trắc trở': 'Complicated love',
  'Nữ chính lột xác': 'Her transformation',
  'Cuộc sống hôn nhân': 'Married life',
  'Phục thù': 'Revenge',
  'Đời thường': 'Everyday life',
  'Cơ hội thứ hai': 'Second chance',
  'Cao thủ ẩn danh': 'Hidden master',
  'Xuyên không': 'Time travel',
  'Nữ tổng tài': 'Powerful woman',
  'Đấu đá gia tộc': 'Family power struggle',
};

export function translateCategory(name: string, language: Language) {
  return language === 'en' ? categoryTranslations[name] || name : name;
}
