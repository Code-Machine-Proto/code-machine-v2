# CodeMachine v3

Simulateur interactif de chemin de donnees pour le cours **INF1600** a Polytechnique Montreal. Ecrivez des programmes en assembleur, compilez-les, et visualisez l'execution du processeur cycle par cycle — du code source jusqu'aux signaux de controle.

<!-- Screenshot de la page d'accueil -->
![Page d'accueil](docs/screenshots/home.png)

---

## Fonctionnalites

- **Editeur de code** avec coloration syntaxique, diagnostics en temps reel et raccourcis clavier (CodeMirror 6)
- **Visualisation du circuit** — schema interactif du chemin de donnees avec mise en surbrillance des signaux actifs a chaque cycle
- **Panneau memoire** — vue tabulaire de la memoire avec format HEX/DEC configurable
- **Panneau registres** — affichage en temps reel de l'etat de chaque registre
- **Navigation temporelle** — avancez, reculez, ou naviguez librement entre les cycles d'execution
- **Reference d'instructions** — tiroir lateral avec le jeu d'instructions complet du processeur selectionne
- **Theme clair / sombre** — basculez selon votre preference, persiste entre les sessions
- **Panneaux redimensionnables** — ajustez la disposition de l'interface selon vos besoins
- **Zoom et panoramique** — explorez le circuit en detail (molette + Alt+clic)

## Processeurs supportes

| Processeur | Instructions | Registres | Architecture memoire |
|---|---|---|---|
| **Accumulateur** | 10 | ACC | Von Neumann (unifiee) |
| **Accumulateur + MA** | 21 | ACC, MA | Von Neumann (unifiee) |
| **PolyRisc** | 17 | 32 registres + drapeaux Z, N | Harvard (separee) |

---

## Captures d'ecran

### Espace de travail — Mode sombre

<!-- Screenshot du workspace en mode sombre avec du code compile et le circuit actif -->
![Workspace sombre](docs/screenshots/workspace-dark.png)

### Espace de travail — Mode clair

<!-- Screenshot du workspace en mode clair -->
![Workspace clair](docs/screenshots/workspace-light.png)

### Visualisation du circuit

<!-- Screenshot en zoom sur le circuit avec des signaux actifs (fils rouges/verts) -->
![Circuit actif](docs/screenshots/circuit-detail.png)

### Reference d'instructions

<!-- Screenshot du tiroir lateral d'instructions ouvert -->
![Instructions](docs/screenshots/instruction-drawer.png)

---

## Architecture technique

```
code-machine-v2/
├── simulator/          # Backend Rust compile en WebAssembly
│   └── src/
│       ├── compiler/   # Compilation assembleur → programme
│       ├── engine/     # Moteurs de simulation par processeur
│       └── lib.rs      # Interface WASM (wasm-bindgen)
├── frontend/           # Application SolidJS
│   ├── src/
│   │   ├── components/ # Composants UI (editeur, circuit, memoire, etc.)
│   │   ├── pages/      # Pages (Home, Workspace)
│   │   ├── stores/     # Etats globaux (simulation, theme)
│   │   └── wasm/       # Bridge TypeScript ↔ WASM
│   └── electron/       # Configuration Electron (app bureau)
└── docs/               # Documentation et ressources
```

### Stack technique

| Couche | Technologie | Role |
|---|---|---|
| Simulation | **Rust** → **WebAssembly** | Compilation assembleur, execution cycle par cycle |
| Interface | **SolidJS** + **TypeScript** | Rendu reactif, gestion d'etat |
| Style | **Tailwind CSS v4** | Theme clair/sombre, composants responsifs |
| Editeur | **CodeMirror 6** | Coloration syntaxique, diagnostics, raccourcis |
| Bureau | **Electron** | Distribution multiplateforme (Windows, macOS, Linux) |

---

## Installation et developpement

### Prerequis

- [Rust](https://rustup.rs/) (stable)
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)
- [Node.js](https://nodejs.org/) >= 18
- npm

### Compiler le simulateur WASM

```bash
cd simulator
wasm-pack build --target web --dev
```

### Lancer le frontend en developpement

```bash
cd frontend
npm install
npm run dev
```

L'application sera accessible a `http://localhost:5173`.

### Construire pour la production

```bash
# Compilation WASM optimisee
cd simulator
wasm-pack build --target web --release

# Build frontend + packaging Electron
cd frontend
npm run build
npx electron-builder
```

Les executables sont generes dans `frontend/release/`.

### Lancer les tests

```bash
cd frontend
npm test           # Execution unique
npm run test:watch # Mode surveillance
```

---

## Raccourcis clavier

| Raccourci | Action |
|---|---|
| `Ctrl + Entree` | Compiler le code |
| `Espace` | Lecture / pause |
| `Fleche droite` | Cycle suivant |
| `Fleche gauche` | Cycle precedent |
| `Home` | Retour au debut |
| `End` | Aller a la fin |
| `Molette` | Zoom sur le circuit |
| `Alt + clic` | Panoramique du circuit |

---

## Convention de commits

Les commits suivent le format :

```
<type>(<portee>): <description courte>
```

| Type | Usage |
|---|---|
| `feat` | Fonctionnalite ou ajout |
| `fix` | Correction de bug |
| `style` | Formatage, mise en page |
| `refactor` | Reusinage du code |
| `doc` | Documentation |
| `test` | Ajout ou modification de tests |
| `chore` | Maintenance, dependances |

---

## Licence

Voir [LICENSE](LICENSE).
