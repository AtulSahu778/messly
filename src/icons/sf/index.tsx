import { ReactNode, SVGProps } from "react";

export interface SfIconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

type PathRenderer = (color: string) => ReactNode;

const createStrokeIcon = (renderPaths: PathRenderer) => {
  const Icon = ({ size = "1em", color = "currentColor", ...props }: SfIconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {renderPaths(color)}
    </svg>
  );

  return Icon;
};

const createFilledIcon = (renderContent: PathRenderer) => {
  const Icon = ({ size = "1em", color = "currentColor", ...props }: SfIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      {renderContent(color)}
    </svg>
  );

  return Icon;
};

export const Calendar = createStrokeIcon(() => (
  <>
    <rect x="4" y="5.5" width="16" height="14.5" rx="3" />
    <path d="M8 3v4.5" />
    <path d="M16 3v4.5" />
    <path d="M4 11h16" />
  </>
));

export const CheckmarkCircle = createStrokeIcon(() => (
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9 12.5l2 2 4-4.5" />
  </>
));

export const XmarkCircle = createStrokeIcon(() => (
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9 9l6 6" />
    <path d="M15 9l-6 6" />
  </>
));

export const ChevronLeft = createStrokeIcon(() => (
  <path d="M14.5 6l-5 6 5 6" />
));

export const ChevronRight = createStrokeIcon(() => (
  <path d="M9.5 6l5 6-5 6" />
));

export const ChevronDown = createStrokeIcon(() => (
  <path d="M6 9l6 6 6-6" />
));

export const ChevronUp = createStrokeIcon(() => (
  <path d="M6 15l6-6 6 6" />
));

export const ArrowLeft = createStrokeIcon(() => (
  <>
    <path d="M6.5 12h11" />
    <path d="M10.5 8l-4 4 4 4" />
  </>
));

export const ArrowRight = createStrokeIcon(() => (
  <>
    <path d="M17.5 12h-11" />
    <path d="M13.5 8l4 4-4 4" />
  </>
));

export const Search = createStrokeIcon(() => (
  <>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M15.5 15.5L20 20" />
  </>
));

export const GripVertical = createStrokeIcon(() => (
  <>
    <path d="M10 5v14" />
    <path d="M14 5v14" />
  </>
));

export const MoreHorizontal = createStrokeIcon(() => (
  <>
    <circle cx="6.5" cy="12" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="17.5" cy="12" r="1" />
  </>
));

export const Circle = createStrokeIcon(() => <circle cx="12" cy="12" r="7.5" />);

export const Dot = createFilledIcon(
  (color) => <circle cx="12" cy="12" r="2.5" fill={color} stroke="none" />,
);

export const Check = createStrokeIcon(() => <path d="M6.5 12.5l3.5 3.5 7-8" />);

export const DollarSign = createStrokeIcon(() => (
  <>
    <path d="M12 4v16" />
    <path d="M16 7.5c0-2-2-3.5-4-3.5s-4 1.5-4 3.5 2 3.5 4 3.5 4 1.5 4 3.5-2 3.5-4 3.5-4-1.5-4-3.5" />
  </>
));

export const RotateCcw = createStrokeIcon(() => (
  <>
    <path d="M7 6L4 9l3 3" />
    <path d="M4 9h8a5 5 0 110 10c-2.76 0-5-2.24-5-5" />
  </>
));

export const PanelLeft = createStrokeIcon(() => (
  <>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M10 4v16" />
  </>
));

export const Creditcard = createStrokeIcon(() => (
  <>
    <rect x="3.5" y="6" width="17" height="12" rx="3" />
    <path d="M3.5 10h17" />
    <path d="M7 14h3" />
  </>
));

export const Gear = createStrokeIcon(() => (
  <>
    <circle cx="12" cy="12" r="3.5" />
    <path d="M12 5v2" />
    <path d="M12 17v2" />
    <path d="M5 12h2" />
    <path d="M17 12h2" />
    <path d="M7.2 7.2l1.4 1.4" />
    <path d="M15.4 15.4l1.4 1.4" />
    <path d="M16.6 7.2l-1.4 1.4" />
    <path d="M8.4 15.4l-1.4 1.4" />
  </>
));

export const Bell = createStrokeIcon(() => (
  <>
    <path d="M12 4a4 4 0 00-4 4v2.5c0 .9-.3 1.8-.85 2.5L6 15h12l-1.15-1.99A4 4 0 0116 10.5V8a4 4 0 00-4-4z" />
    <path d="M10 18a2 2 0 004 0" />
  </>
));

export const Person = createStrokeIcon(() => (
  <>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M6.5 19c1.5-2.5 3.8-4 5.5-4s4 1.5 5.5 4" />
  </>
));

export const ListBullet = createStrokeIcon(() => (
  <>
    <path d="M10 7h9" />
    <path d="M10 12h9" />
    <path d="M10 17h9" />
    <circle cx="6" cy="7" r="1" />
    <circle cx="6" cy="12" r="1" />
    <circle cx="6" cy="17" r="1" />
  </>
));

export const DocText = createStrokeIcon(() => (
  <>
    <path d="M8 4h6l4 4v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z" />
    <path d="M14 4v4h4" />
    <path d="M9 13h6" />
    <path d="M9 17h4" />
  </>
));

export const ChartBar = createStrokeIcon(() => (
  <>
    <path d="M5 18h14" />
    <path d="M8 18V9" />
    <path d="M12 18V6" />
    <path d="M16 18v-4" />
  </>
));

export const CalendarBadgeCheck = createStrokeIcon(() => (
  <>
    <rect x="4" y="5.5" width="16" height="14.5" rx="3" />
    <path d="M8 3v4.5" />
    <path d="M16 3v4.5" />
    <path d="M4 11h16" />
    <path d="M9 15l2 2 4-4" />
  </>
));

export const Sparkles = createStrokeIcon(() => (
  <>
    <path d="M7 4l1.2 3.2L11.5 8 8.2 9.3 7 12.5 5.8 9.3 2.5 8l3.3 -.8L7 4z" />
    <path d="M17 10l.9 2.4 2.6 .6-2.6 .6L17 16l-.9 -2.4-2.6 -.6 2.6 -.6L17 10z" />
    <path d="M13.5 4.5l.6 1.5 1.5 .4-1.5 .4-.6 1.5-.6-1.5-1.5 -.4 1.5 -.4.6-1.5z" />
  </>
));

export const CalendarBadge = createStrokeIcon(() => (
  <>
    <rect x="3.5" y="5" width="17" height="15" rx="3.2" />
    <path d="M8 3v4" />
    <path d="M16 3v4" />
    <path d="M3.5 10h17" />
  </>
));

export const ChevronLeftCircle = createStrokeIcon(() => (
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M13.5 8l-4 4 4 4" />
  </>
));

export const ChevronRightCircle = createStrokeIcon(() => (
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M10.5 8l4 4-4 4" />
  </>
));

export const InformationCircle = createStrokeIcon(() => (
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 8.5h.01" />
    <path d="M11.5 11h1v5" />
  </>
));

export const CalendarRings = createStrokeIcon(() => (
  <>
    <rect x="4" y="6" width="16" height="13" rx="3" />
    <path d="M4 11h16" />
    <path d="M9 15h6" />
  </>
));

