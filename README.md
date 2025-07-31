# CodeMachine

Cette application de simulation de processeur simple est utilisé dans le cadre du cours INF1600 à Polytechnique Montréal. Elle permets l'exécution de code en pseudo-assembleur sur trois architectures: à accumulateur, à accumulateur avec MA et le PolyRisc.

## Guide pour les étudiants

Le [guide](GuideCodeMachine.md) contient les fonctionalités courantes de l'application et quelques astuces pour mieux utilisé CodeMachine

## Frontend

Client web utilisé avec electron ou un browser régulier. Pour de plus amples détails, consultez la [documentation](frontend/README.md) du module.

## Backend

Simulation des processeurs écrit en Chisel compilé vers un exécutable Java. Le backend utilise un serveur http comme façade. Pour de plus amples détails, consultez la [documentation](backend/README.md) du module.

## Contribuez

Pour contribuer au projet vous devez respecter la nomenclature git.

Les commits sont sous cette forme:

    <type>(<portée>): <Courte description>

Le type correspond au type de chose modifier dans le commit :
- feat : Pour les features supplémentaires ou pour des ajouts
- fix : Pour corriger des bugs en tout genre
- style : Pour changer le formatage ou la mise en page de fichier
- refactor : Réusinage du code
- doc : Ajout ou modification de la documentation en tout genre (README.md, TSdoc, etc)
- test : Pour toute modification apporté pour des tests
- chore : Tâches de maintenance ou modification des dépendances

La portée correspond à l'étendue du changement ou au partie touché

Les branches sont sous cette forme:

    <type>/<nom-significatif>

Le type correspond globalement à ce qui est effectué sur la branche :
- feature : pour les nouvelles fonctionalités
- bugfix : pour régler les bugs
- hotfix : pour régler les bugs urgents
- doc : pour modifier de la documentation

Le nom significatif doit être en kebab-case.
