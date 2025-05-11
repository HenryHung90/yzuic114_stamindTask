// style
import {Carousel, IconButton} from "@material-tailwind/react";

// API

// components

// interface
interface ICarouselProps {
  carouselImgList: Array<string>
}

const CarouselComponent = (props: ICarouselProps) => {
  const {carouselImgList} = props

  return (
    <div>
      {carouselImgList.length != 0 ? (
        <Carousel
          className="rounded-xl w-full h-full"
          prevArrow={({handlePrev}) => (
            <IconButton
              variant="text"
              color="white"
              size="lg"
              onClick={handlePrev}
              className="!absolute top-2/4 left-4 -translate-y-2/4"
              placeholder={undefined}
              data-action='click'
              data-type='interact'
              data-object='prevPage'
              data-id='carousel_prevPage'
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="black"
                className="h-8 w-8"
                data-action='click'
                data-type='interact'
                data-object='prevPage'
                data-id='carousel_prevPage'
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  data-action='click'
                  data-type='interact'
                  data-object='prevPage'
                  data-id='carousel_prevPage'
                />
              </svg>
            </IconButton>
          )}
          nextArrow={({handleNext}) => (
            <IconButton
              variant="text"
              color="white"
              size="lg"
              onClick={handleNext}
              className="!absolute top-2/4 !right-4 -translate-y-2/4"
              placeholder={undefined}
              data-action='click'
              data-type='interact'
              data-object='nextPage'
              data-id='carousel_nextPage'
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="black"
                className="h-8 w-8"
                data-action='click'
                data-type='interact'
                data-object='nextPage'
                data-id='carousel_nextPage'
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  data-action='click'
                  data-type='interact'
                  data-object='nextPage'
                  data-id='carousel_nextPage'
                />
              </svg>
            </IconButton>
          )}
          navigation={({setActiveIndex, activeIndex, length}) => (
            <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
              {new Array(length).fill("").map((_, i) => (
                <span
                  key={i}
                  className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] shadow-md ${activeIndex === i ? "w-8 bg-white shadow-black" : "w-4 bg-white/50 shadow-black/50"}`}
                  onClick={() => setActiveIndex(i)}
                  data-action='click'
                  data-type='interact'
                  data-object={`jumpPage_第${i+1}頁`}
                  data-id='carousel_jumpPage'
                />
              ))}
            </div>
          )} placeholder={undefined}>
          {
            carouselImgList.map((link, index) => (
              <img
                key={index}
                src={`${import.meta.env.VITE_APP_TEST_DNS}/${import.meta.env.VITE_APP_FILES_ROUTE}/text_book/${link}`}
                alt={`page_${index + 1}`}
                className="object-fill object-center text-center"
                draggable='false'
              />
            ))
          }
        </Carousel>
      ) : (
        <div className='flex rounded-xl items-center justify-center h-16 bg-white'>該階段計劃無教材</div>
      )}
    </div>
  )
}

export default CarouselComponent