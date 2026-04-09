import sys

html_file = 'e:/Desktop/porfolio/DJ.html'
with open(html_file, 'r', encoding='utf-8') as f:
    html = f.read()

css_inject = """
        /* 静音按钮样式 */
        .mute-btn {
            position: absolute;
            bottom: 20px;
            right: 20px;
            width: 36px;
            height: 36px;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(4px);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10;
            color: #fff;
            transition: all 0.3s ease;
            opacity: 0;
            pointer-events: auto;
        }
        .video-item:hover .mute-btn { opacity: 1; }
        .mute-btn:hover { background: rgba(255, 255, 255, 0.3); transform: scale(1.1); }
        .mute-btn svg { width: 20px; height: 20px; fill: currentColor; }
"""
if '.mute-btn' not in html:
    html = html.replace('</style>', css_inject + '\n    </style>')

mute_html = """<div class="mute-btn" title="Toggle Sound">
                            <svg class="icon-unmuted" viewBox="0 0 24 24" style="display: none;"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                            <svg class="icon-muted" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                        </div>"""

if 'mute-btn' not in html:
    html = html.replace('</video>', '</video>\n                        ' + mute_html)

js_inject = """
                const muteBtn = el.querySelector('.mute-btn');
                const unmutedIcon = el.querySelector('.icon-unmuted');
                const mutedIcon = el.querySelector('.icon-muted');
                if (vid && !vid.hasAttribute('muted')) {
                    vid.muted = true; // 默认全体静音
                }
                if (muteBtn && vid) {
                    muteBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        vid.muted = !vid.muted;
                        if (vid.muted) {
                            unmutedIcon.style.display = 'none';
                            mutedIcon.style.display = 'block';
                        } else {
                            unmutedIcon.style.display = 'block';
                            mutedIcon.style.display = 'none';
                            vid.volume = 1.0;
                            vid.play().catch(() => {});
                        }
                    });
                    el.addEventListener('mouseenter', () => {
                        if (vid.muted) {
                            unmutedIcon.style.display = 'none';
                            mutedIcon.style.display = 'block';
                        } else {
                            unmutedIcon.style.display = 'block';
                            mutedIcon.style.display = 'none';
                        }
                    });
                }
"""
anchor = "const progressFill = el.querySelector('.video-progress-fill');"
if anchor in html and "muteBtn = el.querySelector('.mute-btn')" not in html:
    html = html.replace(anchor, anchor + js_inject)

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(html)

print('Success')
