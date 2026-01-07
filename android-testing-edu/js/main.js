/**
 * Android Testing Hub - Main JavaScript
 * منصة تعليم اختبارات Android - ملف الجافاسكربت الرئيسي
 */

// انتظر تحميل DOM
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة جميع المكونات
    initThemeToggle();
    initProgressBar();
    initSmoothScroll();
    initTabs();
    initCopyButtons();
    initMobileMenu();
    initSearch();
    initSidebarHighlight();
    initCodeHighlight();
    initCardButtons();
    initAnimations();
});

/**
 * تهيئة تبديل المظهر (فاتح/داكن)
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');
    
    // تحقق من التخزين المحلي أو تفضيلات النظام
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (newTheme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
        
        // حفظ التفضيل
        saveThemePreference(newTheme);
    });
}

/**
 * حفظ تفضيل المظهر
 */
function saveThemePreference(theme) {
    try {
        localStorage.setItem('theme', theme);
    } catch (e) {
        console.warn('لا يمكن حفظ تفضيل المظهر:', e);
    }
}

/**
 * تهيئة شريط التقدم
 */
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    
    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }
    
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}

/**
 * تهيئة التمرير السلس
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // تحديث URL بدون #
                history.pushState(null, null, targetId);
                
                // إغلاق القائمة الجوال إذا كانت مفتوحة
                closeMobileMenu();
            }
        });
    });
}

/**
 * تهيئة التبويبات
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const exampleBlocks = document.querySelectorAll('.example-block');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // إزالة الفئة النشطة من جميع الأزرار
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // إضافة الفئة النشطة للزر الحالي
            this.classList.add('active');
            
            // إخفاء جميع كتل الأمثلة
            exampleBlocks.forEach(block => block.classList.remove('active'));
            // إظهار الكتلة المطلوبة
            const targetBlock = document.getElementById(targetTab);
            if (targetBlock) {
                targetBlock.classList.add('active');
            }
        });
    });
}

/**
 * تهيئة أزرار النسخ
 */
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const codeId = this.getAttribute('data-code');
            const codeElement = document.getElementById(codeId);
            
            if (codeElement) {
                const codeText = codeElement.textContent;
                copyToClipboard(codeText, this);
            }
        });
    });
}

/**
 * نسخ النص إلى الحافظة
 */
function copyToClipboard(text, button) {
    // محاولة API الحديثة أولاً
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showCopyFeedback(button);
            })
            .catch(err => {
                console.warn('فشل النسخ باستخدام Clipboard API:', err);
                fallbackCopy(text, button);
            });
    } else {
        // النسخ البديل للمتصفحات القديمة
        fallbackCopy(text, button);
    }
}

/**
 * النسخ البديل
 */
function fallbackCopy(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyFeedback(button);
    } catch (err) {
        console.error('فشل النسخ:', err);
        alert('حدث خطأ أثناء النسخ. يرجى النسخ يدوياً.');
    }
    
    document.body.removeChild(textArea);
}

/**
 * إظهار تغذية راجعة النسخ
 */
function showCopyFeedback(button) {
    const originalText = button.textContent;
    button.textContent = '✓ تم النسخ!';
    button.classList.add('copied');
    
    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('copied');
    }, 2000);
}

/**
 * تهيئة قائمة الجوال
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    const body = document.body;
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // تبديل الأيقونة
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

/**
 * إغلاق قائمة الجوال
 */
function closeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    const body = document.body;
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.classList.remove('active');
        mainNav.classList.remove('active');
        body.classList.remove('menu-open');
        
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

/**
 * تهيئة البحث
 */
function initSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const closeSearch = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    // محتوى البحث
    const searchContent = [
        { title: 'android.jar', url: '#android-jar', description: 'المكتبة الأساسية لواجهات Android البرمجية' },
        { title: 'android.test.base.jar', url: '#test-base', description: 'قاعدة مكتبات الاختبار الأساسية' },
        { title: 'android.test.mock.jar', url: '#test-mock', description: 'مكتبة الكائنات الوهمية' },
        { title: 'android.test.runner.jar', url: '#test-runner', description: 'مشغل الاختبارات' },
        { title: 'AndroidTestCase', url: '#test-base-details', description: 'حالة اختبار أساسية في Android' },
        { title: 'MockContext', url: '#test-mock-details', description: 'سياق وهمي للاختبارات' },
        { title: 'MockApplication', url: '#test-mock-details', description: 'تطبيق وهمي للاختبارات' },
        { title: 'AndroidJUnitRunner', url: '#test-runner-details', description: 'المشغل الرئيسي للاختبارات الحديثة' },
        { title: 'Instrumentation', url: '#test-base-details', description: 'التحكم في دورة حياة المكونات' },
        { title: 'ActivityTestRule', url: '#examples', description: 'قاعدة اختبار Activity مع Espresso' },
        { title: 'JUnit', url: '#architecture', description: 'إطار عمل الاختبارات' },
        { title: 'Espresso', url: '#examples', description: 'مكتبة اختبار واجهة المستخدم' },
        { title: 'MockSharedPreferences', url: '#test-mock-details', description: 'تفضيلات وهمية للاختبار' },
        { title: 'ContentResolver', url: '#android-jar-details', description: 'محلل المحتوى' },
        { title: 'assertEquals', url: '#examples', description: 'تأكيد المساواة في الاختبارات' },
    ];
    
    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', function() {
            searchOverlay.classList.add('active');
            searchInput.focus();
            body.style.overflow = 'hidden';
        });
        
        closeSearch.addEventListener('click', function() {
            searchOverlay.classList.remove('active');
            body.style.overflow = '';
            searchInput.value = '';
            searchResults.innerHTML = '';
        });
        
        searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
                body.style.overflow = '';
                searchInput.value = '';
                searchResults.innerHTML = '';
            }
        });
        
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            
            if (query.length < 2) {
                searchResults.innerHTML = '';
                return;
            }
            
            const results = searchContent.filter(item => 
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query)
            ).slice(0, 8);
            
            if (results.length > 0) {
                searchResults.innerHTML = results.map(item => `
                    <a href="${item.url}" class="search-result-item" onclick="closeSearchOverlay()">
                        <div class="search-result-title">${item.title}</div>
                        <div class="search-result-desc">${item.description}</div>
                    </a>
                `).join('');
            } else {
                searchResults.innerHTML = '<div class="no-results">لم يتم العثور على نتائج</div>';
            }
        });
        
        // اختصار لوحة المفاتيح للبحث
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchOverlay.classList.add('active');
                searchInput.focus();
                body.style.overflow = 'hidden';
            }
            
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
                body.style.overflow = '';
                searchInput.value = '';
                searchResults.innerHTML = '';
            }
        });
    }
}

/**
 * إغلاق نافذة البحث
 */
function closeSearchOverlay() {
    const searchOverlay = document.getElementById('searchOverlay');
    if (searchOverlay) {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * تمييز القائمة الجانبية النشطة
 */
function initSidebarHighlight() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('section[id]');
    
    function highlightSidebar() {
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                sidebarLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightSidebar, { passive: true });
    highlightSidebar();
}

/**
 * تهيئة تمييز كود المصدر
 */
function initCodeHighlight() {
    // إضافة تمييز بسيط للأكواد
    const codeBlocks = document.querySelectorAll('.code-block code');
    
    codeBlocks.forEach(block => {
        const text = block.textContent;
        const highlighted = highlightSyntax(text);
        block.innerHTML = highlighted;
    });
}

/**
 * تمييز بناء جملة الكود الأساسي
 */
function highlightSyntax(code) {
    // تهريب HTML
    let highlighted = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    // تمييز الكلمات المحجوزة
    const keywords = /\b(public|private|protected|class|interface|extends|implements|void|int|String|boolean|new|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|throws|import|package|static|final|abstract|synchronized|volatile|transient|native|strictfp|assert|enum|void|byte|short|long|float|double|char)\b/g;
    highlighted = highlighted.replace(keywords, '<span class="syntax-keyword">$1</span>');
    
    // تمييز التعليقات
    const comments = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
    highlighted = highlighted.replace(comments, '<span class="syntax-comment">$1</span>');
    
    // تمييز annotatios
    const annotations = /@\w+/g;
    highlighted = highlighted.replace(annotations, '<span class="syntax-annotation">$&</span>');
    
    // تمييز أنواع البيانات
    const types = /\b(ArrayList|List|Map|HashMap|HashSet|Set|Iterator|Exception|RuntimeException|Throwable|Object|Thread|Runnable|Collection|Arrays|Collections|Intent|Activity|Context|View|ViewGroup|TextView|Button|EditText|ImageView|RecyclerView|Fragment|Service|BroadcastReceiver|ContentProvider|SharedPreferences|SQLiteDatabase|Cursor|Loader|AsyncTask|Intent|Parcelable|Bundle|Permission|Manifest)\b/g;
    highlighted = highlighted.replace(types, '<span class="syntax-type">$1</span>');
    
    // تمييز strings
    const strings = /"(.*?)"/g;
    highlighted = highlighted.replace(strings, '<span class="syntax-string">"$1"</span>');
    
    // تمييز الأرقام
    const numbers = /\b(\d+\.?\d*)\b/g;
    highlighted = highlighted.replace(numbers, '<span class="syntax-number">$1</span>');
    
    // إضافة أنماط CSS للتمييز
    addSyntaxStyles();
    
    return highlighted;
}

/**
 * إضافة أنماط تمييز الكود
 */
function addSyntaxStyles() {
    if (document.getElementById('syntax-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'syntax-styles';
    style.textContent = `
        .syntax-keyword {
            color: #FF79C6;
        }
        .syntax-comment {
            color: #6272A4;
            font-style: italic;
        }
        .syntax-annotation {
            color: #FFB86C;
        }
        .syntax-type {
            color: #8BE9FD;
        }
        .syntax-string {
            color: #F1FA8C;
        }
        .syntax-number {
            color: #BD93F9;
        }
    `;
    document.head.appendChild(style);
}

/**
 * تهيئة أزرار البطاقات
 */
function initCardButtons() {
    const cardButtons = document.querySelectorAll('.card-btn');
    
    cardButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // توسيع العنصر إذا كان قابل للطي
                expandDetailBlock(targetElement);
            }
        });
    });
}

/**
 * توسيع كتلة التفاصيل
 */
function expandDetailBlock(element) {
    // إضافة تأثير بصري
    element.style.animation = 'none';
    element.offsetHeight; // تشغيل إعادة التدفق
    element.style.animation = 'highlightPulse 0.5s ease';
    
    // إضافة نمط الـ animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes highlightPulse {
            0% { box-shadow: 0 0 0 0 rgba(61, 220, 132, 0.4); }
            70% { box-shadow: 0 0 0 20px rgba(61, 220, 132, 0); }
            100% { box-shadow: 0 0 0 0 rgba(61, 220, 132, 0); }
        }
    `;
    document.head.appendChild(style);
}

/**
 * تهيئة الرسوم المتحركة
 */
function initAnimations() {
    // مراقبة العناصر للرسوم المتحركة
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // مراقبة البطاقات والأقسام
    document.querySelectorAll('.jar-card, .practice-card, .resource-card, .detail-block').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
    
    // إضافة نمط للرسوم المتحركة
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(animationStyle);
}

/**
 * تهيئة قائمة التنقل الرئيسية عند التمرير
 */
function initHeaderScroll() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
    
    // إضافة نمط للرأس عند التمرير
    const style = document.createElement('style');
    style.textContent = `
        .header.scrolled {
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .menu-open .main-nav {
            display: flex !important;
            position: fixed;
            top: 70px;
            right: 0;
            left: 0;
            background: var(--bg-light);
            flex-direction: column;
            padding: var(--space-lg);
            box-shadow: var(--shadow-lg);
        }
        [data-theme="dark"] .menu-open .main-nav {
            background: var(--bg-dark-secondary);
        }
        .menu-open .nav-list {
            flex-direction: column;
        }
        .search-result-item {
            display: block;
            padding: var(--space-md);
            border-bottom: 1px solid var(--border-light);
            text-decoration: none;
            transition: background var(--transition-fast);
        }
        .search-result-item:hover {
            background: var(--bg-secondary);
        }
        .search-result-title {
            font-weight: 600;
            color: var(--text-light);
        }
        .search-result-desc {
            font-size: 0.85rem;
            color: var(--text-secondary);
            margin-top: 4px;
        }
        .no-results {
            text-align: center;
            padding: var(--space-lg);
            color: var(--text-muted);
        }
    `;
    document.head.appendChild(style);
}

// تهيئة قائمة التنقل
initHeaderScroll();

/**
 * دوال مساعدة إضافية
 */

// التحقق من دعم المتصفح لميزة معينة
function supportsFeature(feature) {
    switch (feature) {
        case 'clipboard':
            return navigator.clipboard && window.isSecureContext;
        case 'darkmode':
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        case 'intersectionobserver':
            return 'IntersectionObserver' in window;
        default:
            return false;
    }
}

// الحصول على عنصر منDOM بشكل آمن
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

/**
 * معالجة الأخطاء
 */
window.addEventListener('error', function(e) {
    console.error('خطأ في التطبيق:', e.error);
});

// منع تحميل الموارد الفاشلة
window.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
        });
    });
});

/**
 * الطباعة
 */
function printPage() {
    window.print();
}

/**
 * مشاركة الصفحة
 */
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: 'تعلم اختبار تطبيقات Android من منصة Android Testing Hub',
            url: window.location.href
        }).catch(console.error);
    } else {
        // نسخ الرابط يدوياً
        copyToClipboard(window.location.href, { textContent: 'نسخ الرابط' });
        alert('تم نسخ الرابط!');
    }
}
