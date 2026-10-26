import { Link } from 'react-router-dom';
import { Shield, Key, Bell, CreditCard, ChevronRight } from 'lucide-react';

export default function StudentSettings() {
  const settingsSections = [
    {
      title: 'Hesap ve Güvenlik',
      items: [
        { id: 'password', icon: Key, title: 'Şifre Değiştir', desc: 'Hesap şifrenizi güncellemek için', link: '/change-password' },
        { id: 'security', icon: Shield, title: 'Güvenlik Ayarları', desc: '2FA ve diğer güvenlik seçenekleri', link: '/security-settings' }
      ]
    },
    {
      title: 'Bildirimler',
      items: [
        { id: 'notifications', icon: Bell, title: 'Bildirim Tercihleri', desc: 'Hangi bildirimleri almak istediğinizi seçin', link: '/notification-preferences' }
      ]
    },
    {
      title: 'Ödemeler',
      items: [
        { id: 'billing', icon: CreditCard, title: 'Fatura Bilgileri', desc: 'Ödeme yöntemleri ve geçmişi', link: '/billing-info' }
      ]
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Ayarlar</h1>
      <div className="space-y-8">
        {settingsSections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">{section.title}</h2>
            <div className="space-y-4">
              {section.items.map(item => (
                <Link key={item.id} to={item.link} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
