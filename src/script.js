// ==========================================
// 💊 Рецептус 2.0 - Шпаргалка для рецептов
// ==========================================

let medications = [];
let selectedMed = null;
let currentSettings = {
  packCount: 1,
  tabletsPerDose: 1,
  dosesPerDay: 1,
  timing: 'на ночь'
};

// ==========================================
// Инициализация
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
  await loadMedications();
  renderMedicationsList();
  setupEventListeners();
  showEmptyState();
});

// ==========================================
// Загрузка данных
// ==========================================

async function loadMedications() {
  try {
    const response = await fetch('./data/medications.json');
    medications = await response.json();
  } catch (error) {
    console.error('Ошибка загрузки препаратов:', error);
    medications = getMedicationsFallback();
  }
}

function getMedicationsFallback() {
  return [
    { id: 1, tradeName: "Имован", innRus: "Зопиклон", innLat: "Zopiclone", dosageMg: 7.5, dosageGram: "0.0075", form: "tab", formRus: "таб", quantity: 14, group: "Снотворные", color: "indigo", maxUnits: 56, maxTabsPerDay: 2 },
    { id: 2, tradeName: "Сомнол", innRus: "Зопиклон", innLat: "Zopiclone", dosageMg: 7.5, dosageGram: "0.0075", form: "tab", formRus: "таб", quantity: 30, group: "Снотворные", color: "indigo", maxUnits: 60, maxTabsPerDay: 2 },
    { id: 3, tradeName: "Клоназепам", innRus: "Клоназепам", innLat: "Clonazepami", dosageMg: 2, dosageGram: "0.002", form: "tab", formRus: "таб", quantity: 30, group: "Противоэпилептические", color: "purple", maxUnits: 60, maxTabsPerDay: 4 },
    { id: 4, tradeName: "Клоназепам", innRus: "Клоназепам", innLat: "Clonazepami", dosageMg: 0.5, dosageGram: "0.0005", form: "tab", formRus: "таб", quantity: 30, group: "Противоэпилептические", color: "purple", maxUnits: 60, maxTabsPerDay: 8 },
    { id: 5, tradeName: "Клозапин", innRus: "Клозапин", innLat: "Clozapini", dosageMg: 100, dosageGram: "0.1", form: "tab", formRus: "таб", quantity: 50, group: "Антипсихотики", color: "rose", maxUnits: 100, maxTabsPerDay: 4 },
    { id: 6, tradeName: "Клозапин", innRus: "Клозапин", innLat: "Clozapini", dosageMg: 25, dosageGram: "0.025", form: "tab", formRus: "таб", quantity: 50, group: "Антипсихотики", color: "rose", maxUnits: 100, maxTabsPerDay: 12 },
    { id: 7, tradeName: "Феназепам", innRus: "Бромдигидрохлорфенилбензодиазепин", innLat: "Bromdihydrochlorphenylbenzodiazepini", dosageMg: 1, dosageGram: "0.001", form: "tab", formRus: "таб", quantity: 50, group: "Анксиолитики", color: "blue", maxUnits: 100, maxTabsPerDay: 5 },
    { id: 8, tradeName: "Феназепам", innRus: "Бромдигидрохлорфенилбензодиазепин", innLat: "Bromdihydrochlorphenylbenzodiazepini", dosageMg: 2.5, dosageGram: "0.0025", form: "tab", formRus: "таб", quantity: 50, group: "Анксиолитики", color: "blue", maxUnits: 100, maxTabsPerDay: 2 },
    { id: 9, tradeName: "Феназепам", innRus: "Бромдигидрохлорфенилбензодиазепин", innLat: "Bromdihydrochlorphenylbenzodiazepini", dosageMg: 0.5, dosageGram: "0.0005", form: "tab", formRus: "таб", quantity: 50, group: "Анксиолитики", color: "blue", maxUnits: 100, maxTabsPerDay: 10 },
    { id: 10, tradeName: "Алпразолам", innRus: "Алпразолам", innLat: "Alprazolami", dosageMg: 1, dosageGram: "0.001", form: "tab", formRus: "таб", quantity: 50, group: "Анксиолитики", color: "blue", maxUnits: 100, maxTabsPerDay: 4 },
    { id: 11, tradeName: "Алпразолам", innRus: "Алпразолам", innLat: "Alprazolami", dosageMg: 0.25, dosageGram: "0.00025", form: "tab", formRus: "таб", quantity: 50, group: "Анксиолитики", color: "blue", maxUnits: 100, maxTabsPerDay: 12 },
    { id: 12, tradeName: "Габапентин", innRus: "Габапентин", innLat: "Gabapentini", dosageMg: 300, dosageGram: "0.3", form: "caps", formRus: "капс", quantity: 50, group: "Противоэпилептические", color: "purple", maxUnits: 100, maxTabsPerDay: 4 }
  ];
}

// ==========================================
// Ссылка на аптеку
// ==========================================

function getPharmacyLink(innRus) {
  const encoded = encodeURIComponent(innRus);
  return `https://aptekamos.ru/tovary?q=${encoded}`;
}

// ==========================================
// Рендер списка препаратов
// ==========================================

function renderMedicationsList() {
  const container = document.getElementById('medications-list');
  if (!container) return;
  
  const groups = {};
  medications.forEach(med => {
    if (!groups[med.group]) groups[med.group] = [];
    groups[med.group].push(med);
  });
  
  const groupEmojis = {
    'Снотворные': '🌙',
    'Противоэпилептические': '⚡',
    'Антипсихотики': '🧠',
    'Анксиолитики': '😌'
  };
  
  const colorClasses = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' }
  };
  
  let html = '';
  
  for (const [groupName, meds] of Object.entries(groups)) {
    const color = colorClasses[meds[0].color] || colorClasses.blue;
    const emoji = groupEmojis[groupName] || '💊';
    
    html += `
      <div class="mb-4">
        <div class="group-header ${color.bg} px-3 py-2 rounded-lg mb-2 border ${color.border}">
          <span class="${color.text} font-semibold text-sm">${emoji} ${groupName}</span>
        </div>
        <div class="space-y-1">
    `;
    
    meds.forEach(med => {
      html += `
        <div class="med-card bg-white rounded-lg p-3 shadow-sm border border-gray-100" 
             data-med-id="${med.id}"
             onclick="selectMedication(${med.id})">
          <div class="flex justify-between items-start">
            <div>
              <div class="font-medium text-gray-800">${med.tradeName}</div>
              <div class="text-xs text-gray-500 mt-0.5">${med.innLat}</div>
            </div>
            <div class="text-right">
              <div class="text-sm font-semibold ${color.text}">${med.dosageMg} мг</div>
              <div class="text-xs text-gray-400">№${med.quantity}</div>
            </div>
          </div>
        </div>
      `;
    });
    
    html += '</div></div>';
  }
  
  container.innerHTML = html;
}

// ==========================================
// Выбор препарата
// ==========================================

function selectMedication(id) {
  selectedMed = medications.find(m => m.id === id);
  if (!selectedMed) return;
  
  document.querySelectorAll('.med-card').forEach(card => {
    card.classList.remove('active');
  });
  document.querySelector(`[data-med-id="${id}"]`)?.classList.add('active');
  
  resetToOptimalSettings();
  
  document.getElementById('settings-panel')?.classList.remove('hidden');
  
  updateRecipeForm();
  updateSettingsPanel();
  
  closeSidebar();
}

// ==========================================
// Оптимальные настройки
// ==========================================

function resetToOptimalSettings() {
  if (!selectedMed) return;
  
  const quantity = selectedMed.quantity;
  let packCount = 1;
  let timing = 'на ночь';
  let dosesPerDay = 1;
  
  if (selectedMed.innLat === 'Gabapentini') {
    timing = 'утром и на ночь';
    dosesPerDay = 2;
    packCount = 2;
  }
  
  const totalTablets = selectedMed.quantity * packCount;
  let tabletsPerDose = Math.ceil(totalTablets / (30 * dosesPerDay));
  tabletsPerDose = Math.max(1, tabletsPerDose);
  
  const maxPerDose = Math.floor(selectedMed.maxTabsPerDay / dosesPerDay);
  if (tabletsPerDose > maxPerDose) {
    tabletsPerDose = maxPerDose;
  }
  
  currentSettings = { packCount, tabletsPerDose, dosesPerDay, timing };
}

// ==========================================
// Валидация
// ==========================================

function validatePrescription() {
  if (!selectedMed) return { valid: true, warnings: [], errors: [] };
  
  const totalTablets = selectedMed.quantity * currentSettings.packCount;
  const tabletsPerDay = currentSettings.tabletsPerDose * currentSettings.dosesPerDay;
  const days = Math.floor(totalTablets / tabletsPerDay);
  
  const warnings = [];
  const errors = [];
  
  if (tabletsPerDay > selectedMed.maxTabsPerDay) {
    errors.push({
      type: 'overdose',
      message: `⚠️ Превышена макс. суточная доза! Максимум: ${selectedMed.maxTabsPerDay} ${selectedMed.formRus}/день`
    });
  }
  
  const needsExtraStamps = totalTablets > selectedMed.maxUnits || days > 30;
  
  if (needsExtraStamps) {
    warnings.push({
      type: 'extra_stamps',
      message: '📝 Требуется дополнительное оформление',
      details: [
        '• Вторая печать врача',
        '• Вторая треугольная печать',
        '• Надпись "По спецназначению" + подпись'
      ]
    });
  }
  
  return {
    valid: errors.length === 0,
    needsExtraStamps,
    warnings,
    errors,
    totalTablets,
    days
  };
}

// ==========================================
// Рендер формы рецепта
// ==========================================

function updateRecipeForm() {
  if (!selectedMed) return;
  
  const validation = validatePrescription();
  const { totalTablets, days, needsExtraStamps } = validation;
  
  document.getElementById('recipe-container').innerHTML = generateRecipeHTML(days, needsExtraStamps, validation);
  renderWarnings(validation);
}

function generateRecipeHTML(days, needsExtraStamps, validation) {
  const med = selectedMed;
  const totalTablets = med.quantity * currentSettings.packCount;
  const tabletsInWords = numberToWords(currentSettings.tabletsPerDose);
  const tabletWord = getTabletWord(currentSettings.tabletsPerDose);
  const formWord = med.form === 'caps' ? 'капсуле' : 'таблетке';
  const formWordPlural = med.form === 'caps' ? 'капсулы' : 'таблетки';
  
  // Правильное склонение для Signa
  let unitWord = formWord;
  if (currentSettings.tabletsPerDose >= 2 && currentSettings.tabletsPerDose <= 4) {
    unitWord = formWordPlural;
  } else if (currentSettings.tabletsPerDose >= 5) {
    unitWord = med.form === 'caps' ? 'капсул' : 'таблеток';
  }
  
  const signa = `Принимать по ${tabletsInWords} ${unitWord} ${currentSettings.timing} в течение ${days} ${getDaysWord(days)}`;
  
  let borderClass = 'border-gray-300';
  if (validation.errors.length > 0) {
    borderClass = 'border-red-500';
  } else if (needsExtraStamps) {
    borderClass = 'border-amber-500';
  }
  
  const pharmacyUrl = getPharmacyLink(med.innRus);
  
  return `
    <div class="recipe-form rounded-xl overflow-hidden border-2 ${borderClass}">
      <!-- Шапка -->
      <div class="recipe-header p-4 text-center">
        <div class="stamp-zone mb-3 p-4">
          <div class="stamp-circle">
            <span>Печать<br>ЛПУ</span>
          </div>
        </div>
        <div class="text-lg font-bold text-gray-800">📋 РЕЦЕПТУРНЫЙ БЛАНК</div>
        <div class="text-sm text-gray-600">Форма № 148-1/у-88</div>
      </div>
      
      <!-- Содержимое -->
      <div class="p-5 space-y-4">
        <!-- ФИО пациента -->
        <div class="recipe-field">
          <div class="recipe-field-label">👤 Ф.И.О. пациента</div>
          <div class="recipe-field-value">
            <span class="editable-field" contenteditable="true">Прокофьев В.Н.</span>
          </div>
        </div>
        
        <!-- Дата рождения -->
        <div class="recipe-field">
          <div class="recipe-field-label">📅 Дата рождения</div>
          <div class="recipe-field-value">
            <span class="editable-field" contenteditable="true">16.04.1980</span> г.
          </div>
        </div>
        
        <!-- Адрес -->
        <div class="recipe-field">
          <div class="recipe-field-label">🏠 Адрес или № медицинской карты</div>
          <div class="recipe-field-value text-sm">
            <span class="editable-field" contenteditable="true">№ XX000000<br>123456, г. Москва, ул. Трофимовская, д. 6, к. 1, кв. 111</span>
          </div>
        </div>
        
        <!-- ФИО врача -->
        <div class="recipe-field">
          <div class="recipe-field-label">👨‍⚕️ Ф.И.О. лечащего врача</div>
          <div class="recipe-field-value">
            <span class="editable-field" contenteditable="true">Нестеров А.М.</span>
          </div>
        </div>
        
        <!-- Rx секция -->
        <div class="rx-section ${validation.errors.length > 0 ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'} rounded-lg p-4 mt-6 border-l-4">
          <div class="rx-line">
            <span class="font-bold ${validation.errors.length > 0 ? 'text-red-800' : 'text-blue-800'}">Rp.:</span> 
            <span class="text-gray-800">${med.innLat} ${med.dosageGram}</span>
          </div>
          <div class="rx-line">
            <span class="font-bold ${validation.errors.length > 0 ? 'text-red-800' : 'text-blue-800'}">D.t.d.</span> 
            <span class="text-gray-800">N ${totalTablets} in ${med.form}.</span>
          </div>
          <div class="rx-line">
            <span class="font-bold ${validation.errors.length > 0 ? 'text-red-800' : 'text-blue-800'}">S.:</span> 
            <span class="text-gray-800">${signa}</span>
          </div>
        </div>
        
        <!-- Информация о препарате -->
        <div class="bg-gray-50 rounded-lg p-4 text-sm mt-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-600">💊 Торговое название:</span>
            <span class="font-semibold text-gray-800">${med.tradeName} ${med.dosageMg} мг</span>
          </div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-600">📦 Упаковок:</span>
            <span class="font-semibold text-gray-800">${currentSettings.packCount} × ${med.quantity} = ${totalTablets} ${med.formRus}.</span>
          </div>
          <div class="flex justify-between items-center mb-3">
            <span class="text-gray-600">📆 Хватит на:</span>
            <span class="font-semibold ${days > 30 ? 'text-amber-600' : 'text-green-600'}">${days} ${getDaysWord(days)}</span>
          </div>
          
          <!-- Ссылка на аптеку -->
          <div class="pt-3 border-t border-gray-200">
            <a href="${pharmacyUrl}" target="_blank" rel="noopener noreferrer" class="pharmacy-link">
              🔍 Проверить наличие в аптеках
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>
        </div>
        
        <!-- Печати базовые -->
        <div class="mt-6">
          <div class="text-sm font-medium text-gray-600 mb-2">🔏 Печати (обязательные):</div>
          <div class="grid grid-cols-2 gap-4">
            <div class="stamp-zone p-3">
              <div class="stamp-circle">
                <span>Печать<br>врача</span>
              </div>
            </div>
            <div class="stamp-zone p-3 flex flex-col items-center">
              <div class="stamp-triangle"></div>
              <span class="text-xs text-red-400 mt-2">Треугольная</span>
            </div>
          </div>
        </div>
        
        ${needsExtraStamps ? generateExtraStampsHTML() : ''}
        
        <!-- Подпись -->
        <div class="recipe-field mt-6">
          <div class="recipe-field-label">✍️ Подпись врача и дата</div>
          <div class="h-8 border-b border-gray-300"></div>
        </div>
      </div>
    </div>
  `;
}

function generateExtraStampsHTML() {
  return `
    <div class="bg-amber-50 border-2 border-amber-400 rounded-lg p-4 mt-4">
      <div class="text-amber-800 font-semibold text-sm mb-3 flex items-center">
        ⚠️ Требуются ДОПОЛНИТЕЛЬНО:
      </div>
      
      <!-- Надпись "По спецназначению" -->
      <div class="bg-white rounded-lg p-3 mb-3 border-2 border-dashed border-amber-400">
        <div class="text-center">
          <div class="text-lg font-bold text-amber-800 italic">✍️ "По спецназначению"</div>
          <div class="text-xs text-amber-600 mt-1">← Написать от руки + подпись врача</div>
        </div>
      </div>
      
      <div class="text-sm text-amber-700 mb-2">Дополнительные печати:</div>
      <div class="grid grid-cols-2 gap-4">
        <div class="stamp-zone p-3 border-amber-400 bg-amber-50/50">
          <div class="stamp-circle" style="border-color: #f59e0b;">
            <span class="text-amber-600">Печать<br>врача №2</span>
          </div>
        </div>
        <div class="stamp-zone p-3 border-amber-400 bg-amber-50/50 flex flex-col items-center">
          <div class="stamp-triangle" style="border-bottom-color: rgba(245, 158, 11, 0.2);"></div>
          <span class="text-xs text-amber-500 mt-2">Треуг. №2</span>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// Предупреждения
// ==========================================

function renderWarnings(validation) {
  const container = document.getElementById('warnings-container');
  if (!container) return;
  
  let html = '';
  
  validation.errors.forEach(error => {
    html += `
      <div class="bg-red-50 border-2 border-red-400 rounded-xl p-4 mb-4">
        <div class="flex items-start gap-3">
          <div class="text-2xl">🚫</div>
          <div>
            <h3 class="font-bold text-red-800">Ошибка!</h3>
            <p class="text-red-700 text-sm mt-1">${error.message}</p>
          </div>
        </div>
      </div>
    `;
  });
  
  validation.warnings.forEach(warning => {
    let detailsHtml = '';
    if (warning.details) {
      detailsHtml = '<ul class="text-amber-700 text-sm mt-2 space-y-1">' +
        warning.details.map(d => `<li>${d}</li>`).join('') +
        '</ul>';
    }
    
    html += `
      <div class="bg-amber-50 border-2 border-amber-400 rounded-xl p-4 mb-4 warning-box">
        <div class="flex items-start gap-3">
          <div class="text-2xl">⚠️</div>
          <div>
            <h3 class="font-bold text-amber-800">${warning.message}</h3>
            ${detailsHtml}
          </div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

// ==========================================
// Панель настроек
// ==========================================

function updateSettingsPanel() {
  if (!selectedMed) return;
  
  document.getElementById('pack-count').value = currentSettings.packCount;
  document.getElementById('tablets-per-dose').value = currentSettings.tabletsPerDose;
  document.getElementById('doses-per-day').value = currentSettings.dosesPerDay;
  document.getElementById('timing-select').value = currentSettings.timing;
  
  const maxInfo = document.getElementById('max-dose-info');
  if (maxInfo) {
    maxInfo.textContent = `⚡ Макс. ${selectedMed.maxTabsPerDay} ${selectedMed.formRus}/день`;
  }
  
  const maxUnitsInfo = document.getElementById('max-units-info');
  if (maxUnitsInfo) {
    maxUnitsInfo.textContent = `📦 Без доп. оформления: до ${selectedMed.maxUnits} ${selectedMed.formRus}`;
  }
  
  updateCalculation();
}

function updateCalculation() {
  if (!selectedMed) return;
  
  const totalTablets = selectedMed.quantity * currentSettings.packCount;
  const tabletsPerDay = currentSettings.tabletsPerDose * currentSettings.dosesPerDay;
  const days = Math.floor(totalTablets / tabletsPerDay);
  
  const calcEl = document.getElementById('calc-result');
  if (calcEl) {
    const isOk = days <= 30 && totalTablets <= selectedMed.maxUnits && tabletsPerDay <= selectedMed.maxTabsPerDay;
    const colorClass = isOk ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700';
    const emoji = isOk ? '✅' : '⚠️';
    
    calcEl.className = `p-3 rounded-lg border ${colorClass}`;
    calcEl.innerHTML = `
      <div class="flex items-center justify-between text-sm">
        <span>${emoji} Всего: <strong>${totalTablets} ${selectedMed.formRus}</strong></span>
        <span>Хватит на: <strong>${days} ${getDaysWord(days)}</strong></span>
      </div>
    `;
  }
}

// ==========================================
// Вспомогательные функции
// ==========================================

function numberToWords(num) {
  const words = {
    1: 'одной', 2: 'две', 3: 'три', 4: 'четыре', 5: 'пять',
    6: 'шесть', 7: 'семь', 8: 'восемь', 9: 'девять', 10: 'десять'
  };
  return words[num] || num.toString();
}

function getTabletWord(num) {
  if (num === 1) return 'таблетке';
  if (num >= 2 && num <= 4) return 'таблетки';
  return 'таблеток';
}

function getDaysWord(num) {
  const lastTwo = num % 100;
  const lastOne = num % 10;
  
  if (lastTwo >= 11 && lastTwo <= 14) return 'дней';
  if (lastOne === 1) return 'день';
  if (lastOne >= 2 && lastOne <= 4) return 'дня';
  return 'дней';
}

function showEmptyState() {
  const container = document.getElementById('recipe-container');
  if (container && !selectedMed) {
    container.innerHTML = `
      <div class="text-center py-16 px-8 bg-white rounded-2xl shadow-sm">
        <div class="text-6xl mb-4 emoji-float">💊</div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Выберите препарат</h3>
        <p class="text-gray-500 mb-6">Нажмите на препарат в меню слева, чтобы сформировать рецепт</p>
        <div class="lg:hidden">
          <button onclick="openSidebar()" class="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition">
            📋 Открыть список препаратов
          </button>
        </div>
      </div>
    `;
  }
}

// ==========================================
// Мобильное меню
// ==========================================

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

// ==========================================
// Event Listeners
// ==========================================

function setupEventListeners() {
  document.getElementById('burger-btn')?.addEventListener('click', openSidebar);
  document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);
  document.getElementById('close-sidebar')?.addEventListener('click', closeSidebar);
  
  document.getElementById('pack-count')?.addEventListener('input', (e) => {
    currentSettings.packCount = Math.max(1, parseInt(e.target.value) || 1);
    updateRecipeForm();
    updateCalculation();
  });
  
  document.getElementById('pack-minus')?.addEventListener('click', () => {
    if (currentSettings.packCount > 1) {
      currentSettings.packCount--;
      document.getElementById('pack-count').value = currentSettings.packCount;
      updateRecipeForm();
      updateCalculation();
    }
  });
  
  document.getElementById('pack-plus')?.addEventListener('click', () => {
    currentSettings.packCount++;
    document.getElementById('pack-count').value = currentSettings.packCount;
    updateRecipeForm();
    updateCalculation();
  });
  
  document.getElementById('tablets-per-dose')?.addEventListener('input', (e) => {
    currentSettings.tabletsPerDose = Math.max(1, parseInt(e.target.value) || 1);
    updateRecipeForm();
    updateCalculation();
  });
  
  document.getElementById('tablets-minus')?.addEventListener('click', () => {
    if (currentSettings.tabletsPerDose > 1) {
      currentSettings.tabletsPerDose--;
      document.getElementById('tablets-per-dose').value = currentSettings.tabletsPerDose;
      updateRecipeForm();
      updateCalculation();
    }
  });
  
  document.getElementById('tablets-plus')?.addEventListener('click', () => {
    currentSettings.tabletsPerDose++;
    document.getElementById('tablets-per-dose').value = currentSettings.tabletsPerDose;
    updateRecipeForm();
    updateCalculation();
  });
  
  document.getElementById('doses-per-day')?.addEventListener('change', (e) => {
    currentSettings.dosesPerDay = parseInt(e.target.value) || 1;
    
    if (currentSettings.dosesPerDay === 1) {
      currentSettings.timing = 'на ночь';
    } else if (currentSettings.dosesPerDay === 2) {
      currentSettings.timing = 'утром и на ночь';
    } else {
      currentSettings.timing = `${currentSettings.dosesPerDay} раза в день`;
    }
    document.getElementById('timing-select').value = currentSettings.timing;
    
    updateRecipeForm();
    updateCalculation();
  });
  
  document.getElementById('timing-select')?.addEventListener('change', (e) => {
    currentSettings.timing = e.target.value;
    updateRecipeForm();
  });
  
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = e.currentTarget.dataset.tab;
      switchTab(tab);
    });
  });
}

function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.getElementById(`tab-${tabName}`)?.classList.remove('hidden');
  
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.classList.remove('bg-blue-600', 'text-white');
    btn.classList.add('bg-gray-100', 'text-gray-700');
  });
  
  document.querySelector(`[data-tab="${tabName}"]`)?.classList.remove('bg-gray-100', 'text-gray-700');
  document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('bg-blue-600', 'text-white');
}

// Глобальные функции
window.selectMedication = selectMedication;
window.openSidebar = openSidebar;
window.closeSidebar = closeSidebar;