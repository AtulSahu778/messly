import { ReactNode, SVGProps } from "react";

export interface Sf6IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

type PathRenderer = (color: string) => ReactNode;

const createFilledIcon = (render: PathRenderer) => {
  const Icon = ({ size = "1em", color = "currentColor", ...props }: Sf6IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      {render(color)}
    </svg>
  );
  return Icon;
};

export const HouseFill = createFilledIcon((color) => (
  <path
    fill={color}
    d="M11.2 3.4a1.2 1.2 0 011.6 0l7.2 6.3a1 1 0 01-1.3 1.5l-.7-.6V18a3 3 0 01-3 3h-7.6a3 3 0 01-3-3v-7.4l-.7.6A1 1 0 013 9.7z"
  />
));

export const CalendarFill = createFilledIcon((color) => (
  <path
    fill={color}
    d="M7.5 2.5a1 1 0 012 0V4h5V2.5a1 1 0 012 0V4h.5A3 3 0 0120 7v11a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h.5zm-1.5 8v7A1.5 1.5 0 007.5 19h9a1.5 1.5 0 001.5-1.5v-7z"
  />
));

export const GearFill = createFilledIcon((color) => (
  <path
    fill={color}
    d="M12 7.5A4.5 4.5 0 1112 16.5 4.5 4.5 0 0112 7.5zm0-5a1 1 0 01.97.73l.37 1.38a8 8 0 012.45 1.41l1.38-.37a1 1 0 011.2.69l.7 2.62a1 1 0 01-.31 1.01l-1.08.94c.04.34.07.68.07 1.03s-.03.69-.07 1.03l1.08.94a1 1 0 01.3 1.01l-.69 2.62a1 1 0 01-1.21.7l-1.38-.38a8 8 0 01-2.45 1.41l-.37 1.38A1 1 0 0112 23a1 1 0 01-.97-.73l-.37-1.38a8 8 0 01-2.45-1.41l-1.38.38a1 1 0 01-1.21-.7l-.69-2.62a1 1 0 01.3-1.01l1.08-.94A7.5 7.5 0 016 12c0-.35.03-.69.07-1.03l-1.08-.94a1 1 0 01-.31-1.01l.7-2.62a1 1 0 011.2-.7l1.38.37a8 8 0 012.45-1.41l.37-1.38A1 1 0 0112 2.5z"
  />
));

export const CreditcardFill = createFilledIcon((color) => (
  <path
    fill={color}
    d="M6 5a3 3 0 00-3 3v8a3 3 0 003 3h12a3 3 0 003-3V8a3 3 0 00-3-3zm-1.5 5h15v6A1.5 1.5 0 0118 17.5H6A1.5 1.5 0 014.5 16z"
  />
));

export const ChartBarFill = createFilledIcon((color) => (
  <path
    fill={color}
    d="M5 6a1 1 0 011-1h1a1 1 0 011 1v12H5zm5-3a1 1 0 011-1h1a1 1 0 011 1v15h-3zm5 6a1 1 0 011-1h1a1 1 0 011 1v9h-3zm-12 13a1 1 0 110-2h14a1 1 0 110 2z"
  />
));

export const BellFill = createFilledIcon((color) => (
  <path
    fill={color}
    d="M12 2a5 5 0 00-5 5v2.3c0 .8-.3 1.6-.8 2.2L5 13.5a1 1 0 00.8 1.5H18.2a1 1 0 00.8-1.5l-1.2-2a3.8 3.8 0 01-.8-2.2V7a5 5 0 00-5-5zm0 20a2.5 2.5 0 002.45-2h-4.9A2.5 2.5 0 0012 22z"
  />
));

export const PersonFill = createFilledIcon((color) => (
  <path
    fill={color}
    d="M12 2a4.2 4.2 0 11-.01 8.4A4.2 4.2 0 0112 2zm-6 16.3c1.2-2.9 3.8-4.8 6-4.8s4.8 1.9 6 4.8A2.7 2.7 0 0115.5 22h-7a2.7 2.7 0 01-2.5-3.7z"
  />
));

export const CheckmarkCircleFill = createFilledIcon((color) => (
  <path
    fill={color}
    d="M12 3.5a8.5 8.5 0 110 17 8.5 8.5 0 010-17zm-1.3 10.7L8.2 11.7a1 1 0 10-1.4 1.4l3 3a1 1 0 001.5-.1l5-6a1 1 0 10-1.5-1.3z"
  />
));

export const XmarkCircleFill = createFilledIcon((color) => (
  <path
    fill={color}
    d="M12 3.5a8.5 8.5 0 110 17 8.5 8.5 0 010-17zm-2.8 5.9a1 1 0 00-1.4 1.4L10.6 12l-2.8 2.8a1 1 0 001.4 1.4L12 13.4l2.8 2.8a1 1 0 001.4-1.4L13.4 12l2.8-2.8a1 1 0 10-1.4-1.4L12 10.6z"
  />
));

export const ChevronLeftCircleFill = createFilledIcon((color) => (
  <path
    fill={color}
    d="M12 2.5a9.5 9.5 0 110 19 9.5 9.5 0 010-19zm1.6 5.9l-3.5 3.6 3.5 3.6a1 1 0 11-1.4 1.4l-4.2-4.2a1 1 0 010-1.4l4.2-4.2a1 1 0 111.4 1.4z"
  />
));

export const ChevronRightCircleFill = createFilledIcon((color) => (
  <path
    fill={color}
    d="M12 2.5a9.5 9.5 0 110 19 9.5 9.5 0 010-19zm-.6 5.9a1 1 0 011.4 0l4.2 4.2a1 1 0 010 1.4l-4.2 4.2a1 1 0 11-1.4-1.4l3.5-3.6-3.5-3.6a1 1 0 010-1.4z"
  />
));

