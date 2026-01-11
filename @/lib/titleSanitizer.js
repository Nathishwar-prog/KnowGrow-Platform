const MAX_TITLE_LENGTH = 60;
const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_WORDS = 8;

function stripMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '');
}

function stripCode(text) {
  return text
    .replace(/<code[^>]*>[\s\S]*?<\/code>/gi, '')
    .replace(/<pre[^>]*>[\s\S]*?<\/pre>/gi, '')
    .replace(/\b(const|let|var|function|class|import|export|return|if|else|for|while|switch|case|break|continue|try|catch|throw|new|this|super|extends|implements|interface|type|enum|async|await|yield|static|public|private|protected|readonly|abstract|declare|namespace|module)\b\s*[({=]/gi, '')
    .replace(/[{}\[\]();=><|&!~^%]+/g, ' ')
    .replace(/\s*[-+*/]\s*/g, ' ');
}

function cleanExcessPunctuation(text) {
  return text
    .replace(/[.,:;!?]+$/g, '')
    .replace(/^[.,:;!?]+/g, '')
    .replace(/[.,:;!?]{2,}/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function toTitleCase(text) {
  const minorWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by', 'in', 'of', 'up', 'as', 'is', 'it'];
  
  return text
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index === 0 || !minorWords.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(' ');
}

function truncateToWords(text, maxWords) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ');
}

export function sanitizeChapterTitle(rawTitle, fallbackIndex = 0) {
  if (!rawTitle || typeof rawTitle !== 'string') {
    return `Chapter ${fallbackIndex + 1}`;
  }

  let title = rawTitle;

  title = title.replace(/^chapter\s*\d+\s*[:\-–—]\s*/i, '');
  title = title.replace(/^\d+\.\s*/, '');

  title = stripMarkdown(title);
  title = stripCode(title);
  title = cleanExcessPunctuation(title);

  title = title.replace(/\n+/g, ' ');

  title = truncateToWords(title, MAX_TITLE_WORDS);

  if (title.length > MAX_TITLE_LENGTH) {
    title = title.substring(0, MAX_TITLE_LENGTH - 3).trim() + '...';
  }

  title = toTitleCase(title);

  title = title.trim();

  if (title.length < MIN_TITLE_LENGTH) {
    return `Chapter ${fallbackIndex + 1}`;
  }

  return title;
}

export function sanitizeSubTopic(rawTopic) {
  if (!rawTopic || typeof rawTopic !== 'string') {
    return '';
  }

  let topic = rawTopic;

  topic = stripMarkdown(topic);
  topic = stripCode(topic);
  topic = cleanExcessPunctuation(topic);
  topic = topic.replace(/\n+/g, ' ');

  if (topic.length > 80) {
    topic = topic.substring(0, 77).trim() + '...';
  }

  return topic.trim();
}

export function sanitizeCourseChapters(chapters) {
  if (!Array.isArray(chapters)) return [];

  return chapters.map((chapter, index) => {
    const rawTitle = chapter?.chapterName || chapter?.name || '';
    const sanitizedTitle = sanitizeChapterTitle(rawTitle, index);

    const rawTopics = chapter?.topics || [];
    const sanitizedTopics = rawTopics
      .map(t => {
        if (typeof t === 'string') return sanitizeSubTopic(t);
        return sanitizeSubTopic(t?.name || t?.topic || '');
      })
      .filter(Boolean);

    return {
      ...chapter,
      chapterName: sanitizedTitle,
      topics: sanitizedTopics,
    };
  });
}

export function getDisplayTitle(chapter, fallbackIndex = 0) {
  const rawTitle = chapter?.chapterName || 
                   chapter?.courseData?.chapterName || 
                   chapter?.rawChapterName || 
                   chapter?.name ||
                   '';
  
  return sanitizeChapterTitle(rawTitle, fallbackIndex);
}

export default {
  sanitizeChapterTitle,
  sanitizeSubTopic,
  sanitizeCourseChapters,
  getDisplayTitle,
};
