# 📊 Calculadora de Amortización de Créditos

Plataforma de cálculo de tablas de amortización bajo el **Sistema Francés** (cuota constante), construida con **React + TypeScript + Vite**.

---

## 🚀 Instalación Local

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en desarrollo
npm run dev

# 3. Abrir en el navegador
# http://localhost:5173
```

---

## 🌐 Despliegue en Vercel — Paso a Paso

### Opción A: Desde la interfaz web de Vercel (más fácil)

#### Paso 1 — Subir el código a GitHub
```bash
# En la carpeta del proyecto
git init
git add .
git commit -m "feat: calculadora de amortización inicial"

# Crear repositorio en github.com y luego:
git remote add origin https://github.com/TU_USUARIO/calculadora-amortizacion.git
git push -u origin main
```

#### Paso 2 — Conectar con Vercel
1. Ir a [vercel.com](https://vercel.com) y crear cuenta (gratis)
2. Click en **"Add New → Project"**
3. Click en **"Import Git Repository"**
4. Seleccionar el repositorio `calculadora-amortizacion`
5. Vercel auto-detecta Vite/React

#### Paso 3 — Configurar el proyecto
En la pantalla de configuración de Vercel:
| Campo | Valor |
|-------|-------|
| Framework Preset | **Vite** |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

#### Paso 4 — Desplegar
- Click en **"Deploy"**
- Vercel construye y despliega (~1-2 minutos)
- Obtienes URL automática: `https://calculadora-amortizacion.vercel.app`

---

### Opción B: Desde CLI de Vercel

```bash
# 1. Instalar Vercel CLI globalmente
npm install -g vercel

# 2. Iniciar sesión
vercel login

# 3. Desde la carpeta del proyecto, desplegar
vercel

# Seguir las instrucciones interactivas:
# ? Set up and deploy "calculadora-amortizacion"? → Y
# ? Which scope? → Tu cuenta
# ? Link to existing project? → N
# ? What's your project name? → calculadora-amortizacion
# ? In which directory is your code? → ./
# ? Want to modify settings? → N

# 4. Para producción (dominio estable)
vercel --prod
```

---

### Opción C: Despliegue automático (CI/CD)

Después de conectar GitHub con Vercel:
- Cada `git push` a `main` → re-despliega automáticamente
- Cada Pull Request → genera un preview URL único

---

## ⚙️ Variables de Entorno

No se requieren variables de entorno para funcionar.
Si agrega backend en el futuro, créelas en:
**Vercel Dashboard → Settings → Environment Variables**

---

## 📁 Estructura del Proyecto

```
calculadora-amortizacion/
├── src/
│   ├── types/
│   │   └── amortization.ts      # Tipos TypeScript
│   ├── utils/
│   │   └── amortization.ts      # Lógica de cálculo
│   ├── components/
│   │   └── AmortizationCalculator.tsx  # Componente principal
│   ├── App.tsx
│   ├── App.css                  # Estilos globales
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🧮 Fórmula Utilizada

**Cuota fija mensual (Sistema Francés):**

```
M = P × [r(1+r)^n] / [(1+r)^n - 1]
```

Donde:
- `P` = Capital (principal)
- `r` = Tasa de interés mensual
- `n` = Número de periodos (meses)
- `M` = Cuota mensual fija

**Conversión de tasas:**
- Nominal anual → mensual: `r = TNA / 12`
- Efectiva anual → mensual: `r = (1 + TEA)^(1/12) - 1`
