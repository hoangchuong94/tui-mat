import clsx from 'clsx';
export interface LoadingSkeletonAuthProps {
    className?: string;
    label?: string;
}

export const LoadingSkeletonAuth = ({ className, label }: LoadingSkeletonAuthProps) => {
    return (
        <div className={clsx('flex h-full items-center justify-center', className)}>
            <div className="flex-col items-center justify-center">
                <div className="flex w-full flex-col items-center justify-center gap-4">
                    <div className="flex h-20 w-20 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-pink-400 text-4xl text-pink-400">
                        <div className="flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-fuchsia-400 text-2xl text-fuchsia-400"></div>
                    </div>
                    <span>{label}</span>
                </div>
            </div>
        </div>
    );
};
