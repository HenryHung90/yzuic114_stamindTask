import React, {useMemo, useState, useCallback} from "react";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark-reasonable.css';

// Components
import ReferenceModalComponent from './ReferenceModal';

interface MarkDownTextProps {
  taskId?: string;
  text: string;
}

interface ReferenceData {
  type: string;
  number: string;
  id: string;
}

interface ReferenceModal {
  isOpen: boolean;
  references: ReferenceData[];
}

const MarkDownTextComponent = (props: MarkDownTextProps) => {
  const {text, taskId} = props;
  const [modal, setModal] = useState<ReferenceModal>({isOpen: false, references: []});

  // 處理文本並收集參考資料
  const {processedText, allReferences} = useMemo(() => {
    if (!text) return {processedText: '', allReferences: [] as ReferenceData[]};

    const references: ReferenceData[] = [];

    const processed = text.replace(/\[Data:\s*(.*?)\]/g, (match, dataContent) => {
      const parts = dataContent.split(';').map((part: string) => part.trim());

      parts.forEach((part: string) => {
        const typeMatch = part.match(/^(\w+)\s*\(([\d,\s]+)\)$/);
        if (typeMatch) {
          const [, dataType, numbersString] = typeMatch;
          const numbers = numbersString.split(',').map(num => num.trim());

          numbers.forEach(number => {
            const singularType = dataType.endsWith('s') ?
              dataType.slice(0, -1) : dataType;

            if (dataType === 'Sources') return;
            references.push({
              type: singularType,
              number: number,
              id: `${singularType.toLowerCase()}-${number}`
            });
          });
        }
      });

      return ''; // 移除原本的 Data 標記
    });

    return {processedText: processed, allReferences: references};
  }, [text]);

  // 處理參考資料連結點擊
  const handleReferenceClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setModal({isOpen: true, references: allReferences});
  }, [allReferences]);

  // 關閉彈窗
  const closeModal = useCallback(() => {
    setModal({isOpen: false, references: []});
  }, []);

  // 生成參考資料區塊
  const referenceSection = useMemo(() => {
    if (allReferences.length === 0) return '';

    return `\n\n---\n\n**參考資料：** [查看全部參考資料 (${allReferences.length}項)](#references)`;
  }, [allReferences]);

  return (
    <>
      <div className="prose prose-slate max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            a: ({href, children, ...props}) => {
              if (href === '#references') {
                return (
                  <a
                    href="#"
                    onClick={handleReferenceClick}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer underline"
                    {...props}
                  >
                    {children}
                  </a>
                );
              }
              return <a href={href} {...props}>{children}</a>;
            }
          }}
        >
          {processedText + referenceSection}
        </ReactMarkdown>
      </div>
      <ReferenceModalComponent
        taskId={taskId}
        isOpen={modal.isOpen}
        references={modal.references}
        onClose={closeModal}
      />
    </>
  );
}

export default MarkDownTextComponent;
export type {ReferenceData};
