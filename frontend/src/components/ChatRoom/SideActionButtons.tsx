import React, {useState} from "react";
import {IconButton, Typography} from "@material-tailwind/react";
import {
  GlobeAltIcon,
  AcademicCapIcon,
  LightBulbIcon,
  ArrowRightIcon
} from "@heroicons/react/24/solid";

interface ISideActionButtonsProps {
  onDeepLearnClick?: () => void;
  onLightBulbClick?: () => void;
  onArrowRightClick?: () => void;
  onGraphClick?: () => void;
}

interface IButtonConfig {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  dataObject: string;
  dataId: string;
  isSpecial?: boolean; // 標記特殊按鈕
}

const SideActionButtonsComponent = (props: ISideActionButtonsProps) => {
  const {onDeepLearnClick, onLightBulbClick, onArrowRightClick, onGraphClick} = props;
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const buttonConfigs: IButtonConfig[] = [
    {
      icon: <AcademicCapIcon className='h-5 w-5 color-white pointer-events-none'/>,
      label: "想更深入了解",
      onClick: onDeepLearnClick,
      dataObject: "getDeepLearnInfo",
      dataId: "speedDial_getDeepLearnInfo"
    },
    {
      icon: <LightBulbIcon className='h-5 w-5 color-white pointer-events-none'/>,
      label: "尋找相似知識",
      onClick: onLightBulbClick,
      dataObject: "getLightBulbInfo",
      dataId: "speedDial_getLightBulbInfo"
    },
    {
      icon: <ArrowRightIcon className='h-5 w-5 color-white pointer-events-none'/>,
      label: "下一步可以怎麼做",
      onClick: onArrowRightClick,
      dataObject: "getArrowRightInfo",
      dataId: "speedDial_getArrowRightInfo"
    },
    {
      icon: <GlobeAltIcon className='h-6 w-6 color-white pointer-events-none'/>, // 更大的圖標
      label: "知識圖譜儀表板",
      onClick: onGraphClick,
      dataObject: "openGraphInfo",
      dataId: "speedDial_openGraphInfo",
      isSpecial: true // 標記為特殊按鈕
    }
  ];

  return (
    <div className='absolute -left-2 bottom-14 w-12 h-44 bg-black-10 z-[100]'>
      {buttonConfigs.map((config, index) => (
        <div key={index} className="relative">
          <IconButton
            placeholder={undefined}
            className={
              config.isSpecial
                ? 'mt-[2px] w-12 h-12 bg-stamindTask-primary-blue-600 hover:bg-stamindTask-primary-blue-700 opacity-90 hover:opacity-100 duration-200'
                : 'mt-[2px] opacity-40 hover:bg-stamindTask-black-850 hover:opacity-100 duration-200'
            }
            color={config.isSpecial ? 'blue' : 'black'}
            size={config.isSpecial ? 'lg' : 'md'}
            onClick={config.onClick}
            onMouseEnter={() => setHoveredButton(config.dataId)}
            onMouseLeave={() => setHoveredButton(null)}
            data-action='click'
            data-type='button'
            data-object={config.dataObject}
            data-id={config.dataId}
          >
            {config.icon}
          </IconButton>
          {hoveredButton === config.dataId && (
            <div className="absolute left-12 top-1/2 transform -translate-y-1/2 z-[110]">
              <div className="bg-stamindTask-black-850 text-white px-3 py-1 rounded-md shadow-lg whitespace-nowrap">
                <Typography
                  variant="small"
                  color="white"
                  placeholder={undefined}
                  className="font-medium"
                >
                  {config.label}
                </Typography>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1">
                  <div
                    className="w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-stamindTask-black-850"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SideActionButtonsComponent;
