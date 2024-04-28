import Link from "next/link"
import Image from "../Image"

const DisplaySmall = ({ link, title, price, imageSrc }) => {
  // Extract the integer and decimal parts of the price
  const integerPart = Math.floor(price)
  const decimalPart = (price - integerPart).toFixed(2).slice(2)

  return (
    <div
      className="rounded-lg lg:w-flex-fourth bg-gray-100
      px-6 pt-10 pb-2 lg:p-6 lg:pb-0
      hover:bg-gray-200 lg:mb-0 mb-4 border border-gray-300"
    >
      <Link href={link} aria-label={title}>
        <div className="flex flex-column justify-center items-center h-32">
          <Image alt={title} src={imageSrc} className="w-3/5" />
        </div>
        <div className="">
          <p className="text-xl flex text-black justify-center font-semibold mb-1">
            {title}
          </p>
          <p className="text-black text-center mb-2">
            ${integerPart}
            <sup className="text-xs text-black">.{decimalPart}</sup>{" "}
          </p>
        </div>
      </Link>
    </div>
  )
}

export default DisplaySmall
