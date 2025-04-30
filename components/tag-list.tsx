'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils'; // If you have a classnames utility
import { twMerge } from 'tailwind-merge'; // Optional for cleaner class merging

interface TagListProps<T> {
    tagList: T[];
    getItemName: (item: T) => React.ReactNode;
    onRemove?: (item: T) => void;
    className?: string;
}

const gradientClasses = [
    'from-blue-500 via-blue-600 to-blue-700',
    'from-red-500 via-red-600 to-red-700',
    'from-pink-500 via-pink-600 to-pink-700',
    'from-green-500 via-green-600 to-green-700',
    'from-purple-500 via-purple-600 to-purple-700',
    'from-yellow-400 via-yellow-500 to-yellow-600',
    'from-indigo-500 via-indigo-600 to-indigo-700',
    'from-teal-400 via-teal-500 to-teal-600',
    'from-orange-500 via-orange-600 to-orange-700',
    'from-rose-400 via-rose-500 to-rose-600',
    'from-lime-400 via-lime-500 to-lime-600',
    'from-emerald-400 via-emerald-500 to-emerald-600',
    'from-sky-400 via-sky-500 to-sky-600',
    'from-cyan-400 via-cyan-500 to-cyan-600',
    'from-violet-500 via-violet-600 to-violet-700',
    'from-fuchsia-500 via-fuchsia-600 to-fuchsia-700',
];
export const TagList = <T,>({ tagList = [], getItemName, onRemove, className }: TagListProps<T>) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const handleToggle = () => {
        setIsExpanded((prev) => !prev);
    };

    const reversedTags = [...tagList].reverse();
    const displayedTags = isExpanded ? reversedTags : reversedTags.slice(0, 5);

    const tagGradients = React.useMemo(() => {
        return reversedTags.map(() => {
            const random = Math.floor(Math.random() * gradientClasses.length);
            return gradientClasses[random];
        });
    }, [tagList]);
    return (
        <div className={twMerge('flex flex-wrap items-center gap-2 p-2', className)}>
            {Array.isArray(tagList) && tagList.length > 0 ? (
                <>
                    {displayedTags.map((item, index) => (
                        <span
                            key={index}
                            className={twMerge(
                                `inline-flex items-center justify-center space-x-1 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-medium text-white shadow-md`,
                                tagGradients[index],
                            )}
                        >
                            <span>{getItemName(item)}</span>
                            {onRemove && (
                                <button
                                    className="ml-1 text-white hover:text-red-300"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onRemove(item);
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </span>
                    ))}

                    {tagList.length > 5 && !isExpanded && (
                        <span
                            onClick={handleToggle}
                            className="cursor-pointer text-sm text-blue-500 hover:text-blue-700"
                        >
                            ...+ {tagList.length - 5}
                        </span>
                    )}

                    {isExpanded && tagList.length > 5 && (
                        <span
                            onClick={handleToggle}
                            className="cursor-pointer text-sm text-blue-500 hover:text-blue-700"
                        >
                            Collapse
                        </span>
                    )}
                </>
            ) : (
                <span className="text-sm text-gray-500">No tags available</span>
            )}
        </div>
    );
};
