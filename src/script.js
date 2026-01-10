// ==========================================
// 💊 Рецептус 2.0 - Шпаргалка для рецептов
// ==========================================

let medications = [];
let selectedMed = null;
let packCount = 1;

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
  return `https://aptekamos.ru/tovary?q=${encodeURIComponent(innRus)}`;
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
  
  const groupIcons = {
    'Снотворные': '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>',
    'Противоэпилептические': '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
    'Антипсихотики': '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',
    'Анксиолитики': '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
  };
  
  const colorClasses = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', accent: 'border-indigo-400' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', accent: 'border-purple-400' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', accent: 'border-rose-400' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', accent: 'border-blue-400' }
  };
  
  let html = '';
  
  for (const [groupName, meds] of Object.entries(groups)) {
    const color = colorClasses[meds[0].color] || colorClasses.blue;
    const icon = groupIcons[groupName] || '';
    
    html += `
      <div class="mb-4">
        <div class="group-header ${color.bg} px-3 py-2 rounded-lg mb-2 border ${color.border}">
          <span class="${color.text} font-semibold text-sm flex items-center gap-2">${icon} ${groupName}</span>
        </div>
        <div class="space-y-1">
    `;
    
    meds.forEach(med => {
      html += `
        <div class="med-card bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:${color.accent}" 
             data-med-id="${med.id}"
             data-color="${med.color}"
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
  
  // Подсветка активной карточки
  document.querySelectorAll('.med-card').forEach(card => card.classList.remove('active'));
  document.querySelector(`[data-med-id="${id}"]`)?.classList.add('active');
  
  // Сброс количества упаковок
  packCount = 1;
  document.getElementById('pack-count').textContent = packCount;
  
  // Показ панели настроек
  document.getElementById('settings-panel')?.classList.remove('hidden');
  
  // Обновление ссылки на аптеку
  const pharmacyLink = document.getElementById('pharmacy-link');
  if (pharmacyLink) {
    pharmacyLink.href = getPharmacyLink(selectedMed.innRus);
    pharmacyLink.classList.remove('hidden');
  }
  
  updateRecipeForm();
  closeSidebar();
}

// ==========================================
// Расчёт оптимальной дозировки
// ==========================================

function calculatePrescription() {
  if (!selectedMed) return null;
  
  const totalTablets = selectedMed.quantity * packCount;
  const isSleeping = selectedMed.group === 'Снотворные';
  
  // Для снотворных - всегда 1 раз в день (на ночь)
  // Для остальных - рассчитываем оптимальное количество приёмов
  let dosesPerDay = 1;
  let tabletsPerDose = 1;
  
  if (isSleeping) {
    // Снотворные: максимум maxTabsPerDay за раз, 1 раз на ночь
    tabletsPerDose = Math.min(selectedMed.maxTabsPerDay, Math.ceil(totalTablets / 28));
    tabletsPerDose = Math.max(1, Math.min(tabletsPerDose, selectedMed.maxTabsPerDay));
    dosesPerDay = 1;
  } else {
    // Остальные препараты: распределяем по дню
    // Оптимально - чтобы хватило на ~28 дней
    const targetDays = 28;
    const targetDailyDose = Math.ceil(totalTablets / targetDays);
    
    if (targetDailyDose <= selectedMed.maxTabsPerDay) {
      // Можно уложиться в лимит
      if (targetDailyDose <= 1) {
        dosesPerDay = 1;
        tabletsPerDose = 1;
      } else if (targetDailyDose <= 2) {
        dosesPerDay = 2;
        tabletsPerDose = 1;
      } else if (targetDailyDose <= 3) {
        dosesPerDay = 3;
        tabletsPerDose = 1;
      } else {
        // Больше 3 - делим на 2-3 приёма
        dosesPerDay = targetDailyDose <= 6 ? 2 : 3;
        tabletsPerDose = Math.ceil(targetDailyDose / dosesPerDay);
      }
    } else {
      // Используем максимальную дозу
      dosesPerDay = selectedMed.maxTabsPerDay <= 3 ? selectedMed.maxTabsPerDay : 3;
      tabletsPerDose = Math.floor(selectedMed.maxTabsPerDay / dosesPerDay);
    }
    
    // Проверяем, чтобы не превысить maxTabsPerDay
    while (tabletsPerDose * dosesPerDay > selectedMed.maxTabsPerDay && tabletsPerDose > 1) {
      tabletsPerDose--;
    }
  }
  
  const tabletsPerDay = tabletsPerDose * dosesPerDay;
  const days = Math.floor(totalTablets / tabletsPerDay);
  
  // Проверка на необходимость спецназначения
  const needsExtraStamps = days > 28 || totalTablets > selectedMed.maxUnits;
  
  // Формирование времени приёма
  let timing;
  if (isSleeping) {
    timing = 'на ночь';
  } else if (dosesPerDay === 1) {
    timing = 'утром';
  } else if (dosesPerDay === 2) {
    timing = 'утром и на ночь';
  } else {
    timing = '3 раза в день';
  }
  
  return {
    totalTablets,
    tabletsPerDose,
    dosesPerDay,
    tabletsPerDay,
    days,
    timing,
    needsExtraStamps,
    isSleeping
  };
}

// ==========================================
// Рендер формы рецепта
// ==========================================

function updateRecipeForm() {
  if (!selectedMed) return;
  
  const calc = calculatePrescription();
  if (!calc) return;
  
  // Показ toast при необходимости спецназначения
  if (calc.needsExtraStamps) {
    // showToast(
    //   'warning',
    //   'Требуется дополнительное оформление',
    //   `<ul class="space-y-1 mt-2">
    //     <li>• Вторая печать врача</li>
    //     <li>• Вторая треугольная печать</li>
    //     <li>• Надпись «По спецназначению» + подпись</li>
    //   </ul>`
    // );
  } else {
    hideToast();
  }
  
  document.getElementById('recipe-container').innerHTML = generateRecipeHTML(calc);
}

function generateRecipeHTML(calc) {
  const med = selectedMed;
  const tabletsInWords = numberToWords(calc.tabletsPerDose);
  const formWord = getFormWord(med.form, calc.tabletsPerDose);
  
  const signa = `Принимать по ${tabletsInWords} ${formWord} ${calc.timing} в течение ${calc.days} ${getDaysWord(calc.days)}`;
  
  let borderClass = 'border-gray-200';
  if (calc.needsExtraStamps) {
    borderClass = 'border-amber-400';
  }
  
  return `
    <div class="recipe-form rounded-xl overflow-hidden border-2 ${borderClass} relative">
      
      <!-- Плашка "По спецназначению" (если нужна) -->
      ${calc.needsExtraStamps ? `
        <div class="special-assignment-banner">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <span class="font-bold">«По спецназначению»</span>
          <span class="text-sm opacity-80">+ подпись врача + 2× печати</span>
        </div>
      ` : ''}
      
      <!-- Компактная шапка -->
      <div class="p-4 bg-gray-50 border-b border-gray-200">
        <div class="flex items-center justify-between mb-3">
          <div class="text-sm font-semibold text-gray-600">РЕЦЕПТУРНЫЙ БЛАНК</div>
          <div class="text-xs text-gray-400">Форма № 148-1/у-88</div>
        </div>
        
        <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div class="col-span-2 sm:col-span-1">
            <span class="text-gray-500">Пациент:</span>
            <span class="editable-field ml-1" contenteditable="true">Прокофьев В.Н.</span>
          </div>
          <div>
            <span class="text-gray-500">Д.р.:</span>
            <span class="editable-field ml-1" contenteditable="true">16.04.1980</span>
          </div>
          <div class="col-span-2">
            <span class="text-gray-500">Карта/Адрес:</span>
            <span class="editable-field ml-1" contenteditable="true">№ XX000000</span>
          </div>
          <div class="col-span-2">
            <span class="text-gray-500">Врач:</span>
            <span class="editable-field ml-1" contenteditable="true">Нестеров А.М.</span>
          </div>
        </div>
      </div>
      
      <!-- Основная часть рецепта -->
      <div class="p-5">
        
        <!-- Rx секция -->
        <div class="rx-section bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
          <div class="rx-line">
            <span class="rx-label">Rp.:</span> 
            <span class="rx-value">${med.innLat} ${med.dosageGram}</span>
          </div>
          <div class="rx-line">
            <span class="rx-label">D.t.d.</span> 
            <span class="rx-value">N ${calc.totalTablets} in ${med.form}.</span>
          </div>
          <div class="rx-line">
            <span class="rx-label">S.:</span> 
            <span class="rx-value">${signa}</span>
          </div>
        </div>
        
        <!-- Информация о препарате -->
        <div class="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          <div class="flex items-center gap-1">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
            </svg>
            <span><strong>${med.tradeName}</strong> ${med.dosageMg} мг</span>
          </div>
          <div class="flex items-center gap-1">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <span>${packCount} × ${med.quantity} = <strong>${calc.totalTablets} ${med.formRus}.</strong></span>
          </div>
          <div class="flex items-center gap-1">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span class="${calc.days > 28 ? 'text-amber-600 font-semibold' : 'text-green-600'}">${calc.days} ${getDaysWord(calc.days)}</span>
          </div>
        </div>
        
        <!-- Подпись -->
        <div class="mt-6 pt-4 border-t border-gray-200">
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>Подпись врача и дата:</span>
            <div class="w-48 border-b border-gray-300"></div>
          </div>
        </div>
      </div>
      
      <!-- Зона печатей (наложенная) -->
      <div class="stamps-overlay">
        <div class="stamp-item">
          <div class="stamp-circle">
            <span>Печать<br>врача</span>
          </div>
        </div>
        <div class="stamp-item">
          <div class="stamp-triangle"></div>
        </div>
        ${calc.needsExtraStamps ? `
          <div class="stamp-item extra">
            <div class="stamp-circle extra">
              <span>Печать<br>№2</span>
            </div>
          </div>
          <div class="stamp-item extra">
            <div class="stamp-triangle extra"></div>
          </div>
        ` : ''}
      </div>
      
    </div>
  `;
}

// ==========================================
// Toast уведомления
// ==========================================

function showToast(type, title, message) {
  const toast = document.getElementById('toast');
  const iconEl = document.getElementById('toast-icon');
  const titleEl = document.getElementById('toast-title');
  const messageEl = document.getElementById('toast-message');
  
  const icons = {
    warning: '<svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
    error: '<svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    success: '<svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
  };
  
  const bgColors = {
    warning: 'bg-amber-50 border-amber-300',
    error: 'bg-red-50 border-red-300',
    success: 'bg-green-50 border-green-300'
  };
  
  iconEl.innerHTML = icons[type] || icons.warning;
  titleEl.textContent = title;
  titleEl.className = `font-semibold ${type === 'warning' ? 'text-amber-800' : type === 'error' ? 'text-red-800' : 'text-green-800'}`;
  messageEl.innerHTML = message;
  messageEl.className = `text-sm mt-1 ${type === 'warning' ? 'text-amber-700' : type === 'error' ? 'text-red-700' : 'text-green-700'}`;
  
  toast.querySelector('.toast-content').className = `toast-content ${bgColors[type]}`;
  toast.classList.add('show');
}

function hideToast() {
  document.getElementById('toast')?.classList.remove('show');
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

function getFormWord(form, count) {
  if (form === 'caps') {
    if (count === 1) return 'капсуле';
    if (count >= 2 && count <= 4) return 'капсулы';
    return 'капсул';
  }
  if (count === 1) return 'таблетке';
  if (count >= 2 && count <= 4) return 'таблетки';
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
      <div class="text-center py-16 px-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Выберите препарат</h3>
        <p class="text-gray-500 mb-6">Нажмите на препарат в меню слева, чтобы сформировать рецепт</p>
        <div class="lg:hidden">
          <button onclick="openSidebar()" class="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition inline-flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            Открыть список препаратов
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
  
  document.getElementById('pack-minus')?.addEventListener('click', () => {
    if (packCount > 1) {
      packCount--;
      document.getElementById('pack-count').textContent = packCount;
      updateRecipeForm();
    }
  });
  
  document.getElementById('pack-plus')?.addEventListener('click', () => {
    packCount++;
    document.getElementById('pack-count').textContent = packCount;
    updateRecipeForm();
  });
  
  // Переключение табов
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
  
  document.querySelectorAll('.tab-btn').forEach(btn => {
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
window.hideToast = hideToast;