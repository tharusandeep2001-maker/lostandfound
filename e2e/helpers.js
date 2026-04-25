const STUDENT = {
  name: 'Rashmy',
  email: 'rashmyshiraj1@gmail.com',
  password: '123456',
  faculty: 'Computing',
};

const ADMIN = {
  email: 'lostcampusfinder@gmail.com',
  password: 'Admin@1234',
};

async function loginAs(page, role) {
  const creds = role === 'admin' ? ADMIN : STUDENT;
  
  await page.goto('/login');
  await page.fill('input[name="email"]', creds.email);
  await page.fill('input[name="password"]', creds.password);
  await page.click('button[type="submit"]');
  
  // wait for login to complete — URL changes away from /login
  await page.waitForFunction(() => !window.location.href.includes('/login'), { timeout: 10000 });
}

async function logout(page) {
  await page.click('button:has-text("Logout")');
}

module.exports = { STUDENT, ADMIN, loginAs, logout };