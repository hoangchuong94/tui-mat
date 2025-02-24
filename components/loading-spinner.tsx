export default function LoadingSpinner() {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-indigo-500'];

    return (
        <div className="flex h-24 w-24 items-center justify-center gap-[6px]">
            <>
                <span>Loading</span>
                {colors.map((color, i) => (
                    <span
                        key={i}
                        className={`loading-bar ${color}`}
                        style={{ animationDelay: `${-0.8 + i * 0.1}s` }}
                    ></span>
                ))}
            </>
        </div>
    );
}
