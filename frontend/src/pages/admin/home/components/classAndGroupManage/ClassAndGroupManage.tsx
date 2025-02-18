import React, {useEffect, useState} from "react";
// style

// API

// components
import ControlBarComponent from "./components/ControlBar";
import ClassListComponent from "./components/ClassList";

// interface
interface IClassAndGroupManageProps {
  settingAlertLogAndLoading: ISettingAlertLogAndLoading
}

import {ISettingAlertLogAndLoading} from "../../../../../utils/interface/alertLog";
import {APIT_getAllClassAndGroups} from "../../../../../utils/API/API_ClassName";

const ClassAndGroupManageComponent = (props: IClassAndGroupManageProps) => {
  const {settingAlertLogAndLoading} = props


  return (
    <div>
      <ControlBarComponent settingAlertLogAndLoading={settingAlertLogAndLoading}/>
      <ClassListComponent settingAlertLogAndLoading={settingAlertLogAndLoading}/>
    </div>
  )
}

export default ClassAndGroupManageComponent;