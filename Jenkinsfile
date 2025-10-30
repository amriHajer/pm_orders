pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/amriHajer/pm_orders.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Test') {
            steps {
                echo 'Tests ignorés pour cette version'
                // bat 'npm test || echo "Tests ignorés pour cette version"'
            }
        }

        stage('Archive Build') {
            steps {
                archiveArtifacts artifacts: 'dist/**', fingerprint: true
            }
        }

        stage('Deploy (Simulation)') {
            steps {
                // echo 'Déploiement simulé – application déjà sur Fiori Launchpad'
                   bat 'ui5 deploy --config ui5.yaml'

 
            }
        }
    }

    post {
        success {
            echo 'Pipeline exécuté avec succès !'
        }
        failure {
            echo 'Erreur dans le pipeline ! Vérifie les logs.'
        }
    }
}
