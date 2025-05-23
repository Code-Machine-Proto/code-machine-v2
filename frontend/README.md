# Frontend du projet CodeMachine v2

    Cette interface pour le projet est utilisé par une appplication electron et un site web statique classique. Pour pouvoir déveloper le projet, vous devez avoir node au moins à 22 avec npm d'installer sur votre machine.

## Technologie utilisé

- node/npm
- React
- React-Router
- TypeScript
- TailwindCSS
- Vite
- eslint
- Librairie de test à venir

## node/npm

npm est le package manager de base de node. Documentation de [npm](https://docs.npmjs.com/). L'environnement de dévelopement est node qui vient avec certaine fonction de base dans la [documentation](https://nodejs.org/docs/latest-v22.x/api/index.html).

### Script npm

#### npm ci

# **Obligatoire**

Pour installer les dépendances du projet avant de commencer à déveloper.

#### npm run dev

```
react-router dev --mode website
```

Commande pour partir le frontend en mode dévelopement. Le mode indique qu'il sera ouvert avec les modules propres à la version pour un fureteur régulier.

#### npm run build

```
react-router build --mode website
```

Commande pour construire la plateforme en incluant les modules pour le site web pour un fureteur régulier. À exécuter avant la commande npm start.

#### npm start

```
vite preview
```

Commande pour partir le serveur statique avec les fichiers construit dans l'étape de build. Il faut exécuter la commande npm run build avant de pouvoir la partir.

#### npm run lint

```
eslint .
```

Commande pour vérifier tous les fichiers avec eslint dans le projet frontend

## React

Nous avons choisi React pour son interactivité et la possibilité d'avoir un reducer pour pouvoir gérer l'état global de l'écriture du code ainsi que l'exécution de celui-ci. Documentation de [React](https://react.dev/reference/react)

## React-Router

Nous avons choisi React-Router et son mode Framework pour simplifier la navigation entre les pages et obtenir des états de transition pour certaine action tel que la compilation du code. 

React-Router necessite une certaine configuration de projet: [root.tsx](src/root.tsx), [routes.ts](src/routes.ts) sont obligatoire pour permettre à React-Router de fonctionner. root.tsx est utilisé pour créer la base du de l'application. routes.ts est utilisé pour généré les différentes routes à partir du outlet du root.tsx element. Le fichier de configuration [react-router.config.ts](react-router.config.ts) est optionnel pour faire rouler React-Router, mais la valeur ssr doit être à false, car electron ne peut rouler que du code de frontend sans serveur derrière. SSR tient pour server side rendering. Documentation de [React-Router](https://reactrouter.com/home)

## TypeScript

Utilisation de typescript pour avoir un code plus robuste au moment de la compilation avec une syntaxe stricte.Configuration de [typescript](tsconfig.json). Documentation de [typescript](https://www.typescriptlang.org/docs/)

## TailwindCSS

Nous avons choisi tailwindcss pour réduire le nombre de fichiers dans le projet. Pour utiliser TailwindCSS, il faut ajouter les classes globales prégénérés de tailwind ou on peut ajouter nos propres classes globales pour les comportement plus compliqués. Pour rajouter des couleurs ou des grandeurs de padding, on peut aller voir les thèmes de tailwindcss. Tout cela ce fait dans le fichier [app.css](src/app.css). Documentation de [tailwindcss](https://tailwindcss.com/docs/installation/using-vite)

## Vite

Vite est la plateforme par défaut de react-router, il s'occupe de servir, minifier et construire l'application que ce soit en dévelopement ou en production. Configuration de [Vite](vite.config.ts) Documentation de [Vite](https://vite.dev/guide/)

## eslint

eslint est une vérification de syntaxe pour améliorer la qualité du code. En ce moment, il manque les règles à ajouter dans le [fichier de configuration](eslint.config.js). Documentation de [eslint](https://eslint.org/docs/latest/)

## Format des fichiers

### [assets](src/assets)

Utilisé pour stocké les photos, etc. Si plusieurs fichiers semble pouvoir être rassembler
### routes
### interface
### components