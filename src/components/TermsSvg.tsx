import { UserContext } from "../contexts/context";
import React, { useContext, useEffect, useRef, useState } from "react";

export function TermsSvg() {
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
        return "#174EA6"; // Yellow color for idVersao 4
      default:
        return "#FFCF00"; // Default color if idVersao doesn't match any case
    }
  };

  const getFillColor2 = () => {
    switch (idVersao) {
      case '1':
        return "#174EA6"; // Red color for idVersao 1
      case '2':
        return "#238536"; // Green color for idVersao 2
      case '3':
        return "#0000FF"; // Blue color for idVersao 3
      case '4':
        return "#8AB4F8"; // Yellow color for idVersao 4
      default:
        return "#FFCF00"; // Default color if idVersao doesn't match any case
    }
  };

    return (
  
<svg  height="full" viewBox="0 0 819 873" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_708_153)">
<path d="M78.7599 111.22C85.7299 111.22 87.3799 113.06 88.5899 114.41C95.6099 122.24 103.2 154.22 98.0899 200.81C94.1099 237.04 95.0799 263.3 95.7899 282.62C96.9899 314.85 96.2999 319.25 82.1699 324.17C78.9699 325.29 75.7499 325.33 72.3199 324.3C59.9899 320.59 37.9199 297.03 19.6099 259.17C13.4899 246.52 8.72993 234.18 5.42993 222.71V273.85C24.1799 310.31 47.8599 337.05 66.7699 342.73C70.2099 343.77 73.6999 344.29 77.1399 344.29C80.9799 344.29 84.8099 343.64 88.5099 342.35C116.9 332.46 116.16 312.35 115.03 281.84C114.34 263.25 113.4 237.78 117.22 202.92C122.14 158.13 116.26 116.45 102.93 101.56C98.9199 97.1 92.5599 91.98 78.7699 91.98C52.1999 91.98 24.6599 109.46 5.43993 131.68V165.81C18.7799 138.97 50.9899 111.23 78.7599 111.22Z"fill={getFillColor2()}/>
<path d="M49.3699 484.48C52.6499 488.8 58.7799 489.69 63.1299 486.46C67.5399 483.18 68.4499 476.93 65.1199 472.55C51.8399 455.1 38.3799 438.07 25.1899 421.39C18.4999 412.93 11.8999 404.58 5.42993 396.32V428.24C6.84993 430.04 8.27993 431.84 9.70993 433.65C22.8099 450.22 36.1799 467.14 49.3699 484.48Z" fill={getFillColor2()}/>
<path d="M78.7599 19.75C110.04 19.75 137 31.37 156.7 53.35C173.51 72.1 184.39 97.63 189.11 128.81C190.29 136.59 199.61 139.95 205.39 134.61L205.58 134.43C207.97 132.22 209.08 128.97 208.59 125.75C203.26 90.73 190.77 61.77 171.4 40.16C147.85 13.89 115.82 0 78.7599 0C55.3299 0 29.9399 6.16 5.42993 18.3V40.49C29.7399 26.75 55.3599 19.75 78.7599 19.75Z" fill={getFillColor2()}/>
<path d="M46.3899 404.65C54.9899 415.52 63.8099 426.67 72.6799 438.09C75.7399 442.03 81.3099 442.57 85.1199 439.33C85.1299 439.32 85.1399 439.31 85.1499 439.3C88.9099 436.18 89.6899 430.74 86.6899 426.88C77.8199 415.48 69.0199 404.35 60.4199 393.48C40.6999 368.56 21.7799 344.64 5.41992 321.67V352C18.2699 369.1 32.1299 386.62 46.3899 404.65Z" fill={getFillColor()}/>
<path d="M78.7599 64.71C97.1599 64.71 112.13 70.99 123.23 83.37C141.85 104.15 149.8 141.78 145.89 189.96C145.4 195.96 150.86 200.73 156.74 199.44C160.6 198.59 163.45 195.31 163.76 191.36C168.03 138.2 158.5 95.83 136.59 71.39C121.95 55.05 102.49 46.77 78.7699 46.77C55.3799 46.77 29.2499 55.36 5.43994 72.19V94.75C28.6399 74.89 55.3099 64.71 78.7599 64.71Z" fill={getFillColor()}/>
<path d="M720.71 531.25C722.8 525.96 725.28 514.43 729.02 496.96C734.39 471.9 741.71 437.76 750.99 409.3C765.62 364.39 775.56 363.88 775.98 363.88C776.47 363.88 777.15 364.13 777.91 364.58C780.38 366.05 787.92 370.53 782.97 393.28C779.53 409.12 771.32 428.1 764.09 444.84C755.32 465.13 748.43 481.08 748.57 492.42C748.92 520.24 762.58 533.15 773.56 543.53C781.36 550.9 787.52 556.73 789.78 567.09C792.75 580.7 787.3 590.62 780.4 603.19C773.31 616.09 765.29 630.7 767.94 650.29C769.48 661.66 780.85 680.87 799.89 706.65C801.82 709.26 804.89 710.8 808.14 710.74C808.22 710.74 808.29 710.74 808.37 710.74C816.56 710.6 821.15 701.26 816.25 694.69C799.94 672.81 789.3 655.87 788.17 647.55C786.42 634.64 792.19 624.15 798.29 613.04C805.81 599.33 814.33 583.81 809.72 562.72C806.11 546.21 796.27 536.9 787.58 528.68C777.73 519.37 769.22 511.33 768.98 492.15C768.89 485.16 775.97 468.79 782.81 452.97C790.42 435.37 799.04 415.41 802.91 397.62C808.27 372.97 803.36 355.94 788.32 347.01C784.34 344.65 780.19 343.45 775.97 343.45C743.67 343.45 726.56 410.99 709.06 492.58C706.04 506.69 703.18 520.01 701.71 523.71C666.78 611.84 594.98 703.51 522.58 789.43C519.45 793.15 516.29 796.98 513.13 800.91C509.87 804.96 510.27 810.83 514.01 814.44C514.09 814.52 514.17 814.59 514.25 814.67C518.49 818.78 525.33 818.3 529.03 813.71C532.1 809.91 535.16 806.19 538.2 802.58C611.72 715.35 684.71 622.09 720.71 531.25Z" fill={getFillColor()}/>
<path d="M692.06 824.2C692.97 823.74 694.07 823.51 695.31 823.51C701.11 823.51 708.07 827.19 714.78 832.59C717.2 834.53 720.68 834.43 723.06 832.44L723.14 832.38C726.7 829.41 728.39 824.75 727.56 820.18C727.1 817.66 726.59 815.59 726.06 813.8C725.64 812.4 724.75 811.17 723.54 810.34C714.35 804.09 704.58 800.09 695.31 800.09C690.4 800.09 685.78 801.15 681.6 803.24C663.44 812.32 631.45 841.97 607.81 872.93H637.8C656.23 851.31 677.69 831.39 692.06 824.2Z" fill={getFillColor2()}/>
<path d="M704.97 756.5C707.93 753.81 709.49 753.24 709.92 753.13C712.61 754.17 717.33 761.66 722.08 769.97C724.7 774.56 730.28 776.54 735.21 774.65C741.6 772.19 744.07 764.46 740.29 758.75C732.69 747.28 720.21 731.2 710 731.2C703.46 731.2 697 734.17 690.27 740.27C689.04 741.38 619.09 805.3 570.06 872.96H597.63C632.46 827.34 676.37 782.44 704.97 756.5Z" fill={getFillColor()}/>
<path d="M769.06 714.9C773.52 712.64 775.7 707.49 774.2 702.71C767.47 681.32 762.46 658.19 759.76 633.1C758.3 619.44 755.84 596.57 738.72 596.57C724.81 596.57 712.22 613.91 681.8 655.79C655.73 691.69 616.32 745.94 559.83 809.57C553.7 816.47 545.07 827.11 535.49 840.24C533.83 842.51 533.18 845.37 533.72 848.13L533.79 848.5C535.46 857.17 546.67 859.63 551.86 852.48C560.49 840.58 568.59 830.48 575.12 823.13C632.22 758.83 671.98 704.08 698.3 667.86C714.08 646.13 729.07 625.49 736.67 618.89C737.49 621.65 738.54 626.58 739.47 635.28C742.31 661.79 747.57 686.21 754.62 708.75C756.52 714.83 763.38 717.79 769.06 714.9Z" fill={getFillColor2()}/>
</g>
<defs>
<clipPath id="clip0_708_153">
<rect width="818.28" height="872.95" fill="white"/>
</clipPath>
</defs>
</svg>
      
    );
  }