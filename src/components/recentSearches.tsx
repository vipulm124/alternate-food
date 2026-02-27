import { Clock4, MoveRight } from "lucide-react";

function RecentSearches() {
  return (
    <div className="bg-white p-6 sm:p-10 md:p-15 rounded-3xl mt-6 sm:mt-10">
      <div className="flex items-center">
        <Clock4 className="text-[#99a1af] w-5 h-5 sm:w-6 sm:h-6" />
        <p className="font-normal text-lg sm:text-xl ml-2">Recent Searches</p>
      </div>
      <div
        className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors mt-6 sm:mt-10"
      >
        <div
          className="flex-1 min-w-0"
        >
          <div
            className="flex items-center gap-2 mb-2"
          >
            <span
              className="text-gray-800 font-medium"
            >
              ujdf
            </span>
            <span
              className="text-gray-400"
            >
              <MoveRight />
            </span>
          </div>
          <p
            className="text-gray-600 text-sm"
          ></p>
        </div>
        <span
          className="text-xs text-gray-400 whitespace-nowrap"
        >
          18:02
        </span>
      </div>
    </div>
  );
}

export default RecentSearches;
