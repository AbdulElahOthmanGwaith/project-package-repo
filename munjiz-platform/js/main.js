/**
 * مُنجز - منصة إدارة الأعمال للمستقلين
 * ملف JavaScript الرئيسي
 */

// انتظار تحميل DOM
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة جميع المكونات
    initApp();
});

/**
 * تهيئة التطبيق الرئيسية
 */
function initApp() {
    // إظهار شاشة التحميل ثم إخفاؤها
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 1500);

    // تهيئة المكونات
    initNavigation();
    initThemeToggle();
    initLanguageToggle();
    initDropdowns();
    initModals();
    initCharts();
    initFilters();
    initMediaGallery();
    initAutomation();
    initFormCalculations();
    initAnimations();
    
    // استعادة التفضيلات
    loadPreferences();
}

/**
 * تهيئة التنقل بين الصفحات
 */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            
            // تحديث التنشيط
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // إظهار الصفحة المطلوبة
            pages.forEach(page => page.classList.remove('active'));
            const targetElement = document.getElementById(`page-${targetPage}`);
            if (targetElement) {
                targetElement.classList.add('active');
            }
            
            // إغلاق القائمة في الجوال
            if (window.innerWidth < 992) {
                sidebar.classList.remove('active');
            }
            
            // إعادة رسم الرسوم البيانية إذا لزم الأمر
            if (targetPage === 'dashboard' || targetPage === 'reports') {
                setTimeout(() => {
                    initCharts();
                }, 100);
            }
            
            // تمرير للأعلى
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // تبديل القائمة في الجوال
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (window.innerWidth < 992) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
}

/**
 * تبديل المظهر (فاتح/داكن)
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // تحديث الأيقونة
        if (newTheme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }

        // إعادة رسم الرسوم البيانية
        initCharts();
    });
}

/**
 * تبديل اللغة
 */
function initLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    let currentLang = localStorage.getItem('language') || 'ar';

    // تعيين اللغة المحفوظة
    setLanguage(currentLang);

    langToggle.addEventListener('click', function() {
        currentLang = currentLang === 'ar' ? 'en' : 'ar';
        setLanguage(currentLang);
        localStorage.setItem('language', currentLang);
    });
}

/**
 * تعيين اللغة
 */
function setLanguage(lang) {
    const html = document.documentElement;
    const currentLangEl = langToggle.querySelector('.current-lang');
    
    // تعيين الاتجاه واللغة
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    html.setAttribute('data-dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // تحديث نص زر اللغة
    if (currentLangEl) {
        currentLangEl.textContent = lang === 'ar' ? 'English' : 'عربي';
    }

    // تحديث جميع العناصر ذات البيانات
    document.querySelectorAll('[data-ar]').forEach(el => {
        const arabicText = el.getAttribute('data-ar');
        const englishText = el.getAttribute('data-en');
        
        if (lang === 'ar') {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.setAttribute('placeholder', el.getAttribute('data-ar') || '');
            } else {
                el.textContent = arabicText || '';
            }
        } else {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.setAttribute('placeholder', el.getAttribute('data-en') || '');
            } else {
                el.textContent = englishText || '';
            }
        }
    });

    // تحديث جداول البيانات
    document.querySelectorAll('th').forEach(th => {
        const arText = th.getAttribute('data-ar');
        const enText = th.getAttribute('data-en');
        if (arText && enText) {
            th.textContent = lang === 'ar' ? arText : enText;
        }
    });

    // تحديث التصنيفات
    document.querySelectorAll('.status-badge').forEach(badge => {
        const arText = badge.getAttribute('data-ar');
        const enText = badge.getAttribute('data-en');
        if (arText && enText) {
            badge.textContent = lang === 'ar' ? arText : enText;
        }
    });

    // تحديث الرسوم البيانية
    setTimeout(() => {
        initCharts();
    }, 100);
}

/**
 * تهيئة القوائم المنسدلة
 */
function initDropdowns() {
    const notificationsDropdown = document.getElementById('notificationsDropdown');
    const profileDropdown = document.getElementById('profileDropdown');
    const notificationBtn = document.getElementById('notificationBtn');
    const profileBtn = document.getElementById('profileBtn');
    const notificationsMenu = document.getElementById('notificationsMenu');
    const profileMenu = document.getElementById('profileMenu');

    // إشعارات
    if (notificationBtn && notificationsMenu) {
        notificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationsMenu.classList.toggle('active');
            profileMenu.classList.remove('active');
        });
    }

    // الملف الشخصي
    if (profileBtn && profileMenu) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            profileMenu.classList.toggle('active');
            notificationsMenu.classList.remove('active');
        });
    }

    // إغلاق القوائم عند النقر خارجها
    document.addEventListener('click', function() {
        if (notificationsMenu) notificationsMenu.classList.remove('active');
        if (profileMenu) profileMenu.classList.remove('active');
    });

    // إيقافPropagation للقوائم
    if (notificationsMenu) {
        notificationsMenu.addEventListener('click', e => e.stopPropagation());
    }
    if (profileMenu) {
        profileMenu.addEventListener('click', e => e.stopPropagation());
    }
}

/**
 * تهيئة النوافذ المنبثقة
 */
function initModals() {
    // إغلاق النافذة عند النقر خارجها
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });

    // إغلاق النافذة عند الضغط على ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
}

/**
 * إظهار الإجراء السريع
 */
function showQuickAction() {
    document.getElementById('quickActionModal').classList.add('active');
}

/**
 * إغلاق الإجراء السريع
 */
function closeQuickAction() {
    document.getElementById('quickActionModal').classList.remove('active');
}

/**
 * إظهار إنشاء فاتورة
 */
function showCreateInvoice() {
    document.getElementById('invoiceModal').classList.add('active');
}

/**
 * إنشاء عقد جديد
 */
function showCreateContract() {
    showNotification('قريباً', 'ميزة إنشاء العقود ستكون متاحة قريباً');
}

/**
 * إنشاء عرض أسعار
 */
function showCreateProposal() {
    showNotification('قريباً', 'ميزة إنشاء عروض الأسعار ستكون متاحة قريباً');
}

/**
 * إضافة عميل
 */
function showAddClient() {
    showNotification('قريباً', 'ميزة إضافة العملاء ستكون متاحة قريباً');
}

/**
 * رفع ملفات الوسائط
 */
function showUploadMedia() {
    showNotification('قريباً', 'ميزة رفع الملفات ستكون متاحة قريباً');
}

/**
 * إنشاء أتمتة جديدة
 */
function showCreateAutomation() {
    showNotification('قريباً', 'ميزة إنشاء الأتمتة ستكون متاحة قريباً');
}

/**
 * استخدام قالب عقد
 */
function useContractTemplate(type) {
    showNotification('جيد', `تم اختيار قالب ${type}`);
}

/**
 * إغلاق نافذة منبثقة
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * تهيئة الرسوم البيانية
 */
function initCharts() {
    // التحقق من وجود Chart.js
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded');
        return;
    }

    // تعيين ألوان المظهر
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#E9ECEF' : '#2B2D42';
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

    // إعداد الألوان
    Chart.defaults.color = textColor;
    Chart.defaults.borderColor = gridColor;

    // رسم بياني الإيرادات
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        if (revenueCtx.chart) revenueCtx.chart.destroy();
        
        revenueCtx.chart = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
                datasets: [{
                    label: 'الإيرادات',
                    data: [5000, 7500, 4200, 8900, 6200, 11500, 3800],
                    borderColor: '#005F73',
                    backgroundColor: 'rgba(0, 95, 115, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#005F73',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: gridColor
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // رسم بياني دائري للفواتير
    const invoiceCtx = document.getElementById('invoiceChart');
    if (invoiceCtx) {
        if (invoiceCtx.chart) invoiceCtx.chart.destroy();
        
        invoiceCtx.chart = new Chart(invoiceCtx, {
            type: 'doughnut',
            data: {
                labels: ['مدفوعة', 'قيد الانتظار', 'متأخرة'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: ['#28A745', '#FFC107', '#DC3545'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // رسم بياني الإيرادات الشهرية
    const monthlyCtx = document.getElementById('monthlyRevenueChart');
    if (monthlyCtx) {
        if (monthlyCtx.chart) monthlyCtx.chart.destroy();
        
        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        
        monthlyCtx.chart = new Chart(monthlyCtx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'الإيرادات',
                    data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 40000, 38000, 45000],
                    backgroundColor: '#005F73',
                    borderRadius: 8,
                    barThickness: 20
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: gridColor
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // رسم بياني أداء العملاء
    const clientCtx = document.getElementById('clientPerformanceChart');
    if (clientCtx) {
        if (clientCtx.chart) clientCtx.chart.destroy();
        
        clientCtx.chart = new Chart(clientCtx, {
            type: 'pie',
            data: {
                labels: ['شركة الأفق الرقمي', 'أحمد العمري', 'سارة علي', 'شركة التقنية المتقدمة'],
                datasets: [{
                    data: [45, 25, 18, 12],
                    backgroundColor: ['#005F73', '#EE9B00', '#009688', '#673AB7'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
}

/**
 * تهيئة الفلاتر
 */
function initFilters() {
    // فلاتر الفواتير
    const invoiceStatus = document.getElementById('invoiceStatus');
    const invoiceDate = document.getElementById('invoiceDate');
    
    if (invoiceStatus) {
        invoiceStatus.addEventListener('change', filterInvoices);
    }
    if (invoiceDate) {
        invoiceDate.addEventListener('change', filterInvoices);
    }

    // فلاتر الرسوم البيانية
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.closest('.chart-filters');
            parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // تحديث الرسم البياني
            initCharts();
        });
    });

    // فلاتر الوسائط
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // تصفية الوسائط
            filterMedia(filter);
        });
    });

    // تبديل عرض الوسائط
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/**
 * تصفية الفواتير
 */
function filterInvoices() {
    const status = document.getElementById('invoiceStatus').value;
    const date = document.getElementById('invoiceDate').value;
    
    // هنا يمكن إضافة منطق التصفية
    console.log('تصفية الفواتير:', { status, date });
}

/**
 * تصفية الوسائط
 */
function filterMedia(filter) {
    const items = document.querySelectorAll('.media-item');
    
    items.forEach(item => {
        const type = item.getAttribute('data-type');
        
        if (filter === 'all' || type === filter) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * تهيئة المكتبة الإعلامية
 */
function initMediaGallery() {
    // تشغيل الفيديو
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const thumbnail = this.closest('.media-thumbnail');
            const videoId = thumbnail.getAttribute('data-video');
            
            // يمكن إضافة مشغل فيديو هنا
            showNotification('مشغل الفيديو', 'سيتم تشغيل الفيديو');
        });
    });

    // تكبير الصورة
    document.querySelectorAll('.zoom-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const img = this.closest('.media-thumbnail').querySelector('img');
            const src = img.src;
            
            // يمكن إضافة عارض صور هنا
            showNotification('عارض الصور', 'سيتم عرض الصورة بحجم كامل');
        });
    });
}

/**
 * تهيئة الأتمتة
 */
function initAutomation() {
    // تبديل حالة الأتمتة
    document.querySelectorAll('.automation-controls .control-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const card = this.closest('.automation-card');
            
            if (icon.classList.contains('fa-toggle-off')) {
                icon.classList.remove('fa-toggle-off');
                icon.classList.add('fa-toggle-on');
                card.classList.add('active');
                card.querySelector('.automation-status').textContent = 'نشط';
                card.querySelector('.automation-status').classList.remove('inactive');
                card.querySelector('.automation-status').classList.add('active');
                showNotification('تم التفعيل', 'تم تفعيل الأتمتة بنجاح');
            } else if (icon.classList.contains('fa-toggle-on')) {
                icon.classList.remove('fa-toggle-on');
                icon.classList.add('fa-toggle-off');
                card.classList.remove('active');
                card.querySelector('.automation-status').textContent = 'غير نشط';
                card.querySelector('.automation-status').classList.remove('active');
                card.querySelector('.automation-status').classList.add('inactive');
                showNotification('تم التعطيل', 'تم تعطيل الأتمتة');
            }
        });
    });

    // تحرير الأتمتة
    document.querySelectorAll('.control-btn .fa-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('تعديل', 'سيتم فتح محرر الأتمتة');
        });
    });
}

/**
 * تهيئة حسابات النماذج
 */
function initFormCalculations() {
    // حساب المجموع في الفاتورة
    const itemsTable = document.querySelector('.items-table');
    if (itemsTable) {
        const inputs = itemsTable.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', calculateInvoiceTotal);
            input.addEventListener('change', calculateInvoiceTotal);
        });

        // تغيير الضريبة
        const taxSelects = itemsTable.querySelectorAll('select');
        taxSelects.forEach(select => {
            select.addEventListener('change', calculateInvoiceTotal);
        });
    }
}

/**
 * حساب مجموع الفاتورة
 */
function calculateInvoiceTotal() {
    const rows = document.querySelectorAll('.items-table tbody tr');
    let subtotal = 0;
    let totalTax = 0;

    rows.forEach(row => {
        const quantity = parseFloat(row.querySelector('input[type="number"]').value) || 0;
        const price = parseFloat(row.querySelectorAll('input[type="number"]')[1].value) || 0;
        const taxSelect = row.querySelector('select');
        const taxRate = parseFloat(taxSelect.value) || 0;
        
        const rowTotal = quantity * price;
        const rowTax = rowTotal * (taxRate / 100);
        
        subtotal += rowTotal;
        totalTax += rowTax;
        
        // تحديث مجموع الصف
        const totalCell = row.querySelector('.row-total');
        if (totalCell) {
            totalCell.textContent = (rowTotal + rowTax).toLocaleString() + ' SAR';
        }
    });

    // تحديث ملخص الفاتورة
    const summaryRows = document.querySelectorAll('.invoice-summary .summary-row');
    if (summaryRows.length >= 3) {
        summaryRows[0].querySelector('span:last-child').textContent = subtotal.toLocaleString() + ' SAR';
        summaryRows[1].querySelector('span:last-child').textContent = totalTax.toLocaleString() + ' SAR';
        summaryRows[2].querySelector('span:last-child').textContent = (subtotal + totalTax).toLocaleString() + ' SAR';
    }
}

/**
 * تهيئة الرسوم المتحركة
 */
function initAnimations() {
    // تهيئة شريط التقدم عند التمرير
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById('progressBar').style.width = scrolled + '%';
    }, { passive: true });

    // إضافة تأثير ظهور تدريجي للعناصر
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.stat-card, .chart-card, .media-item, .automation-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    // إضافة نمط الأنيميشن
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * حفظ التفضيلات
 */
function loadPreferences() {
    // استعادة المظهر
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeIcon = document.getElementById('themeToggle').querySelector('i');
    if (savedTheme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    // استعادة اللغة
    const savedLang = localStorage.getItem('language') || 'ar';
    setLanguage(savedLang);
}

/**
 * إظهار إشعار
 */
function showNotification(title, message) {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = 'toast-notification';
    notification.innerHTML = `
        <div class="toast-header">
            <strong>${title}</strong>
            <button onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="toast-body">${message}</div>
    `;

    // إضافة الأنماط
    const toastStyle = document.createElement('style');
    toastStyle.textContent = `
        .toast-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--bg-secondary);
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            padding: 15px;
            min-width: 300px;
            max-width: 400px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            border-right: 4px solid var(--primary);
        }
        .toast-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        .toast-header button {
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
        }
        .toast-body {
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    
    if (!document.querySelector('#toast-styles')) {
        toastStyle.id = 'toast-styles';
        document.head.appendChild(toastStyle);
    }

    document.body.appendChild(notification);

    // إخفاء الإشعار بعد 3 ثوانٍ
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * دوال مساعدة
 */
function formatCurrency(amount, currency = 'SAR') {
    return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// تصدير الدوال للاستخدام العام
window.showQuickAction = showQuickAction;
window.closeQuickAction = closeQuickAction;
window.showCreateInvoice = showCreateInvoice;
window.showCreateContract = showCreateContract;
window.showCreateProposal = showCreateProposal;
window.showAddClient = showAddClient;
window.showUploadMedia = showUploadMedia;
window.showCreateAutomation = showCreateAutomation;
window.useContractTemplate = useContractTemplate;
window.closeModal = closeModal;
window.showNotification = showNotification;
