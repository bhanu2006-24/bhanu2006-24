import { apps } from './apps.js';

class OS {
    constructor() {
        this.windows = [];
        this.zIndex = 100;
        this.isLoggedIn = false;
        this.init();
    }

    init() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);

        // Boot Sequence
        setTimeout(() => {
            const bootScreen = document.getElementById('boot-screen');
            bootScreen.style.opacity = '0';
            setTimeout(() => {
                bootScreen.classList.add('hidden');
                document.getElementById('login-screen').classList.remove('hidden');
                this.setupLogin();
            }, 1000);
        }, 2000);
    }

    setupLogin() {
        const passwordInput = document.getElementById('password-input');
        const loginBtn = document.getElementById('login-btn');

        const attemptLogin = () => {
            if (passwordInput.value === '1234') {
                this.login();
            } else {
                passwordInput.style.borderColor = '#e74c3c';
                passwordInput.classList.add('shake');
                setTimeout(() => {
                    passwordInput.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    passwordInput.classList.remove('shake');
                }, 500);
            }
        };

        loginBtn.addEventListener('click', attemptLogin);
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') attemptLogin();
        });
    }

    login() {
        this.isLoggedIn = true;
        const loginScreen = document.getElementById('login-screen');
        loginScreen.style.opacity = '0';
        setTimeout(() => {
            loginScreen.classList.add('hidden');
            document.getElementById('desktop').classList.remove('hidden');
            this.playSound('startup');
        }, 500);
    }

    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        document.getElementById('clock').textContent = timeString;
    }

    openApp(appId) {
        const app = apps[appId];
        if (!app) return;

        // Check if already open
        const existingWindow = document.getElementById(`window-${appId}`);
        if (existingWindow) {
            this.focusWindow(existingWindow);
            return;
        }

        this.createWindow(appId, app);
        this.addToTaskbar(appId, app);
        this.toggleStartMenu(false); // Close start menu if open
    }

    createWindow(appId, app) {
        const win = document.createElement('div');
        win.className = 'window';
        win.id = `window-${appId}`;
        win.style.zIndex = ++this.zIndex;

        // Random position slightly offset
        const offset = this.windows.length * 20;
        win.style.top = `${50 + offset}px`;
        win.style.left = `${50 + offset}px`;

        // Content
        const content = app.render ? app.render() : app.content;

        win.innerHTML = `
            <div class="window-header" onmousedown="os.startDrag(event, '${appId}')">
                <div class="window-title">
                    <i class="fa-solid ${app.icon}"></i> ${app.title}
                </div>
                <div class="window-controls">
                    <div class="control-btn minimize-btn" onclick="os.minimizeWindow('${appId}')"></div>
                    <div class="control-btn maximize-btn" onclick="os.maximizeWindow('${appId}')"></div>
                    <div class="control-btn close-btn" onclick="os.closeWindow('${appId}')"></div>
                </div>
            </div>
            <div class="window-content">
                ${content}
            </div>
        `;

        // Focus on click
        win.addEventListener('mousedown', () => this.focusWindow(win));

        document.getElementById('windows-container').appendChild(win);
        this.windows.push(appId);

        // Initialize App Logic if exists
        if (app.init) {
            app.init(win.querySelector('.window-content'));
        }
    }

    closeWindow(appId) {
        const win = document.getElementById(`window-${appId}`);
        if (win) {
            win.remove();
            this.windows = this.windows.filter(id => id !== appId);
            this.removeFromTaskbar(appId);
        }
    }

    minimizeWindow(appId) {
        const win = document.getElementById(`window-${appId}`);
        if (win) {
            win.classList.add('hidden');
        }
    }

    maximizeWindow(appId) {
        const win = document.getElementById(`window-${appId}`);
        if (win) {
            if (win.style.width === '100%') {
                // Restore
                win.style.width = '';
                win.style.height = '';
                win.style.top = '50px';
                win.style.left = '50px';
            } else {
                // Maximize
                win.style.width = '100%';
                win.style.height = 'calc(100% - 48px)'; // Minus taskbar
                win.style.top = '0';
                win.style.left = '0';
            }
        }
    }

    focusWindow(win) {
        win.style.zIndex = ++this.zIndex;
        win.classList.remove('hidden');
    }

    addToTaskbar(appId, app) {
        const taskbar = document.getElementById('taskbar-apps');
        const item = document.createElement('div');
        item.className = 'taskbar-app active';
        item.id = `taskbar-${appId}`;
        item.innerHTML = `<i class="fa-solid ${app.icon}"></i>`;
        item.onclick = () => {
            const win = document.getElementById(`window-${appId}`);
            if (win.classList.contains('hidden')) {
                this.focusWindow(win);
            } else {
                // If focused, minimize, else focus
                if (parseInt(win.style.zIndex) === this.zIndex) {
                    this.minimizeWindow(appId);
                } else {
                    this.focusWindow(win);
                }
            }
        };
        taskbar.appendChild(item);
    }

    removeFromTaskbar(appId) {
        const item = document.getElementById(`taskbar-${appId}`);
        if (item) item.remove();
    }

    toggleStartMenu(forceState) {
        const menu = document.getElementById('start-menu');
        if (forceState !== undefined) {
            if (forceState) menu.classList.remove('hidden');
            else menu.classList.add('hidden');
        } else {
            menu.classList.toggle('hidden');
        }
    }

    // Dragging Logic
    startDrag(e, appId) {
        if (e.target.closest('.window-controls')) return; // Don't drag if clicking controls

        const win = document.getElementById(`window-${appId}`);
        this.focusWindow(win);

        let shiftX = e.clientX - win.getBoundingClientRect().left;
        let shiftY = e.clientY - win.getBoundingClientRect().top;

        const moveAt = (pageX, pageY) => {
            // Boundary checks
            let newLeft = pageX - shiftX;
            let newTop = pageY - shiftY;

            // Prevent dragging off-screen (top/left)
            if (newTop < 0) newTop = 0;
            if (newLeft < 0) newLeft = 0;

            // Prevent dragging off-screen (bottom/right - keep some part visible)
            if (newTop > window.innerHeight - 30) newTop = window.innerHeight - 30;
            if (newLeft > window.innerWidth - 30) newLeft = window.innerWidth - 30;

            win.style.left = newLeft + 'px';
            win.style.top = newTop + 'px';
        };

        const onMouseMove = (event) => {
            moveAt(event.pageX, event.pageY);
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    playSound(type) {
        // Placeholder for sound effects
    }
}

// Initialize OS
window.os = new OS();
