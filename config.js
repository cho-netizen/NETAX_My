// ===== my.netax.kr 공통 설정 =====
// Code.gs 배포 후 나오는 웹앱 URL을 여기에 붙여넣으세요.
const GAS_URL = 'https://script.google.com/macros/s/AKfycbzpyTO4wLZNJhpoiV0Ke3u1KsRW_4x6LppvPWE9hyZbE9UrZzDzQ2gOLndzmeKeHwBLsw/exec';

// SHA-256 해시 (rpt.netax.kr과 동일 방식 — 서버로는 평문 비밀번호를 보내지 않음)
async function sha256Hex(text) {
  const enc = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function callGas(payload) {
  const res = await fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // GAS doPost 호환을 위해 text/plain 사용
    body: JSON.stringify(payload)
  });
  return res.json();
}

// 세션 저장 헬퍼 — 로그인 상태를 /report, /upload 페이지가 공유해서 씀
function saveSession(session) {
  sessionStorage.setItem('my_netax_session', JSON.stringify(session));
}
function loadSession() {
  try {
    return JSON.parse(sessionStorage.getItem('my_netax_session') || 'null');
  } catch (e) {
    return null;
  }
}
function requireSessionOrRedirect() {
  const s = loadSession();
  if (!s || !s.report_id || !s.password_hash) {
    location.href = '/';
    return null;
  }
  return s;
}
