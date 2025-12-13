// اختبار شامل لـ Skill-Match API
const http = require('http');

// ألوان للـ console
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

let testResults = {
    passed: 0,
    failed: 0
};

// دالة مساعدة لعمل HTTP Request
function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            const postData = JSON.stringify(data);
            options.headers['Content-Length'] = Buffer.byteLength(postData);
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => { body += chunk; });
            res.on('end', () => {
                try {
                    const response = {
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: body,
                        json: body ? JSON.parse(body) : null
                    };
                    resolve(response);
                } catch (e) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: body,
                        json: null
                    });
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

// دالة لطباعة النتائج
function printTest(testName, passed, message) {
    if (passed) {
        console.log(`${colors.green}✓${colors.reset} ${testName}`);
        testResults.passed++;
    } else {
        console.log(`${colors.red}✗${colors.reset} ${testName}`);
        console.log(`  ${colors.red}${message}${colors.reset}`);
        testResults.failed++;
    }
}

// الاختبارات
async function runTests() {
    console.log(`\n${colors.blue}==================================${colors.reset}`);
    console.log(`${colors.blue}   اختبار Skill-Match API${colors.reset}`);
    console.log(`${colors.blue}==================================${colors.reset}\n`);

    let token = '';
    const testEmail = `test${Date.now()}@example.com`;

    try {
        // 1. اختبار الصفحة الرئيسية
        console.log(`${colors.yellow}1. اختبار الصفحة الرئيسية${colors.reset}`);
        const homeRes = await makeRequest('GET', '/');
        printTest('GET /', homeRes.statusCode === 200, `Status: ${homeRes.statusCode}`);

        // 2. اختبار التسجيل
        console.log(`\n${colors.yellow}2. اختبار التسجيل${colors.reset}`);
        const registerData = {
            name: 'أحمد محمد',
            email: testEmail,
            password: '123456'
        };
        const registerRes = await makeRequest('POST', '/api/auth/register', registerData);
        printTest('POST /api/auth/register', registerRes.statusCode === 201, `Status: ${registerRes.statusCode}`);
        if (registerRes.json) {
            console.log(`  ${colors.green}User ID: ${registerRes.json.user?.id}${colors.reset}`);
        }

        // 3. اختبار تسجيل الدخول
        console.log(`\n${colors.yellow}3. اختبار تسجيل الدخول${colors.reset}`);
        const loginData = {
            email: testEmail,
            password: '123456'
        };
        const loginRes = await makeRequest('POST', '/api/auth/login', loginData);
        printTest('POST /api/auth/login', loginRes.statusCode === 200, `Status: ${loginRes.statusCode}`);
        if (loginRes.json && loginRes.json.token) {
            token = loginRes.json.token;
            console.log(`  ${colors.green}Token: ${token.substring(0, 20)}...${colors.reset}`);
        }

        // 4. اختبار إنشاء مهارة
        console.log(`\n${colors.yellow}4. اختبار إنشاء مهارة${colors.reset}`);
        const skillData = { name: 'JavaScript' };
        const skillRes = await makeRequest('POST', '/api/skills', skillData);
        printTest('POST /api/skills', skillRes.statusCode === 200 || skillRes.statusCode === 201, `Status: ${skillRes.statusCode}`);

        // 5. اختبار عرض المهارات
        console.log(`\n${colors.yellow}5. اختبار عرض المهارات${colors.reset}`);
        const skillsRes = await makeRequest('GET', '/api/skills');
        printTest('GET /api/skills', skillsRes.statusCode === 200, `Status: ${skillsRes.statusCode}`);
        if (skillsRes.json) {
            console.log(`  ${colors.green}عدد المهارات: ${skillsRes.json.length || skillsRes.json.skills?.length || 0}${colors.reset}`);
        }

        // النتائج النهائية
        console.log(`\n${colors.blue}==================================${colors.reset}`);
        console.log(`${colors.blue}         النتائج النهائية${colors.reset}`);
        console.log(`${colors.blue}==================================${colors.reset}`);
        console.log(`${colors.green}✓ نجح: ${testResults.passed}${colors.reset}`);
        console.log(`${colors.red}✗ فشل: ${testResults.failed}${colors.reset}`);
        console.log(`${colors.blue}==================================${colors.reset}\n`);

        if (testResults.failed === 0) {
            console.log(`${colors.green}🎉 جميع الاختبارات نجحت!${colors.reset}\n`);
        } else {
            console.log(`${colors.yellow}⚠️  بعض الاختبارات فشلت${colors.reset}\n`);
        }

    } catch (error) {
        console.error(`${colors.red}خطأ في الاختبار: ${error.message}${colors.reset}`);
    }
}

// تشغيل الاختبارات
runTests();
