// Password Check Logic
console.log('🔐 Password Check geladen');

let currentPassword = '';
let showPassword = false;


// Close Button
document.getElementById('close-btn').addEventListener('click', () => {
  window.close();
});

// Keyboard Shortcut - ESC to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.close();
  }
});

// Toggle Password Visibility
document.getElementById('toggle-visibility').addEventListener('click', () => {
  showPassword = !showPassword;
  const input = document.getElementById('password-input');
  const btn = document.getElementById('toggle-visibility');
  
  input.type = showPassword ? 'text' : 'password';
  btn.textContent = showPassword ? '🙈' : '👁️';
});

// Analyze Password
document.getElementById('analyze-password').addEventListener('click', async () => {
  const password = document.getElementById('password-input').value;
  if (!password) return;
  
  currentPassword = password;
  const analysis = await analyzePassword(password);
  displayResults(analysis);
});

// Generate Password
document.getElementById('generate-password').addEventListener('click', async () => {
  const password = generateSecurePassword();
  document.getElementById('password-input').value = password;
  currentPassword = password;
  
  // Auto-analyze
  const analysis = await analyzePassword(password);
  displayResults(analysis);
});

// Copy Password
document.getElementById('copy-password').addEventListener('click', () => {
  const password = document.getElementById('password-input').value;
  if (!password) return;
  
  navigator.clipboard.writeText(password);
  const btn = document.getElementById('copy-password');
  btn.innerHTML = '<span>✓</span>Kopiert!';
  setTimeout(() => {
    btn.innerHTML = '<span>📋</span>Kopieren';
  }, 2000);
});

// haveibeenpwned API Check
async function checkPasswordBreach(password) {
  try {
    // SHA-1 Hash des Passworts
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    
    // k-Anonymity: Nur erste 5 Zeichen senden
    const prefix = hashHex.substring(0, 5);
    const suffix = hashHex.substring(5);
    
    console.log('🔍 Prüfe Passwort bei haveibeenpwned...');
    
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    
    if (!response.ok) throw new Error('API-Fehler');
    
    const text = await response.text();
    const lines = text.split('\n');
    
    for (const line of lines) {
      const [hashSuffix, count] = line.split(':');
      if (hashSuffix.trim() === suffix) {
        return parseInt(count);
      }
    }
    
    return 0; // Nicht gefunden!
  } catch (error) {
    console.error('❌ Breach-Check-Fehler:', error);
    return null; // Fehler
  }
}

// Password Analysis
async function analyzePassword(password) {
  let score = 0;
  const feedback = [];
  const suggestions = [];
  
  // Length
  const length = password.length;
  if (length < 8) {
    score += Math.min(length * 5, 30);
    feedback.push('Passwort ist zu kurz');
    suggestions.push('Verwende mindestens 12 Zeichen');
  } else if (length < 12) {
    score += 40;
    feedback.push('Akzeptable Länge');
    suggestions.push('Längere Passwörter sind sicherer');
  } else if (length < 16) {
    score += 50;
    feedback.push('Gute Länge');
  } else {
    score += 60;
    feedback.push('Ausgezeichnete Länge');
  }
  
  // Character types
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  let varietyScore = 0;
  if (hasUppercase) varietyScore += 10;
  if (hasLowercase) varietyScore += 10;
  if (hasNumbers) varietyScore += 10;
  if (hasSpecial) varietyScore += 15;
  
  score += varietyScore;
  
  if (!hasUppercase) suggestions.push('Füge Großbuchstaben hinzu');
  if (!hasLowercase) suggestions.push('Füge Kleinbuchstaben hinzu');
  if (!hasNumbers) suggestions.push('Füge Zahlen hinzu');
  if (!hasSpecial) suggestions.push('Füge Sonderzeichen hinzu');
  
  // Common patterns
  const hasCommonPatterns = /password|123|abc|qwerty/i.test(password);
  if (hasCommonPatterns) {
    score -= 20;
    feedback.push('Enthält häufige Muster');
    suggestions.push('Vermeide häufige Wörter');
  }
  
  // Normalize score
  score = Math.max(0, Math.min(100, score));
  
  // Determine strength
  let strength;
  if (score < 40) strength = 'Sehr schwach';
  else if (score < 60) strength = 'Schwach';
  else if (score < 75) strength = 'Mittel';
  else if (score < 90) strength = 'Stark';
  else strength = 'Sehr stark';
  
  // Crack time
  let crackTime;
  if (score < 40) crackTime = 'Sekunden bis Minuten';
  else if (score < 60) crackTime = 'Stunden bis Tage';
  else if (score < 75) crackTime = 'Monate';
  else if (score < 90) crackTime = 'Jahre';
  else crackTime = 'Jahrhunderte+';
  
  // Breach-Check (asynchron)
  let breachCount = null;
  try {
    breachCount = await checkPasswordBreach(password);
    
    if (breachCount > 0) {
      score = Math.max(0, score - 40); // Massive Abwertung!
      feedback.push('⚠️ IN DATENLECKS GEFUNDEN!');
      suggestions.unshift(`KRITISCH: Wurde ${breachCount.toLocaleString()}x in Datenlecks gefunden - SOFORT ändern!`);
      strength = 'KOMPROMITTIERT';
    } else if (breachCount === 0) {
      feedback.push('✓ Nicht in Datenlecks gefunden');
    }
  } catch (e) {
    console.log('Breach-Check übersprungen');
  }
  
  if (score >= 80 && suggestions.length === 0) {
    suggestions.push('Ausgezeichnetes Passwort!');
  }
  
  return {
    score,
    strength,
    feedback,
    suggestions,
    details: {
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSpecial,
      crackTime,
      length,
      breached: breachCount > 0,
      breachCount
    }
  };
}

// Display Results
function displayResults(analysis) {
  document.getElementById('results').style.display = 'block';
  
  // Score
  updatePasswordScore(analysis.score);
  
  // Strength Badge
  const badge = document.getElementById('strength-badge');
  if (analysis.details.breached) {
    badge.textContent = '⚠️ KOMPROMITTIERT';
    badge.className = 'strength-badge strength-compromised';
    badge.style.background = '#ef4444';
  } else {
    badge.textContent = analysis.strength;
    badge.className = 'strength-badge strength-' + analysis.strength.toLowerCase().replace(' ', '-');
    badge.style.background = '';
  }
  
  // Checks
  updateCheck('check-uppercase', analysis.details.hasUppercase);
  updateCheck('check-lowercase', analysis.details.hasLowercase);
  updateCheck('check-numbers', analysis.details.hasNumbers);
  updateCheck('check-special', analysis.details.hasSpecial);
  
  // Crack Time
  document.getElementById('crack-time').textContent = analysis.details.crackTime;
  
  // Feedback
  if (analysis.suggestions.length > 0) {
    const list = document.getElementById('feedback-list');
    list.innerHTML = analysis.suggestions.map(s => `
      <div class="list-item">
        <span class="list-dot info"></span>
        <span>${s}</span>
      </div>
    `).join('');
    document.getElementById('feedback-card').style.display = 'block';
  } else {
    document.getElementById('feedback-card').style.display = 'none';
  }
}

// Update Password Score Visual
function updatePasswordScore(score) {
  const circle = document.getElementById('password-score-circle');
  const number = document.getElementById('password-score-number');
  
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  
  circle.style.strokeDashoffset = offset;
  number.textContent = score;
  
  if (score >= 80) circle.style.stroke = '#10b981';
  else if (score >= 60) circle.style.stroke = '#f59e0b';
  else if (score >= 40) circle.style.stroke = '#fb923c';
  else circle.style.stroke = '#ef4444';
}

// Update Check Item
function updateCheck(id, passed) {
  const el = document.getElementById(id);
  const icon = el.querySelector('.check-icon');
  
  if (passed) {
    icon.textContent = '✓';
    icon.style.color = '#10b981';
  } else {
    icon.textContent = '✗';
    icon.style.color = '#ef4444';
  }
}

// Generate Secure Password
function generateSecurePassword() {
  const length = 16;
  const charset = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    special: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  };

  let password = '';
  const allChars = Object.values(charset).join('');

  // Mindestens eins von jedem
  password += charset.uppercase.charAt(Math.floor(Math.random() * charset.uppercase.length));
  password += charset.lowercase.charAt(Math.floor(Math.random() * charset.lowercase.length));
  password += charset.numbers.charAt(Math.floor(Math.random() * charset.numbers.length));
  password += charset.special.charAt(Math.floor(Math.random() * charset.special.length));

  // Rest auffüllen
  for (let i = password.length; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Mischen
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Auto-analyze on input
document.getElementById('password-input').addEventListener('input', async (e) => {
  const password = e.target.value;
  if (password.length > 0) {
    const analysis = await analyzePassword(password);
    displayResults(analysis);
  } else {
    document.getElementById('results').style.display = 'none';
  }
});

