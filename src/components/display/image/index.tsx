import { CSSProperties, useEffect, useState } from 'react';
import { Image, Skeleton } from 'antd';
import { useReadLocalStorage } from 'usehooks-ts';
import defaultImage from '@/assets/images/default-image.png';

interface IProps {
  useCach?: boolean;
  tokenized?: boolean;
  circle?: boolean;
  src: string;
  id?: string;
  defaultSrc?: string;
  style?: CSSProperties;
  key?: string | number;
  className?: string;
  preview?: boolean;
  onClick?: () => void;
}

function TokenizedImage({
  useCach = false,
  tokenized = false,
  src,
  id,
  defaultSrc = defaultImage,
  style,
  preview = false,
  key,
  className,
  circle = false,
  onClick
}: IProps) {
  const userToken = useReadLocalStorage<any>('userToken');

  const [imageUrl, setImageUrl] = useState('');

  const fetchImageCacher = async () => {
    try {
      if (useCach) {
        const cache = await caches.open('imageCache');
        const cachedResponse = await cache.match(src);
        if (cachedResponse) {
          const blob = await cachedResponse.blob();
          const objectUrl = URL.createObjectURL(blob);
          setImageUrl(objectUrl);
        } else {
          const headers = new Headers();
          tokenized && headers.append('AuthPerson', userToken);
          const response = await fetch(src, {
            headers
          });
          if (response.ok) {
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            src && (await cache.put(src, new Response(blob)));

            setImageUrl(objectUrl);
          } else {
            console.error('error 1');
          }
        }
      } else if (tokenized) {
        const response = await fetch(src, {
          headers: {
            Authperson: userToken
          }
        });
        if (response.ok) {
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          setImageUrl(objectUrl);
        } else {
          console.error('error 2');
        }
      } else {
        setImageUrl(src);
      }
    } catch (error) {
      console.error('error 3', error);
    }
  };

  useEffect(() => {
    src && fetchImageCacher();
    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [src]);

  return (
    <Image
      className={className}
      src={imageUrl}
      fallback={defaultSrc}
      key={key?.toString()}
      style={style}
      aria-hidden
      id={id}
      preview={preview}
      onClick={onClick}
      placeholder={
        circle ? (
          <Skeleton.Avatar style={style} active />
        ) : (
          <Skeleton style={style} active />
        )
      }
      alt=""
    />
  );
}

export default TokenizedImage;
