import React from 'react';
import { 
  Laptop, 
  Camera, 
  Wrench, 
  Shield, 
  Server, 
  Wifi, 
  Printer, 
  Cpu, 
  Fingerprint, 
  Volume2, 
  HardDrive, 
  Clock, 
  Users, 
  ThumbsUp, 
  Headphones, 
  Award, 
  CheckCircle, 
  Sparkles,
  Calendar,
  PhoneCall,
  Settings,
  HelpCircle
} from 'lucide-react';

interface IconProps {
  name?: string;
  className?: string;
}

const iconMap: Record<string, React.ElementType> = {
  laptop: Laptop,
  computer: Cpu,
  camera: Camera,
  cctv: Camera,
  wrench: Wrench,
  shield: Shield,
  server: Server,
  wifi: Wifi,
  printer: Printer,
  fingerprint: Fingerprint,
  biometric: Fingerprint,
  'volume-2': Volume2,
  speaker: Volume2,
  audio: Volume2,
  'hard-drive': HardDrive,
  clock: Clock,
  users: Users,
  'thumbs-up': ThumbsUp,
  headphones: Headphones,
  award: Award,
  check: CheckCircle,
  sparkles: Sparkles,
  calendar: Calendar,
  phone: PhoneCall,
  settings: Settings,
};

export const DynamicIcon: React.FC<IconProps> = ({ name, className = "w-6 h-6" }) => {
  if (!name) return <HelpCircle className={className} />;
  const normalized = name.toLowerCase().trim();
  const IconComponent = iconMap[normalized] || Wrench;
  return <IconComponent className={className} />;
};
