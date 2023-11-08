import { UserContext } from "../contexts/context";
import React, { useContext, useEffect, useRef, useState } from "react";

export function Circle() {
  const { idVersao, setIdVersao } = useContext(UserContext);  

  const getFillColor = () => {
    switch (idVersao) {
      case '1':
        return "#5198E5"; // Red color for idVersao 1
      case '2':
        return "#FFCF00"; // Green color for idVersao 2
      case '3':
        return "#0000FF"; // Blue color for idVersao 3
      case '4':
        return "#8AB4F8"; // Yellow color for idVersao 4
      default:
        return "#FFCF00"; // Default color if idVersao doesn't match any case
    }
  };

  return (


<svg
      xmlns="http://www.w3.org/2000/svg"

      height="full"
      fill="none"
      viewBox="0 0 817 670"
    >
      <g clipPath="url(#clip0_566_60)">
        <path
          fill={getFillColor()}
          d="M813.827 93.141c-2.591-11.028-6.638-21.357-12.038-30.698-5.983-10.358-13.726-19.684-22.999-27.686-73.202-63.156-122.372-32.313-220.538 29.258-59.679 37.448-141.426 88.733-263.333 142.33C128.224 279.613 22.591 374.122 4.396 429.611c-5.924 18.142-9.098 41.696 12.358 78.81 59.287 102.613 214.294 161.564 339.155 161.564 17.424 0 34.265-1.149 50.175-3.477 86.623-12.744 194.162-102.569 287.685-240.244 88.195-129.833 136.448-263.711 120.058-333.123zm-507.35 139.465c123.711-54.369 206.448-106.264 266.841-144.135l.422-.262C670.334 27.6 702.881 7.173 760.013 56.493c13.042 11.246 21.747 25.78 25.852 43.21 14.643 62.108-31.922 186.879-115.881 310.456-89.083 131.128-189.301 216.355-268.092 227.95-15.051 2.212-30.976 3.303-47.453 3.303-115.808 0-258.719-53.656-312.838-147.336-16.55-28.661-13.799-43.69-9.912-55.532 16.2-49.423 115.778-136.031 274.788-205.938z"
        ></path>
      </g>
      <defs>
        <clipPath id="clip0_566_60">
          <path fill="#fff" d="M0 0H817V670H0z"></path>
        </clipPath>
      </defs>
    </svg>
    );
  }