import { SliderImage } from "@/clients/database/get-active-slider";

interface BannerPaginationProps {
  images: SliderImage[];
  selectedIndex: number;
  scrollTo: (index: number) => void;
}
export function BannerPagination({
  images,
  selectedIndex,
  scrollTo,
}: BannerPaginationProps) {
  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
      {images.map((_, index) => (
        <button
          key={index}
          onClick={() => scrollTo(index)}
          className={`h-1 rounded-full transition-all duration-300 ${
            index === selectedIndex ? "w-12 bg-black" : "w-8 bg-gray-400"
          }`}
        />
      ))}
    </div>
  );
}
