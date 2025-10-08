import React from 'react';
import {
  // nav/content
  User, Calendar, FileText, DollarSign, Users, BookOpen, Inbox, HelpCircle, Bell,
  Briefcase, Shield, ClipboardList, BarChart3, UserPlus, Search, Upload, Edit,
  CreditCard, Calculator, Building2, Headphones, MessageSquare, Settings, Palette, Plus, Clock,
  // controls/util
  ChevronDown, ChevronRight, ChevronLeft, ChevronUp, LogOut, X, Star, Paperclip, Reply, Forward, Trash2, Send,
  type LucideIcon
} from 'lucide-react';

export const ICONS = {
  // nav/content
  User, Calendar, FileText, DollarSign, Users, BookOpen, Inbox, HelpCircle, Bell,
  Briefcase, Shield, ClipboardList, BarChart3, UserPlus, Search, Upload, Edit,
  CreditCard, Calculator, Building2, Headphones, MessageSquare, Settings, Palette, Plus, Clock,
  // controls/util
  ChevronDown, ChevronRight, ChevronLeft, ChevronUp, LogOut, X, Star, Paperclip, Reply, Forward, Trash2, Send,
} as const;

export type IconName = keyof typeof ICONS;

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  strokeWidth?: number;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, strokeWidth = 2, ...rest }) => {
  const Cmp = (ICONS as any)[name] as LucideIcon | undefined;

  if (!Cmp) {
    // safe fallback: warn and render a neutral square placeholder
    // This prevents the "Element type is invalid" crash while you find incorrect names.
    // Also helpful when SamplePanel is auto-rendering unknown exports.
    // eslint-disable-next-line no-console
    console.warn(`Icon: unknown name "${name}" — available: ${Object.keys(ICONS).join(', ')}`);
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        {...rest}
      >
        <rect x="2" y="2" width="20" height="20" rx="3" fill="rgba(6,18,16,0.06)" />
      </svg>
    );
  }

  return <Cmp size={size} strokeWidth={strokeWidth} {...rest} />;
};

export default Icon;