import Link from 'next/link';

const SidebarLink = ({ Icon, label, href }) => (
  <Link href={href}>
    <div className="flex items-center space-x-3 text-gray-700 hover:bg-[#F3EAE7] active:bg-[#EBE0DD] px-4 py-3 lg:py-2 rounded-md cursor-pointer transition-colors duration-200">
      <Icon className="h-6 w-6 lg:h-5 lg:w-5" />
      <span className="text-base lg:text-sm font-medium">{label}</span>
    </div>
  </Link>
);

export default SidebarLink;