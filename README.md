# Axiom — Deterministic Agent Swarm Operations (AI B2B SaaS Landing Page)

A modern, high conversion AI B2B SaaS landing page designed for static deployment on **GitHub Pages**.

Built according to strict design engineering standards:
- **Zero Unicode Emojis**: Crisp SVG vector iconography (Phosphor / Solar style).
- **Typography**: Manrope + Geist Mono for telemetry metrics, strictly snapped to standard type scale with `text-wrap: balance` & `text-wrap: pretty`.
- **Flat Surface Colors**: Deep `#000000` base, `#181818` / `#1F1F1F` cards without tacky background gradients.
- **Mandatory Tagline Word Reveal**: Word by word scroll triggered transition with `IntersectionObserver`.
- **Interactive Telemetry Terminal**: Live simulated swarm throughput, active workers count, and distributed execution log.
- **Accessible Native Dialog**: `<dialog>` modal with backdrop blur, light dismiss, and form validation for "Book Demo".
- **Transparent Pricing Calculator**: Monthly / Annual billing toggle (-20% discount).
- **Custom Branded 404 Page**: Included for complete GitHub Pages routing.

---

## 🚀 Quick Start / Local Preview

Open `index.html` directly in any web browser, or run a local static server:

```bash
# Using python:
python -m http.server 8080

# Using npx serve:
npx serve .
```

Visit `http://localhost:8080`.

---

## 🌐 Deploy to GitHub Pages (1 Minute)

1. Initialize Git and create a repository on GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete AI B2B SaaS landing page"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. Go to **Settings** → **Pages** in your GitHub repository.
3. Under **Branch**, select `main` and root folder `/`, then click **Save**.
4. Your site will be live at `https://<your-username>.github.io/<your-repo-name>/`.
