import { Platform, PlatformColors } from "@/types";
import { cn } from "@/lib/utils";

const platformIcons: Record<Platform, React.ReactNode> = {
  xiaohongshu: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 5.5c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5S9 15.83 9 15V9c0-.83.67-1.5 1.5-1.5zm5 0c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5S14 15.83 14 15V9c0-.83.67-1.5 1.5-1.5z" />
    </svg>
  ),
  douyin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.45a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.18z" />
    </svg>
  ),
  kuaishou: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.3L19.5 8 12 11.7 4.5 8 12 4.3z" />
    </svg>
  ),
  weixin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M8.69 4C4.83 4 1.7 6.57 1.7 9.74c0 1.85 1.07 3.49 2.74 4.56L3.6 16.2l2.14-1.15c.76.21 1.57.33 2.4.35-.15-.5-.23-1.02-.23-1.56 0-3.03 2.88-5.49 6.43-5.49.24 0 .47.01.7.04C14.3 5.67 11.75 4 8.69 4zm-2.4 3.3a.93.93 0 1 1 0 1.86.93.93 0 0 1 0-1.86zm4.8 0a.93.93 0 1 1 0 1.86.93.93 0 0 1 0-1.86zm4.2 3.2c-3.1 0-5.62 2.15-5.62 4.8 0 2.65 2.52 4.8 5.62 4.8.63 0 1.24-.09 1.8-.26l1.77.95-.48-1.58c1.38-.88 2.27-2.26 2.27-3.91 0-2.65-2.52-4.8-5.36-4.8zm-1.8 2.3a.76.76 0 1 1 0 1.52.76.76 0 0 1 0-1.52zm3.6 0a.76.76 0 1 1 0 1.52.76.76 0 0 1 0-1.52z" />
    </svg>
  ),
  web: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  ),
};

interface PlatformIconProps {
  platform: Platform;
  size?: number;
  className?: string;
}

export function PlatformIcon({ platform, size = 20, className }: PlatformIconProps) {
  return (
    <div
      className={cn("flex items-center justify-center rounded-full", className)}
      style={{
        width: size,
        height: size,
        backgroundColor: PlatformColors[platform],
        color: "white",
      }}
    >
      <div style={{ width: size * 0.6, height: size * 0.6 }}>
        {platformIcons[platform]}
      </div>
    </div>
  );
}
