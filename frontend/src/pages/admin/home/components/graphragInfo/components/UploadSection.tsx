import React from "react";
import {Typography, Card, CardBody} from "@material-tailwind/react";

interface UploadSectionProps {
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => Promise<void>;
  uploadSuccess: string;
  uploadError: string;
}

const UploadSectionComponent: React.FC<UploadSectionProps> = ({
                                                                handleFileUpload,
                                                                uploadSuccess,
                                                                uploadError
                                                              }) => {
  return (
    <>
      <Typography variant="h5" color="blue-gray" className="pl-4 pt-2 mt-4" placeholder={undefined}>
        上傳 CSV 檔案
      </Typography>
      <Card placeholder={undefined}>
        <CardBody placeholder={undefined}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col border rounded-md p-4">
              <Typography variant="h6" color="blue-gray" className="mb-2" placeholder={undefined}>
                Communities 文件
              </Typography>
              <div className="flex items-center justify-between">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileUpload(e, "Communities")}
                  className="hidden"
                  id="communities-upload"
                />
                <label
                  htmlFor="communities-upload"
                  className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm flex items-center justify-center w-full"
                >
                  選擇 CSV 文件
                </label>
              </div>
            </div>
            <div className="flex flex-col border rounded-md p-4">
              <Typography variant="h6" color="blue-gray" className="mb-2" placeholder={undefined}>
                Entities 文件
              </Typography>
              <div className="flex items-center justify-between">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileUpload(e, "Entities")}
                  className="hidden"
                  id="entities-upload"
                />
                <label
                  htmlFor="entities-upload"
                  className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm flex items-center justify-center w-full"
                >
                  選擇 CSV 文件
                </label>
              </div>
            </div>
            <div className="flex flex-col border rounded-md p-4">
              <Typography variant="h6" color="blue-gray" className="mb-2" placeholder={undefined}>
                Relationships 文件
              </Typography>
              <div className="flex items-center justify-between">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileUpload(e, "Relationships")}
                  className="hidden"
                  id="relationships-upload"
                />
                <label
                  htmlFor="relationships-upload"
                  className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm flex items-center justify-center w-full"
                >
                  選擇 CSV 文件
                </label>
              </div>
            </div>
            <div className="flex flex-col border rounded-md p-4">
              <Typography variant="h6" color="blue-gray" className="mb-2" placeholder={undefined}>
                Source (Text Unit) 文件
              </Typography>
              <div className="flex items-center justify-between">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileUpload(e, "Sources")}
                  className="hidden"
                  id="sources-upload"
                />
                <label
                  htmlFor="sources-upload"
                  className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm flex items-center justify-center w-full"
                >
                  選擇 CSV 文件
                </label>
              </div>
            </div>
            <div className="flex flex-col border rounded-md p-4">
              <Typography variant="h6" color="blue-gray" className="mb-2" placeholder={undefined}>
                Summary (Community Report) 文件
              </Typography>
              <div className="flex items-center justify-between">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileUpload(e, "Summaries")}
                  className="hidden"
                  id="summaries-upload"
                />
                <label
                  htmlFor="summaries-upload"
                  className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm flex items-center justify-center w-full"
                >
                  選擇 CSV 文件
                </label>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Typography variant="small" color="blue-gray" className="italic" placeholder={undefined}>
              * 請上傳CSV格式檔案，檔案大小不超過 10MB
            </Typography>
            {uploadSuccess && (
              <Typography variant="h6" color="green" className="font-bold mt-2" placeholder={undefined}>
                {uploadSuccess}
              </Typography>
            )}
            {uploadError && (
              <Typography variant="h6" color="red" className="font-bold mt-2" placeholder={undefined}>
                {uploadError}
              </Typography>
            )}
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default UploadSectionComponent;
