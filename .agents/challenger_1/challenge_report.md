# Challenge Report — BMICalculatorModal.jsx

## Challenge Summary

**Overall risk assessment**: LOW

All calculations, boundary condition transitions, dynamic gauge pointer percentage clamping (0% - 100%), ideal weight range formulas, and Esenyurt University SKS advisory output text updates operate accurately and strictly within mathematical specifications.

---

## Stress Test Results

| Test Scenario | Inputs (Height, Weight) | Expected BMI & Category | Expected Ideal Range (kg) | Expected Pointer % | Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Boundary BMI = 18.5 | h = 100 cm, w = 18.5 kg | 18.5 (Normal) | 18.5 - 24.9 kg | 25.0% | PASS |
| Boundary BMI = 24.9 | h = 100 cm, w = 24.9 kg | 24.9 (Normal) | 18.5 - 24.9 kg | 50.0% | PASS |
| Boundary BMI = 25.0 | h = 100 cm, w = 25.0 kg | 25.0 (Fazla Kilolu) | 18.5 - 24.9 kg | 50.0% | PASS |
| Boundary BMI = 29.9 | h = 100 cm, w = 29.9 kg | 29.9 (Fazla Kilolu) | 18.5 - 24.9 kg | 75.0% | PASS |
| Boundary BMI = 30.0 | h = 100 cm, w = 30.0 kg | 30.0 (Obez) | 18.5 - 24.9 kg | 75.0% | PASS |
| Extreme Min Height / Min Weight | h = 100 cm, w = 30.0 kg | 30.0 (Obez) | 18.5 - 24.9 kg | 75.0% | PASS |
| Extreme Min Height / Max Weight | h = 100 cm, w = 250.0 kg | 250.0 (Obez) | 18.5 - 24.9 kg | 100.0% (Clamped) | PASS |
| Extreme Max Height / Min Weight | h = 250 cm, w = 30.0 kg | 4.8 (Zayıf) | 115.6 - 155.6 kg | 6.49% | PASS |
| Extreme Max Height / Max Weight | h = 250 cm, w = 250.0 kg | 40.0 (Obez) | 115.6 - 155.6 kg | 100.0% (Clamped) | PASS |

---

## Detailed Findings & Challenge Dimensions

### 1. Mathematical Formula Integrity
- **Ideal Weight Range Formula**: `minIdeal = 18.5 * (h/100)^2` and `maxIdeal = 24.9 * (h/100)^2`. Verified in `BMICalculatorModal.jsx` lines 66-67:
  ```javascript
  const minIdeal = 18.5 * (hInMeters * hInMeters);
  const maxIdeal = 24.9 * (hInMeters * hInMeters);
  ```
  Evaluates with zero error for all height inputs (100cm, 150cm, 170cm, 180cm, 200cm, 250cm).

### 2. Pointer Arrow Percentage Clamping & Gauge Overflow Defense
- **Formula across 4 spectrum zones**:
  - Zone 1 (`bmiVal < 18.5`): `Math.max(0, Math.min(25, (bmiVal / 18.5) * 25))` -> strictly in `[0%, 25%]`.
  - Zone 2 (`18.5 <= bmiVal <= 24.9`): `25 + Math.min(25, Math.max(0, ((bmiVal - 18.5) / 6.4) * 25))` -> strictly in `[25%, 50%]`.
  - Zone 3 (`25.0 <= bmiVal <= 29.9`): `50 + Math.min(25, Math.max(0, ((bmiVal - 25) / 4.9) * 25))` -> strictly in `[50%, 75%]`.
  - Zone 4 (`bmiVal >= 30.0`): `75 + Math.min(25, Math.max(0, ((bmiVal - 30) / 10) * 25))` -> strictly in `[75%, 100%]`.
- **Clamping Verification**: Even under massive extreme values (e.g. height=100cm, weight=250kg -> BMI 250.0), `pointerPercent` evaluates to `75 + 25 = 100%`. Overflow outside the 0% - 100% gauge boundary is mathematically impossible.

### 3. Dynamic Esenyurt University SKS Advisory Text
- **Category Specificity**:
  - **Zayıf (<18.5)**: Refers to "T.C. İstanbul Esenyurt Üniversitesi Sağlık Kültür ve Spor Daire Başkanlığı Diyetisyen ve Beslenme Danışmanlığı birimi".
  - **Normal (18.5 - 24.9)**: Refers to "T.C. İstanbul Esenyurt Üniversitesi Sağlık Kültür ve Spor Daire Başkanlığı Spor Birimi kampüs aktiviteleri".
  - **Fazla Kilolu (25.0 - 29.9)**: Refers to "T.C. İstanbul Esenyurt Üniversitesi Sağlık Kültür ve Spor Daire Başkanlığı Sağlık Birimi rehberliğinde düzenli egzersiz programları".
  - **Obez (>=30.0)**: Refers to "T.C. İstanbul Esenyurt Üniversitesi Sağlık Kültür ve Spor Daire Başkanlığı Sağlık Danışmanlığı birimi uzmanlarımızla görüşerek kapsamlı sağlık taraması".
- Dynamic state updating upon calculation: Fully verified.

### 4. Unit Test Suite Status
- Unit tests in `src/__tests__/BMICalculatorModal.test.jsx` were upgraded with comprehensive test suites for boundary conditions, extreme height/weight, pointer percentage clamping, ideal weight formulas, and dynamic advisory outputs.

---

## Unchallenged Areas
- Full CSS animation rendering in real browser DOM (unit tests run under JSDOM environment).
