#!/bin/bash

echo "🧪 Lanceur de Tests - SeniorPhonePro"
echo "===================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Fonction d'aide
show_help() {
    echo ""
    echo "Usage: ./scripts/run-tests.sh [OPTION]"
    echo ""
    echo "Options:"
    echo "  unit          - Lancer les tests unitaires"
    echo "  unit:watch    - Lancer les tests unitaires en mode watch"
    echo "  unit:coverage - Lancer les tests unitaires avec couverture"
    echo "  e2e:setup     - Installer et configurer Detox"
    echo "  e2e:ios       - Lancer les tests E2E iOS"
    echo "  e2e:android   - Lancer les tests E2E Android"
    echo "  e2e:all       - Lancer tous les tests E2E"
    echo "  visual        - Lancer les tests visuels (Percy)"
    echo "  all           - Lancer tous les tests"
    echo "  help          - Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  ./scripts/run-tests.sh unit"
    echo "  ./scripts/run-tests.sh e2e:ios"
    echo "  ./scripts/run-tests.sh all"
    echo ""
}

# Fonction pour lancer les tests unitaires
run_unit_tests() {
    print_status "Lancement des tests unitaires..."
    if npm test; then
        print_success "Tests unitaires terminés avec succès"
    else
        print_error "Échec des tests unitaires"
        return 1
    fi
}

# Fonction pour lancer les tests unitaires en mode watch
run_unit_tests_watch() {
    print_status "Lancement des tests unitaires en mode watch..."
    print_warning "Appuyez sur Ctrl+C pour arrêter"
    npm test -- --watch
}

# Fonction pour lancer les tests unitaires avec couverture
run_unit_tests_coverage() {
    print_status "Lancement des tests unitaires avec couverture..."
    if npm test -- --coverage; then
        print_success "Tests unitaires avec couverture terminés"
        print_status "Ouvrir le rapport de couverture..."
        open coverage/lcov-report/index.html 2>/dev/null || print_warning "Impossible d'ouvrir le rapport automatiquement"
    else
        print_error "Échec des tests unitaires avec couverture"
        return 1
    fi
}

# Fonction pour installer Detox
setup_e2e() {
    print_status "Installation et configuration de Detox..."
    if [ -f "./scripts/setup-e2e.sh" ]; then
        chmod +x ./scripts/setup-e2e.sh
        ./scripts/setup-e2e.sh
    else
        print_error "Script setup-e2e.sh non trouvé"
        return 1
    fi
}

# Fonction pour lancer les tests E2E iOS
run_e2e_ios() {
    print_status "Lancement des tests E2E iOS..."
    
    # Vérifier si Detox est installé
    if ! command -v detox &> /dev/null; then
        print_error "Detox n'est pas installé. Lancement de l'installation..."
        setup_e2e
    fi
    
    # Construire l'application iOS
    print_status "Construction de l'application iOS..."
    if npm run e2e:build:ios 2>/dev/null; then
        print_success "Application iOS construite"
    else
        print_warning "Construction iOS échouée, tentative de test direct..."
    fi
    
    # Lancer les tests
    print_status "Lancement des tests E2E iOS..."
    if npm run e2e:test:ios 2>/dev/null; then
        print_success "Tests E2E iOS terminés avec succès"
    else
        print_error "Échec des tests E2E iOS"
        print_warning "Vérifiez que Xcode et les simulateurs iOS sont configurés"
        return 1
    fi
}

# Fonction pour lancer les tests E2E Android
run_e2e_android() {
    print_status "Lancement des tests E2E Android..."
    
    # Vérifier si Detox est installé
    if ! command -v detox &> /dev/null; then
        print_error "Detox n'est pas installé. Lancement de l'installation..."
        setup_e2e
    fi
    
    # Construire l'application Android
    print_status "Construction de l'application Android..."
    if npm run e2e:build:android 2>/dev/null; then
        print_success "Application Android construite"
    else
        print_warning "Construction Android échouée, tentative de test direct..."
    fi
    
    # Lancer les tests
    print_status "Lancement des tests E2E Android..."
    if npm run e2e:test:android 2>/dev/null; then
        print_success "Tests E2E Android terminés avec succès"
    else
        print_error "Échec des tests E2E Android"
        print_warning "Vérifiez que Android SDK et les émulateurs sont configurés"
        return 1
    fi
}

# Fonction pour lancer tous les tests E2E
run_e2e_all() {
    print_status "Lancement de tous les tests E2E..."
    
    # Tests iOS
    if run_e2e_ios; then
        print_success "Tests E2E iOS réussis"
    else
        print_warning "Tests E2E iOS échoués, continuation avec Android..."
    fi
    
    # Tests Android
    if run_e2e_android; then
        print_success "Tests E2E Android réussis"
    else
        print_warning "Tests E2E Android échoués"
    fi
}

# Fonction pour lancer les tests visuels
run_visual_tests() {
    print_status "Lancement des tests visuels..."
    
    # Vérifier si Percy est installé
    if ! npm list @percy/cli &> /dev/null; then
        print_warning "Percy n'est pas installé. Installation..."
        npm install --save-dev @percy/cli @percy/react-native
    fi
    
    # Lancer les tests visuels
    if npm run percy:test 2>/dev/null; then
        print_success "Tests visuels terminés avec succès"
    else
        print_error "Échec des tests visuels"
        print_warning "Vérifiez que PERCY_TOKEN est configuré"
        return 1
    fi
}

# Fonction pour lancer tous les tests
run_all_tests() {
    print_status "Lancement de tous les tests..."
    
    # Tests unitaires
    print_status "=== Tests Unitaires ==="
    if run_unit_tests; then
        print_success "Tests unitaires réussis"
    else
        print_error "Tests unitaires échoués"
        return 1
    fi
    
    # Tests E2E
    print_status "=== Tests E2E ==="
    run_e2e_all
    
    # Tests visuels
    print_status "=== Tests Visuels ==="
    run_visual_tests
    
    print_success "Tous les tests terminés !"
}

# Vérifier les arguments
if [ $# -eq 0 ]; then
    show_help
    exit 0
fi

# Traiter les arguments
case "$1" in
    "unit")
        run_unit_tests
        ;;
    "unit:watch")
        run_unit_tests_watch
        ;;
    "unit:coverage")
        run_unit_tests_coverage
        ;;
    "e2e:setup")
        setup_e2e
        ;;
    "e2e:ios")
        run_e2e_ios
        ;;
    "e2e:android")
        run_e2e_android
        ;;
    "e2e:all")
        run_e2e_all
        ;;
    "visual")
        run_visual_tests
        ;;
    "all")
        run_all_tests
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Option inconnue: $1"
        show_help
        exit 1
        ;;
esac

echo ""
print_success "Script terminé !"
