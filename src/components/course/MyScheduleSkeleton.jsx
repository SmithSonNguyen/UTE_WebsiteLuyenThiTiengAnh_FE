const TableSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Ngày
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Lớp Học
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Thời Gian
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Hành Động
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y">
        {[...Array(5)].map((_, i) => (
          <tr key={i}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-48"></div>
                <div className="h-3 bg-gray-200 rounded w-40"></div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-28"></div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ProgressSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
    <div className="flex justify-between items-center">
      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
      <div className="h-6 bg-gray-200 rounded w-8 animate-pulse"></div>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5 animate-pulse"></div>
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="text-center">
        <div className="h-8 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-20 mx-auto mt-1 animate-pulse"></div>
      </div>
      <div className="text-center">
        <div className="h-8 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-20 mx-auto mt-1 animate-pulse"></div>
      </div>
    </div>
  </div>
);

const UpcomingSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6 space-y-3 max-h-64 overflow-y-auto">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="flex items-center p-3 bg-gray-50 rounded-lg animate-pulse"
      >
        <div className="w-2 h-2 rounded-full mr-3 bg-gray-200"></div>
        <div className="flex-1 space-y-1">
          <div className="h-3 bg-gray-200 rounded w-48"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    ))}
  </div>
);

export { TableSkeleton, ProgressSkeleton, UpcomingSkeleton };
