import Skeleton from "../common/Skeleton";

const AdminSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="space-y-2 w-full sm:w-auto">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Skeleton className="h-8 w-16 flex-1 sm:flex-none" />
          <Skeleton className="h-8 w-16 flex-1 sm:flex-none" />
          <Skeleton className="h-8 w-16 flex-1 sm:flex-none" />
        </div>
      </div>

      <div className="mt-4">
        <Skeleton className="h-4 w-24 mb-2" />
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSkeleton;
