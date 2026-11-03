const { spawn } = require('child_process');

console.log('\x1b[36m%s\x1b[0m', '==================================================');
console.log('\x1b[36m%s\x1b[0m', '  🚀 Memulai FaceScan AI Platform (Server + Client)  ');
console.log('\x1b[36m%s\x1b[0m', '==================================================\n');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

// Jalankan backend server (Port 5000)
const server = spawn(npmCmd, ['--prefix', 'server', 'run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// Jalankan frontend client Vite (Port 5173)
const client = spawn(npmCmd, ['--prefix', 'client', 'run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

function handleExit() {
  console.log('\n\x1b[33m%s\x1b[0m', '🛑 Menghentikan seluruh service...');
  try {
    if (isWin) {
      if (server.pid) spawn('taskkill', ['/pid', server.pid.toString(), '/f', '/t']);
      if (client.pid) spawn('taskkill', ['/pid', client.pid.toString(), '/f', '/t']);
    } else {
      server.kill('SIGTERM');
      client.kill('SIGTERM');
    }
  } catch (e) {
    // ignore cleanup errors
  }
  process.exit(0);
}

server.on('error', (err) => {
  console.error('[SERVER ERROR]:', err);
});

client.on('error', (err) => {
  console.error('[CLIENT ERROR]:', err);
});

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
