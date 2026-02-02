"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

type SliderProps = {
  images: {
    image_url: string;
    href?: string;
  }[];
  width: number;
  height: number;
  reverse?: boolean;
};

const AutoSlider: React.FC<SliderProps> = ({
  images,
  width,
  height,
  reverse = false,
}) => {
  if (!images || !images?.length) return;
  return (
    <div
      className="overflow-hidden relative mt-2"
      style={{
        width: "100%",
        height: `${height}px`,
        maskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <div
        className="flex relative"
        style={{
          minWidth: `${width * (images?.length - 1)}px`,
        }}
      >
        {images.map((src, index) => (
          <div
            key={index}
            className="absolute w-full transition-all filter hover:grayscale"
            style={{
              width: `${width}px`,
              height: `${height}px`,
              position: "absolute",
              animation: `${reverse ? "reverseSlide" : "autoSlide"
                } 35s linear infinite`,
              animationDelay: `${(35 / images?.length) * index - 35}s`,
            }}
          >
            {src.href ? (
              <Link href={src.href}>
                <Image
                  src={src.image_url}
                  width={width}
                  height={height}
                  alt={`Slider image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </Link>
            ) : (
              <Image
                src={src.image_url}
                width={width}
                height={height}
                alt={`Slider image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes autoSlide {
          from {
            left: 100%;
          }
          to {
            left: -${width}px;
          }
        }
        @keyframes reverseSlide {
          from {
            left: -${width}px;
          }
          to {
            left: 100%;
          }
        }
        div:hover .absolute {
          animation-play-state: paused !important;
          filter: grayscale(1);
        }
        div:hover .absolute:hover {
          filter: grayscale(0);
        }
      `}</style>
    </div>
  );
};

export default AutoSlider;
