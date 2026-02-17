# Veekaitsevööndi kalkulaator - Cursor setup

## Projekti struktuur lõpptulemusena:
```
veekaitse-kalkulaator/
├── api/
│   ├── field/
│   │   └── [id].js          # PRIA proxy
│   └── water-zones.js       # Keskkonnaagentuuri proxy
├── public/
│   └── index.html            # Frontend
├── package.json
├── vercel.json
└── .gitignore
```

## Samm-sammult

### 1. Loo uus kaust ja ava Cursoris
```bash
mkdir veekaitse-kalkulaator
cd veekaitse-kalkulaator
code .
```

### 2. Loo kõik failid (allpool)

### 3. Git + GitHub
```bash
git init
git add .
git commit -m "veekaitse kalkulaator"
gh repo create veekaitse-kalkulaator --public --push --source=.
```
(Või tee GitHub Desktop / GitHub.com kaudu)

### 4. Vercel deploy
- Mine vercel.com → "Add New Project" → import GitHubi repo
- Mitte midagi muuta, vajuta "Deploy"
- Valmis! Töötab automaatselt.

## Maksumus
Vercel Hobby (tasuta): 100GB bandwidth/kuu, serverless functions kaasas.
Selle rakenduse jaoks täiesti piisav.
