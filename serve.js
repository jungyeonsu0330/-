const http = require('http');
const fs = require('fs');
const path = require('path');
const { runNewsPipeline } = require('./scripts/news_crawler');

const PORT = process.env.PORT || 5500;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = req.url.split('?')[0];
  const reqUrl = decodeURI(parsedUrl);

  // API 1: 실시간 뉴스 조회 (/api/news)
  if (reqUrl === '/api/news') {
    const jsonPath = path.join(__dirname, 'js', 'data', 'news_data.json');
    if (fs.existsSync(jsonPath)) {
      const data = fs.readFileSync(jsonPath, 'utf-8');
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      return res.end(data);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ error: 'News data not found' }));
    }
  }

  // API 2: 실시간 뉴스 강제 갱신 트리거 (/api/news/refresh)
  if (reqUrl === '/api/news/refresh') {
    try {
      console.log(`[API 요청] 실시간 뉴스 강제 동기화 시작...`);
      const updatedNews = await runNewsPipeline();
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      return res.end(JSON.stringify({
        success: true,
        count: updatedNews ? updatedNews.length : 0,
        updatedAt: new Date().toLocaleString('ko-KR'),
        news: updatedNews
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ success: false, error: err.message }));
    }
  }

  // 정적 파일 서빙
  let filePath = path.join(__dirname, reqUrl === '/' ? 'index.html' : reqUrl);
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(content);
    }
  });
});

function startServer(port) {
  server.listen(port, () => {
    console.log(`입시 플랫폼 로컬 서버가 포트 ${port}에서 실행 중입니다: http://localhost:${port}`);
    // 1시간마다 백그라운드 자동 뉴스 수집 & AI 분석 스케줄러 (3600초)
    setInterval(() => {
      console.log(`[정기 스케줄러] 1·2·3번 통합 실시간 교육 뉴스 자동 업데이트 실행...`);
      runNewsPipeline().catch(err => console.error('[스케줄러 오류]', err.message));
    }, 60 * 60 * 1000);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`포트 ${port}이(가) 이미 사용 중입니다. 포트 ${port + 1}로 재시도합니다...`);
      startServer(port + 1);
    } else {
      console.error('서버 오류:', err);
    }
  });
}

startServer(Number(PORT));
