import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark-reasonable.css';
import React from "react"; // 引入 Highlight.js 的樣式

interface MarkDownTextProps {
  text: string;
}

const MarkDownTextComponent = (props: MarkDownTextProps) => {
  const {text} = props;

  return (
    <div className="prose prose-slate max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        children={text}
      />
    </div>
  )
}

export default MarkDownTextComponent