// Gestionnaire simple de dépenses en français (LocalStorage)
const KEY = 'gestion_depenses_v1';
let expenses = [];

// Références DOM
const form = document.getElementById('expense-form');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const body = document.getElementById('expenses-body');
const totalEl = document.getElementById('total');

// Charger depuis LocalStorage ou initialiser avec quelques exemples réalistes en FC
function load() {
    const raw = localStorage.getItem(KEY);

    if (raw) {
        expenses = JSON.parse(raw);
    } else {
        expenses = [
            {
                id: Date.now() - 3000,
                desc: 'Pain et boisson',
                amount: 5000,
                category: 'Nourriture'
            },
            {
                id: Date.now() - 2000,
                desc: 'Forfait internet',
                amount: 25000,
                category: 'Internet'
            },
            {
                id: Date.now() - 1000,
                desc: 'Taxi',
                amount: 8000,
                category: 'Transport'
            }
        ];
        save();
    }

    render();
}

// Sauvegarde dans LocalStorage
function save() {
    localStorage.setItem(KEY, JSON.stringify(expenses));
}

// Formatage du montant en Franc Congolais
function formatFC(n) {
    return new Intl.NumberFormat('fr-FR', {
        maximumFractionDigits: 2
    }).format(n) + ' FC';
}

// Ajouter une dépense
function addExpense(e) {
    e.preventDefault();

    const desc = descInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;

    if (!desc || isNaN(amount) || amount <= 0) {
        return alert('Veuillez saisir une description et un montant valide');
    }

    expenses.push({
        id: Date.now(),
        desc: desc,
        amount: Math.round(amount * 100) / 100,
        category: category
    });

    save();
    render();
    form.reset();
}

// Supprimer une dépense par identifiant
function deleteExpense(id) {
    expenses = expenses.filter(function (item) {
        return item.id !== id;
    });

    save();
    render();
}

// Échapper le texte pour éviter les balises HTML
function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[c] || c;
    });
}

// Afficher la liste et le total
function render() {
    body.innerHTML = '';
    let sum = 0;

    expenses.forEach(function (it) {
        sum += it.amount;

        const tr = document.createElement('tr');
        tr.innerHTML =
            '<td>' + escapeHtml(it.desc) + '</td>' +
            '<td>' + formatFC(it.amount) + '</td>' +
            '<td>' + escapeHtml(it.category) + '</td>' +
            '<td><button data-id="' + it.id + '">Supprimer</button></td>';

        body.appendChild(tr);
    });

    totalEl.textContent = formatFC(sum);
}

// Écoute des actions utilisateur
form.addEventListener('submit', addExpense);

body.addEventListener('click', function (e) {
    if (e.target.tagName === 'BUTTON') {
        const id = Number(e.target.dataset.id);

        if (id) {
            deleteExpense(id);
        }
    }
});

// Démarrage de l'application
document.addEventListener('DOMContentLoaded', load);
