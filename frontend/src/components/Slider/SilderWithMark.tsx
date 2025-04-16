import React from "react";
// style
import {Typography, Slider} from "@material-tailwind/react";
// API
// components
// interface
interface SliderWithMarkProps {
  value: number;
  handleSetValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SliderWithMarkComponent = (props: SliderWithMarkProps) => {
  const {value, handleSetValue} = props;

  const marks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  return (
    <>
      <Slider
        placeholder={undefined}
        value={value * 10}
        onChange={handleSetValue}
        min={0}
        max={100}
        step={10}
        barClassName="transition-all duration-500"
        thumbClassName='transition-all duration-200'
      />
      <div className="relative w-[97.5%] mt-1 mx-auto h-6">
        {marks.map((mark) => (
          <div
            key={mark}
            className="absolute transform -translate-x-1/2 transition-all duration-200"
            style={{
              left: `${(mark / 10) * 100}%`,
              top: 0
            }}
          >
            <div
              className={`h-2 w-0.5 mx-auto transition-all duration-200 ${Math.abs(value - mark) < 0.1 ? 'bg-blue-500 h-3' : 'bg-gray-300'}`}
            ></div>
            <Typography
              placeholder={undefined}
              variant="small"
              className={`text-center select-none mt-1 text-xs transition-all duration-200 ${Math.abs(value - mark) < 0.1 ? 'text-blue-500 font-medium' : 'text-gray-600'}`}
            >
              {mark}
            </Typography>
          </div>
        ))}
      </div>
    </>
  )
}

export default SliderWithMarkComponent