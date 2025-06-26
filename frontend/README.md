# Frontend du projet CodeMachine v2

    Cette interface pour le projet est utilisé par une appplication electron et un site web statique classique. Pour pouvoir déveloper le projet, vous devez avoir node au moins à 22 avec npm d'installer sur votre machine.

## Technologie utilisé

- [node/npm](#nodenpm)
- [React](#react)
- [React-Router](#react-router)
- [TypeScript](#typescript)
- [TailwindCSS](#tailwindcss)
- [Vite](#vite)
- [eslint](#eslint)
- [Vitest](#vitest)
- [Electron](#electron)
- [Electron-Builder](#electron-builder)

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

#### npm run dev:electron

```
electron .
```

Commande pour partir le frontend en mode dévelopement sur la plateforme electron. Pour pouvoir utiliser la commande, il faut effectuer la commande npm run build:electron détaillé ci-dessous.

#### npm run build

```
react-router build --mode website
```

Commande pour construire la plateforme en incluant les modules pour le site web pour un fureteur régulier. À exécuter avant la commande npm start.

#### npm run build:electron

```
react-router build --mode electron && vite build -c vite.config.electron.ts
```

Commande pour construire la plateforme en incluant les modules pour la plateforme electron. À exécuter avant de partir l'application electron.

#### npm start

```
vite preview
```

Commande pour partir le serveur statique avec les fichiers construit dans l'étape de build. Il faut exécuter la commande npm run build avant de pouvoir la partir.

#### npm run lint

```
eslint
```

Commande pour vérifier tous les fichiers avec eslint dans le projet frontend

#### npm run lint:fix

```
eslint --fix
```

Commande pour vérifier tous les fichiers avec eslint dans le projet frontend et corriger les erreurs simples.

#### npm test

```
vitest watch
```

Commande pour lancer les tests et garder une instance de test à chaque changement. Parfait durant le développement.

#### npm run test:headless

```
vitest --browser.headless
```

Commande pour lancer les tests une seule fois sans l'ouverture d'un navigateur web. Parfait pour les tests d'un pipeline.

#### npm run coverage

```
npm run test:headless -- --coverage --coverage.provider v8 -r src
```

Commande pour lancer le code coverage en mode headless avec l'engin de coverage v8 en ne prenant en compte que les fichiers sources.

#### npm run package

```
electron-builder
```

Commande pour emballer l'application dans un installateur pour une plateforme en particulier, mac linux ou windows. Pour pouvoir l'exécuter, il faut avoir rouler la commande npm run build:electron au préalable détaillé ci-dessus. De plus, vous devez avoir l'exécutable jar du backend dans le dossier module-electron.

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

## Vitest

Vitest est un cadriciel de test adapté pour Vite et fonctionnant avec React. Nous l'avons choisi pour sa compatibilité avec Vite et React. Documentation de [Vitest](https://vitest.dev/)

## Electron

Electron est un cadriciel de dévelopement d'application de bureau avec html, css, javascript qui se compile vers OsX, Linux et Windows. Electron est utilisé dans ce projet pour rendre CodeMachine standalone sans trop changer sa structure si une version déployé est plus approprié. Documentation de [electron](https://www.electronjs.org/docs/latest)

## Electron-builder

Electron-Builder est une des façons pour emballer l'application dans un installateur de la plateforme de son choix et permets la distribution facile et rapide de ceux-ci avec une fonctionalité d'auto-update. Electron-Builder utilise des configurations dans le package.json pour choisir le format d'installateur et bien d'autre chose. Documentation de [Electron-Builder](https://www.electron.build/index.html)

## Format des fichiers

### [assets](src/assets)

Utilisé pour stocké les photos, etc. Si plusieurs fichiers semble pouvoir être rassembler en un dossier on le priorise pour garder la lisibilité.

### [routes](src/routes)

Utilisé pour stocké les composantes react et leur test il faut garder le chemin pour faire un url. Par exemple, la page des processeurs doient être stockés dans src/routes/processor, car son url est /processor. Bref, on veut que le dossier du composant soit le même chemin que son url.

### [interface](src/interface)

Utilisé pour stocké les types et interfaces de typescript. Si besoin, créer des sous-dossier pour regrouper les fichiers cohérents.

### [components](src/components)

Utilisé pour les composants réutilisables ou ponctuelles. Veuillez regrouper les composantes qui sont cohérentes entre eux. 

### [constants](src/constants)

Utilisé pour les constantes des divers composants.

### [module-http](src/module-http)

Utilisé pour stocké tout ce qui se raporte avec la communication par http. À terme, le module http ne devrait être inclut qu'avec le mode website pour pouvoir communiquer avec le serveur externe.

### [module-electron](src/module-electron)

Utilisé pour stocké tout les scripts se rapportant à electron et son fonctionnement. De plus, pour pouvoir partir electron il faut ajouté le fichier jar compilé depuis le backend.

## Mode d'exécution

L'application s'exécute avec deux différents modes d'exécution en ajoutant --mode \<mode> à react-router dev ou build.

### Mode website

Le mode website est utilisé pour représenter l'exécution dans un browser régulier. Il permets au site d'utilisé http pour comuniquer avec le serveur.

### Mode electron

Comme son nom l'indique, le mode d'exécution electron sert à compiler l'application dans le contexte d'une application electron. Il permets au client d'utiliser la communication IPC pour contacter le serveur.