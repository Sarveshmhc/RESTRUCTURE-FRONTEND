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
  const Cmp = ICONS[name] as LucideIcon;
  return <Cmp size={size} strokeWidth={strokeWidth} {...rest} />;
};

export default Icon;