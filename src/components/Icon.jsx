import {
  ArrowRight, AtSign, Award, BriefcaseBusiness, Building2, Cable, Check,
  ChevronLeft, ChevronRight, ClipboardList, Clock3, Droplets, Eye, Factory,
  Fan, Flame, Handshake, Hotel, House, KeyRound, Landmark, Mail, MapPin,
  Menu, MessageSquareText, Network, Phone, Quote, Send, ShieldCheck,
  SolarPanel, Target, UserRound, Workflow, Wrench, X,
} from 'lucide-react';

const icons = {
  arrow: ArrowRight, bolt: Cable, wind: Fan, drop: Droplets, shield: ShieldCheck,
  signal: Network, sun: SolarPanel, key: KeyRound, layers: Workflow, check: Check,
  target: Target, eye: Eye, map: MapPin, mail: Mail, phone: Phone, clock: Clock3,
  close: X, menu: Menu, quote: Quote, award: Award, home: House,
  company: Building2, services: Wrench, projects: BriefcaseBusiness,
  clients: Handshake, fire: Flame, hospitality: Hotel, industrial: Factory,
  infrastructure: Landmark, user: UserRound, email: AtSign,
  clipboard: ClipboardList, message: MessageSquareText, send: Send,
  previous: ChevronLeft, next: ChevronRight,
};

export default function Icon({ name, size = 22 }) {
  const LucideIcon = icons[name] || Building2;
  return <LucideIcon className="icon" size={size} strokeWidth={1.8} aria-hidden="true" />;
}
