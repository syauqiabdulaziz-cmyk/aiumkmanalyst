// Data Storage (Simulasi Database)
let users = [
    { id: 1, storeName: "Toko Maju Jaya", ownerName: "Budi Santoso", password: "123456", businessType: "makanan", joined: "2023-01-15", level: "berkembang" },
    { id: 2, storeName: "Warung Sehat", ownerName: "Siti Aminah", password: "123456", businessType: "makanan", joined: "2023-02-20", level: "pemula" },
    { id: 3, storeName: "Butik Modern", ownerName: "Rina Wijaya", password: "123456", businessType: "fashion", joined: "2023-03-10", level: "stabil" }
];

let currentUser = null;
let dailyData = [];
let historyData = [];
let notes = [];
let monthlyData = null;

// AI Responses (Simulasi)
const aiTips = [
    "Fokus pada produk terlaris Anda. Tingkatkan kualitas dan promosi untuk produk tersebut.",
    "Evaluasi biaya operasional bulanan. Cari penghematan tanpa mengurangi kualitas produk.",
    "Buat catatan harian penjualan. Data ini penting untuk analisis tren dan perencanaan.",
    "Jaga hubungan baik dengan pelanggan. Pelanggan tetap adalah aset berharga untuk UMKM.",
    "Manfaatkan media sosial untuk promosi. Konten visual menarik bisa meningkatkan penjualan.",
    "Diversifikasi produk. Tambahkan varian baru untuk menarik lebih banyak pelanggan.",
    "Monitor stok secara rutin. Hindari kehabisan stok untuk produk yang laris.",
    "Tawarkan promo bundling. Gabungkan produk yang saling melengkapi dengan harga khusus.",
    "Perhatikan feedback pelanggan. Gunakan masukan untuk perbaikan produk dan layanan.",
    "Rencanakan target harian. Pecah target bulanan menjadi target harian yang lebih mudah dicapai."
];

const quickAnswers = {
    health: "Berdasarkan data yang ada, usaha Anda dalam kondisi yang cukup baik. Health score menunjukkan usaha Anda berada di level waspada. Pertahankan konsistensi penjualan dan kontrol biaya operasional.",
    revenue: "Untuk menaikkan omzet, pertimbangkan untuk: 1) Meningkatkan promosi di media sosial, 2) Menawarkan paket bundling dengan harga menarik, 3) Memperluas jangkauan pasar ke area baru, 4) Meningkatkan kualitas produk untuk menarik lebih banyak pelanggan.",
    cost: "Beberapa biaya yang bisa dievaluasi untuk pengurangan: 1) Biaya bahan baku (cari supplier dengan harga lebih kompetitif), 2) Biaya operasional (optimalkan penggunaan listrik dan air), 3) Biaya packaging (pertimbangkan alternatif yang lebih ekonomis tanpa mengurangi kualitas)"
};

const businessAnalysis = {
    sehat: {
        status: "Sehat",
        description: "Usaha Anda menunjukkan performa yang sangat baik dengan laba konsisten dan pengelolaan keuangan yang sehat.",
        recommendation: "Pertahankan momentum positif. Pertimbangkan ekspansi usaha atau diversifikasi produk."
    },
    waspada: {
        status: "Waspada",
        description: "Usaha Anda dalam kondisi yang perlu diperhatikan. Beberapa aspek memerlukan perbaikan untuk meningkatkan stabilitas.",
        recommendation: "Fokus pada kontrol biaya dan peningkatan penjualan. Evaluasi strategi pemasaran yang sedang berjalan."
    },
    berisiko: {
        status: "Berisiko",
        description: "Usaha Anda menghadapi tantangan yang perlu segera ditangani. Terdapat indikasi masalah dalam pengelolaan keuangan.",
        recommendation: "Lakukan evaluasi mendalam terhadap semua aspek usaha. Pertimbangkan konsultasi dengan mentor bisnis."
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadDummyData();
    
    // Set default dates for filters
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('filterDateFrom').value = today;
    document.getElementById('filterDateTo').value = today;
});

// Initialize all event listeners
function initEventListeners() {
    // Hero Section
    document.getElementById('loginUserBtn').addEventListener('click', showLogin);
    document.getElementById('loginAdminBtn').addEventListener('click', showAdminDashboard);
    
    // Login Section
    document.getElementById('backToHero').addEventListener('click', showHero);
    document.getElementById('loginBtn').addEventListener('click', loginUser);
    document.getElementById('registerBtn').addEventListener('click', registerUser);
    document.getElementById('demoLoginBtn').addEventListener('click', demoLogin);
    
    // Tab switching in login
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId, this);
        });
    });
    
    // Dashboard Section
    document.getElementById('logoutBtn').addEventListener('click', logoutUser);
    document.getElementById('closeNotification').addEventListener('click', hideNotification);
    
    // Menu navigation
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            switchDashboardSection(sectionId, this);
        });
    });
    
    // Daily Data Section
    document.getElementById('addItemBtn').addEventListener('click', addDailyItem);
    document.getElementById('addSaleBtn').addEventListener('click', addDailySale);
    document.getElementById('saveDailyDataBtn').addEventListener('click', saveDailyData);
    document.getElementById('demoDailyBtn').addEventListener('click', demoDailyData);
    document.getElementById('resetChecklistBtn').addEventListener('click', resetChecklist);
    
    // Checklist functionality
    document.querySelectorAll('.checklist input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateChecklistStatus);
    });
    
    // Finance Section
    document.getElementById('hitungKeuanganBtn').addEventListener('click', calculateFinance);
    document.getElementById('updateTargetBtn').addEventListener('click', updateTargetProgress);
    document.getElementById('simulasiUsahaBtn').addEventListener('click', simulateBusiness);
    
    // AI Assistant Section
    document.getElementById('aiTipsBtn').addEventListener('click', showAiTip);
    document.querySelectorAll('.quick-question-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const questionType = this.getAttribute('data-question');
            showQuickAnswer(questionType);
        });
    });
    document.getElementById('aiQuestionBtn').addEventListener('click', askAiQuestion);
    document.getElementById('predictionBtn').addEventListener('click', showPrediction);
    document.getElementById('analyzeBusinessBtn').addEventListener('click', analyzeBusiness);
    document.getElementById('summaryBusinessBtn').addEventListener('click', generateBusinessSummary);
    
    // Notes functionality
    document.getElementById('saveNoteBtn').addEventListener('click', saveNote);
    document.getElementById('clearNoteBtn').addEventListener('click', clearNote);
    
    // History Section
    document.getElementById('filterHistoryBtn').addEventListener('click', filterHistory);
    document.getElementById('exportMonthlyBtn').addEventListener('click', exportToMonthly);
    document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
    document.getElementById('generateMonthlyBtn').addEventListener('click', generateMonthlyData);
    
    // Export functionality
    document.getElementById('exportExcelBtn').addEventListener('click', exportExcel);
    document.getElementById('exportCSVBtn').addEventListener('click', exportCSV);
    document.getElementById('exportPDFBtn').addEventListener('click', exportPDF);
    
    // Analysis Section
    document.getElementById('updateConditionBtn').addEventListener('click', updateConditionAnalysis);
    document.getElementById('refreshChartBtn').addEventListener('click', refreshChart);
    document.getElementById('addDummyDataBtn').addEventListener('click', addDummyChartData);
    document.getElementById('generateAutoSummaryBtn').addEventListener('click', generateAutoSummary);
    document.getElementById('copySummaryBtn').addEventListener('click', copySummary);
    document.getElementById('refreshNotificationsBtn').addEventListener('click', refreshNotifications);
    
    // Admin Section
    document.getElementById('backFromAdminBtn').addEventListener('click', showHero);
    document.getElementById('adminViewUsersBtn').addEventListener('click', showAdminUsers);
    document.getElementById('adminViewUMKMBtn').addEventListener('click', showAdminUMKM);
    document.getElementById('adminExportDataBtn').addEventListener('click', showAdminExport);
    document.getElementById('adminSimulateDataBtn').addEventListener('click', generateAdminDummyData);
    
    // Admin export buttons
    document.getElementById('adminExportExcelBtn').addEventListener('click', adminExportExcel);
    document.getElementById('adminExportCSVBtn').addEventListener('click', adminExportCSV);
    document.getElementById('adminExportPDFBtn').addEventListener('click', adminExportPDF);
    
    // Modal
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    
    // Preview admin buttons
    document.getElementById('viewUsersBtn').addEventListener('click', showAdminUsers);
    document.getElementById('viewUMKMBtn').addEventListener('click', showAdminUMKM);
    document.getElementById('exportAdminBtn').addEventListener('click', showAdminExport);
}

// Navigation Functions
function showHero() {
    document.getElementById('hero').classList.remove('hidden');
    document.getElementById('login').classList.add('hidden');
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('admin').classList.add('hidden');
}

function showLogin() {
    document.getElementById('hero').classList.add('hidden');
    document.getElementById('login').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('admin').classList.add('hidden');
    
    // Reset login form
    document.getElementById('login-tab').classList.add('active');
    document.getElementById('register-tab').classList.remove('active');
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    document.querySelectorAll('.tab-btn')[1].classList.remove('active');
}

function showDashboard() {
    document.getElementById('hero').classList.add('hidden');
    document.getElementById('login').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('admin').classList.add('hidden');
    
    // Update user info
    if (currentUser) {
        document.getElementById('currentStoreName').textContent = currentUser.storeName;
        document.getElementById('currentUsername').textContent = `Pemilik: ${currentUser.ownerName}`;
        document.getElementById('exportStoreName').textContent = currentUser.storeName;
    }
    
    // Show notification
    showNotification(`Selamat datang, ${currentUser ? currentUser.ownerName : 'User'}! Dashboard AI UMKM Assistant siap digunakan.`);
    
    // Calculate finance on load
    calculateFinance();
}

function showAdminDashboard() {
    document.getElementById('hero').classList.add('hidden');
    document.getElementById('login').classList.add('hidden');
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('admin').classList.remove('hidden');
    
    // Show user list by default
    showAdminUsers();
}

function switchTab(tabId, button) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabId).classList.add('active');
    button.classList.add('active');
}

function switchDashboardSection(sectionId, button) {
    // Hide all section contents
    document.querySelectorAll('.dashboard-section-content').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all menu buttons
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    button.classList.add('active');
}

// Login Functions
function loginUser() {
    const storeName = document.getElementById('storeName').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!storeName || !password) {
        showNotification('Harap isi nama toko dan kata sandi', 'error');
        return;
    }
    
    // Check user in database
    const user = users.find(u => u.storeName === storeName && u.password === password);
    
    if (user) {
        currentUser = user;
        showDashboard();
        showNotification(`Login berhasil! Selamat datang di ${storeName}`, 'success');
    } else {
        showNotification('Nama toko atau kata sandi salah', 'error');
    }
}

function registerUser() {
    const storeName = document.getElementById('newStoreName').value.trim();
    const ownerName = document.getElementById('ownerName').value.trim();
    const password = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const businessType = document.getElementById('businessType').value;
    
    if (!storeName || !ownerName || !password || !confirmPassword || !businessType) {
        showNotification('Harap isi semua data pendaftaran', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Kata sandi tidak cocok', 'error');
        return;
    }
    
    // Check if store name already exists
    if (users.some(u => u.storeName === storeName)) {
        showNotification('Nama toko sudah digunakan', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        storeName: storeName,
        ownerName: ownerName,
        password: password,
        businessType: businessType,
        joined: new Date().toISOString().split('T')[0],
        level: "pemula"
    };
    
    users.push(newUser);
    
    // Auto login
    currentUser = newUser;
    showDashboard();
    showNotification(`Pendaftaran berhasil! Selamat datang di ${storeName}`, 'success');
    
    // Clear form
    document.getElementById('newStoreName').value = '';
    document.getElementById('ownerName').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    document.getElementById('businessType').value = '';
}

function demoLogin() {
    // Use first user as demo
    currentUser = users[0];
    showDashboard();
    showNotification('Mode demo diaktifkan. Anda login sebagai Toko Maju Jaya', 'info');
}

function logoutUser() {
    currentUser = null;
    showHero();
    showNotification('Anda telah keluar dari sistem', 'info');
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notificationText.textContent = message;
    
    // Set color based on type
    notification.style.backgroundColor = type === 'error' ? '#fee2e2' : 
                                       type === 'success' ? '#d1fae5' : 
                                       type === 'warning' ? '#fef3c7' : '#e3f2fd';
    notification.style.borderLeftColor = type === 'error' ? '#ef4444' : 
                                        type === 'success' ? '#10b981' : 
                                        type === 'warning' ? '#f59e0b' : '#4a6bff';
    
    notification.classList.remove('hidden');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification();
    }, 5000);
}

function hideNotification() {
    document.getElementById('notification').classList.add('hidden');
}

// Daily Data Functions
function addDailyItem() {
    const itemName = document.getElementById('itemName').value.trim();
    const quantity = parseInt(document.getElementById('itemQuantity').value) || 0;
    const price = parseInt(document.getElementById('itemPrice').value) || 0;
    const category = document.getElementById('itemCategory').value;
    
    if (!itemName || quantity <= 0 || price <= 0) {
        showNotification('Harap isi semua data dengan benar', 'error');
        return;
    }
    
    const total = quantity * price;
    
    // Add to list
    const itemList = document.getElementById('itemList');
    const emptyMessage = itemList.querySelector('.empty-message');
    
    if (emptyMessage) {
        itemList.innerHTML = '';
    }
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item-row';
    itemDiv.innerHTML = `
        <div class="item-info">
            <strong>${itemName}</strong>
            <small>${quantity} x Rp ${price.toLocaleString()} | ${category}</small>
        </div>
        <div class="item-total">Rp ${total.toLocaleString()}</div>
    `;
    
    itemList.appendChild(itemDiv);
    
    // Update total
    updateDailyModalTotal();
    
    // Clear form
    document.getElementById('itemName').value = '';
    document.getElementById('itemQuantity').value = '';
    document.getElementById('itemPrice').value = '';
    
    showNotification('Item berhasil ditambahkan ke modal harian', 'success');
}

function updateDailyModalTotal() {
    const items = document.querySelectorAll('#itemList .item-row');
    let total = 0;
    
    items.forEach(item => {
        const totalText = item.querySelector('.item-total').textContent;
        const amount = parseInt(totalText.replace(/[^\d]/g, '')) || 0;
        total += amount;
    });
    
    document.getElementById('totalDailyModal').textContent = total.toLocaleString();
    document.getElementById('summaryModal').textContent = `Rp ${total.toLocaleString()}`;
    
    updateDailySummary();
}

function addDailySale() {
    const productName = document.getElementById('soldProduct').value.trim();
    const quantity = parseInt(document.getElementById('soldQuantity').value) || 0;
    const price = parseInt(document.getElementById('soldPrice').value) || 0;
    
    if (!productName || quantity <= 0 || price <= 0) {
        showNotification('Harap isi semua data penjualan dengan benar', 'error');
        return;
    }
    
    const total = quantity * price;
    
    // Add to list
    const salesList = document.getElementById('salesList');
    const emptyMessage = salesList.querySelector('.empty-message');
    
    if (emptyMessage) {
        salesList.innerHTML = '';
    }
    
    const saleDiv = document.createElement('div');
    saleDiv.className = 'item-row';
    saleDiv.innerHTML = `
        <div class="item-info">
            <strong>${productName}</strong>
            <small>${quantity} x Rp ${price.toLocaleString()}</small>
        </div>
        <div class="item-total">Rp ${total.toLocaleString()}</div>
    `;
    
    salesList.appendChild(saleDiv);
    
    // Update total
    updateDailySalesTotal();
    
    // Clear form
    document.getElementById('soldProduct').value = '';
    document.getElementById('soldQuantity').value = '';
    document.getElementById('soldPrice').value = '';
    
    showNotification('Penjualan berhasil ditambahkan', 'success');
}

function updateDailySalesTotal() {
    const sales = document.querySelectorAll('#salesList .item-row');
    let total = 0;
    
    sales.forEach(sale => {
        const totalText = sale.querySelector('.item-total').textContent;
        const amount = parseInt(totalText.replace(/[^\d]/g, '')) || 0;
        total += amount;
    });
    
    document.getElementById('totalDailySales').textContent = total.toLocaleString();
    document.getElementById('summarySales').textContent = `Rp ${total.toLocaleString()}`;
    
    updateDailySummary();
}

function updateDailySummary() {
    const modalTotal = parseInt(document.getElementById('totalDailyModal').textContent.replace(/,/g, '')) || 0;
    const salesTotal = parseInt(document.getElementById('totalDailySales').textContent.replace(/,/g, '')) || 0;
    
    const profitLoss = salesTotal - modalTotal;
    const profitElement = document.getElementById('summaryProfit');
    
    profitElement.textContent = `Rp ${Math.abs(profitLoss).toLocaleString()}`;
    
    if (profitLoss >= 0) {
        profitElement.className = 'profit-text';
        profitElement.textContent = `+Rp ${profitLoss.toLocaleString()}`;
    } else {
        profitElement.className = 'loss-text';
        profitElement.textContent = `-Rp ${Math.abs(profitLoss).toLocaleString()}`;
    }
}

function updateChecklistStatus() {
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    const statusElement = document.getElementById('checklistStatus');
    
    if (allChecked) {
        statusElement.classList.remove('hidden');
        showNotification('Selamat! Anda telah menyelesaikan semua checklist harian', 'success');
    } else {
        statusElement.classList.add('hidden');
    }
}

function resetChecklist() {
    document.querySelectorAll('.checklist input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    document.getElementById('checklistStatus').classList.add('hidden');
    showNotification('Checklist telah direset', 'info');
}

function saveDailyData() {
    const modalTotal = parseInt(document.getElementById('totalDailyModal').textContent.replace(/,/g, '')) || 0;
    const salesTotal = parseInt(document.getElementById('totalDailySales').textContent.replace(/,/g, '')) || 0;
    const profitLoss = salesTotal - modalTotal;
    
    if (modalTotal === 0 && salesTotal === 0) {
        showNotification('Tidak ada data harian untuk disimpan', 'error');
        return;
    }
    
    const dailyRecord = {
        id: dailyData.length + 1,
        date: new Date().toISOString().split('T')[0],
        modal: modalTotal,
        sales: salesTotal,
        profit: profitLoss,
        items: Array.from(document.querySelectorAll('#itemList .item-row')).map(item => {
            return {
                name: item.querySelector('strong').textContent,
                info: item.querySelector('small').textContent
            };
        }),
        salesItems: Array.from(document.querySelectorAll('#salesList .item-row')).map(sale => {
            return {
                name: sale.querySelector('strong').textContent,
                info: sale.querySelector('small').textContent
            };
        })
    };
    
    dailyData.push(dailyRecord);
    
    // Also add to history
    historyData.push(dailyRecord);
    
    // Clear daily data
    document.getElementById('itemList').innerHTML = '<p class="empty-message">Belum ada item ditambahkan</p>';
    document.getElementById('salesList').innerHTML = '<p class="empty-message">Belum ada penjualan dicatat</p>';
    document.getElementById('totalDailyModal').textContent = '0';
    document.getElementById('totalDailySales').textContent = '0';
    document.getElementById('summaryModal').textContent = '0';
    document.getElementById('summarySales').textContent = '0';
    document.getElementById('summaryProfit').textContent = '0';
    document.getElementById('summaryProfit').className = 'profit-text';
    
    showNotification(`Data harian berhasil disimpan (${dailyRecord.date})`, 'success');
    
    // Update history table
    updateHistoryTable();
}

function demoDailyData() {
    // Add demo items
    const demoItems = [
        { name: "Beras 5kg", quantity: 2, price: 60000, category: "bahan-baku" },
        { name: "Minyak Goreng 2L", quantity: 3, price: 30000, category: "bahan-baku" },
        { name: "Gas LPG 3kg", quantity: 1, price: 25000, category: "operasional" }
    ];
    
    demoItems.forEach(item => {
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemQuantity').value = item.quantity;
        document.getElementById('itemPrice').value = item.price;
        document.getElementById('itemCategory').value = item.category;
        addDailyItem();
    });
    
    // Add demo sales
    const demoSales = [
        { name: "Nasi Goreng Spesial", quantity: 15, price: 25000 },
        { name: "Es Teh Manis", quantity: 20, price: 5000 },
        { name: "Mie Goreng", quantity: 10, price: 20000 }
    ];
    
    demoSales.forEach(sale => {
        document.getElementById('soldProduct').value = sale.name;
        document.getElementById('soldQuantity').value = sale.quantity;
        document.getElementById('soldPrice').value = sale.price;
        addDailySale();
    });
    
    // Check all checkboxes
    document.querySelectorAll('.checklist input[type="checkbox"]').forEach(cb => {
        cb.checked = true;
    });
    updateChecklistStatus();
    
    showNotification('Data demo harian telah dimuat', 'info');
}

// Finance Functions
function calculateFinance() {
    const modalAwal = parseInt(document.getElementById('modalAwal').value) || 0;
    const penjualan = parseInt(document.getElementById('penjualan').value) || 0;
    const biayaOperasional = parseInt(document.getElementById('biayaOperasional').value) || 0;
    const pajakPercent = parseInt(document.getElementById('pajak').value) || 0;
    
    // Calculate
    const pajakAmount = (penjualan * pajakPercent) / 100;
    const totalPemasukan = penjualan;
    const totalPengeluaran = modalAwal + biayaOperasional + pajakAmount;
    const labaRugi = totalPemasukan - totalPengeluaran;
    
    // Update UI
    document.getElementById('totalPemasukan').textContent = `Rp ${totalPemasukan.toLocaleString()}`;
    document.getElementById('totalPengeluaran').textContent = `Rp ${totalPengeluaran.toLocaleString()}`;
    document.getElementById('pajakResult').textContent = `Rp ${pajakAmount.toLocaleString()}`;
    
    const labaRugiElement = document.getElementById('labaRugi');
    if (labaRugi >= 0) {
        labaRugiElement.textContent = `+Rp ${labaRugi.toLocaleString()}`;
        labaRugiElement.className = 'profit-text';
    } else {
        labaRugiElement.textContent = `-Rp ${Math.abs(labaRugi).toLocaleString()}`;
        labaRugiElement.className = 'loss-text';
    }
    
    // Update finance status
    updateFinanceStatus(labaRugi, penjualan, totalPengeluaran);
    
    // Update health score based on profit margin
    const profitMargin = penjualan > 0 ? (labaRugi / penjualan) * 100 : 0;
    updateHealthScore(profitMargin);
    
    showNotification('Perhitungan keuangan selesai', 'success');
}

function updateFinanceStatus(labaRugi, penjualan, pengeluaran) {
    const statusElement = document.getElementById('financeStatus');
    const descriptionElement = document.getElementById('financeDescription');
    
    let status = '';
    let description = '';
    
    if (labaRugi > 0) {
        const margin = (labaRugi / penjualan) * 100;
        
        if (margin > 20) {
            status = 'Sangat Baik';
            statusElement.style.backgroundColor = '#10b981';
            description = `Usaha Anda sangat menguntungkan dengan margin laba ${margin.toFixed(1)}%. Pertahankan kinerja ini!`;
        } else if (margin > 10) {
            status = 'Baik';
            statusElement.style.backgroundColor = '#34d399';
            description = `Usaha Anda menguntungkan dengan margin laba ${margin.toFixed(1)}%. Ada ruang untuk perbaikan.`;
        } else {
            status = 'Cukup';
            statusElement.style.backgroundColor = '#f59e0b';
            description = `Usaha Anda menghasilkan laba, tetapi margin ${margin.toFixed(1)}% cukup tipis. Perlu optimasi biaya.`;
        }
    } else {
        status = 'Perhatian';
        statusElement.style.backgroundColor = '#ef4444';
        description = `Usaha Anda mengalami kerugian. Perlu evaluasi menyeluruh terhadap biaya dan strategi penjualan.`;
    }
    
    statusElement.textContent = status;
    descriptionElement.textContent = description;
}

function updateTargetProgress() {
    const targetPenjualan = parseInt(document.getElementById('targetPenjualan').value) || 1;
    const targetLaba = parseInt(document.getElementById('targetLaba').value) || 1;
    
    const actualPenjualan = parseInt(document.getElementById('penjualan').value) || 0;
    const actualLaba = parseInt(document.getElementById('labaRugi').textContent.replace(/[^\d-]/g, '')) || 0;
    
    // Calculate progress
    const salesProgress = Math.min(100, (actualPenjualan / targetPenjualan) * 100);
    const profitProgress = Math.min(100, (Math.max(0, actualLaba) / targetLaba) * 100);
    
    // Update progress bars
    document.getElementById('salesProgress').style.width = `${salesProgress}%`;
    document.getElementById('profitProgress').style.width = `${profitProgress}%`;
    
    // Update progress text
    document.getElementById('salesProgressText').textContent = `${salesProgress.toFixed(1)}%`;
    document.getElementById('profitProgressText').textContent = `${profitProgress.toFixed(1)}%`;
    
    showNotification('Progress target telah diupdate', 'success');
}

function simulateBusiness() {
    const modal = parseInt(document.getElementById('simulasiModal').value) || 0;
    const target = parseInt(document.getElementById('simulasiTarget').value) || 0;
    
    if (modal <= 0 || target <= 0) {
        showNotification('Harap isi modal dan target dengan benar', 'error');
        return;
    }
    
    // Simple simulation logic
    const biayaOperasional = modal * 0.3; // 30% of modal
    const estimasiPenjualan = target * 0.8; // 80% of target (conservative)
    const estimasiLaba = estimasiPenjualan - modal - biayaOperasional;
    const roi = (estimasiLaba / modal) * 100;
    
    // Show result
    document.getElementById('simulasiResult').classList.remove('hidden');
    
    const labaElement = document.getElementById('simulasiLaba');
    if (estimasiLaba >= 0) {
        labaElement.textContent = `+Rp ${estimasiLaba.toLocaleString()}`;
        labaElement.className = 'profit-text';
    } else {
        labaElement.textContent = `-Rp ${Math.abs(estimasiLaba).toLocaleString()}`;
        labaElement.className = 'loss-text';
    }
    
    document.getElementById('simulasiROI').textContent = `${roi.toFixed(1)}%`;
    
    // AI note
    let catatan = '';
    if (roi > 20) {
        catatan = 'Simulasi menunjukkan usaha sangat potensial dengan ROI tinggi. Pertimbangkan untuk segera memulai.';
    } else if (roi > 0) {
        catatan = 'Usaha menunjukkan potensi keuntungan. Perlu manajemen biaya yang baik untuk mencapai target.';
    } else {
        catatan = 'Usaha berisiko rugi berdasarkan simulasi. Evaluasi ulang modal, harga jual, atau target pasar.';
    }
    
    document.getElementById('simulasiCatatan').innerHTML = `<i class="fas fa-robot"></i> <em>Catatan AI: ${catatan}</em>`;
    
    showNotification('Simulasi usaha selesai', 'success');
}

// AI Functions
function showAiTip() {
    const randomTip = aiTips[Math.floor(Math.random() * aiTips.length)];
    document.getElementById('aiTipsOutput').innerHTML = `
        <p><strong>Tips Bisnis Hari Ini:</strong></p>
        <p>${randomTip}</p>
        <small><i class="fas fa-robot"></i> AI Mentor UMKM</small>
    `;
    
    showNotification('Tips bisnis harian telah diperbarui', 'success');
}

function showQuickAnswer(questionType) {
    const answer = quickAnswers[questionType] || "Maaf, saya tidak dapat menjawab pertanyaan tersebut saat ini.";
    
    document.getElementById('quickAnswerOutput').innerHTML = `
        <p><strong>Jawaban AI:</strong></p>
        <p>${answer}</p>
        <small><i class="fas fa-robot"></i> AI Assistant UMKM</small>
    `;
}

function askAiQuestion() {
    const question = document.getElementById('aiQuestion').value.trim();
    
    if (!question) {
        showNotification('Harap masukkan pertanyaan terlebih dahulu', 'error');
        return;
    }
    
    // Get financial data for context
    const labaRugi = parseInt(document.getElementById('labaRugi').textContent.replace(/[^\d-]/g, '')) || 0;
    const penjualan = parseInt(document.getElementById('penjualan').value) || 0;
    const pengeluaran = parseInt(document.getElementById('totalPengeluaran').textContent.replace(/[^\d]/g, '')) || 0;
    
    // Generate AI response based on financial condition
    let response = '';
    
    if (labaRugi > 0) {
        response = `Berdasarkan data keuangan Anda yang menunjukkan laba sebesar Rp ${Math.abs(labaRugi).toLocaleString()}, usaha Anda dalam kondisi baik. `;
        response += `Untuk pertanyaan "${question}", AI menyarankan: Fokus pada peningkatan kualitas produk, ekspansi pasar, dan pertimbangkan investasi dalam pemasaran digital untuk meningkatkan penjualan lebih lanjut.`;
    } else {
        response = `Berdasarkan data keuangan Anda yang menunjukkan kerugian sebesar Rp ${Math.abs(labaRugi).toLocaleString()}, ada beberapa area yang perlu diperbaiki. `;
        response += `Untuk pertanyaan "${question}", AI menyarankan: Lakukan evaluasi biaya operasional, pertimbangkan menaikkan harga jual jika memungkinkan, dan fokus pada produk dengan margin terbaik.`;
    }
    
    document.getElementById('aiFinanceOutput').innerHTML = `
        <p><strong>Pertanyaan:</strong> ${question}</p>
        <p><strong>Jawaban AI:</strong> ${response}</p>
        <small><i class="fas fa-robot"></i> Analisis berdasarkan kondisi keuangan terkini</small>
    `;
    
    // Clear question field
    document.getElementById('aiQuestion').value = '';
    
    showNotification('AI telah menjawab pertanyaan Anda', 'success');
}

function showPrediction() {
    const penjualan = parseInt(document.getElementById('penjualan').value) || 0;
    const labaRugi = parseInt(document.getElementById('labaRugi').textContent.replace(/[^\d-]/g, '')) || 0;
    
    // Simple prediction based on current data
    const growthRate = 0.1; // Assume 10% growth
    const predictedSales = penjualan * (1 + growthRate);
    const predictedProfit = labaRugi * (1 + growthRate);
    
    let predictionText = '';
    
    if (predictedProfit > 0) {
        predictionText = `Berdasarkan data saat ini, prediksi untuk bulan depan: Penjualan diperkirakan Rp ${predictedSales.toLocaleString()} (naik 10%) dengan laba sekitar Rp ${predictedProfit.toLocaleString()}.`;
    } else {
        predictionText = `Berdasarkan data saat ini, prediksi untuk bulan depan: Perlu perbaikan strategi karena diperkirakan masih rugi sekitar Rp ${Math.abs(predictedProfit).toLocaleString()}. Fokus pada pengurangan biaya dan peningkatan penjualan.`;
    }
    
    document.getElementById('predictionOutput').innerHTML = `
        <p><strong>Prediksi AI untuk Bulan Depan:</strong></p>
        <p>${predictionText}</p>
        <small><i class="fas fa-robot"></i> Simulasi prediksi berdasarkan data input dan tren rata-rata UMKM</small>
    `;
    
    showNotification('Prediksi bulan depan telah dibuat', 'success');
}

function analyzeBusiness() {
    const labaRugi = parseInt(document.getElementById('labaRugi').textContent.replace(/[^\d-]/g, '')) || 0;
    const penjualan = parseInt(document.getElementById('penjualan').value) || 0;
    
    // Determine business health
    let analysisKey = 'waspada';
    
    if (labaRugi > 0) {
        const profitMargin = (labaRugi / penjualan) * 100;
        if (profitMargin > 15) {
            analysisKey = 'sehat';
        }
    } else {
        analysisKey = 'berisiko';
    }
    
    const analysis = businessAnalysis[analysisKey];
    
    document.getElementById('analysisOutput').innerHTML = `
        <p><strong>Status Usaha: ${analysis.status}</strong></p>
        <p>${analysis.description}</p>
        <p><strong>Rekomendasi:</strong> ${analysis.recommendation}</p>
        <small><i class="fas fa-robot"></i> Analisis AI berdasarkan data keuangan terkini</small>
    `;
    
    // Update level based on analysis
    updateUserLevel(analysisKey);
    
    showNotification('Analisis usaha selesai', 'success');
}

function generateBusinessSummary() {
    if (!currentUser) return;
    
    const storeName = currentUser.storeName;
    const ownerName = currentUser.ownerName;
    const businessType = currentUser.businessType;
    const level = currentUser.level;
    
    const penjualan = parseInt(document.getElementById('penjualan').value) || 0;
    const labaRugi = parseInt(document.getElementById('labaRugi').textContent.replace(/[^\d-]/g, '')) || 0;
    const healthScore = document.getElementById('healthScoreValue').textContent;
    
    const summary = `
        <p><strong>Ringkasan Usaha: ${storeName}</strong></p>
        <p>Pemilik: ${ownerName}</p>
        <p>Jenis Usaha: ${getBusinessTypeName(businessType)}</p>
        <p>Level UMKM: ${level.charAt(0).toUpperCase() + level.slice(1)}</p>
        <p>Penjualan Bulanan: Rp ${penjualan.toLocaleString()}</p>
        <p>Laba/Rugi: ${labaRugi >= 0 ? 'Rp +' + labaRugi.toLocaleString() : 'Rp -' + Math.abs(labaRugi).toLocaleString()}</p>
        <p>Health Score: ${healthScore}</p>
        <p><strong>Deskripsi Singkat:</strong> Usaha ${storeName} bergerak di bidang ${getBusinessTypeName(businessType)} dengan performa ${labaRugi >= 0 ? 'menguntungkan' : 'perlu perhatian'}. Berdasarkan analisis AI, usaha ini berada pada level ${level} dengan rekomendasi untuk ${labaRugi >= 0 ? 'pengembangan dan ekspansi' : 'optimasi biaya dan peningkatan penjualan'}.</p>
    `;
    
    document.getElementById('analysisOutput').innerHTML = summary;
    
    showNotification('Ringkasan usaha telah dibuat', 'success');
}

function getBusinessTypeName(type) {
    const types = {
        'makanan': 'Makanan & Minuman',
        'fashion': 'Fashion',
        'elektronik': 'Elektronik',
        'jasa': 'Jasa',
        'lainnya': 'Lainnya'
    };
    
    return types[type] || type;
}

function updateHealthScore(profitMargin) {
    // Calculate health score based on various factors
    let score = 50; // Base score
    
    // Add points based on profit margin
    if (profitMargin > 20) score += 30;
    else if (profitMargin > 10) score += 20;
    else if (profitMargin > 0) score += 10;
    else if (profitMargin > -10) score -= 10;
    else score -= 30;
    
    // Add points based on checklist completion
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    score += (checkedCount * 5);
    
    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score));
    
    // Update UI
    document.getElementById('healthScoreValue').textContent = Math.round(score);
    document.getElementById('healthScore').textContent = `Skor: ${Math.round(score)}`;
    
    // Update score circle
    const scoreCircle = document.querySelector('.score-circle');
    const fillPercentage = score;
    scoreCircle.style.background = `conic-gradient(var(--success) 0% ${fillPercentage}%, var(--light-gray) ${fillPercentage}% 100%)`;
    
    // Update category
    let category = '';
    let description = '';
    
    if (score >= 80) {
        category = 'Sehat';
        description = 'Usaha Anda dalam kondisi sangat baik dengan performa optimal.';
        document.getElementById('healthScoreCategory').innerHTML = 'Kategori: <strong style="color: #10b981">Sehat</strong>';
    } else if (score >= 60) {
        category = 'Waspada';
        description = 'Usaha Anda memerlukan perhatian pada beberapa aspek untuk meningkatkan performa.';
        document.getElementById('healthScoreCategory').innerHTML = 'Kategori: <strong style="color: #f59e0b">Waspada</strong>';
    } else {
        category = 'Berisiko';
        description = 'Usaha Anda memerlukan intervensi segera untuk memperbaiki kondisi keuangan.';
        document.getElementById('healthScoreCategory').innerHTML = 'Kategori: <strong style="color: #ef4444">Berisiko</strong>';
    }
    
    document.getElementById('healthScoreDescription').textContent = description;
}

function updateUserLevel(analysisKey) {
    if (!currentUser) return;
    
    let newLevel = currentUser.level;
    
    // Update level based on analysis
    if (analysisKey === 'sehat') {
        newLevel = 'stabil';
    } else if (analysisKey === 'waspada') {
        newLevel = 'berkembang';
    } else {
        newLevel = 'pemula';
    }
    
    // Update current user
    currentUser.level = newLevel;
    
    // Update UI
    document.getElementById('userLevel').textContent = newLevel.charAt(0).toUpperCase() + newLevel.slice(1);
    
    // Update level indicators
    document.querySelectorAll('.stage-indicator').forEach(indicator => {
        indicator.style.backgroundColor = 'var(--light-gray)';
    });
    
    if (newLevel === 'pemula') {
        document.getElementById('levelPemula').style.backgroundColor = 'var(--success)';
        document.getElementById('currentLevelText').textContent = 'Pemula';
    } else if (newLevel === 'berkembang') {
        document.getElementById('levelBerkembang').style.backgroundColor = 'var(--success)';
        document.getElementById('currentLevelText').textContent = 'Berkembang';
    } else {
        document.getElementById('levelStabil').style.backgroundColor = 'var(--success)';
        document.getElementById('currentLevelText').textContent = 'Stabil';
    }
    
    // Update level description
    const levelDescriptions = {
        pemula: 'Usaha Anda baru dimulai. Fokus pada bertahan hidup, membangun basis pelanggan, dan memahami pasar.',
        berkembang: 'Usaha Anda menunjukkan pertumbuhan. Fokus pada stabilisasi keuangan dan ekspansi terbatas.',
        stabil: 'Usaha Anda telah matang. Fokus pada ekspansi, diversifikasi, dan optimalisasi operasional.'
    };
    
    document.getElementById('levelDescription').textContent = levelDescriptions[newLevel];
}

// Notes Functions
function saveNote() {
    const noteText = document.getElementById('businessNote').value.trim();
    
    if (!noteText) {
        showNotification('Harap tulis catatan terlebih dahulu', 'error');
        return;
    }
    
    const note = {
        id: notes.length + 1,
        text: noteText,
        date: new Date().toLocaleString('id-ID'),
        type: 'business'
    };
    
    notes.push(note);
    
    // Update saved notes display
    updateNotesDisplay();
    
    // Clear textarea
    document.getElementById('businessNote').value = '';
    
    showNotification('Catatan berhasil disimpan', 'success');
}

function clearNote() {
    document.getElementById('businessNote').value = '';
    showNotification('Catatan telah dibersihkan', 'info');
}

function updateNotesDisplay() {
    const notesContainer = document.getElementById('savedNotes');
    
    if (notes.length === 0) {
        notesContainer.innerHTML = '<h6>Catatan Tersimpan:</h6><p class="empty-message">Belum ada catatan tersimpan</p>';
        return;
    }
    
    let notesHTML = '<h6>Catatan Tersimpan:</h6>';
    
    // Show last 3 notes
    const recentNotes = notes.slice(-3).reverse();
    
    recentNotes.forEach(note => {
        notesHTML += `
            <div class="note-item">
                <p>${note.text}</p>
                <small>${note.date}</small>
            </div>
        `;
    });
    
    if (notes.length > 3) {
        notesHTML += `<p class="note-more">+ ${notes.length - 3} catatan lainnya</p>`;
    }
    
    notesContainer.innerHTML = notesHTML;
}

// History Functions
function updateHistoryTable() {
    const tableBody = document.getElementById('historyTableBody');
    
    if (historyData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Belum ada data harian tersimpan</td></tr>';
        return;
    }
    
    let tableHTML = '';
    
    // Show recent history (last 10 entries)
    const recentHistory = historyData.slice(-10).reverse();
    
    recentHistory.forEach(record => {
        const profitClass = record.profit >= 0 ? 'profit-text' : 'loss-text';
        const profitDisplay = record.profit >= 0 ? 
            `+Rp ${record.profit.toLocaleString()}` : 
            `-Rp ${Math.abs(record.profit).toLocaleString()}`;
        
        tableHTML += `
            <tr>
                <td>${record.date}</td>
                <td>Rp ${record.modal.toLocaleString()}</td>
                <td>Rp ${record.sales.toLocaleString()}</td>
                <td class="${profitClass}">${profitDisplay}</td>
                <td>
                    <button class="btn-view-detail" data-id="${record.id}">Detail</button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = tableHTML;
    
    // Add event listeners to detail buttons
    document.querySelectorAll('.btn-view-detail').forEach(btn => {
        btn.addEventListener('click', function() {
            const recordId = parseInt(this.getAttribute('data-id'));
            showDetailModal(recordId);
        });
    });
}

function filterHistory() {
    const dateFrom = document.getElementById('filterDateFrom').value;
    const dateTo = document.getElementById('filterDateTo').value;
    
    if (!dateFrom || !dateTo) {
        showNotification('Harap pilih tanggal filter', 'error');
        return;
    }
    
    // In a real app, this would filter from the database
    // For prototype, we'll just show a message
    showNotification(`Filter diterapkan: ${dateFrom} hingga ${dateTo}`, 'info');
}

function exportToMonthly() {
    if (historyData.length === 0) {
        showNotification('Tidak ada data harian untuk diekspor', 'error');
        return;
    }
    
    // Generate monthly data from history
    generateMonthlyData();
    
    showNotification('Data harian telah diekspor ke data bulanan', 'success');
}

function clearHistory() {
    if (confirm('Apakah Anda yakin ingin menghapus semua riwayat data?')) {
        historyData = [];
        updateHistoryTable();
        showNotification('Riwayat data telah dihapus', 'success');
    }
}

function generateMonthlyData() {
    if (historyData.length === 0) {
        showNotification('Tidak ada data harian untuk membuat data bulanan', 'error');
        return;
    }
    
    // Calculate monthly totals
    let totalModal = 0;
    let totalSales = 0;
    let totalProfit = 0;
    let days = historyData.length;
    
    historyData.forEach(record => {
        totalModal += record.modal;
        totalSales += record.sales;
        totalProfit += record.profit;
    });
    
    const avgProfit = totalProfit / days;
    
    // Create monthly data object
    monthlyData = {
        period: `${historyData[0].date} hingga ${historyData[historyData.length - 1].date}`,
        totalModal: totalModal,
        totalSales: totalSales,
        totalProfit: totalProfit,
        avgProfit: avgProfit,
        days: days
    };
    
    // Update UI
    document.getElementById('monthlyModal').textContent = `Rp ${totalModal.toLocaleString()}`;
    document.getElementById('monthlySales').textContent = `Rp ${totalSales.toLocaleString()}`;
    
    const monthlyProfitElement = document.getElementById('monthlyProfit');
    if (totalProfit >= 0) {
        monthlyProfitElement.textContent = `+Rp ${totalProfit.toLocaleString()}`;
        monthlyProfitElement.className = 'profit-text';
    } else {
        monthlyProfitElement.textContent = `-Rp ${Math.abs(totalProfit).toLocaleString()}`;
        monthlyProfitElement.className = 'loss-text';
    }
    
    document.getElementById('monthlyAvgProfit').textContent = `Rp ${avgProfit.toLocaleString()}`;
    document.getElementById('monthlyDays').textContent = days;
    
    // Generate conclusion
    let conclusion = '';
    if (totalProfit > 0) {
        const profitMargin = (totalProfit / totalSales) * 100;
        conclusion = `Usaha menunjukkan performa yang baik dengan laba sebesar Rp ${totalProfit.toLocaleString()} (margin ${profitMargin.toFixed(1)}%) dalam ${days} hari.`;
        
        if (profitMargin > 15) {
            conclusion += ' Pertahankan momentum ini!';
        } else {
            conclusion += ' Ada ruang untuk meningkatkan margin keuntungan.';
        }
    } else {
        conclusion = `Usaha mengalami kerugian sebesar Rp ${Math.abs(totalProfit).toLocaleString()} dalam ${days} hari. Perlu evaluasi menyeluruh terhadap strategi bisnis.`;
    }
    
    document.getElementById('monthlyConclusion').textContent = conclusion;
    
    // Show monthly summary
    document.getElementById('monthlySummary').classList.remove('hidden');
    
    showNotification('Data bulanan telah dihasilkan', 'success');
}

// Export Functions
function exportExcel() {
    // Simulate export
    showNotification('Mengunduh laporan Excel...', 'info');
    
    // Simulate download
    setTimeout(() => {
        showNotification('Laporan Excel berhasil diunduh (simulasi)', 'success');
    }, 1500);
}

function exportCSV() {
    // Simulate export
    showNotification('Mengunduh laporan CSV...', 'info');
    
    // Simulate download
    setTimeout(() => {
        showNotification('Laporan CSV berhasil diunduh (simulasi)', 'success');
    }, 1500);
}

function exportPDF() {
    // Simulate export
    showNotification('Mengunduh laporan PDF...', 'info');
    
    // Simulate download
    setTimeout(() => {
        showNotification('Laporan PDF berhasil diunduh (simulasi)', 'success');
    }, 1500);
}

// Analysis Functions
function updateConditionAnalysis() {
    // Simulate updating condition analysis
    const financeValue = Math.floor(Math.random() * 30) + 60;
    const operationalValue = Math.floor(Math.random() * 25) + 65;
    const marketingValue = Math.floor(Math.random() * 40) + 50;
    const managementValue = Math.floor(Math.random() * 20) + 70;
    
    // Update progress bars
    document.querySelector('.condition-fill.finance').style.width = `${financeValue}%`;
    document.querySelector('.condition-fill.operational').style.width = `${operationalValue}%`;
    document.querySelector('.condition-fill.marketing').style.width = `${marketingValue}%`;
    document.querySelector('.condition-fill.management').style.width = `${managementValue}%`;
    
    // Update values
    document.querySelectorAll('.condition-value')[0].textContent = `${financeValue}%`;
    document.querySelectorAll('.condition-value')[1].textContent = `${operationalValue}%`;
    document.querySelectorAll('.condition-value')[2].textContent = `${marketingValue}%`;
    document.querySelectorAll('.condition-value')[3].textContent = `${managementValue}%`;
    
    // Update conclusion
    const avgScore = (financeValue + operationalValue + marketingValue + managementValue) / 4;
    
    let conclusion = '';
    if (avgScore >= 80) {
        conclusion = 'Usaha Anda dalam kondisi sangat sehat. Semua aspek berjalan dengan baik. Pertahankan dan tingkatkan konsistensi.';
    } else if (avgScore >= 65) {
        conclusion = 'Usaha Anda dalam kondisi cukup baik. Perlu perhatian lebih pada aspek pemasaran untuk meningkatkan penjualan.';
    } else {
        conclusion = 'Usaha Anda memerlukan perhatian serius. Fokus pada perbaikan aspek keuangan dan pemasaran terlebih dahulu.';
    }
    
    document.getElementById('conditionConclusion').textContent = conclusion;
    
    showNotification('Analisis kondisi usaha telah diperbarui', 'success');
}

function refreshChart() {
    // Simulate refreshing chart data
    const bars = document.querySelectorAll('.chart-bar');
    
    bars.forEach(bar => {
        const isProfit = Math.random() > 0.3; // 70% chance of profit
        const height = Math.floor(Math.random() * 60) + 30; // 30-90% height
        
        bar.style.height = `${height}%`;
        bar.className = `chart-bar ${isProfit ? 'profit' : 'loss'}`;
    });
    
    showNotification('Grafik telah diperbarui', 'success');
}

function addDummyChartData() {
    // Simulate adding dummy data to chart
    const chartBars = document.querySelector('.chart-bars');
    
    // Add more bars for demonstration
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min', 'Sen', 'Sel', 'Rab'];
    
    // Clear existing bars
    chartBars.innerHTML = '';
    
    // Add new bars
    days.forEach(day => {
        const isProfit = Math.random() > 0.3;
        const height = Math.floor(Math.random() * 70) + 20;
        
        const barContainer = document.createElement('div');
        barContainer.className = 'chart-bar-container';
        barContainer.innerHTML = `
            <div class="chart-bar ${isProfit ? 'profit' : 'loss'}" style="height: ${height}%"></div>
            <div class="chart-label">${day}</div>
        `;
        
        chartBars.appendChild(barContainer);
    });
    
    showNotification('Data demo telah ditambahkan ke grafik', 'success');
}

function generateAutoSummary() {
    if (!currentUser) return;
    
    const storeName = currentUser.storeName;
    const penjualan = parseInt(document.getElementById('penjualan').value) || 0;
    const labaRugi = parseInt(document.getElementById('labaRugi').textContent.replace(/[^\d-]/g, '')) || 0;
    const healthScore = document.getElementById('healthScoreValue').textContent;
    const level = currentUser.level;
    
    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const summary = `
        <h5>Ringkasan Usaha Otomatis</h5>
        <p><strong>Nama Usaha:</strong> ${storeName}</p>
        <p><strong>Tanggal Laporan:</strong> ${today}</p>
        <p><strong>Ringkasan Performa:</strong></p>
        <p>Usaha ${storeName} menunjukkan ${labaRugi >= 0 ? 'performa yang menguntungkan' : 'tanda-tanda yang perlu diperhatikan'} dengan ${labaRugi >= 0 ? 'laba' : 'rugi'} sebesar Rp ${Math.abs(labaRugi).toLocaleString()} dari total penjualan Rp ${penjualan.toLocaleString()}.</p>
        <p><strong>Analisis Kondisi:</strong></p>
        <p>Berdasarkan analisis sistem, usaha ini berada pada level <strong>${level}</strong> dengan health score <strong>${healthScore}/100</strong>. ${parseInt(healthScore) >= 70 ? 'Kondisi usaha cukup sehat dengan prospek perkembangan yang baik.' : 'Diperlukan evaluasi dan perbaikan pada beberapa aspek usaha.'}</p>
        <p><strong>Rekomendasi Strategis:</strong></p>
        <p>${labaRugi >= 0 ? 'Pertahankan momentum positif dengan fokus pada ekspansi pasar dan peningkatan kualitas produk. Pertimbangkan diversifikasi produk untuk meningkatkan ketahanan usaha.' : 'Lakukan evaluasi menyeluruh terhadap struktur biaya dan strategi penetapan harga. Fokus pada produk dengan margin terbaik dan pertimbangkan strategi pemasaran yang lebih efektif.'}</p>
        <p class="signature">---<br/>Dihasilkan otomatis oleh AI UMKM Assistant</p>
    `;
    
    document.getElementById('autoSummaryOutput').innerHTML = summary;
    
    showNotification('Ringkasan usaha otomatis telah dibuat', 'success');
}

function copySummary() {
    const summaryContent = document.getElementById('autoSummaryOutput').textContent;
    
    // Create a temporary textarea to copy text
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = summaryContent;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
    
    showNotification('Ringkasan telah disalin ke clipboard', 'success');
}

function refreshNotifications() {
    // Simulate new notifications
    const notificationsList = document.getElementById('educationalNotifications');
    
    const newNotifications = [
        {
            icon: 'fas fa-chart-line success',
            message: 'Health score meningkat 2 poin sejak pekan lalu. Pertahankan konsistensi!',
            time: 'Baru saja'
        },
        {
            icon: 'fas fa-exclamation-triangle warning',
            message: 'Biaya operasional bulan ini naik 15%. Evaluasi pengeluaran yang tidak perlu.',
            time: '1 jam yang lalu'
        },
        {
            icon: 'fas fa-lightbulb info',
            message: 'Pelanggan baru meningkat 20% melalui promosi media sosial. Pertimbangkan anggaran lebih untuk digital marketing.',
            time: 'Hari ini'
        }
    ];
    
    let notificationsHTML = '';
    
    newNotifications.forEach(notif => {
        notificationsHTML += `
            <div class="notification-item">
                <i class="${notif.icon}"></i>
                <div class="notification-content">
                    <p>${notif.message}</p>
                    <small>${notif.time}</small>
                </div>
            </div>
        `;
    });
    
    notificationsList.innerHTML = notificationsHTML;
    
    showNotification('Notifikasi telah diperbarui', 'success');
}

// Admin Functions
function showAdminUsers() {
    // Show user list, hide other sections
    document.getElementById('adminUserList').classList.remove('hidden');
    document.getElementById('adminUMKMData').classList.add('hidden');
    document.getElementById('adminExport').classList.add('hidden');
    
    // Update user table
    const tableBody = document.getElementById('adminUserTableBody');
    let tableHTML = '';
    
    users.forEach(user => {
        tableHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.storeName}</td>
                <td>${user.ownerName}</td>
                <td>${getBusinessTypeName(user.businessType)}</td>
                <td><span class="status-active">Aktif</span></td>
                <td>${user.level.charAt(0).toUpperCase() + user.level.slice(1)}</td>
                <td>${user.joined}</td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = tableHTML;
}

function showAdminUMKM() {
    // Show UMKM data, hide other sections
    document.getElementById('adminUserList').classList.add('hidden');
    document.getElementById('adminUMKMData').classList.remove('hidden');
    document.getElementById('adminExport').classList.add('hidden');
    
    // Generate dummy UMKM data
    const tableBody = document.getElementById('adminUMKMTableBody');
    let tableHTML = '';
    
    const umkmData = [
        { name: "Toko Maju Jaya", avgSales: 15000000, avgProfit: 3000000, healthScore: 78, level: "Berkembang", status: "Aktif" },
        { name: "Warung Sehat", avgSales: 8000000, avgProfit: 1200000, healthScore: 65, level: "Pemula", status: "Aktif" },
        { name: "Butik Modern", avgSales: 25000000, avgProfit: 6000000, healthScore: 85, level: "Stabil", status: "Aktif" },
        { name: "Kedai Kopi Mantap", avgSales: 12000000, avgProfit: 2500000, healthScore: 72, level: "Berkembang", status: "Aktif" },
        { name: "Toko Elektronik Jaya", avgSales: 30000000, avgProfit: 4500000, healthScore: 82, level: "Stabil", status: "Aktif" },
        { name: "Catering Sehat", avgSales: 18000000, avgProfit: 3500000, healthScore: 79, level: "Berkembang", status: "Aktif" }
    ];
    
    umkmData.forEach(umkm => {
        tableHTML += `
            <tr>
                <td>${umkm.name}</td>
                <td>Rp ${umkm.avgSales.toLocaleString()}</td>
                <td>Rp ${umkm.avgProfit.toLocaleString()}</td>
                <td>${umkm.healthScore}</td>
                <td>${umkm.level}</td>
                <td><span class="status-active">${umkm.status}</span></td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = tableHTML;
}

function showAdminExport() {
    // Show export section, hide other sections
    document.getElementById('adminUserList').classList.add('hidden');
    document.getElementById('adminUMKMData').classList.add('hidden');
    document.getElementById('adminExport').classList.remove('hidden');
    
    // Update export preview
    document.getElementById('adminUserCount').textContent = users.length;
    document.getElementById('adminUMKMCount').textContent = users.length; // Same as user count for prototype
    document.getElementById('adminAvgHealthScore').textContent = "75"; // Hardcoded for prototype
    
    const today = new Date().toLocaleDateString('id-ID');
    document.getElementById('adminDataPeriod').textContent = `1 Januari 2023 - ${today}`;
}

function generateAdminDummyData() {
    // Add more dummy users
    const newUsers = [
        { id: users.length + 1, storeName: "Kedai Kopi Mantap", ownerName: "Ahmad Fauzi", password: "123456", businessType: "makanan", joined: "2023-04-05", level: "berkembang" },
        { id: users.length + 2, storeName: "Toko Elektronik Jaya", ownerName: "Dewi Susanti", password: "123456", businessType: "elektronik", joined: "2023-05-12", level: "stabil" },
        { id: users.length + 3, storeName: "Catering Sehat", ownerName: "Maya Indah", password: "123456", businessType: "makanan", joined: "2023-06-20", level: "berkembang" }
    ];
    
    users.push(...newUsers);
    
    // Update display if on user list
    if (!document.getElementById('adminUserList').classList.contains('hidden')) {
        showAdminUsers();
    }
    
    showNotification(`${newUsers.length} data dummy telah ditambahkan`, 'success');
}

function adminExportExcel() {
    showNotification('Mengunduh data Excel (admin)...', 'info');
    setTimeout(() => {
        showNotification('Data Excel admin berhasil diunduh (simulasi)', 'success');
    }, 1500);
}

function adminExportCSV() {
    showNotification('Mengunduh data CSV (admin)...', 'info');
    setTimeout(() => {
        showNotification('Data CSV admin berhasil diunduh (simulasi)', 'success');
    }, 1500);
}

function adminExportPDF() {
    showNotification('Mengunduh laporan PDF (admin)...', 'info');
    setTimeout(() => {
        showNotification('Laporan PDF admin berhasil diunduh (simulasi)', 'success');
    }, 1500);
}

// Modal Functions
function showDetailModal(recordId) {
    const record = historyData.find(r => r.id === recordId);
    
    if (!record) {
        showNotification('Data tidak ditemukan', 'error');
        return;
    }
    
    document.getElementById('modalTitle').textContent = `Detail Data Harian - ${record.date}`;
    
    let modalBody = `
        <div class="modal-detail">
            <div class="detail-section">
                <h4>Ringkasan</h4>
                <p><strong>Modal:</strong> Rp ${record.modal.toLocaleString()}</p>
                <p><strong>Penjualan:</strong> Rp ${record.sales.toLocaleString()}</p>
                <p><strong>Laba/Rugi:</strong> <span class="${record.profit >= 0 ? 'profit-text' : 'loss-text'}">${record.profit >= 0 ? '+' : ''}Rp ${Math.abs(record.profit).toLocaleString()}</span></p>
            </div>
    `;
    
    if (record.items && record.items.length > 0) {
        modalBody += `
            <div class="detail-section">
                <h4>Detail Modal</h4>
                <ul class="detail-list">
        `;
        
        record.items.forEach(item => {
            modalBody += `<li>${item.name} - ${item.info}</li>`;
        });
        
        modalBody += `
                </ul>
            </div>
        `;
    }
    
    if (record.salesItems && record.salesItems.length > 0) {
        modalBody += `
            <div class="detail-section">
                <h4>Detail Penjualan</h4>
                <ul class="detail-list">
        `;
        
        record.salesItems.forEach(item => {
            modalBody += `<li>${item.name} - ${item.info}</li>`;
        });
        
        modalBody += `
                </ul>
            </div>
        `;
    }
    
    modalBody += '</div>';
    
    document.getElementById('modalBody').innerHTML = modalBody;
    document.getElementById('detailModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('detailModal').classList.add('hidden');
}

// Utility Functions
function loadDummyData() {
    // Add some dummy history data for demonstration
    const dummyDates = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dummyDates.push(date.toISOString().split('T')[0]);
    }
    
    dummyDates.forEach((date, index) => {
        const modal = 500000 + Math.floor(Math.random() * 500000);
        const sales = 1000000 + Math.floor(Math.random() * 1500000);
        const profit = sales - modal - 200000;
        
        historyData.push({
            id: index + 1,
            date: date,
            modal: modal,
            sales: sales,
            profit: profit
        });
    });
    
    // Update history table
    updateHistoryTable();
}

// Initialize checklist status
function initChecklist() {
    document.querySelectorAll('.checklist input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
}

// Initialize on page load
initChecklist();