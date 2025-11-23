import { apps } from './apps.js';

class OS {
    constructor() {
        this.windows = [];
        this.zIndex = 100;
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
                document.getElementById('desktop').classList.remove('hidden');
                this.playSound('startup');
            }, 1000);
        }, 2000);
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

        function moveAt(pageX, pageY) {
            win.style.left = pageX - shiftX + 'px';
            win.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        win.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            win.onmouseup = null;
        };
    }

    playSound(type) {
        // Placeholder for sound effects
    }
}

// Initialize OS
window.os = new OS();
