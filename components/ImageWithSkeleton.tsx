
import React, { useState } from 'react';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    className?: string;
    // Corrected: use fetchPriority instead of fetchpriority
    fetchPriority?: "high" | "low" | "auto";
}

const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({ className, fetchPriority, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={`relative overflow-hidden bg-gray-200 ${className}`}>
            {!isLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gray-300" />
            )}
            <img
                {...props}
                // Corrected: pass fetchPriority correctly to the img element
                fetchPriority={fetchPriority}
                onLoad={() => setIsLoaded(true)}
                className={`transition-opacity duration-500 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'} w-full h-full object-cover`}
            />
        </div>
    );
};

export default ImageWithSkeleton;