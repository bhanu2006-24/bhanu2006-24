import { projects, resumeData } from './data.js';

export const apps = {
    about: {
        title: 'About Me',
        icon: 'fa-user-astronaut',
        content: `
            <div style="text-align: center; padding: 20px;">
                <i class="fa-solid fa-user-astronaut" style="font-size: 64px; color: #3498db; margin-bottom: 20px;"></i>
                <h2>Bhanu Pratap Saini</h2>
                <p style="color: #aaa; margin-bottom: 20px;">Aspiring Software Engineer & Data Analyst</p>
                <p>
                    Hi! I'm a passionate developer who loves building things that live on the internet. 
                    Whether it's a complex data analysis dashboard, an interactive game, or a sleek web application, 
                    I enjoy the challenge of creating efficient and beautiful software.
                </p>
                <br>
                <p>
                    I specialize in <strong>Python</strong> and <strong>JavaScript</strong>, bridging the gap between 
                    data science and web development.
                </p>
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
                <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
                    <header style="border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 20px;">
                        <h1>${resumeData.name}</h1>
                        <p style="color: #3498db;">${resumeData.title}</p>
                        <p style="margin-top: 10px; font-size: 0.9em; color: #aaa;">${resumeData.summary}</p>
                    </header>
                    
                    <section style="margin-bottom: 30px;">
                        <h3 style="color: #fff; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 15px;">Skills</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                            ${resumeData.skills.map(s => `<span class="tag" style="font-size: 14px; padding: 5px 10px;">${s}</span>`).join('')}
                        </div>
                    </section>

                    <section style="margin-bottom: 30px;">
                        <h3 style="color: #fff; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 15px;">Experience</h3>
                        ${resumeData.experience.map(e => `
                            <div style="margin-bottom: 15px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                    <strong>${e.role}</strong>
                                    <span style="color: #aaa;">${e.year}</span>
                                </div>
                                <div style="color: #3498db; font-size: 0.9em; margin-bottom: 5px;">${e.company}</div>
                                <p style="font-size: 0.9em; color: #ccc;">${e.desc}</p>
                            </div>
                        `).join('')}
                    </section>

                    <div style="text-align: center; margin-top: 40px;">
                        <button class="btn" onclick="alert('Download feature coming soon!')"><i class="fa-solid fa-download"></i> Download PDF</button>
                    </div>
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
        content: `
            <div style="font-family: 'Courier New', monospace; padding: 10px;">
                <div style="color: #2ecc71;">bhanu@os:~$ <span style="color: #fff;">echo "Welcome to my portfolio!"</span></div>
                <div style="color: #fff; margin-top: 5px;">Welcome to my portfolio!</div>
                <div style="color: #2ecc71; margin-top: 10px;">bhanu@os:~$ <span class="cursor">_</span></div>
            </div>
        `
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
