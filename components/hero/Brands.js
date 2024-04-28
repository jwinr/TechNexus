import Image from "../common/Image"

const Brands = ({ title, imageSrc }) => (
  <div className="lg:w-1/4 px-6 pt-10 pb-6 lg:p-6 mb-4">
    <div className="flex flex-col justify-center items-center h-32">
      <Image alt={title} src={imageSrc} className="w-3/5" />
      <div className="brand-title">{title}</div>
    </div>
  </div>
)

export default Brands
