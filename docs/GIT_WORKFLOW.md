# 🌿 Git Workflow - SeniorPhonePro

## 📋 Structure des branches

```
main (production stable)
├── develop (intégration)
├── feature/* (nouvelles fonctionnalités)
├── hotfix/* (corrections urgentes)
└── release/* (préparation des releases)
```

## 🚀 Workflow quotidien

### 1. **Nouvelle fonctionnalité**

```bash
# Créer une branche feature
./scripts/create-feature.sh nom-fonctionnalité

# Développer et committer
git add .
git commit -m "feat: ajout nouvelle fonctionnalité"

# Pousser la branche
git push origin feature/nom-fonctionnalité

# Créer une Pull Request sur GitHub
# Après validation, merger vers develop
./scripts/merge-feature.sh nom-fonctionnalité
```

### 2. **Correction de bug**

```bash
# Créer une branche hotfix depuis main
./scripts/create-hotfix.sh nom-bug

# Corriger et committer
git add .
git commit -m "fix: correction bug affichage"

# Merger vers main ET develop
git checkout main
git merge hotfix/nom-bug
git push origin main

git checkout develop
git merge hotfix/nom-bug
git push origin develop
```

### 3. **Préparation d'une release**

```bash
# Créer une branche release
./scripts/create-release.sh v1.2.0

# Préparer la release
# - Mettre à jour version dans package.json
# - Mettre à jour CHANGELOG.md
# - Tester tout le code

# Merger vers main ET develop
git checkout main
git merge release/v1.2.0
git tag v1.2.0
git push origin main --tags

git checkout develop
git merge release/v1.2.0
git push origin develop
```

## 📝 Convention de commits

### **Types de commits :**
- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage (pas de changement de code)
- `refactor:` Refactoring
- `test:` Tests
- `chore:` Maintenance

### **Exemples :**
```bash
git commit -m "feat: ajout synthèse vocale dans modal"
git commit -m "fix: correction bug affichage numéro"
git commit -m "docs: mise à jour README"
git commit -m "refactor: nettoyage code mort"
git commit -m "test: ajout tests unitaires"
```

## 🛠️ Scripts disponibles

### **Création de branches :**
- `./scripts/create-feature.sh nom` - Créer une feature
- `./scripts/create-hotfix.sh nom` - Créer un hotfix
- `./scripts/create-release.sh version` - Créer une release

### **Merge :**
- `./scripts/merge-feature.sh nom` - Merger une feature vers develop

## 🎯 Règles importantes

### **Branches :**
- **`main`** : Toujours stable, prêt pour la production
- **`develop`** : Intégration des fonctionnalités
- **`feature/*`** : Une fonctionnalité par branche
- **`hotfix/*`** : Corrections urgentes depuis main
- **`release/*`** : Préparation des releases

### **Commits :**
- Messages clairs et descriptifs
- Utiliser les préfixes (feat:, fix:, etc.)
- Un commit par changement logique

### **Pull Requests :**
- Toujours créer une PR pour merger vers develop
- Description claire des changements
- Tests passants obligatoires

## 🔄 Workflow complet

1. **Développement** : `feature/branche` → `develop`
2. **Intégration** : `develop` (tests, validation)
3. **Release** : `develop` → `release/v1.x.x`
4. **Production** : `release/v1.x.x` → `main`
5. **Maintenance** : `main` → `hotfix/bug` → `main` + `develop`

## 🚨 Situations d'urgence

### **Bug critique en production :**
```bash
./scripts/create-hotfix.sh bug-critique
# Corriger rapidement
# Merger vers main ET develop
# Déployer immédiatement
```

### **Conflit de merge :**
```bash
# Résoudre les conflits
git add .
git commit -m "fix: résolution conflit merge"
git push origin feature/branche
```

## 📚 Ressources

- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
