# Amélioration potentiel de Code Machine

Ce documents traite des pistes d'amélioration pour CodeMachine dans l'optique
de l'améliorer pour que la plateforme soit à jour avec les standards modernes.
De plus, il est à noter que ce sont juste des idées et suggestions.

## Frontend

Pour le frontend, il y a plusieurs système qui pourrait être améliorer: 

- Mise en évidence de la syntaxe
- Mise en évidence des erreurs
- Ajout de test unitaire

### Mise en évidence de la syntaxe

En ce moment, la mise en évidence de la syntaxe est créer par un système de création
de jeton, puis les jetons sont associés avec les bonnes couleurs. Pour être afficher,
cette solution est loin d'être efficace, car on regénère à chaque fois le visuel et on
regarde l'entièreté du code à chaque keystroke. Deux solution s'offre à ce problème.
Optimiser l'algorithme et ajouter des fonctions de jeton partiel. La deuxième que je
préconise, est d'ajouter comme package treesitter.

#### Qu'est-ce que TreeSitter?

Treesitter est une librairie/API qui permets de générer des arbres de syntaxe abstrait ou concret.
C'est arbre de syntaxe peuve être regénéré partiellement, ce qui règle le problème de performance.
De plus, treesitter vient avec une librairie de mise en évidence de syntaxe. Pour avoir la bonne
grammaire, il faut créer une grammaire LR(1) pour chacun des processeurs.

### Mise en évidence des erreurs

En ce moment la mise en évidence des erreurs est fait par une table de syntaxe hard coder dans le site.
Cependant, cela limite l'ajout de nouveau processeur avec une nouvelle syntaxe. Pour régler le problème,
il faudrait implémenter un LSP pour chacun des langages et permettre au frontend de communiquer avec le LSP.

#### Qu'est-ce qu'un LSP?

LSP est un acronyme pour Language Server Protocol créé par Microsoft ce protocole permets d'implémenter
la mise en évidence des erreurs, l'autocomplétion et la navigation vers les labels.

Ceci permettrait d'avoir les erreurs de manière plus précise et d'ajouter l'autocomplétion.

## Backend

Pour le backend, en ce moment le backend est une simulation des processeurs écrite en scala et transpiler vers
un jar pour être exécuter en temps que serveur http et communique directement avec le frontend.

En analysant les fontionalités du code du backend, j'ai remarqué que la seule chose qu'il fait est d'envoyer les accumulateurs
et les différentes mémoires étape par étape. Bref, le backend agit comme un debugger. Pour faire, un debugger le DAP est parfait.

#### Qu'est-ce qu'un DAP?

Le DAP est un acronyme pour Debug Adapter Protocol créé par Microsoft. Il sert à découpler l'éditeur de code du debugger ce qui permettrait
de faire un seule système pour afficher certaines informations et avoir une plateforme qui peut s'exporter vers des éditeurs de code plus
tradditionnelle.

## Addition supplémentaire

J'ajouterais aussi un compilateur ou un interpréteur pour rapidement pouvoir obtenir la fin de l'exécution pour avoir une façon rapide de compiler
et exécuter le programme pour pouvoir vérifier si le programme est bien réussi en affichant le dernier état.

## Conclusion

Ces additions et changements permettront d'ajouter des fonctionalités qui seront plus facile à ajouter pour des processeurs supplémentaires, par exemple un Risc.
Lorsqu'il faudra ajouter des processeurs qui existe déjà, il sera possible d'utiliser les LSP, DAP et TreeSitter déjà créer, car c'est protocole sont des standards
ouverts et utilisés dans les éditeurs de code.

Félix-Antoine Lefebvre
