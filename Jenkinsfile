pipeline {
    agent any
    options { skipDefaultCheckout(true) }
    triggers { pollSCM('H/5 * * * *') }
    environment {
        IMAGE_SERVER = 'emnajebali/mern-server'
        IMAGE_CLIENT = 'emnajebali/mern-client'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'git@gitlab.com:amna.jebali-group/mern-app.git',
                    credentialsId: 'gitlab_ssh'
            }
        }
        stage('SERVER : build, scan, push') {
            when {
                anyOf {
                    changeset 'server/**'
                    changeset 'Jenkinsfile'
                    expression { env.BUILD_NUMBER == '1' }
                }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DH_USER',
                    passwordVariable: 'DH_PASS'
                )]) {
                    sh '''
                        set -eu
                        docker build -t "$IMAGE_SERVER:$BUILD_NUMBER" server
                        docker run --rm \
                          -v /var/run/docker.sock:/var/run/docker.sock \
                          aquasec/trivy:0.76.2 image \
                          "$IMAGE_SERVER:$BUILD_NUMBER" > trivy_server.txt
                        cat trivy_server.txt
                        echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
                        docker push "$IMAGE_SERVER:$BUILD_NUMBER"
                    '''
                }
            }
        }
        stage('CLIENT : build, scan, push') {
            when {
                anyOf {
                    changeset 'client/**'
                    changeset 'Jenkinsfile'
                    expression { env.BUILD_NUMBER == '1' }
                }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DH_USER',
                    passwordVariable: 'DH_PASS'
                )]) {
                    sh '''
                        set -eu
                        docker build -t "$IMAGE_CLIENT:$BUILD_NUMBER" client
                        docker run --rm \
                          -v /var/run/docker.sock:/var/run/docker.sock \
                          aquasec/trivy:0.76.2 image \
                          "$IMAGE_CLIENT:$BUILD_NUMBER" > trivy_client.txt
                        cat trivy_client.txt
                        echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
                        docker push "$IMAGE_CLIENT:$BUILD_NUMBER"
                    '''
                }
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'trivy_*.txt', allowEmptyArchive: true
            sh '''
                docker logout || true
                docker image rm "$IMAGE_SERVER:$BUILD_NUMBER" \
                  "$IMAGE_CLIENT:$BUILD_NUMBER" 2>/dev/null || true
            '''
        }
    }
}