import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BMICalculatorModal from '../components/BMICalculatorModal';

describe('BMICalculatorModal Component', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(<BMICalculatorModal isOpen={false} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal when isOpen is true', () => {
    render(<BMICalculatorModal isOpen={true} onClose={() => {}} />);
    expect(screen.getAllByText(/Kilo & Vücut Kitle İndeksi \(VKİ\) Ölçümü/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Boyunuz/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Kilonuz/i).length).toBeGreaterThan(0);
  });

  it('calculates BMI correctly and displays ideal range, delta and SKS advisory for normal weight', () => {
    render(<BMICalculatorModal isOpen={true} onClose={() => {}} />);

    // Default height 170cm, weight 70kg -> BMI = 70 / (1.7^2) = 24.2 (Normal)
    const submitButton = screen.getByText(/VKİ Hesapla & Değerlendir/i);
    fireEvent.click(submitButton);

    expect(screen.getByText('24.2')).toBeTruthy();
    expect(screen.getByText(/Normal \(İdeal Kilo\)/i)).toBeTruthy();
    expect(screen.getByText(/İdeal kilodasınız/i)).toBeTruthy();
    expect(screen.getByText(/53.5 - 72.0 kg/i)).toBeTruthy();
    expect(screen.getAllByText(/T.C. İstanbul Esenyurt Üniversitesi Sağlık Kültür ve Spor Daire Başkanlığı/i).length).toBeGreaterThan(0);
  });

  it('calculates BMI and weight delta for underweight category', () => {
    render(<BMICalculatorModal isOpen={true} onClose={() => {}} />);

    // Height 180cm, weight 50kg -> BMI = 50 / (1.8^2) = 15.4 (Zayıf)
    const numberInputs = screen.getAllByRole('spinbutton');
    fireEvent.change(numberInputs[0], { target: { value: 180 } });
    fireEvent.change(numberInputs[1], { target: { value: 50 } });

    fireEvent.click(screen.getByText(/VKİ Hesapla & Değerlendir/i));

    expect(screen.getByText('15.4')).toBeTruthy();
    expect(screen.getByText(/Zayıf \(Düşük Kilo\)/i)).toBeTruthy();
    expect(screen.getByText(/\+9.9 kg almanız önerilir/i)).toBeTruthy();
  });

  it('calculates BMI and weight delta for overweight/obese category', () => {
    render(<BMICalculatorModal isOpen={true} onClose={() => {}} />);

    // Height 160cm, weight 90kg -> BMI = 90 / (1.6^2) = 35.2 (Obez)
    const numberInputs = screen.getAllByRole('spinbutton');
    fireEvent.change(numberInputs[0], { target: { value: 160 } });
    fireEvent.change(numberInputs[1], { target: { value: 90 } });

    fireEvent.click(screen.getByText(/VKİ Hesapla & Değerlendir/i));

    expect(screen.getByText('35.2')).toBeTruthy();
    expect(screen.getByText(/Obez \(Yüksek Risk\)/i)).toBeTruthy();
    expect(screen.getByText(/-26.3 kg vermeniz önerilir/i)).toBeTruthy();
  });

  /* ADVERSARIAL & EMPIRICAL STRESS TESTS */

  describe('Adversarial Stress Testing: BMI Boundaries', () => {
    it('tests boundary BMI = 18.5 (exactly Normal lower bound)', () => {
      render(<BMICalculatorModal isOpen={true} onClose={() => {}} />);
      const numberInputs = screen.getAllByRole('spinbutton');
      fireEvent.change(numberInputs[0], { target: { value: 100 } });
      fireEvent.change(numberInputs[1], { target: { value: 18.5 } });
      fireEvent.click(screen.getByText(/VKİ Hesapla & Değerlendir/i));

      expect(screen.getAllByText('18.5').length).toBeGreaterThan(0);
      expect(screen.getByText(/Normal \(İdeal Kilo\)/i)).toBeTruthy();
      expect(screen.getByText(/İdeal kilodasınız/i)).toBeTruthy();
    });

    it('tests boundary BMI = 24.9 (exactly Normal upper bound)', () => {
      render(<BMICalculatorModal isOpen={true} onClose={() => {}} />);
      const numberInputs = screen.getAllByRole('spinbutton');
      fireEvent.change(numberInputs[0], { target: { value: 100 } });
      fireEvent.change(numberInputs[1], { target: { value: 24.9 } });
      fireEvent.click(screen.getByText(/VKİ Hesapla & Değerlendir/i));

      expect(screen.getAllByText('24.9').length).toBeGreaterThan(0);
      expect(screen.getByText(/Normal \(İdeal Kilo\)/i)).toBeTruthy();
      expect(screen.getByText(/İdeal kilodasınız/i)).toBeTruthy();
    });

    it('tests boundary BMI = 25.0 (exactly Overweight lower bound)', () => {
      render(<BMICalculatorModal isOpen={true} onClose={() => {}} />);
      const numberInputs = screen.getAllByRole('spinbutton');
      fireEvent.change(numberInputs[0], { target: { value: 100 } });
      fireEvent.change(numberInputs[1], { target: { value: 25.0 } });
      fireEvent.click(screen.getByText(/VKİ Hesapla & Değerlendir/i));

      expect(screen.getAllByText('25.0').length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Fazla Kilolu/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/-0.1 kg vermeniz önerilir/i)).toBeTruthy();
    });

    it('tests boundary BMI = 29.9 (exactly Overweight upper bound)', () => {
      render(<BMICalculatorModal isOpen={true} onClose={() => {}} />);
      const numberInputs = screen.getAllByRole('spinbutton');
      fireEvent.change(numberInputs[0], { target: { value: 100 } });
      fireEvent.change(numberInputs[1], { target: { value: 29.9 } });
      fireEvent.click(screen.getByText(/VKİ Hesapla & Değerlendir/i));

      expect(screen.getAllByText('29.9').length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Fazla Kilolu/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/-5.0 kg vermeniz önerilir/i)).toBeTruthy();
    });

    it('tests boundary BMI = 30.0 (exactly Obese lower bound)', () => {
      render(<BMICalculatorModal isOpen={true} onClose={() => {}} />);
      const numberInputs = screen.getAllByRole('spinbutton');
      // Height 100cm (1.0m), Weight 30.0kg -> BMI = 30.0 / (1.0^2) = 30.0
      fireEvent.change(numberInputs[0], { target: { value: 100 } });
      fireEvent.change(numberInputs[1], { target: { value: 30.0 } });
      fireEvent.click(screen.getByText(/VKİ Hesapla & Değerlendir/i));

      expect(screen.getByText('30.0')).toBeTruthy();
      expect(screen.getByText(/Obez \(Yüksek Risk\)/i)).toBeTruthy();
      expect(screen.getByText(/-5.1 kg vermeniz önerilir/i)).toBeTruthy();
    });
  });

  describe('Adversarial Stress Testing: Extreme Heights & Weights', () => {
    it('tests extreme min height 100cm and max weight 250kg (BMI = 250)', () => {
      render(<BMICalculatorModal isOpen={true} onClose={() => {}} />);
      const numberInputs = screen.getAllByRole('spinbutton');
      fireEvent.change(numberInputs[0], { target: { value: 100 } });
      fireEvent.change(numberInputs[1], { target: { value: 250 } });
      fireEvent.click(screen.getByText(/VKİ Hesapla & Değerlendir/i));

      expect(screen.getByText('250.0')).toBeTruthy();
      expect(screen.getByText(/Obez \(Yüksek Risk\)/i)).toBeTruthy();
      // Pointer indicator should be clamped to 100%
      const arrowIndicator = document.querySelector('.animate-bounce')?.parentElement;
      expect(arrowIndicator?.style.left).toBe('100%');
    });

    it('tests extreme max height 250cm and min weight 30kg (BMI = 4.8)', () => {
      render(<BMICalculatorModal isOpen={true} onClose={() => {}} />);
      const numberInputs = screen.getAllByRole('spinbutton');
      fireEvent.change(numberInputs[0], { target: { value: 250 } });
      fireEvent.change(numberInputs[1], { target: { value: 30 } });
      fireEvent.click(screen.getByText(/VKİ Hesapla & Değerlendir/i));

      expect(screen.getByText('4.8')).toBeTruthy();
      expect(screen.getByText(/Zayıf \(Düşük Kilo\)/i)).toBeTruthy();
      // minIdeal = 18.5 * 2.5^2 = 115.625 -> 115.6 kg
      // maxIdeal = 24.9 * 2.5^2 = 155.625 -> 155.6 kg
      expect(screen.getByText(/115.6 - 155.6 kg/i)).toBeTruthy();
      expect(screen.getByText(/\+85.6 kg almanız önerilir/i)).toBeTruthy();
      // Pointer indicator should be within 0% and 25% (6.48648%)
      const arrowIndicator = document.querySelector('.animate-bounce')?.parentElement;
      const leftVal = parseFloat(arrowIndicator?.style.left || '0');
      expect(leftVal).toBeGreaterThanOrEqual(0);
      expect(leftVal).toBeLessThanOrEqual(100);
    });

    it('tests extreme height 250cm and weight 250kg (BMI = 40.0)', () => {
      render(<BMICalculatorModal isOpen={true} onClose={() => {}} />);
      const numberInputs = screen.getAllByRole('spinbutton');
      fireEvent.change(numberInputs[0], { target: { value: 250 } });
      fireEvent.change(numberInputs[1], { target: { value: 250 } });
      fireEvent.click(screen.getByText(/VKİ Hesapla & Değerlendir/i));

      expect(screen.getByText('40.0')).toBeTruthy();
      expect(screen.getByText(/Obez \(Yüksek Risk\)/i)).toBeTruthy();
      const arrowIndicator = document.querySelector('.animate-bounce')?.parentElement;
      expect(arrowIndicator?.style.left).toBe('100%');
    });
  });

  describe('Verification: Pointer Gauge Percentage Clamping', () => {
    it('ensures pointerPercent is clamped between 0% and 100% for all category boundaries', () => {
      // Test cases across spectrum
      const testCases = [
        { h: 250, w: 30, expectedMin: 0, expectedMax: 25 },   // Underweight
        { h: 170, w: 50, expectedMin: 0, expectedMax: 25 },   // Underweight
        { h: 170, w: 70, expectedMin: 25, expectedMax: 50 },  // Normal
        { h: 170, w: 80, expectedMin: 50, expectedMax: 75 },  // Overweight
        { h: 170, w: 120, expectedMin: 75, expectedMax: 100 },// Obese
        { h: 100, w: 250, expectedMin: 75, expectedMax: 100 } // Extreme Obese
      ];

      testCases.forEach(({ h, w, expectedMin, expectedMax }) => {
        const { unmount } = render(<BMICalculatorModal isOpen={true} onClose={() => {}} />);
        const numberInputs = screen.getAllByRole('spinbutton');
        fireEvent.change(numberInputs[0], { target: { value: h } });
        fireEvent.change(numberInputs[1], { target: { value: w } });
        fireEvent.click(screen.getByText(/VKİ Hesapla & Değerlendir/i));

        const arrowIndicator = document.querySelector('.animate-bounce')?.parentElement;
        const pointerPercent = parseFloat(arrowIndicator?.style.left || '0');

        expect(pointerPercent).toBeGreaterThanOrEqual(expectedMin);
        expect(pointerPercent).toBeLessThanOrEqual(expectedMax);
        expect(pointerPercent).toBeGreaterThanOrEqual(0);
        expect(pointerPercent).toBeLessThanOrEqual(100);

        unmount();
      });
    });
  });

  describe('Verification: Ideal Weight Range Exact Formulas', () => {
    it('validates minIdeal = 18.5 * (h/100)^2 and maxIdeal = 24.9 * (h/100)^2', () => {
      const heights = [100, 150, 170, 180, 200, 250];

      heights.forEach((h) => {
        const { unmount } = render(<BMICalculatorModal isOpen={true} onClose={() => {}} />);
        const numberInputs = screen.getAllByRole('spinbutton');
        fireEvent.change(numberInputs[0], { target: { value: h } });
        fireEvent.change(numberInputs[1], { target: { value: 70 } });
        fireEvent.click(screen.getByText(/VKİ Hesapla & Değerlendir/i));

        const hM = h / 100;
        const expectedMin = (18.5 * hM * hM).toFixed(1);
        const expectedMax = (24.9 * hM * hM).toFixed(1);

        expect(screen.getByText(`${expectedMin} - ${expectedMax} kg`)).toBeTruthy();

        unmount();
      });
    });
  });

  describe('Verification: Dynamic Esenyurt University SKS Advisory Text', () => {
    it('verifies Underweight advisory text', () => {
      render(<BMICalculatorModal isOpen={true} onClose={() => {}} />);
      const numberInputs = screen.getAllByRole('spinbutton');
      fireEvent.change(numberInputs[0], { target: { value: 180 } });
      fireEvent.change(numberInputs[1], { target: { value: 50 } });
      fireEvent.click(screen.getByText(/VKİ Hesapla & Değerlendir/i));

      expect(screen.getByText(/Diyetisyen ve Beslenme Danışmanlığı birimimize başvurarak/i)).toBeTruthy();
    });

    it('verifies Normal advisory text', () => {
      render(<BMICalculatorModal isOpen={true} onClose={() => {}} />);
      const numberInputs = screen.getAllByRole('spinbutton');
      fireEvent.change(numberInputs[0], { target: { value: 170 } });
      fireEvent.change(numberInputs[1], { target: { value: 70 } });
      fireEvent.click(screen.getByText(/VKİ Hesapla & Değerlendir/i));

      expect(screen.getByText(/Spor Birimi kampüs aktivitelerine katılım sağlayabilirsiniz/i)).toBeTruthy();
    });

    it('verifies Overweight advisory text', () => {
      render(<BMICalculatorModal isOpen={true} onClose={() => {}} />);
      const numberInputs = screen.getAllByRole('spinbutton');
      fireEvent.change(numberInputs[0], { target: { value: 170 } });
      fireEvent.change(numberInputs[1], { target: { value: 80 } });
      fireEvent.click(screen.getByText(/VKİ Hesapla & Değerlendir/i));

      expect(screen.getByText(/Sağlık Birimi rehberliğinde düzenli egzersiz programları/i)).toBeTruthy();
    });

    it('verifies Obese advisory text', () => {
      render(<BMICalculatorModal isOpen={true} onClose={() => {}} />);
      const numberInputs = screen.getAllByRole('spinbutton');
      fireEvent.change(numberInputs[0], { target: { value: 170 } });
      fireEvent.change(numberInputs[1], { target: { value: 100 } });
      fireEvent.click(screen.getByText(/VKİ Hesapla & Değerlendir/i));

      expect(screen.getByText(/Sağlık Danışmanlığı birimi uzmanlarımızla görüşerek/i)).toBeTruthy();
    });
  });

  it('resets form when Yeniden Hesapla is clicked', () => {
    render(<BMICalculatorModal isOpen={true} onClose={() => {}} />);

    fireEvent.click(screen.getByText(/VKİ Hesapla & Değerlendir/i));
    expect(screen.getByText('24.2')).toBeTruthy();

    fireEvent.click(screen.getByText(/Yeniden Hesapla/i));
    expect(screen.queryByText('24.2')).toBeNull();
    expect(screen.getByText(/VKİ Hesapla & Değerlendir/i)).toBeTruthy();
  });

  it('calls onClose when close button or Tamam is clicked', () => {
    const onCloseMock = vi.fn();
    render(<BMICalculatorModal isOpen={true} onClose={onCloseMock} />);

    fireEvent.click(screen.getByText(/VKİ Hesapla & Değerlendir/i));
    fireEvent.click(screen.getByText(/Tamam/i));

    expect(onCloseMock).toHaveBeenCalled();
  });
});

