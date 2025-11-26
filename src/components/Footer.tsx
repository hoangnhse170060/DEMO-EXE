import { Facebook, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { icon: Facebook, label: 'Facebook', url: '#' },
    { icon: Youtube, label: 'YouTube', url: '#' },
    { icon: Instagram, label: 'Instagram', url: '#' },
  ];

  return (
    <footer className="bg-[#0D0D0D] border-t border-[#333333] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex space-x-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.url}
                aria-label={social.label}
                className="text-[#9CA3AF] hover:text-[#F4D03F] transition-colors duration-300"
              >
                <social.icon size={24} />
              </a>
            ))}
          </div>

          <div className="text-center">
            <p className="text-[#F4D03F] font-serif text-sm mb-2">
              Nơi quá khứ ngân vang trong từng hơi thở hiện đại
            </p>
            <p className="text-[#6B7280] text-xs">
              © 2025 Try Your Best – Echoes of Việt Nam
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
