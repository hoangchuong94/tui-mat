import React from 'react';

interface TagListProps<T> {
    tagList: T[];
    getItemName: (item: T) => React.ReactNode;
}

const TagList = <T,>({ tagList, getItemName }: TagListProps<T>) => {
    return (
        <div className="flex w-full flex-row items-center justify-start rounded-md border border-gray-300 bg-white p-2">
            {tagList
                .map((item) => getItemName(item))
                .reverse()
                .slice(0, 3)
                .map((renderedItem, index) => (
                    <span key={index} className="mr-2 text-xs">
                        {renderedItem}
                    </span>
                ))}
            {tagList.length > 3 && <span className="mr-2 text-xs">...+ {tagList.length - 3}</span>}
        </div>
    );
};

export default TagList;
