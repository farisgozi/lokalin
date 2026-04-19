'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  fallback: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  [key: string]: any;
}

export default function SafeImage({
  src,
  alt,
  fallback,
  fill = false,
  priority = false,
  className = '',
  objectFit = 'cover',
  ...props
}: SafeImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imageSrc !== fallback) {
      setImageSrc(fallback);
      setHasError(true);
    }
  };

  const imageClassName = `${className} object-${objectFit}`.trim();

  if (fill) {
    return (
      <Image
        src={imageSrc || "/placeholder.jpg"}
        alt={alt}
        fill
        priority={priority}
        onError={handleError}
        className={imageClassName}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw"
        {...props}
      />
    );
  }

  return (
    <Image
      src={imageSrc || "/placeholder.jpg"}
      alt={alt}
      priority={priority}
      onError={handleError}
      className={imageClassName}
      {...props}
    />
  );
}
