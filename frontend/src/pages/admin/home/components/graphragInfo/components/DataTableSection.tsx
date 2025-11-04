import React, {useState} from "react";
import {
  Typography,
  Card,
  CardBody,
  Select,
  Option
} from "@material-tailwind/react";
import {ICommunity, IEntity, IRelationship, ISource, ISummary} from "../../../../../../utils/interface/adminManage";

interface DataTableSectionProps {
  communityData: ICommunity[];
  entityData: IEntity[];
  relationshipData: IRelationship[];
  sourceData: ISource[];
  summaryData: ISummary[];
}

const DataTableSectionComponent: React.FC<DataTableSectionProps> = ({
                                                                      communityData,
                                                                      entityData,
                                                                      relationshipData,
                                                                      sourceData,
                                                                      summaryData
                                                                    }) => {
  const [activeTab, setActiveTab] = useState<string>("communities");

  // 所有可用選項的定義
  const tabOptions = [
    {label: "Communities", value: "communities"},
    {label: "Entities", value: "entities"},
    {label: "Relationships", value: "relationships"},
    {label: "Sources", value: "sources"},
    {label: "Summaries", value: "summaries"}
  ];

  // 根據當前選中的選項渲染對應的數據表格
  const renderActiveTable = () => {
    switch (activeTab) {
      case "communities":
        return renderCommunityTable(communityData);
      case "entities":
        return renderEntityTable(entityData);
      case "relationships":
        return renderRelationshipTable(relationshipData);
      case "sources":
        return renderSourceTable(sourceData);
      case "summaries":
        return renderSummaryTable(summaryData);
      default:
        return <div>無效的選擇</div>;
    }
  };

  function renderCommunityTable(data: ICommunity[]) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
          <tr>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">ID</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">標題</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">社區編號</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">層級</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">大小</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">實體數量</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">關係數量</th>
          </tr>
          </thead>
          <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id} className="even:bg-blue-gray-50/50">
                <td className="p-4 border-b border-blue-gray-50">{item.human_readable_id}</td>
                <td className="p-4 border-b border-blue-gray-50">{item.title}</td>
                <td className="p-4 border-b border-blue-gray-50">{item.community}</td>
                <td className="p-4 border-b border-blue-gray-50">{item.level}</td>
                <td className="p-4 border-b border-blue-gray-50">{item.size}</td>
                <td
                  className="p-4 border-b border-blue-gray-50">{item.entity_count || (item.entity_ids ? item.entity_ids.length : 0)}</td>
                <td
                  className="p-4 border-b border-blue-gray-50">{item.relationship_count || (item.relationship_ids ? item.relationship_ids.length : 0)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-4 text-center">無數據</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    );
  }

  function renderEntityTable(data: IEntity[]) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
          <tr>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">ID</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">標題</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">類型</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">頻率</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">度數</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">描述</th>
          </tr>
          </thead>
          <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id} className="even:bg-blue-gray-50/50">
                <td className="p-4 border-b border-blue-gray-50">{item.human_readable_id}</td>
                <td className="p-4 border-b border-blue-gray-50">{item.title}</td>
                <td className="p-4 border-b border-blue-gray-50">{item.type}</td>
                <td className="p-4 border-b border-blue-gray-50">{item.frequency}</td>
                <td className="p-4 border-b border-blue-gray-50">{item.degree}</td>
                <td className="p-4 border-b border-blue-gray-50 max-w-[200rem] truncate">{item.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-4 text-center">無數據</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    );
  }

  function renderRelationshipTable(data: IRelationship[]) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
          <tr>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">ID</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">來源</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">目標</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">權重</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">合併度</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">描述</th>
          </tr>
          </thead>
          <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id} className="even:bg-blue-gray-50/50">
                <td className="p-4 border-b border-blue-gray-50">{item.human_readable_id}</td>
                <td className="p-4 border-b border-blue-gray-50">{item.source}</td>
                <td className="p-4 border-b border-blue-gray-50">{item.target}</td>
                <td className="p-4 border-b border-blue-gray-50">{item.weight}</td>
                <td className="p-4 border-b border-blue-gray-50">{item.combined_degree}</td>
                <td className="p-4 border-b border-blue-gray-50 max-w-[200rem] truncate">{item.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-4 text-center">無數據</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    );
  }

  function renderSourceTable(data: ISource[]) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
          <tr>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">ID</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">Token 數</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">實體數</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">關係數</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">文本</th>
          </tr>
          </thead>
          <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id} className="even:bg-blue-gray-50/50">
                <td className="p-4 border-b border-blue-gray-50">{item.human_readable_id}</td>
                <td className="p-4 border-b border-blue-gray-50">{item.n_tokens}</td>
                <td className="p-4 border-b border-blue-gray-50">{item.entity_count}</td>
                <td className="p-4 border-b border-blue-gray-50">{item.relationship_count}</td>
                <td className="p-4 border-b border-blue-gray-50 max-w-[200rem] truncate">{item.text}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-4 text-center">無數據</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    );
  }

  function renderSummaryTable(data: ISummary[]) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
          <tr>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">ID</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">標題</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">社區</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">層級</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">排名</th>
            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">摘要</th>
          </tr>
          </thead>
          <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id} className="even:bg-blue-gray-50/50">
                <td className="p-4 border-b border-blue-gray-50">{item.human_readable_id}</td>
                <td className="p-4 border-b border-blue-gray-50">{item.title}</td>
                <td className="p-4 border-b border-blue-gray-50">{item.community}</td>
                <td className="p-4 border-b border-blue-gray-50">{item.level}</td>
                <td className="p-4 border-b border-blue-gray-50">{item.rank}</td>
                <td className="p-4 border-b border-blue-gray-50 max-w-[200rem] truncate">{item.summary}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-4 text-center">無數據</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <>
      <Typography variant="h5" color="blue-gray" className="pl-4 pt-6 mt-6" placeholder={undefined}>
        數據瀏覽
      </Typography>
      <Card className="mt-4" placeholder={undefined}>
        <CardBody placeholder={undefined}>
          <div className="mb-6">
            <Select
              label="選擇數據類型"
              value={activeTab}
              onChange={(value) => value && setActiveTab(value)}
              placeholder={undefined}
            >
              {tabOptions.map(({label, value}) => (
                <Option key={value} value={value}>
                  {label}
                </Option>
              ))}
            </Select>
          </div>
          <div className="h-[400px] overflow-auto">
            {renderActiveTable()}
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default DataTableSectionComponent;
