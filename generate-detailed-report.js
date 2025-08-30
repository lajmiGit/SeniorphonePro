const fs = require('fs');

// Lire le fichier JSON des résultats
const testResults = JSON.parse(fs.readFileSync('test-results-complete.json', 'utf8'));

// Fonction pour formater la durée
function formatDuration(duration) {
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(2)}s`;
}

// Fonction pour nettoyer les messages d'erreur
function cleanErrorMessage(message) {
    return message
        .replace(/\u001b\[[0-9;]*m/g, '') // Supprimer les codes ANSI
        .replace(/at\s+.*\s+\(.*\)/g, '') // Supprimer les stack traces
        .trim();
}

// Fonction pour extraire les détails des tests
function extractTestDetails(testResult) {
    const details = [];
    
    testResult.testResults.forEach(suite => {
        suite.assertionResults.forEach(test => {
            const testDetail = {
                suiteName: suite.name,
                testName: test.title,
                fullName: test.fullName,
                status: test.status,
                duration: formatDuration(test.duration),
                numPassingAsserts: test.numPassingAsserts,
                failureMessages: test.failureMessages.map(cleanErrorMessage),
                ancestorTitles: test.ancestorTitles
            };
            details.push(testDetail);
        });
    });
    
    return details;
}

// Extraire tous les détails des tests
const allTestDetails = extractTestDetails(testResults);

// Calculer les statistiques
const totalTests = testResults.numTotalTests;
const passedTests = testResults.numPassedTests;
const failedTests = testResults.numFailedTests;
const successRate = ((passedTests / totalTests) * 100).toFixed(1);

// Grouper les tests par composant
const testsByComponent = {};
allTestDetails.forEach(test => {
    const componentName = test.ancestorTitles[0] || 'Autres';
    if (!testsByComponent[componentName]) {
        testsByComponent[componentName] = {
            passed: [],
            failed: [],
            total: 0
        };
    }
    
    if (test.status === 'passed') {
        testsByComponent[componentName].passed.push(test);
    } else {
        testsByComponent[componentName].failed.push(test);
    }
    testsByComponent[componentName].total++;
});

// Générer le HTML
const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport Ultra-Détaillé des Tests - SeniorPhonePro</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1600px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 300;
        }

        .header .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }

        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            text-align: center;
            transition: transform 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-5px);
        }

        .stat-number {
            font-size: 3em;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .stat-label {
            font-size: 1.1em;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .passed { color: #4CAF50; }
        .failed { color: #f44336; }
        .skipped { color: #ff9800; }

        .progress-section {
            padding: 30px;
            background: white;
        }

        .progress-bar {
            width: 100%;
            height: 30px;
            background: #e0e0e0;
            border-radius: 15px;
            overflow: hidden;
            margin: 20px 0;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4CAF50, #45a049);
            transition: width 1s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }

        .components-section {
            padding: 30px;
            background: #f8f9fa;
        }

        .component-card {
            background: white;
            margin: 20px 0;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }

        .component-header {
            padding: 20px;
            background: #f5f5f5;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
        }

        .component-header:hover {
            background: #e8f5e8;
        }

        .component-name {
            font-size: 1.3em;
            font-weight: bold;
            color: #333;
        }

        .component-status {
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 0.9em;
        }

        .status-passed {
            background: #e8f5e8;
            color: #4CAF50;
        }

        .status-failed {
            background: #ffebee;
            color: #f44336;
        }

        .status-skipped {
            background: #fff3e0;
            color: #ff9800;
        }

        .test-list {
            padding: 20px;
            display: none;
        }

        .test-list.expanded {
            display: block;
        }

        .test-item {
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
            border-left: 4px solid;
            background: #fafafa;
            transition: all 0.3s ease;
        }

        .test-item:hover {
            transform: translateX(5px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .test-passed {
            border-left-color: #4CAF50;
            background: #f1f8e9;
        }

        .test-failed {
            border-left-color: #f44336;
            background: #ffebee;
        }

        .test-skipped {
            border-left-color: #ff9800;
            background: #fff3e0;
        }

        .test-name {
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 1.1em;
        }

        .test-details {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 10px;
            margin-top: 10px;
            font-size: 0.9em;
        }

        .test-detail-label {
            font-weight: bold;
            color: #666;
        }

        .test-duration {
            font-size: 0.9em;
            color: #666;
        }

        .error-message {
            background: #ffebee;
            color: #c62828;
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            white-space: pre-wrap;
            max-height: 200px;
            overflow-y: auto;
        }

        .summary-section {
            padding: 30px;
            background: white;
            border-top: 1px solid #e0e0e0;
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .summary-item {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }

        .summary-number {
            font-size: 2em;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .footer {
            background: #333;
            color: white;
            text-align: center;
            padding: 20px;
        }

        .timestamp {
            font-size: 0.9em;
            opacity: 0.8;
        }

        .new-tests-badge {
            background: #2196F3;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            margin-left: 10px;
        }

        .expand-icon {
            font-size: 1.2em;
            transition: transform 0.3s ease;
        }

        .expand-icon.expanded {
            transform: rotate(90deg);
        }

        .search-section {
            padding: 20px;
            background: white;
            border-bottom: 1px solid #e0e0e0;
        }

        .search-input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1em;
            transition: border-color 0.3s ease;
        }

        .search-input:focus {
            outline: none;
            border-color: #4CAF50;
        }

        .filter-buttons {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }

        .filter-button {
            padding: 8px 16px;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        }

        .filter-button.active {
            background: #4CAF50;
            color: white;
        }

        .filter-button:not(.active) {
            background: #f0f0f0;
            color: #666;
        }

        @media (max-width: 768px) {
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            .header h1 {
                font-size: 2em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📱 SeniorPhonePro</h1>
            <div class="subtitle">Rapport Ultra-Détaillé des Tests - Tous les Tests</div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number passed" id="total-tests">${totalTests}</div>
                <div class="stat-label">Tests Totaux</div>
            </div>
            <div class="stat-card">
                <div class="stat-number passed" id="passed-tests">${passedTests}</div>
                <div class="stat-label">Tests Réussis</div>
            </div>
            <div class="stat-card">
                <div class="stat-number failed" id="failed-tests">${failedTests}</div>
                <div class="stat-label">Tests Échoués</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="success-rate">${successRate}%</div>
                <div class="stat-label">Taux de Réussite</div>
            </div>
        </div>

        <div class="progress-section">
            <h2>📊 Progression Globale</h2>
            <div class="progress-bar">
                <div class="progress-fill" id="progress-fill" style="width: ${successRate}%">${successRate}%</div>
            </div>
            <p>Le projet SeniorPhonePro affiche un taux de réussite de <strong>${successRate}%</strong> avec ${passedTests} tests réussis sur ${totalTests} tests totaux.</p>
        </div>

        <div class="search-section">
            <input type="text" class="search-input" id="searchInput" placeholder="🔍 Rechercher un test spécifique...">
            <div class="filter-buttons">
                <button class="filter-button active" data-filter="all">Tous</button>
                <button class="filter-button" data-filter="passed">Réussis</button>
                <button class="filter-button" data-filter="failed">Échoués</button>
            </div>
        </div>

        <div class="components-section">
            <h2>🧩 Détails de Tous les Tests</h2>
            
            ${Object.entries(testsByComponent).map(([componentName, tests]) => {
                const passedCount = tests.passed.length;
                const failedCount = tests.failed.length;
                const totalCount = tests.total;
                const status = failedCount === 0 ? 'passed' : 'failed';
                const statusText = failedCount === 0 ? `${passedCount}/${totalCount} Tests Réussis` : `${passedCount}/${totalCount} Tests Réussis`;
                
                return `
                <div class="component-card" data-component="${componentName}">
                    <div class="component-header" onclick="toggleComponent('${componentName}')">
                        <div class="component-name">
                            ${componentName} 
                            ${componentName.includes('PhoneDisplay') || componentName.includes('DialPad') ? '<span class="new-tests-badge">NOUVEAU</span>' : ''}
                        </div>
                        <div class="component-status status-${status}">${statusText}</div>
                        <div class="expand-icon" id="expand-${componentName}">▶</div>
                    </div>
                    <div class="test-list" id="tests-${componentName}">
                        ${tests.passed.map(test => `
                            <div class="test-item test-passed" data-status="passed">
                                <div class="test-name">✅ ${test.testName}</div>
                                <div class="test-details">
                                    <div class="test-detail-label">Durée:</div>
                                    <div>${test.duration}</div>
                                    <div class="test-detail-label">Assertions:</div>
                                    <div>${test.numPassingAsserts}</div>
                                    <div class="test-detail-label">Suite:</div>
                                    <div>${test.suiteName}</div>
                                </div>
                            </div>
                        `).join('')}
                        ${tests.failed.map(test => `
                            <div class="test-item test-failed" data-status="failed">
                                <div class="test-name">❌ ${test.testName}</div>
                                <div class="test-details">
                                    <div class="test-detail-label">Durée:</div>
                                    <div>${test.duration}</div>
                                    <div class="test-detail-label">Assertions:</div>
                                    <div>${test.numPassingAsserts}</div>
                                    <div class="test-detail-label">Suite:</div>
                                    <div>${test.suiteName}</div>
                                </div>
                                ${test.failureMessages.length > 0 ? `
                                    <div class="error-message">
                                        ${test.failureMessages.join('\n\n')}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                `;
            }).join('')}
        </div>

        <div class="summary-section">
            <h2>📋 Résumé Détaillé</h2>
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-number passed">${totalTests}</div>
                    <div class="stat-label">Total Tests</div>
                    <p>Tests exécutés</p>
                </div>
                <div class="summary-item">
                    <div class="summary-number passed">${passedTests}</div>
                    <div class="stat-label">Tests Réussis</div>
                    <p>Fonctionnement correct</p>
                </div>
                <div class="summary-item">
                    <div class="summary-number failed">${failedTests}</div>
                    <div class="stat-label">Tests Échoués</div>
                    <p>Nécessitent correction</p>
                </div>
                <div class="summary-item">
                    <div class="summary-number passed">${successRate}%</div>
                    <div class="stat-label">Taux de Réussite</div>
                    <p>Qualité du code</p>
                </div>
            </div>
            
            <h3>🎯 Prochaines Actions Recommandées</h3>
            <ul style="margin: 20px 0; padding-left: 20px;">
                <li><strong>NavigationScreen</strong> : Ajouter les testID manquants (${testsByComponent['NavigationScreen']?.failed.length || 0} tests)</li>
                <li><strong>VirtualKeyboard</strong> : Corriger les testID et modals (${testsByComponent['VirtualKeyboard']?.failed.length || 0} tests)</li>
                <li><strong>ContactList</strong> : Améliorer le mock Vibration (${testsByComponent['ContactList']?.failed.length || 0} tests)</li>
                <li><strong>DialPad</strong> : Corriger les propriétés d'accessibilité (${testsByComponent['DialPad']?.failed.length || 0} tests)</li>
                <li><strong>PhoneDisplay</strong> : Corriger l'arrêt de synthèse vocale (${testsByComponent['PhoneDisplay']?.failed.length || 0} tests)</li>
            </ul>
        </div>

        <div class="footer">
            <div class="timestamp">Rapport généré le <span id="timestamp"></span></div>
            <p>SeniorPhonePro - Application optimisée pour les seniors</p>
            <p><strong>Rapport ultra-détaillé :</strong> Tous les tests avec leurs détails complets !</p>
        </div>
    </div>

    <script>
        // Mettre à jour la date et l'heure
        document.getElementById('timestamp').textContent = new Date().toLocaleString('fr-FR');
        
        // Animation des statistiques
        function animateNumbers() {
            const numbers = document.querySelectorAll('.stat-number');
            numbers.forEach(number => {
                const finalValue = number.textContent;
                const isPercentage = finalValue.includes('%');
                const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
                
                let current = 0;
                const increment = numericValue / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= numericValue) {
                        current = numericValue;
                        clearInterval(timer);
                    }
                    number.textContent = isPercentage ? Math.floor(current) + '%' : Math.floor(current);
                }, 20);
            });
        }
        
        // Fonction pour basculer l'affichage des tests d'un composant
        function toggleComponent(componentName) {
            const testList = document.getElementById('tests-' + componentName);
            const expandIcon = document.getElementById('expand-' + componentName);
            
            testList.classList.toggle('expanded');
            expandIcon.classList.toggle('expanded');
        }
        
        // Fonction de recherche
        function filterTests() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const activeFilter = document.querySelector('.filter-button.active').dataset.filter;
            
            document.querySelectorAll('.test-item').forEach(testItem => {
                const testName = testItem.querySelector('.test-name').textContent.toLowerCase();
                const testStatus = testItem.dataset.status;
                
                const matchesSearch = testName.includes(searchTerm);
                const matchesFilter = activeFilter === 'all' || testStatus === activeFilter;
                
                testItem.style.display = matchesSearch && matchesFilter ? 'block' : 'none';
            });
        }
        
        // Fonction de filtrage
        function setFilter(filter) {
            document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
            document.querySelector('[data-filter="' + filter + '"]').classList.add('active');
            filterTests();
        }
        
        // Événements
        document.getElementById('searchInput').addEventListener('input', filterTests);
        document.querySelectorAll('.filter-button').forEach(btn => {
            btn.addEventListener('click', () => setFilter(btn.dataset.filter));
        });
        
        // Lancer l'animation après le chargement
        window.addEventListener('load', () => {
            setTimeout(animateNumbers, 500);
        });
    </script>
</body>
</html>`;

// Écrire le fichier HTML
fs.writeFileSync('test-report-ultra-detailed.html', html);

console.log('✅ Rapport ultra-détaillé généré : test-report-ultra-detailed.html');
console.log(`📊 Statistiques : ${totalTests} tests totaux, ${passedTests} réussis, ${failedTests} échoués (${successRate}%)`);
