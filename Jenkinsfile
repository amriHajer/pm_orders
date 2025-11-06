pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Clonage du dépôt'
                git branch: 'main', url: 'https://github.com/amriHajer/pm_orders.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installation des dépendances'
                bat 'npm install'
            }
        }

        stage('Build') {
            steps {
                echo 'Construction du projet UI5'
                bat 'npm run build'
            }
        }

        stage('Test') {
            steps {
                echo 'Étape de test (désactivée pour cette version)'
                // Si tu ajoutes plus tard des tests : bat 'npm test'
            }
        }

        stage('Deploy to SAP Fiori Launchpad') {
            steps {
                echo 'Déploiement sur SAP Fiori Launchpad'
                bat 'npm run deploy'
            }
        }

        stage('Clean up') {
            steps {
                echo 'Nettoyage des fichiers temporaires'
                bat 'rimraf archive.zip'
            }
        }
    }

    post {
        success {
            echo 'Pipeline exécuté avec succès ! Application déployée'
        }
        failure {
            echo 'Erreur dans le pipeline. Vérifie les logs Jenkins'
        }
    }
}
