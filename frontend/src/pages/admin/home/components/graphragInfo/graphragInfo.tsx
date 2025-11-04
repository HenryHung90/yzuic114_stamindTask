import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
// style
import {Button, Typography} from "@material-tailwind/react";

// API

// components
import UploadSectionComponent from "./components/UploadSection";
import StatsSectionComponent from "./components/StatsSection";
import DataTableSectionComponent from "./components/DataTableSection";

// interface
import {
  IGraphragData,
  IGraphragInfoProps,
  ICommunity,
  IEntity,
  IRelationship,
  ISource,
  ISummary
} from "../../../../../utils/interface/adminManage";
import {API_getGraphRagInfo, API_uploadGraphRagFile} from "../../../../../utils/API/API_Graphrag";


const GraphragInfo = (props: IGraphragInfoProps) => {
  const {loading} = props
  const {taskId} = useParams()

  const [communitiesAmount, setCommunitiesAmount] = useState<number>(0);
  const [entitiesAmount, setEntitiesAmount] = useState<number>(0);
  const [relationshipsAmount, setRelationshipsAmount] = useState<number>(0);
  const [sourcesAmount, setSourcesAmount] = useState<number>(0);
  const [summariesAmount, setSummariesAmount] = useState<number>(0);

  const [communityData, setCommunityData] = useState<Array<ICommunity>>([]);
  const [entityData, setEntityData] = useState<Array<IEntity>>([]);
  const [relationshipData, setRelationshipData] = useState<Array<IRelationship>>([]);
  const [sourceData, setSourceData] = useState<Array<ISource>>([]);
  const [summaryData, setSummaryData] = useState<Array<ISummary>>([]);

  // 新增上傳文件相關狀態
  const [uploadSuccess, setUploadSuccess] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");

  const fetchTaskGraphRagInfo = async () => {
    loading.setLoadingOpen(true);
    const fetchData: { data: IGraphragData } = await API_getGraphRagInfo(taskId || "");
    loading.setLoadingOpen(false);
    setCommunitiesAmount(fetchData.data.data_count.community_count);
    setEntitiesAmount(fetchData.data.data_count.entity_count);
    setRelationshipsAmount(fetchData.data.data_count.relationship_count);
    setSourcesAmount(fetchData.data.data_count.source_count);
    setSummariesAmount(fetchData.data.data_count.summary_count);

    setCommunityData(fetchData.data.communities);
    setEntityData(fetchData.data.entities);
    setRelationshipData(fetchData.data.relationships);
    setSourceData(fetchData.data.sources);
    setSummaryData(fetchData.data.summaries);
  }

  useEffect(() => {
    fetchTaskGraphRagInfo()
  }, []);

  // 處理文件上傳
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 檢查是否為CSV檔
    if (!file.name.endsWith('.csv')) {
      setUploadError(`請上傳CSV格式檔案`);
      setTimeout(() => setUploadError(""), 3000);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);
    formData.append('taskId', taskId || "");

    try {
      await API_uploadGraphRagFile(formData);
      // 顯示成功訊息
      setUploadSuccess(`${fileType} 檔案上傳成功!`);
      fetchTaskGraphRagInfo();

      // 3秒後清除成功訊息
      setTimeout(() => setUploadSuccess(""), 3000);
    } catch (error) {
      console.error("上傳失敗:", error);
      setUploadError(`${fileType} 檔案上傳失敗，請重試。`);
      setTimeout(() => setUploadError(""), 3000);
    }
  };


  return (
    <div className='w-[100vw] h-[100vh] p-4  animate-messageSlideIn'>
      <Button variant='gradient' color='red' className='mb-4' placeholder={undefined}
              onClick={() => window.history.back()}>返回</Button>
      <div className='h-[90%] p-10 bg-stamindTask-white-100 rounded-xl shadow-lg shadow-black/50 overflow-auto'>
        <Typography variant="h5" color="blue-gray"
                    placeholder={undefined}>管理課程 rag 文件 {taskId && `- 課程 ID: ${taskId}`}</Typography>
        <UploadSectionComponent
          handleFileUpload={handleFileUpload}
          uploadSuccess={uploadSuccess}
          uploadError={uploadError}
        />
        <StatsSectionComponent
          taskId={taskId}
          communitiesAmount={communitiesAmount}
          entitiesAmount={entitiesAmount}
          relationshipsAmount={relationshipsAmount}
          sourcesAmount={sourcesAmount}
          summariesAmount={summariesAmount}
        />
        <DataTableSectionComponent
          communityData={communityData}
          entityData={entityData}
          relationshipData={relationshipData}
          sourceData={sourceData}
          summaryData={summaryData}
        />
      </div>
    </div>
  )
}

export default GraphragInfo;
