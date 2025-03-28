'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface CandidateAvatarProps {
  name: string;
  photoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-14 h-14',
  lg: 'w-16 h-16'
};

export default function CandidateAvatar({ name, photoUrl, size = 'md', className = '' }: CandidateAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(photoUrl || '');
  
  // Update imageSrc if photoUrl changes
  useEffect(() => {
    if (photoUrl) {
      setImageSrc(photoUrl);
      setImageError(false);
    } else {
      setImageSrc(getFallbackUrl());
    }
  }, [photoUrl, name]);
  
  // Generate a consistent color based on the name
  const getInitialBackgroundColor = (name: string) => {
    const colors = [
      'gold-4', 'mauve-4', 'accent-gold/10',
      'gold-5', 'mauve-5', 'accent-gold/15'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getFallbackUrl = () => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=150&color=fff&bold=true`;
  };

  const handleImageError = () => {
    console.log('Image error occurred, using fallback for:', name);
    setImageError(true);
    setImageSrc(getFallbackUrl());
  };

  const containerClasses = `relative ${sizeClasses[size]} rounded-full overflow-hidden ring-2 ring-mauve-3 ${className}`;

  return (
    <div className={containerClasses}>
      <Image
        src={imageError ? getFallbackUrl() : imageSrc}
        alt={name || 'Avatar'}
        fill
        className="object-cover"
        onError={handleImageError}
        priority={size === 'lg'} // Prioritize loading larger avatars
      />
    </div>
  );
} 