import Skeleton from "../common/Skeleton";

const ActivityLogSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="divide-y divide-gray-200">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="p-6 flex items-center space-x-4">
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-40" />
            </div>
            <div className="w-20">
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLogSkeleton;
