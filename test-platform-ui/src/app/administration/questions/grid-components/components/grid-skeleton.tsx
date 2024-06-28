import Skeleton from '@mui/material/Skeleton';

export const GridItemsSkeleton = () => {
  return (
    <div className="ml-6 mt-3 grid h-[calc(100%_-_70px)] w-[calc(100%_-_60px)] gap-2 overflow-hidden rounded-lg p-3">
      {[1, 2].map((_, indx: number) => (
        <div
          key={`skeleton-question-${indx}`}
          className="h-[350px] w-full rounded-lg border-2 border-solid border-zinc-200 p-3"
        >
          <Skeleton
            animation="wave"
            className="pb-2"
            variant="text"
            sx={{ fontSize: '2.5rem' }}
          />
          <div className="flex justify-between">
            <div className="flex gap-2 pb-3">
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={150}
                height={50}
              />
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={150}
                height={50}
              />
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={150}
                height={50}
              />
            </div>
            <div className="flex gap-2">
              <Skeleton
                animation="wave"
                variant="circular"
                width={40}
                height={40}
              />
              <Skeleton
                animation="wave"
                variant="circular"
                width={40}
                height={40}
              />
            </div>
          </div>

          <Skeleton
            className="w-[calc(100%_-_5px)]"
            animation="wave"
            variant="rounded"
            height={190}
          />
        </div>
      ))}
    </div>
  );
};

export const GridTool = () => {
  return (
    <Skeleton
      className="ml-3 rounded-lg"
      variant="rectangular"
      width={'calc(100% - 40px)'}
      height={50}
    />
  );
};

export default function GridSkeleton() {
  return (
    <div className="question-list grid h-[inherit] gap-2">
      <GridTool />
      <GridItemsSkeleton />
    </div>
  );
}