// 時計/タイマー

// --- 1. モードの決定と初期設定 ---
const URL_PARAMS = new URLSearchParams(window.location.search);
const CLOCK_MODE = URL_PARAMS.has('clock'); // ?clock

const timerParam = URL_PARAMS.get('timer');
const initialMinutes = parseFloat(timerParam);

// カウントダウンモード: ?timer=4, ?timer=5.5 (有効な数値がある場合)
const IS_COUNTDOWN_MODE = !isNaN(initialMinutes) && initialMinutes > 0;

// カウントアップモード: ?timer (値がない、または無効な数値の場合)
const IS_COUNTUP_MODE = timerParam !== null && !IS_COUNTDOWN_MODE;

// 実行が必要なモード (何も指定されていない場合はfalse)
const IS_ACTIVE_MODE = CLOCK_MODE || IS_COUNTDOWN_MODE || IS_COUNTUP_MODE;

let startTime = new Date(); // カウントアップモード用: 開始時刻
let endTime = null; // カウントダウンモード用: 終了時刻
let timerInterval = null;

if (IS_COUNTDOWN_MODE) {
    // カウントダウンモード: 終了時刻を設定
    const initialSeconds = Math.ceil(initialMinutes * 60);
    // endTime = (開始時刻) + (初期秒数 * 1000ミリ秒)
    endTime = new Date(startTime.getTime() + initialSeconds * 1000);
}

// --- 2. 表示形式の定義 ---

/**
 * リアルタイムの時刻を HH:MM:SS 形式で取得する
 */
function getClockTime() {
    const now = new Date();
    return now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/**
 * 秒数を MM:SS 形式にフォーマットする (マイナスは00:00)
 */
function formatTime(secs) {
    if (secs < 0) secs = 0;

    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;

    const minStr = String(minutes).padStart(2, '0');
    const secStr = String(seconds).padStart(2, '0');

    return `${minStr}:${secStr}`;
}

// --- 3. タイマー/時計の更新ロジック ---

function updateTime() {
    let timeStr = '';
    let newColor = 'gray';
    const now = new Date();

    if (IS_COUNTDOWN_MODE) {
        // --- COUNTDOWN MODE (?timer=X) ---

        // 残り秒数を計算 (経過時間方式)
        const remainingTimeMs = endTime.getTime() - now.getTime();
        const remainingSeconds = Math.ceil(remainingTimeMs / 1000);

        timeStr = formatTime(remainingSeconds);

        if (remainingSeconds <= 0) {
            newColor = '#c0392b'; // タイムアップ (赤)
            clearInterval(timerInterval);
            timeStr = formatTime(0);
        } else if (remainingSeconds <= 60) {
            newColor = '#e67e22'; // 1分未満 (オレンジ)
        }

    } else if (IS_COUNTUP_MODE) {
        // --- COUNTUP MODE (?timer) ---
        const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        timeStr = formatTime(elapsedSeconds);
        newColor = '#2980b9'; // カウントアップは青系

    } else if (CLOCK_MODE) {
        // --- CLOCK MODE (?clock) ---
        timeStr = getClockTime();
        newColor = 'gray';
    }

    // 全スライドの要素を更新
    document.querySelectorAll('.slide-clock').forEach(clock => {
        clock.textContent = timeStr;
        clock.style.color = newColor;
    });
}

// --- 4. 初期化とDOM要素の注入 ---

function initTime() {
    // 全スライドに時計/タイマー要素を注入
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (!section.querySelector('.slide-clock')) {
            const clockDiv = document.createElement('div');
            clockDiv.className = 'slide-clock';
            section.appendChild(clockDiv);
        }
    });

    updateTime();
    timerInterval = setInterval(updateTime, 1000);
}

// --- 5. 実行 ---

// アクティブなモードが指定されている場合のみ実行
if (IS_ACTIVE_MODE) {
    document.addEventListener('DOMContentLoaded', initTime);
}
