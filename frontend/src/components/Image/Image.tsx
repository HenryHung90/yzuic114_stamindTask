interface ImageProps {
  src: string
  alt: string
  width?: string | number
  height?: string | number
}


const ImageComponent = (props: ImageProps) => {
  const {src, alt, width = 'auto', height = 'auto'} = props
  return (
    <img width={width} height={height} src={src} alt={alt} />
  )
}

export default ImageComponent