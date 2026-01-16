/* --- PWA REGISTRATION --- */
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.log(err));
}

const dict = {
    en: { title: "FocusFlow", taskH: "Tasks", goalH: "Goals", postpone: "⏳ Later", delete: "🗑️ Delete", achieved: "✅ Done", delConfirm: "Delete this?" },
    es: { title: "Enfoque", taskH: "Tareas", goalH: "Metas", postpone: "⏳ Luego", delete: "🗑️ Borrar", achieved: "✅ Hecho", delConfirm: "¿Eliminar?" }
};

let currentLang = localStorage.getItem('focusFlowLang') || 'en';

// Add Item
document.getElementById('addBtn').addEventListener('click', () => {
    const text = document.getElementById('mainInput').value;
    const date = document.getElementById('taskDate').value;
    const time = document.getElementById('taskTime').value;
    const type = document.getElementById('typeSelect').value;

    if (!text) return;

    const li = document.createElement('li');
    li.setAttribute('data-date', date);
    li.innerHTML = `
        <div class="task-info">
            <span class="date-badge">${date || '---'}</span><br>
            <strong class="task-text">${text}</strong>
            <br><small>${time || ''}</small>
        </div>
        <div class="menu-container">
            <button class="menu-dots" onclick="toggleMenu(this)">⋮</button>
            <div class="menu-options">
                <button onclick="markAchieved(this)">${dict[currentLang].achieved}</button>
                <button onclick="moveToTomorrow(this)">${dict[currentLang].postpone}</button>
                <button onclick="deleteItem(this)">${dict[currentLang].delete}</button>
            </div>
        </div>
    `;

    type === 'task' ? document.getElementById('taskList').appendChild(li) : document.getElementById('goalList').appendChild(li);
    document.getElementById('mainInput').value = '';
    saveData();
});

// Actions
window.toggleMenu = (btn) => {
    document.querySelectorAll('.menu-options').forEach(m => m !== btn.nextElementSibling ? m.style.display = 'none' : null);
    const menu = btn.nextElementSibling;
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
};

window.markAchieved = (btn) => {
    btn.closest('li').classList.toggle('achieved');
    saveData();
};

window.deleteItem = (btn) => {
    if (confirm(dict[currentLang].delConfirm)) {
        const item = btn.closest('li');
        item.style.opacity = '0';
        setTimeout(() => { item.remove(); saveData(); }, 300);
    }
};

window.moveToTomorrow = (btn) => {
    const item = btn.closest('li');
    const dateStr = item.getAttribute('data-date');
    if (dateStr) {
        let d = new Date(dateStr);
        d.setDate(d.getDate() + 1);
        const newDate = d.toISOString().split('T')[0];
        item.setAttribute('data-date', newDate);
        item.querySelector('.date-badge').innerText = newDate;
        saveData();
    }
};

// Storage
function saveData() {
    localStorage.setItem('focusFlowTasks', document.getElementById('taskList').innerHTML);
    localStorage.setItem('focusFlowGoals', document.getElementById('goalList').innerHTML);
    localStorage.setItem('focusFlowLang', currentLang);
}

window.onload = () => {
    document.getElementById('taskList').innerHTML = localStorage.getItem('focusFlowTasks') || '';
    document.getElementById('goalList').innerHTML = localStorage.getItem('focusFlowGoals') || '';
    updateLabels();
};

function updateLabels() {
    document.getElementById('appTitle').innerText = dict[currentLang].title;
    document.getElementById('taskHeader').innerText = dict[currentLang].taskH;
    document.getElementById('goalHeader').innerText = dict[currentLang].goalH;
}

document.getElementById('langToggle').addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    updateLabels();
    saveData();
    location.reload(); // Refresh to update button text in existing menus
});