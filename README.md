Cr�e par Elegbe Maximilien le 16/02/17
Projet finalis� en 25h (d�but� le 13/02 finalis� le 16/02)

I/ FONCTIONNEMENT DE L'APPLICATION

Mon application utilise la technologie du WebSocket qui a les avantages de la rapidit� de transfert de donn�es client/serveur,
et la mise � jour automatique des donn�es du site (comme le nombre de points par exemple).
Les mots sont stock�s dans une base de donn�es MongoDB.

II/ INSTALLATION DE L'APPLICATION

1) Apr�s avoir install� npm , lancer la commande : "npm install"
2) Executer la commande depuis un terminal : "node index.js"
3) Le serveur de jeu sera compl�tement lanc� apr�s l'affichage du message "Les mots ont bien �t� charg� le serveur est lanc� !"
3) Acc�der � l'URL http://localhost:9000 depuis un navigateur

III/ AMELIORATIONS

- Changer l'api de traduction
- Ajout d'une notion de difficult� sur les mots