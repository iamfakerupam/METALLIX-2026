declare module 'react-vertical-timeline-component' {
  import { ReactNode } from 'react';

  export interface VerticalTimelineProps {
    animate?: boolean;
    className?: string;
    layout?: '1-column-left' | '1-column-right' | '2-columns';
    lineColor?: string;
    children?: ReactNode;
  }

  export interface VerticalTimelineElementProps {
    className?: string;
    contentStyle?: React.CSSProperties;
    contentArrowStyle?: React.CSSProperties;
    date?: string;
    dateClassName?: string;
    iconClassName?: string;
    icon?: ReactNode;
    iconStyle?: React.CSSProperties;
    iconOnClick?: () => void;
    position?: 'left' | 'right';
    style?: React.CSSProperties;
    textClassName?: string;
    visible?: boolean;
    children?: ReactNode;
  }

  export const VerticalTimeline: React.FC<VerticalTimelineProps>;
  export const VerticalTimelineElement: React.FC<VerticalTimelineElementProps>;
}

declare module 'react-vertical-timeline-component/style.min.css';