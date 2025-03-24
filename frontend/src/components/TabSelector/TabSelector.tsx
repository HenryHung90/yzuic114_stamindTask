import React from "react"
// style
import {
  Tabs,
  TabsHeader,
  Tab,
} from "@material-tailwind/react"

// API

// components
import {CODE_STATUS, LANGUAGE_TYPE} from "../../pages/task/components/Process";

// interface

interface TabSelectorProps {
  tabData: typeof LANGUAGE_TYPE
  activeTab: string
  setActiveTab: React.Dispatch<React.SetStateAction<string>> | React.Dispatch<React.SetStateAction<LANGUAGE_TYPE>>
}

const ICON_SIZE = '20'

const TabSelectorComponent = (props: TabSelectorProps) => {
  const {tabData, activeTab, setActiveTab} = props


  const iconSelect = (label: string) => {
    switch (label) {
      case tabData.HTML:
        return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width={ICON_SIZE} height={ICON_SIZE}>
          <path
            d="M0 32l34.9 395.8L191.5 480l157.6-52.2L384 32H0zm308.2 127.9H124.4l4.1 49.4h175.6l-13.6 148.4-97.9 27v.3h-1.1l-98.7-27.3-6-75.8h47.7L138 320l53.5 14.5 53.7-14.5 6-62.2H84.3L71.5 112.2h241.1l-4.4 47.7z"/>
        </svg>
      case tabData.CSS:
        return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width={ICON_SIZE} height={ICON_SIZE}>
          <path
            d="M0 32l34.9 395.8L192 480l157.1-52.2L384 32H0zm313.1 80l-4.8 47.3L193 208.6l-.3 .1h111.5l-12.8 146.6-98.2 28.7-98.8-29.2-6.4-73.9h48.9l3.2 38.3 52.6 13.3 54.7-15.4 3.7-61.6-166.3-.5v-.1l-.2 .1-3.6-46.3L193.1 162l6.5-2.7H76.7L70.9 112h242.2z"/>
        </svg>
      case tabData.JS:
        return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width={ICON_SIZE} height={ICON_SIZE}>
          <path
            d="M448 96c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96zM180.9 444.9c-33.7 0-53.2-17.4-63.2-38.5L152 385.7c6.6 11.7 12.6 21.6 27.1 21.6c13.8 0 22.6-5.4 22.6-26.5V237.7h42.1V381.4c0 43.6-25.6 63.5-62.9 63.5zm85.8-43L301 382.1c9 14.7 20.8 25.6 41.5 25.6c17.4 0 28.6-8.7 28.6-20.8c0-14.4-11.4-19.5-30.7-28l-10.5-4.5c-30.4-12.9-50.5-29.2-50.5-63.5c0-31.6 24.1-55.6 61.6-55.6c26.8 0 46 9.3 59.8 33.7L368 290c-7.2-12.9-15-18-27.1-18c-12.3 0-20.1 7.8-20.1 18c0 12.6 7.8 17.7 25.9 25.6l10.5 4.5c35.8 15.3 55.9 31 55.9 66.2c0 37.8-29.8 58.6-69.7 58.6c-39.1 0-64.4-18.6-76.7-43z"/>
        </svg>
      default:
        return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width={ICON_SIZE} height={ICON_SIZE}>
          <path
            d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"/>
        </svg>
    }
  }

  return (
    <Tabs value={activeTab}>
      <TabsHeader
        className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
        indicatorProps={{
          className:
            "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
        }}
        placeholder={undefined}
      >
        {Object.values(tabData).map((language, index) => (
          <Tab
            key={index}
            value={language}
            onClick={() => setActiveTab(language)}
            className={activeTab === language ? "text-gray-900" : ""}
            placeholder={undefined}
          >
            <div className='flex items-center gap-x-2'>
              {iconSelect(language)}
              {language}
            </div>
          </Tab>
        ))}
      </TabsHeader>
    </Tabs>
  )
}

export default TabSelectorComponent