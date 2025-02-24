export const LoadingSkeletonAuth = () => {
    return (
        <div className="flex h-[596.3px] w-[416px] items-center justify-center rounded-xl bg-white">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
        </div>
    );
};

export const LoadingSkeletonTokens = () => {
    return (
        <div className="flex h-[250px] w-[608px] items-center justify-center rounded-xl bg-white">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
        </div>
    );
};
