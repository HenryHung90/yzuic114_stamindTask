import React from "react";
import {Typography, Card, CardBody} from "@material-tailwind/react";

interface StatsSectionProps {
  taskId?: string;
  communitiesAmount: number;
  entitiesAmount: number;
  relationshipsAmount: number;
  sourcesAmount: number;
  summariesAmount: number;
}

const StatsSectionComponent: React.FC<StatsSectionProps> = ({
                                                              taskId,
                                                              communitiesAmount,
                                                              entitiesAmount,
                                                              relationshipsAmount,
                                                              sourcesAmount,
                                                              summariesAmount
                                                            }) => {
  return (
    <Card placeholder={undefined} className='mt-8'>
      <CardBody placeholder={undefined}>
        <Typography variant="h6" color="blue-gray" className="pl-4 pt-2"
                    placeholder={undefined}>數據統計</Typography>
        <div className={"mt-4 mb-8"}>
          <Typography variant="paragraph" color="blue-gray" className="pl-4 pt-2"
                      placeholder={undefined}>Communities Amount: {communitiesAmount}</Typography>
          <Typography variant="paragraph" color="blue-gray" className="pl-4 pt-2"
                      placeholder={undefined}>Entities Amount: {entitiesAmount}</Typography>
          <Typography variant="paragraph" color="blue-gray" className="pl-4 pt-2"
                      placeholder={undefined}>Relationships Amount: {relationshipsAmount}</Typography>
          <Typography variant="paragraph" color="blue-gray" className="pl-4 pt-2"
                      placeholder={undefined}>Sources Amount: {sourcesAmount}</Typography>
          <Typography variant="paragraph" color="blue-gray" className="pl-4 pt-2"
                      placeholder={undefined}>Summaries Amount: {summariesAmount}</Typography>
        </div>
      </CardBody>
    </Card>
  );
};

export default StatsSectionComponent;
