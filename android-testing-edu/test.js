const { chromium } = require('playwright');
const path = require('path');

async function testWebsite() {
    console.log('بدء اختبار الموقع...\n');

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const errors = [];
    const warnings = [];

    // التقاط الأخطاء في الكونسول
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(`خطأ في الكونسول: ${msg.text()}`);
        } else if (msg.type() === 'warning') {
            warnings.push(`تحذير: ${msg.text()}`);
        }
    });

    page.on('pageerror', err => {
        errors.push(`خطأ في الصفحة: ${err.message}`);
    });

    try {
        // تحميل الصفحة
        const filePath = path.resolve(__dirname, 'index.html');
        console.log('1. تحميل الصفحة الرئيسية...');
        await page.goto(`file://${filePath}`, { waitUntil: 'networkidle' });
        console.log('   ✓ تم تحميل الصفحة بنجاح');

        // التحقق من وجود العناصر الرئيسية
        console.log('\n2. التحقق من عناصر الصفحة...');

        const header = await page.$('.header');
        console.log(`   ${header ? '✓' : '✗'} الرأس العلوي`);

        const hero = await page.$('.hero');
        console.log(`   ${hero ? '✓' : '✗'} قسم الهيرو`);

        const sidebar = await page.$('.sidebar');
        console.log(`   ${sidebar ? '✓' : '✗'} القائمة الجانبية`);

        const sections = await page.$$('section.section');
        console.log(`   ${sections.length >= 5 ? '✓' : '✗'} الأقسام (${sections.length} أقسام)`);

        const jarCards = await page.$$('.jar-card');
        console.log(`   ${jarCards.length === 4 ? '✓' : '✗'} بطاقات JAR (${jarCards.length} بطاقات)`);

        // التحقق من عنوان الصفحة
        const title = await page.title();
        console.log(`   ✓ عنوان الصفحة: "${title}"`);

        // التحقق من دعم اللغة العربية
        const htmlLang = await page.$eval('html', el => el.getAttribute('lang'));
        console.log(`   ${htmlLang === 'ar' ? '✓' : '✗'} دعم اللغة العربية (lang="${htmlLang}")`);

        // التحقق من اتجاه النص RTL
        const dir = await page.$eval('html', el => el.getAttribute('dir'));
        console.log(`   ${dir === 'rtl' ? '✓' : '✗'} اتجاه النص RTL (dir="${dir}")`);

        // اختبار التفاعلات
        console.log('\n3. اختبار التفاعلات...');

        // اختبار تبويب الأمثلة
        const tabBtn = await page.$('.tab-btn[data-tab="intermediate"]');
        if (tabBtn) {
            await tabBtn.click();
            await page.waitForTimeout(300);
            const activeTab = await page.$('.tab-btn.active');
            const tabData = await activeTab.getAttribute('data-tab');
            console.log(`   ${tabData === 'intermediate' ? '✓' : '✗'} تبديل التبويبات`);
        }

        // اختبار زر تبديل المظهر
        const themeToggle = await page.$('#themeToggle');
        if (themeToggle) {
            await themeToggle.click();
            await page.waitForTimeout(300);
            const theme = await page.$eval('html', el => el.getAttribute('data-theme'));
            console.log(`   ${theme === 'dark' ? '✓' : '✗'} تبديل المظهر (المظهر: ${theme})`);

            // إعادة التبديل
            await themeToggle.click();
            await page.waitForTimeout(300);
        }

        // اختبار زر النسخ
        const copyBtn = await page.$('.copy-btn');
        if (copyBtn) {
            await copyBtn.click();
            await page.waitForTimeout(100);
            const btnText = await copyBtn.textContent();
            console.log(`   ${btnText.includes('تم النسخ') ? '✓' : '✗'} زر النسخ`);
        }

        // التحقق من وجود الأكواد
        console.log('\n4. التحقق من المحتوى...');
        const codeBlocks = await page.$$('.code-block');
        console.log(`   ${codeBlocks.length >= 5 ? '✓' : '✗'} كتل الكود (${codeBlocks.length} كتل)`);

        const detailBlocks = await page.$$('.detail-block');
        console.log(`   ${detailBlocks.length === 4 ? '✓' : '✗'} كتل التفاصيل (${detailBlocks.length} كتل)`);

        // التحقق من الاستجابة
        console.log('\n5. التحقق من الاستجابة...');
        const viewport = page.viewportSize();
        console.log(`   ✓ حجم النافذة: ${viewport.width}x${viewport.height}`);

        // التحقق من تحميل الخطوط
        const fontsLoaded = await page.evaluate(() => {
            return document.fonts.ready.then(() => true).catch(() => false);
        });
        console.log(`   ${fontsLoaded ? '✓' : '✗'} تحميل الخطوط`);

        // عرض النتائج
        console.log('\n═══════════════════════════════════════════');
        console.log('نتائج الاختبار');
        console.log('═══════════════════════════════════════════');

        if (errors.length === 0) {
            console.log('✓ لا توجد أخطاء!');
        } else {
            console.log(`✗ ${errors.length} خطأ (أخطاء):`);
            errors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
        }

        if (warnings.length > 0) {
            console.log(`⚠ ${warnings.length} تحذير:`);
            warnings.forEach((warn, i) => console.log(`  ${i + 1}. ${warn}`));
        }

        console.log('\n═══════════════════════════════════════════');

    } catch (error) {
        console.error('\n✗ حدث خطأ أثناء الاختبار:', error.message);
    } finally {
        await browser.close();
    }
}

// تشغيل الاختبار
testWebsite().catch(console.error);
