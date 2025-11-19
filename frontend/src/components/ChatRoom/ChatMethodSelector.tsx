import React, {createElement} from "react";
import {
  IconButton,
  SpeedDial,
  SpeedDialHandler,
  SpeedDialContent,
  SpeedDialAction
} from "@material-tailwind/react";
import {
  ChatBubbleLeftRightIcon,
  BugAntIcon
} from "@heroicons/react/24/solid";

// 方法配置
const CHAT_METHODS = [
  {
    key: 'normal',
    label: '一般問答',
    icon: ChatBubbleLeftRightIcon,
    color: 'blue'
  },
  {
    key: 'code_debug',
    label: 'Code Debug',
    icon: BugAntIcon,
    color: 'red'
  },
] as const;

export type ChatMethodType = 'normal' | 'code_debug';

interface ChatMethodSelectorProps {
  currentMethod: ChatMethodType;
  onMethodChange: (method: ChatMethodType) => void;
}

const ChatMethodSelectorComponent: React.FC<ChatMethodSelectorProps> = ({
                                                                          currentMethod,
                                                                          onMethodChange
                                                                        }) => {
  // 獲取當前方法的配置
  const getCurrentMethodConfig = () => {
    return CHAT_METHODS.find(method => method.key === currentMethod) || CHAT_METHODS[0];
  };

  return (
    <div className='absolute bottom-16 right-3 flex w-34'>
      <SpeedDial placement="top-end">
        <SpeedDialHandler>
          <IconButton
            size="lg"
            className="rounded-full"
            color={getCurrentMethodConfig().color as any}
            placeholder={undefined}
          >
            {createElement(getCurrentMethodConfig().icon, {className: "h-5 w-5"})}
          </IconButton>
        </SpeedDialHandler>
        <SpeedDialContent placeholder={undefined}>
          {CHAT_METHODS.map((method) => {
            const IconComponent = method.icon;
            const isActive = currentMethod === method.key;

            return (
              <SpeedDialAction
                key={method.key}
                className={`relative group ${isActive ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                placeholder={undefined}
                onClick={() => onMethodChange(method.key)}
              >
                <IconComponent className="h-5 w-5" color={method.color}/>
                <div
                  className='absolute right-0 w-32 text-[0px] flex justify-end opacity-0 group-hover:text-sm group-hover:opacity-100 group-hover:right-14 transition-all duration-1000 ease-out pointer-events-none'>
                  {method.label}
                </div>
              </SpeedDialAction>
            );
          })}
        </SpeedDialContent>
      </SpeedDial>
    </div>
  );
};

export default ChatMethodSelectorComponent;
export {CHAT_METHODS};
