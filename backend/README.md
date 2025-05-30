# backend

Backend de l'ancien projet réutilisé dans cette version


## Lancer le serveur chisel (en scala): 

### Ubuntu:
Il faut pouvoir lancer les fichiers sbt dans le backend.

#### Telechargement de sdk: 
- Commande suivante dans un terminal : ```curl -s "https://get.sdkman.io" | bash```
- Une fois que sdk est telecharge, pour obtenir la commande sdk il faut: ```source "$HOME/.sdkman/bin/sdkman-init.sh"``` {Peut changer en fonction de la localisation de sdk}

#### Telecharger la bonne version de java avec sdk:
- Peut se faire grace a sdk```sdk install java 17.0.10-tem``` (*Attention: ce n'est peut etre pas la seule version qui fonctionne mais 22, 24 ne fonctionnait pas*)

#### Lancer le terminal sbt:
- Se trouver a la racine du dossier backend
- Dans le terminal, taper la commande ```sbt```

#### Rouler le backend:
- Etre dans le terminal sbt
- Pour lancer le serveur: ```~run```
- Une fois le serveur lance, peut acceder a l'aide avec ```?```

#### Compiler en un .JAR stand-alone:
- Se trouver dans la racine du backend et faire la commande: ```sbt assembly``` *Attention: le fichier n'a pas directement les droits d'execution donc possiblement lui ajouter avec chmod*


### Windows:

#### Telechargement de sdk:
- Télécharge Java 17.0.15 (choisis JDK) : ``https://adoptium.net/fr/temurin/archive/?version=17``

### Telecharger SBT
- Télécharge SBT pour Windows depuis ``https://www.scala-sbt.org/download/``
 
#### Lancer le terminal sbt:
- Se trouver a la racine du dossier backend
- Dans le terminal, taper la commande ```sbt```

#### Rouler le backend:
- Etre dans le terminal sbt
- Pour lancer le serveur: ```~run```
- Une fois le serveur lance, peut acceder a l'aide avec ```?```

#### Compiler en un .JAR stand-alone:
- Se trouver dans la racine du backend et faire la commande: ```sbt assembly``` *Attention: le fichier n'a pas directement les droits d'execution donc possiblement lui ajouter avec chmod*