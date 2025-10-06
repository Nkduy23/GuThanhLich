import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonLoader: React.FC = () => {
  return (
    <div className="p-6 space-y-4">
      <Skeleton height={30} width="40%" />
      <Skeleton height={20} count={3} />
      <div className="grid grid-cols-3 gap-4 mt-4">
        <Skeleton height={150} />
        <Skeleton height={150} />
        <Skeleton height={150} />
      </div>
    </div>
  );
};

export default SkeletonLoader;
