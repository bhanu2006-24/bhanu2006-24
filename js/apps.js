import { projects, resumeData } from './data.js';

export const apps = {
    about: {
        title: 'About Me',
        icon: 'fa-user-astronaut',
        content: `
            <div style="text-align: center; padding: 40px; max-width: 600px; margin: 0 auto;">
                <img src="https://github.com/bhanu2006-24.png" style="width: 150px; height: 150px; border-radius: 50%; border: 4px solid #3498db; margin-bottom: 20px; box-shadow: 0 0 20px rgba(52, 152, 219, 0.5);">
                <h2 style="font-size: 2.5em; margin-bottom: 10px;">Bhanu Pratap Saini</h2>
                <p style="color: #3498db; font-size: 1.2em; margin-bottom: 30px;">Aspiring Software Engineer & Data Analyst</p>
                
                <div style="text-align: left; background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);">
                    <p style="margin-bottom: 15px; line-height: 1.6;">
                        Hi! I'm a passionate developer who loves building things that live on the internet. 
                        Whether it's a complex data analysis dashboard, an interactive game, or a sleek web application, 
                        I enjoy the challenge of creating efficient and beautiful software.
                    </p>
                    <p style="line-height: 1.6;">
                        I specialize in <strong>Python</strong> and <strong>JavaScript</strong>, bridging the gap between 
                        data science and web development. I'm constantly learning new technologies and looking for 
                        opportunities to apply my skills to real-world problems.
                    </p>
                </div>
            </div>
        `
    },
    projects: {
        title: 'My Projects',
        icon: 'fa-folder-open',
        render: () => {
            let html = '<div class="projects-grid">';
            projects.forEach(p => {
                html += `
                    <div class="project-card">
                        <h3><i class="fa-solid ${p.icon}" style="color: ${p.color}; margin-right: 10px;"></i>${p.title}</h3>
                        <p>${p.description}</p>
                        <div class="project-tags">
                            ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                        </div>
                        <a href="${p.link}" target="_blank" class="btn">View on GitHub</a>
                    </div>
                `;
            });
            html += '</div>';
            return html;
        }
    },
    resume: {
        title: 'Resume',
        icon: 'fa-file-pdf',
        render: () => {
            return `
                <div style="padding: 40px; max-width: 800px; margin: 0 auto; background: white; color: #333; border-radius: 5px;">
                    <header style="border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h1 style="font-size: 2.5em; margin-bottom: 5px;">${resumeData.name}</h1>
                            <p style="color: #3498db; font-weight: bold; font-size: 1.2em;">${resumeData.title}</p>
                        </div>
                        <div style="text-align: right; font-size: 0.9em;">
                            <p>bhanupratapsaini2006@gmail.com</p>
                            <p>github.com/bhanu2006-24</p>
                        </div>
                    </header>
                    
                    <section style="margin-bottom: 30px;">
                        <h3 style="color: #333; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px;">Summary</h3>
                        <p style="line-height: 1.6;">${resumeData.summary}</p>
                    </section>

                    <section style="margin-bottom: 30px;">
                        <h3 style="color: #333; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px;">Technical Skills</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                            ${resumeData.skills.map(s => `<span style="background: #eee; padding: 5px 10px; border-radius: 4px; font-size: 0.9em;">${s}</span>`).join('')}
                        </div>
                    </section>

                    <section style="margin-bottom: 30px;">
                        <h3 style="color: #333; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px;">Experience</h3>
                        ${resumeData.experience.map(e => `
                            <div style="margin-bottom: 20px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                    <strong style="font-size: 1.1em;">${e.role}</strong>
                                    <span style="color: #666;">${e.year}</span>
                                </div>
                                <div style="color: #3498db; font-weight: bold; margin-bottom: 5px;">${e.company}</div>
                                <p style="line-height: 1.6;">${e.desc}</p>
                            </div>
                        `).join('')}
                    </section>
                    
                    <section style="margin-bottom: 30px;">
                        <h3 style="color: #333; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px;">Education</h3>
                        ${resumeData.education.map(e => `
                            <div>
                                <div style="display: flex; justify-content: space-between;">
                                    <strong>${e.school}</strong>
                                    <span>${e.year}</span>
                                </div>
                                <p>${e.degree}</p>
                            </div>
                        `).join('')}
                    </section>
                </div>
            `;
        }
    },
    contact: {
        title: 'Contact Me',
        icon: 'fa-envelope',
        content: `
            <div style="text-align: center; padding: 40px;">
                <h2>Get In Touch</h2>
                <p style="margin: 20px 0; color: #aaa;">I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.</p>
                
                <div style="display: flex; justify-content: center; gap: 20px; margin-top: 30px;">
                    <a href="mailto:bhanupratapsaini2006@gmail.com" class="btn" style="background: #e74c3c;"><i class="fa-solid fa-envelope"></i> Email Me</a>
                    <a href="https://www.linkedin.com/in/bhanu-saini-3bb251391/" target="_blank" class="btn" style="background: #0077b5;"><i class="fa-brands fa-linkedin"></i> LinkedIn</a>
                    <a href="https://github.com/bhanu2006-24" target="_blank" class="btn" style="background: #333;"><i class="fa-brands fa-github"></i> GitHub</a>
                </div>
            </div>
        `
    },
    terminal: {
        title: 'Terminal',
        icon: 'fa-terminal',
        render: () => {
            return `
                <div class="terminal-content" id="terminal-content">
                    <div class="terminal-line">Welcome to BhanuOS Terminal v1.0.0</div>
                    <div class="terminal-line">Type 'help' to see available commands.</div>
                    <div class="terminal-input-line">
                        <span class="terminal-prompt">bhanu@os:~$</span>
                        <input type="text" id="terminal-input" autocomplete="off" autofocus>
                    </div>
                </div>
            `;
        },
        init: (container) => {
            const input = container.querySelector('#terminal-input');
            const content = container.querySelector('#terminal-content');

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const command = input.value.trim();
                    const outputDiv = document.createElement('div');
                    outputDiv.className = 'terminal-line';
                    outputDiv.innerHTML = `<span class="terminal-prompt">bhanu@os:~$</span> ${command}`;
                    content.insertBefore(outputDiv, input.parentElement);

                    processCommand(command, content);

                    input.value = '';
                    content.scrollTop = content.scrollHeight;
                }
            });

            // Keep focus
            container.addEventListener('click', () => input.focus());
        }
    },
    settings: {
        title: 'Settings',
        icon: 'fa-gear',
        content: `
            <div style="padding: 20px;">
                <h3>Personalization</h3>
                <div style="margin-top: 20px;">
                    <p>Background Image</p>
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <div style="width: 50px; height: 50px; background: #333; border-radius: 5px; cursor: pointer;"></div>
                        <div style="width: 50px; height: 50px; background: #555; border-radius: 5px; cursor: pointer;"></div>
                        <div style="width: 50px; height: 50px; background: #777; border-radius: 5px; cursor: pointer;"></div>
                    </div>
                </div>
            </div>
        `
    }
};

function processCommand(cmd, container) {
    const args = cmd.split(' ');
    const command = args[0].toLowerCase();

    let response = '';

    switch (command) {
        case 'help':
            response = `
                Available commands:
                - help: Show this help message
                - clear: Clear the terminal
                - echo [text]: Print text
                - open [app]: Open an application (about, projects, resume, contact)
                - whoami: Display user info
                - date: Show current date/time
            `;
            break;
        case 'clear':
            // Remove all previous lines except the input line
            const lines = container.querySelectorAll('.terminal-line');
            lines.forEach(line => line.remove());
            return; // Don't print response
        case 'echo':
            response = args.slice(1).join(' ');
            break;
        case 'whoami':
            response = 'bhanu - admin';
            break;
        case 'date':
            response = new Date().toString();
            break;
        case 'open':
            if (args[1] && apps[args[1]]) {
                window.os.openApp(args[1]);
                response = `Opening ${args[1]}...`;
            } else {
                response = `App not found. Available apps: ${Object.keys(apps).join(', ')}`;
            }
            break;
        case '':
            return;
        default:
            response = `Command not found: ${command}`;
    }

    const responseDiv = document.createElement('div');
    responseDiv.className = 'terminal-line';
    responseDiv.style.color = '#ccc';
    responseDiv.innerText = response;
    container.insertBefore(responseDiv, container.querySelector('.terminal-input-line'));
}
