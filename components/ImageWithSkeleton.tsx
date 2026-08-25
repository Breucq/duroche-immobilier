
import React, { useState } from 'react';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    className?: string;
    fetchPriority?: "high" | "low" | "auto";
    srcSet?: string;
    sizes?: string;
}

const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({ className, fetchPriority, srcSet, sizes, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={`relative overflow-hidden bg-gray-200 ${className}`}>
            {!isLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gray-300" />
            )}
            <img
                {...props}
                srcSet={srcSet}
                sizes={sizes}
                fetchPriority={fetchPriority}
                decoding="async"
                onLoad={() => setIsLoaded(true)}
                className={`transition-opacity duration-500 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'} w-full h-full object-cover`}
            />
        </div>
    );
};

export default ImageWithSkeleton;
