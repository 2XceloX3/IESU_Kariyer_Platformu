import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileUpdate from '../components/ProfileUpdate';
import useAppStore from '../store/useAppStore';

describe('ProfileUpdate - Branch Customization & 12 Soru & Alt Panel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.setState({
      activePortalBranch: 'alumni',
      previousView: 'alumni',
      currentUser: {
        id: 'mock-alumni-1',
        name: 'Ali Yılmaz',
        email: 'ali.yilmaz@alumni.esenyurt.edu.tr',
        role: 'alumni',
        department: 'Bilgisayar Mühendisliği',
        faculty: 'Mühendislik ve Mimarlık Fakültesi',
        graduationYear: '2023',
        employed: true,
        sector: 'Bilişim & Yazılım',
        title: 'Kıdemli Yazılım Uzmanı',
        checkupAnswers: {
          1: 'Evet',
          2: '0 - 3 Ay İçinde',
          3: 'Bilişim & Yazılım',
          4: 'Özel Şirket',
          5: 'Kıdemli Yazılım Uzmanı',
          6: 'Evet',
          7: 'İstanbul / Türkiye',
          8: 'Hibrit',
          9: 'Hayır',
          10: 'Evet',
          11: 'Evet',
          12: 'Harika bir kariyer ekosistemi.'
        }
      }
    });
  });

  it('1. Sağ üstteki Dal switcher hap menüsü KESİNLİKLE kaldırılmış olmalıdır', () => {
    render(
      <ProfileUpdate 
        setView={vi.fn()} 
        currentUser={useAppStore.getState().currentUser}
        setCurrentUser={vi.fn()}
        userRole="admin"
      />
    );
    expect(screen.queryByText(/^Dal:$/i)).toBeNull();
  });

  it('2. Mezun portalında 12 Soruluk Mezun Kariyer Anketi sekmesi ve 12 soru bulunmalıdır', () => {
    render(
      <ProfileUpdate 
        setView={vi.fn()} 
        currentUser={useAppStore.getState().currentUser}
        setCurrentUser={vi.fn()}
        userRole="alumni"
      />
    );

    const checkupTab = screen.getByText(/12 Soruluk Mezun Kariyer Anketi/i);
    expect(checkupTab).toBeDefined();

    fireEvent.click(checkupTab);

    expect(screen.getByText(/12 \/ 12/i)).toBeDefined();
    expect(screen.getByText(/1\. Şu anda aktif olarak çalışıyor musunuz\?/i)).toBeDefined();
    expect(screen.getByText(/2\. İlk işinizi mezun olduktan ne kadar süre sonra buldunuz\?/i)).toBeDefined();
    expect(screen.getByText(/3\. Çalıştığınız sektör/i)).toBeDefined();
    expect(screen.getByText(/4\. Çalıştığınız kurumun türü/i)).toBeDefined();
    expect(screen.getByText(/5\. Mevcut göreviniz \/ ünvanınız/i)).toBeDefined();
    expect(screen.getByText(/6\. Çalıştığınız iş mezun olduğunuz bölümle ilişkili mi\?/i)).toBeDefined();
    expect(screen.getByText(/7\. Çalıştığınız il \/ ülke/i)).toBeDefined();
    expect(screen.getByText(/8\. Çalışma şekliniz/i)).toBeDefined();
    expect(screen.getByText(/9\. Lisansüstü eğitim alıyor musunuz\?/i)).toBeDefined();
    expect(screen.getByText(/10\. Telefon numaranız güncel mi\?/i)).toBeDefined();
    expect(screen.getByText(/11\. E-posta adresiniz güncel mi\?/i)).toBeDefined();
    expect(screen.getByText(/12\. Üniversitemize veya Kariyer Merkezimize iletmek istediğiniz görüş ve önerileriniz var mı\?/i)).toBeDefined();
  });

  it('3. Alt panel (floating dock) bulunmalı ve ana akışa dönüşü sağlamalıdır', () => {
    const mockSetView = vi.fn();
    render(
      <ProfileUpdate 
        setView={mockSetView} 
        currentUser={useAppStore.getState().currentUser}
        setCurrentUser={vi.fn()}
        userRole="alumni"
      />
    );

    const backButtons = screen.getAllByTitle(/Mezun Akışına Dön/i);
    expect(backButtons.length).toBeGreaterThan(0);

    fireEvent.click(backButtons[0]);
    expect(mockSetView).toHaveBeenCalledWith('alumni');
  });

  it('4. Öğrenci portalında öğrenciye özel sekmeler olmalıdır', () => {
    useAppStore.setState({
      activePortalBranch: 'student',
      previousView: 'student'
    });

    render(
      <ProfileUpdate 
        setView={vi.fn()} 
        currentUser={useAppStore.getState().currentUser}
        setCurrentUser={vi.fn()}
        userRole="student"
      />
    );

    expect(screen.getByText(/Akademik Eğitim & ÇAP/i)).toBeDefined();
    expect(screen.getAllByText(/Akıllı CV/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/12 Soruluk Mezun Kariyer Anketi/i)).toBeNull();
  });

  it('5. Tüm portallarda üst sekme etiketlerinde mükerrer unicode emoji bulunmamalıdır', () => {
    const branches = ['student', 'alumni', 'academic', 'company', 'admin'];
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

    branches.forEach(branch => {
      useAppStore.setState({ activePortalBranch: branch, previousView: branch });
      const { unmount } = render(
        <ProfileUpdate 
          setView={vi.fn()} 
          currentUser={{ ...useAppStore.getState().currentUser, role: branch }}
          setCurrentUser={vi.fn()}
          userRole={branch}
        />
      );

      const navs = screen.getAllByRole('navigation');
      const tabNav = navs[1] || navs[0];
      const buttons = tabNav.querySelectorAll('button');
      buttons.forEach(btn => {
        const text = btn.querySelector('span')?.textContent || '';
        if (text) {
          expect(emojiRegex.test(text)).toBe(false);
        }
      });

      unmount();
    });
  });
});
