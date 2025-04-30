import { SpinnerIsLLoading } from '@/components/loading-spinner';

export const LoadingSkeletonAuth = () => {
    return (
        <div className="flex h-[596.3px] w-[416px] items-center justify-center rounded-xl bg-white">
            <SpinnerIsLLoading />
        </div>
    );
};

export const LoadingSkeletonTokens = () => {
    return (
        <div className="flex h-[240px] w-auto items-center justify-center rounded-xl bg-white">
            <SpinnerIsLLoading />
        </div>
    );
};

export const LoadingSkeletonTableProduct = () => {
    return (
        <div className="flex h-full w-full items-center justify-center rounded-xl bg-white">
            <SpinnerIsLLoading />
        </div>
    );
};

export const LoadingSkeletonUpdateGenderForm = () => {
    return (
        <div className="flex h-36 w-full items-center justify-center bg-transparent">
            <SpinnerIsLLoading />
        </div>
    );
};

export const LoadingSkeletonUpdateCategoryForm = () => {
    return (
        <div className="flex h-52 w-full items-center justify-center bg-transparent">
            <SpinnerIsLLoading />
        </div>
    );
};

export const LoadingSkeletonUpdateDetailCategoryForm = () => {
    return (
        <div className="flex h-52 w-full items-center justify-center bg-transparent">
            <SpinnerIsLLoading />
        </div>
    );
};

export const LoadingSkeletonUpdatePromotion = () => {
    return (
        <div className="flex h-52 w-full items-center justify-center bg-transparent">
            <SpinnerIsLLoading />
        </div>
    );
};

export const LoadingSkeletonUpdateTrademark = () => {
    return (
        <div className="flex h-52 w-full items-center justify-center bg-transparent">
            <SpinnerIsLLoading />
        </div>
    );
};
