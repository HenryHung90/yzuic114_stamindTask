import React, {useState, useEffect} from "react";
import {
  Button,
  IconButton,
  Typography,
  Card,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Spinner
} from "@material-tailwind/react";
import {
  XMarkIcon,
  DocumentTextIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";
import {API_getGraphRagDetailByTypeAndId} from "../../utils/API/API_Graphrag";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface ReferenceData {
  type: string;
  number: string;
  id: string;
}

interface ReferenceDetail {
  id: string;
  title?: string;
  content?: string;
  url?: string;
  description?: string;
  // 根據你的 API 回傳格式調整這些欄位
}

interface ReferenceModalProps {
  taskId?: string;
  isOpen: boolean;
  references: ReferenceData[];
  onClose: () => void;
}

const ReferenceModalComponent: React.FC<ReferenceModalProps> = ({
                                                                  taskId,
                                                                  isOpen,
                                                                  references,
                                                                  onClose
                                                                }) => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [referenceDetails, setReferenceDetails] = useState<Map<string, ReferenceDetail>>(new Map());
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());

  // 獲取類型顏色
  const getTypeColor = (type: string) => {
    const colors = {
      'entitie': 'blue',
      'source': 'green',
      'report': 'purple',
    };
    return colors[type.toLowerCase() as keyof typeof colors] || 'blue-gray';
  };

  // 處理 Accordion 開關
  const handleAccordionToggle = async (reference: ReferenceData) => {
    const itemId = reference.id;

    if (openAccordion === itemId) {
      // 關閉當前打開的 accordion
      setOpenAccordion(null);
    } else {
      // 打開新的 accordion
      setOpenAccordion(itemId);

      // 如果還沒有詳細資料，則從 API 抓取
      if (!referenceDetails.has(itemId)) {
        setLoadingItems(prev => new Set(prev).add(itemId));

        try {
          let detailData: any = await API_getGraphRagDetailByTypeAndId(taskId, reference.type, reference.number);
          detailData = detailData.data

          let detail: ReferenceDetail;
          // 根據不同類型處理資料
          switch (reference.type.toLowerCase()) {
            case 'entitie':
              detail = {
                id: detailData.id || itemId,
                title: detailData.title || `實體 ${reference.number}`,
                description: `類型: ${detailData.type || '未知'} \n出現頻率: ${detailData.frequency || 0} \nDegree: ${detailData.degree || 0}${detailData.text_unit_ids?.length ? ` \n關聯文本單元: ${detailData.text_unit_ids.length} 個` : ''}`,
                content: detailData.description || '無描述',
              };
              break;

            case 'report':
              console.log(detailData)
              detail = {
                id: detailData.id || itemId,
                title: detailData.title || `報告 ${reference.number}`,
                description: `社群: ${detailData.community || '未知'} | 層級: ${detailData.level || 0} | 評分: ${detailData.rank || 0}`,
                content: detailData.summary || detailData.full_content || '無摘要內容',
              };
              break;

            default:
              detail = {
                id: detailData.id || itemId,
                title: `${reference.type} ${reference.number}`,
                description: '未知類型',
                content: JSON.stringify(detailData, null, 2),
              };
          }

          setReferenceDetails(prev => new Map(prev).set(itemId, detail));
        } catch (error) {
          console.error('Failed to fetch reference detail:', error);
          // 設置錯誤狀態的詳細資料
          setReferenceDetails(prev => new Map(prev).set(itemId, {
            id: itemId,
            title: '載入失敗',
            content: '無法載入參考資料詳情',
            description: '請稍後再試'
          }));
        } finally {
          setLoadingItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(itemId);
            return newSet;
          });
        }
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 重置狀態當彈窗關閉時
  useEffect(() => {
    if (!isOpen) {
      setOpenAccordion(null);
      setReferenceDetails(new Map());
      setLoadingItems(new Set());
    }
  }, [isOpen]);

  // 自定義 Accordion Icon
  const AccordionIcon = ({id, open}: { id: string; open: boolean }) => {
    return (
      <ChevronDownIcon
        strokeWidth={2.5}
        className={`mx-auto h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
      />
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 h-[95%] mt-[3.5%] bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-[48rem] overflow-hidden" placeholder={undefined}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <DocumentTextIcon className="h-5 w-5 text-white"/>
            </div>
            <div>
              <Typography variant="h5" color="blue-gray" placeholder="">
                參考資料
              </Typography>
              <Typography variant="small" color="gray" className="font-normal" placeholder="">
                共 {references.length} 項參考資料
              </Typography>
            </div>
          </div>
          <IconButton
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={onClose}
            placeholder=""
          >
            <XMarkIcon strokeWidth={2} className="h-5 w-5"/>
          </IconButton>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[60vh] px-0">
          {references.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {references.map((ref, index) => {
                const isOpen = openAccordion === ref.id;
                const isLoading = loadingItems.has(ref.id);
                const detail = referenceDetails.get(ref.id);

                return (
                  <Accordion
                    key={`${ref.id}-${index}`}
                    open={isOpen}
                    icon={<AccordionIcon id={ref.id} open={isOpen}/>}
                    placeholder=""
                  >
                    <AccordionHeader
                      onClick={() => handleAccordionToggle(ref)}
                      className="border-b-0 p-4 hover:bg-blue-50 transition-colors"
                      placeholder=""
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div
                          className={`w-8 h-8 bg-${getTypeColor(ref.type)}-500 rounded-full flex items-center justify-center flex-shrink-0`}>
                          <Typography
                            variant="small"
                            color="white"
                            className="font-bold text-xs"
                            placeholder=""
                          >
                            {ref.type.charAt(0).toUpperCase()}
                          </Typography>
                        </div>
                        <div className="flex-1 text-left">
                          <Typography
                            variant="h6"
                            color="blue-gray"
                            className="font-medium"
                            placeholder=""
                          >
                            {ref.type} {ref.number}
                          </Typography>
                        </div>

                        <div className="flex items-center gap-2">
                          <Chip
                            value={ref.type}
                            size="sm"
                            color={getTypeColor(ref.type) as any}
                            className="rounded-full"
                          />
                        </div>
                      </div>
                    </AccordionHeader>

                    <AccordionBody className="px-4 py-4 bg-gray-50" placeholder="">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Spinner className="h-6 w-6"/>
                          <Typography variant="small" color="gray" className="ml-2" placeholder="">
                            載入中...
                          </Typography>
                        </div>
                      ) : detail ? (
                        <div className="space-y-4">
                          {detail.title && (
                            <div>
                              <Typography variant="small" color="blue-gray" className="font-semibold mb-1"
                                          placeholder="">
                                標題
                              </Typography>
                              <Typography variant="small" color="gray" placeholder="">
                                {detail.title}
                              </Typography>
                            </div>
                          )}

                          {detail.description && (
                            <div>
                              <Typography variant="small" color="blue-gray" className="font-semibold mb-1"
                                          placeholder="">
                                描述
                              </Typography>
                              <Typography variant="small" color="gray" placeholder="">
                                {detail.description}
                              </Typography>
                            </div>
                          )}

                          {detail.content && (
                            <div>
                              <Typography variant="small" color="blue-gray" className="font-semibold mb-1"
                                          placeholder="">
                                內容
                              </Typography>
                              <div className="max-h-80 overflow-y-auto bg-white p-3 rounded border">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  rehypePlugins={[rehypeHighlight]}
                                >
                                  {detail.content}
                                </ReactMarkdown>
                              </div>
                            </div>
                          )}

                          {detail.url && (
                            <div>
                              <Typography variant="small" color="blue-gray" className="font-semibold mb-1"
                                          placeholder="">
                                連結
                              </Typography>
                              <a
                                href={detail.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700 text-sm underline break-all"
                              >
                                {detail.url}
                              </a>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <Typography variant="small" color="gray" placeholder="">
                            無法載入詳細資料
                          </Typography>
                        </div>
                      )}
                    </AccordionBody>
                  </Accordion>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mb-4"/>
              <Typography variant="h6" color="gray" placeholder="">
                沒有找到參考資料
              </Typography>
              <Typography variant="small" color="gray" className="text-center mt-2" placeholder="">
                此文檔中沒有包含任何參考資料
              </Typography>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-6 border-t bg-gray-50">
          <Button
            variant="text"
            color="gray"
            onClick={onClose}
            placeholder=""
          >
            關閉
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ReferenceModalComponent;
export type {ReferenceData, ReferenceDetail};
